Awesometown.Graph = function (container, data, configuration) {
  this.animationSpeed = 1000;
  this.rangeSize = 10;
  this.gutters = { top: 50, right: 50, bottom: 50, left: 50 };
  this.line = { style: { stroke: "#f55b38", "stroke-width": 2, "stroke-linejoin": "round" } };
  this.background = { style: { fill: "#fff", stroke: "none" }, overflow: 25 }; // overflow determines how far into the gutter it goes

  this.fontSize = 12;
  this.gridMargin = 3;

  this.showGrid = true;

  this.grid = { numLines: 6,
                yLine: { style: {stroke: "#e0e0e0"} },
                xLine: { style: {stroke: "#f6f6f6"} },
                label: { style: {fill: "#dbdbdb", 
                                 font: this.fontSize.toString() + "px Helvetica, Arial, sans-serif",
                                 "font-weight": "normal"} } };

  this.visibleGutters = { top:    this.gutters.top - this.background.overflow,
                          right:  this.gutters.right - this.background.overflow,
                          bottom: this.gutters.bottom - this.background.overflow,
                          left:   this.gutters.left - this.background.overflow };

  this.borders = { left:   { style: { stroke: "#403b27", "stroke-width": 1 }},
                   bottom: { style: { stroke: "#403b27", "stroke-width": 1 }},
                   right:  { style: { stroke: "#e0e0d9", "stroke-width": 1 }},
                   top:    { style: { stroke: "#e0e0d9", "stroke-width": 1 }} };

  this.labels = { style: { } };

  this.gutterFill = "#fffff6";
  this.clearMemo();

  this.yLabelText = "y-axis";
  this.xLabelText = "x-axis";

  this.data = data;
  this.container = container;
  this.newPoints = [];
//  this.absoluteMaxY = 0;
  this.bufferRight  = 1; // buffer this many points off the right of the viewport

  if (configuration) {
    _.extend(this, configuration);
  }

  this.containerDimensions = this.getContainerDimensions("#" + container);
  this.r = Raphael(container, this.containerDimensions.width, this.containerDimensions.height);
};

