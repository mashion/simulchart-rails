// id: ID on the server
// graph: an Awesometown.Graph
Awesometown.Updater = function (id, graph, host, port) {
  var client = new Chloe({host: host, port: port});

  // TODO (trotter): Apparently Chloe won't receive any channel
  //                 subscription messages if we don't have an
  //                 onmessage defined.
  client.onmessage(function () {
    // Nothing, just a placeholder
  });

  client.connect(function () {
    client.subscribe(id, function (incoming) {
      console.log("Received data");
      console.dir(incoming);
      graph.add(JSON.parse(incoming));
    });
  });
};
