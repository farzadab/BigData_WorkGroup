var server = require('./library/elasticServer.js');
server.deleteAll();
// server.createNode('news');
// server.createNode('news', {name: 'asrnews'});

// var q = 'CREATE (n {name:"World"}) RETURN "hello", n.name';
// var p = server.query('MATCH (n) RETURN n');

// p.then(function(res) { console.log(res); });
// var fn_small = require('./data/FarsNews_Small.json').data;
