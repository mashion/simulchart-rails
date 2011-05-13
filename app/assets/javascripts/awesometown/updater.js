// id: ID on the server
// graph: an Awesometown.Graph
Awesometown.Updater = function (id, graph) {
  var client = new Faye.Client('/faye', {timeout: 45}),
      updates = '/' + id + '/updates';
 
  client.subscribe(updates, function (incoming) {
    graph.add(incoming);
  });
};
