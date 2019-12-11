'use strict';
const restify = require('restify');
const server = restify.createServer();

server.get('/places', function(req, res, next) {
  res.send(200, ['place1', 'place2', 'place3']);
  next();
});

server.listen(8081, function() {
  console.log(`${server.name} listening at ${server.url}`);
});
