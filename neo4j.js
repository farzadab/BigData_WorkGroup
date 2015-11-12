var server = require('./library/elasticServer.js');

var p = server.query('MATCH (n) RETURN n');

p.then(function(res) { console.log(res); });
