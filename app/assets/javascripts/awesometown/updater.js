// id: ID on the server
// graph: an Awesometown.Graph
Awesometown.Updater = function (id, graph, host, port) {
  var client = new Chloe({host: host, port: port});

  client.connect(function () {
    client.subscribe(id, function (incoming) {
      console.log("Received data");
      console.dir(incoming);
      graph.add(JSON.parse(incoming));
    });
  });
};