Awesometown.Graph.prototype = {
  getContainerDimensions: function (selector) {
    var el = $(selector);
    return { width: el.width(), height: el.height() };
  },

  visibleData: function () {
    if (this.memo.visibleData) return this.memo.visibleData;

    // Assuming that the data is sorted
    var self = this,
        first = _.detect(this.data, function (d) {
            return d.x >= self.minVisibleX();
          }),
        index = _.max([_.indexOf(this.data, first) - self.bufferRight, 0]),
        slicePosition = _.max([index, 0]);

    this.data = this.data.slice(slicePosition);
    this.memo.visibleData = this.data;

    return this.memo.visibleData;
  },

  maxY: function () {
    if (this.memo.maxY) return this.memo.maxY;

    var maxInData = _.max(_.map(this.data, function (d) {
                      return d.y;
                    }));

    this._maxY = _.max([this._maxY || 0, this.absoluteMaxY || 0, maxInData]);
    this.memo.maxY = this._maxY;
    return this.memo.maxY;
  },

  maxX: function () {
    if (this.memo.maxX) return this.memo.maxX;
    this.memo.maxX = _.max(_.map(this.data, function (d) {
                                          return d.x;
                                        }));
    return this.memo.maxX;
  },

  minVisibleX: function () {
    if (this.memo.minVisibleX) return this.memo.minVisibleX;

    var maxX = this.oldMaxX || this.maxX();

    this.memo.minVisibleX = maxX - this.rangeSize;

    return this.memo.minVisibleX;
  },

  scaleFactor: function () {
    if (this.memo.scaleFactor) return this.memo.scaleFactor;

    var y = (this.containerDimensions.height - this.gutters.top - this.gutters.bottom) / this.maxY(),
        x = (this.containerDimensions.width - this.gutters.right - this.gutters.left) / this.rangeSize;

    this.memo.scaleFactor = { x: x, y: y };

    return this.memo.scaleFactor;
  },

  xAdjuster: function () {
    return 0;
  },

  points: function () {
    if (this.data.length < this.bufferRight + 1) return [];
    if (this.memo.points) return this.memo.points;

    var self = this,
        xAdjuster = this.xAdjuster();
    
    this.memo.points = _.map(this.visibleData(), function (d) {
      return { x: ((d.x || 0) - self.minVisibleX() - xAdjuster) * self.scaleFactor().x + self.gutters.left,
               y: self.containerDimensions.height - (self.gutters.bottom + ((d.y || 0) * self.scaleFactor().y)) };
    });

    return this.memo.points;
  },

  // Shamelessly yoinked from http://raphaeljs.com/analytics.html
  getAnchors: function (p1x, p1y, p2x, p2y, p3x, p3y) {
      var l1 = (p2x - p1x) / 2,
          l2 = (p3x - p2x) / 2,
          a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
          b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
      a = p1y < p2y ? Math.PI - a : a;
      b = p3y < p2y ? Math.PI - b : b;
      var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
          dx1 = l1 * Math.sin(alpha + a),
          dy1 = l1 * Math.cos(alpha + a),
          dx2 = l2 * Math.sin(alpha + b),
          dy2 = l2 * Math.cos(alpha + b);
      return {
          x1: p2x - dx1,
          y1: p2y + dy1,
          x2: p2x + dx2,
          y2: p2y + dy2
      };
  },

  pointsToPath: function (points) {
    return "M," + points[0].x + "," + points[0].y + "L" + _.map(points.slice(1), function (point) {
              return point.x + "," + point.y;
            }).join(",");
  },

  pointsToCurvedPath: function (points) {
    var self  = this,
        first = points[0],
        start = ["M", first.x, first.y],
        curves = _.flatten(_.map(points, function (point, i) {
          var nextPoint  = points[i + 1],
              halfX;
          if (nextPoint) {
            halfX = (point.x + nextPoint.x) / 2;
            return ["C", halfX, point.y, halfX, nextPoint.y, nextPoint.x, nextPoint.y];
          }
        }));
        return start.concat(curves);
  },

  drawLine: function () {
    if (!this.path) {
      this.path = this.r.path().attr(this.line.style);
    }
    if (_.isEmpty(this.points())) return [];
    var curvePoints = this.pointsToCurvedPath(this.points());
    this.path.attr({ path: curvePoints });
  },

  animationMultiplier: function () {
    if (this.data.length + this.newPoints.length == 0) return 1; // don't want to divide by zero
    return this.rangeSize / (this.data.length + this.newPoints.length);
  },

  animateLine: function () {
    if (_.isEmpty(this.points())) {
      this.runNextAnimation();
      return [];
    };
    var curvePoints = this.pointsToCurvedPath(this.points()),
        translation = ((this.oldMaxX - this.maxX()) * this.scaleFactor().x) + " 0";

    this.path.attr({path: curvePoints});
    this.path.animate({ translation: translation }, this.animationSpeed * this.animationMultiplier(), _.bind(this.runNextAnimation, this));
  },

  sortData: function () {
    // Handle nans
    this.data = _.map(this.data, function (d) {
      return { x: parseFloat(d.x) || 0, y: parseFloat(d.y) || 0 };
    });

    this.data = _.sortBy(this.data, function (d) {
      return d.x || 0;
    });
  },

  drawBackground: function () {
    var x = this.gutters.left - this.background.overflow,
        y = this.gutters.top  - this.background.overflow,
        width = this.containerDimensions.width - this.gutters.left - this.gutters.right + 2 * this.background.overflow,
        height = this.containerDimensions.height - this.gutters.top - this.gutters.bottom + 2 * this.background.overflow;
    this.r.rect(x, y, width, height).attr(this.background.style);
  },

  drawBorder: function () {
    var left = this.gutters.left - this.background.overflow,
        top = this.gutters.top  - this.background.overflow,
        right = this.containerDimensions.width - this.gutters.left + this.background.overflow,
        bottom = this.containerDimensions.height - this.gutters.top + this.background.overflow;

    this.r.path(["M", right, top, "L", right, bottom]).attr(this.borders.right.style);
    this.r.path(["M", left, top, "L", right, top]).attr(this.borders.top.style);
    this.r.path(["M", left, top, "L", left, bottom]).attr(this.borders.left.style);
    this.r.path(["M", left, bottom, "L", right, bottom]).attr(this.borders.bottom.style);
  },

  drawGutterHiders: function () {
    // This rect cuts the line off on the left gutter
    this.r.rect(0, 0, this.gutters.left - this.background.overflow, this.containerDimensions.height).attr({stroke: "none", fill: this.gutterFill});
    // This rect cuts the line off on the right gutter
    this.r.rect(this.containerDimensions.width - this.gutters.right + this.background.overflow, 0, this.gutters.right, this.containerDimensions.height).attr({stroke: "none", fill: this.gutterFill});
  },

  drawLabels: function () {
    this.yLabel = this.r.text(this.visibleGutters.left / 2,
                              this.containerDimensions.height / 2,
                              this.yLabelText).attr(this.labels.style).rotate(-90);
    this.xLabel = this.r.text(this.containerDimensions.width / 2,
                              this.containerDimensions.height - (this.visibleGutters.bottom / 2),
                              this.xLabelText).attr(this.labels.style);
  },

  xToData: function (x) {
    var dataX = (x - this.gutters.left) / this.scaleFactor().x + this.minVisibleX() + this.xAdjuster();
        rm = this.roundingMultiplier(this.rangeSize);
    return Math.round(dataX * rm) / rm;
  },

  yToData: function (y) {
    var dataY = -(y - this.containerDimensions.height + this.gutters.bottom) / this.scaleFactor().y,
        rm = this.roundingMultiplier(this.maxY());
    return Math.round(dataY * rm) / rm;
  },

  roundingMultiplier: function (val) {
    if (val > 10) return 1;
    if (val > 1)  return 10;
    return 100;
  },

  gridValues: function () {
    if (this.memo.gridValues) return this.memo.gridValues;

    this.memo.gridValues = { x: [], y: [] };

    var self   = this,
        fullHeight = this.containerDimensions.height - this.visibleGutters.bottom - this.visibleGutters.top,
        fullWidth  = this.containerDimensions.width - this.visibleGutters.left - this.visibleGutters.right,
        height = fullHeight / this.grid.numLines,
        width  = fullWidth / this.grid.numLines,
        i = 0;

    for (i = 0; i < this.grid.numLines; i++) {
      var y = fullHeight + this.visibleGutters.top - ((i+1) * height);
      this.memo.gridValues.y.push(this.yToData(y));
    };

    for (i = 0; i < this.grid.numLines; i++) {
      var x = self.visibleGutters.left + (i * width);
      this.memo.gridValues.x.push(this.xToData(x));
    };

    return this.memo.gridValues;
  },

  rightAlign: function (text, x) {
    var bBox = text.getBBox();
        delta = x - bBox.x - bBox.width;
    text.attr({translation: delta.toString() + " 0"});
  },

  leftAlign: function (text, x) {
    var bBox = text.getBBox(),
        delta = x - bBox.x;
    text.attr({translation: delta.toString() + " 0"});
  },

  drawGrid: function () {
    if (!this.showGrid) return;

    var self   = this,
        fullHeight = this.containerDimensions.height - this.visibleGutters.bottom - this.visibleGutters.top,
        fullWidth  = this.containerDimensions.width - this.visibleGutters.left - this.visibleGutters.right,
        height = fullHeight / this.gridValues().y.length,
        width  = fullWidth / this.gridValues().x.length,
        yAdjuster = this.fontSize / 2 + this.gridMargin;

    this.gridText = { x: [], y: [] };

    _.each(this.gridValues().y, function (value, i) {
        var y = fullHeight + self.visibleGutters.top - ((i+1) * height),
            path = ["M", self.visibleGutters.left, y, "L", fullWidth + self.visibleGutters.left, y],
            text = self.r.text(fullWidth, y + yAdjuster, value).attr(self.grid.label.style);
        self.rightAlign(text, fullWidth + self.visibleGutters.left - self.gridMargin);
        self.r.path(path).attr(self.grid.yLine.style);
        self.gridText.y.push(text);
      });

    _.each(this.gridValues().x, function (value, i) {
        var x = self.visibleGutters.left + ((i+1) * width),
            path = ["M", x, self.visibleGutters.top, "L", x, fullHeight + self.visibleGutters.top],
            text = self.r.text(x, fullHeight + self.visibleGutters.top - yAdjuster, value).attr(self.grid.label.style);
        self.leftAlign(text, self.visibleGutters.left + (i * width) + self.gridMargin);
        self.r.path(path).attr(self.grid.xLine.style);
        self.gridText.x.push(text);
      });
  },

  redrawGridValues: function () {
    if (!this.showGrid) return;
    var self = this;

    _.each(this.gridValues().y, function (value, i) {
        var text = self.gridText.y[i],
            bBox = text.getBBox();
        text.attr({text: value});
        self.rightAlign(text, bBox.x + bBox.width);
      });

    _.each(this.gridValues().x, function (value, i) {
        var text = self.gridText.x[i],
            bBox = text.getBBox();
        text.attr({text: value});
        self.leftAlign(text, bBox.x);
      });
  },

  draw: function () {
    this.sortData();
    this.drawBackground();
    this.drawGrid();
    this.drawLine();
    this.drawGutterHiders();
    this.drawLabels();
    this.drawBorder();
  },

  animate: function () {
    this.sortData();
    this.redrawGridValues();
    this.animateLine();
  },

  clearMemo: function () {
    this.memo = {};
  },

  runNextAnimation: function () {
    if (_.isEmpty(this.newPoints)) {
      this.animating = false;
      return;
    }

    this.addWithAnimation(this.newPoints.shift());
  },

  // internal use only: addWithAnimation
  addWithAnimation: function (datum) {
    var existing = _.detect(this.data, function (d) {
            return datum.x === d.x;
          });
    this.oldMaxX = this.maxX();
    
    if (existing) {
      existing.y = datum.y;
    } else {
      this.data.push(datum);
    }
    this.redraw();
  },

  resetDataWithAnimation: function (data) {
    this.oldMaxX = this.maxX();
    this.data = data;
    this.redraw();
  },

  // WARNING: DO NOT USE THIS IN CONJUNCTION WITH add
  resetData: function (data) {
    if (this.animating) {
      this.newPoints.push(data);
    } else {
      this.animating = true;
      this.resetDataWithAnimation(data);
    }
  },

  // WARNING: DO NOT USE THIS IN CONJUNCTION WITH resetData
  add: function (datum) {
    if (this.animating) {
      this.newPoints.push(datum);
    } else {
      this.animating = true;
      this.addWithAnimation(datum);
    }
  },

  redraw: function () {
    this.clearMemo();
    this.animate();
  },

  ///////////////////////// TEST HELPER METHODS ////////////////////////
  drawGutters: function () {
    this.r.rect(0, 0, this.containerDimensions.width, this.gutters.top).attr({stroke: "none", fill: "#f00", "fill-opacity": 0.2});
    this.r.rect(0, 0, this.gutters.left, this.containerDimensions.height).attr({stroke: "none", fill: "#f00", "fill-opacity": 0.2});
    this.r.rect(0, this.containerDimensions.height - this.gutters.top, this.containerDimensions.width, this.containerDimensions.height).attr({stroke: "none", fill: "#f00", "fill-opacity": 0.2});
    this.r.rect(this.containerDimensions.width - this.gutters.right, 0, this.containerDimensions.width, this.containerDimensions.height).attr({stroke: "none", fill: "#f00", "fill-opacity": 0.2});
  }
};
