var fn_small = require('./data/FarsNews_Small.json').data;
var kws = require('./library/keyword.js');
var clean = require('./library/clean.js');
var gUtils = require('./library/graphUtils.js');
var utils = require('./library/utils.js');

var data = clean.clean(fn_small);
var graph = kws.keywordGraph(clean.tokenize(data));
var subset = gUtils.graphSubset(graph, graph.nodes.slice(0, 100));
console.log(graph.nodes[0]);
console.log(graph.edges[0]);

var query = "CREATE ";

for(var i=0; i<graph.nodes.length; i++)
    query += createWordNode(i, graph.nodes[i]) + ',';

for(var i=0; i<graph.edges.length; i++)
    query += createWordEdge(graph.edges[i]) + ',';

query = query.substr(0, query.length-1);
// console.log(query);


function createWordEdge(edge) {
    return '(w' + edge.source + ')-[:CoOccurence {strength:' + edge.value + '}]->(w' + edge.target + ')';
}

function createWordNode(number, text) {
    return '(' + 'w' + number + ':Word {text: "' + text + '"})';
}

var neo4j = require('./library/neo4j.js');
var db = neo4j.server({auth: 'neo4j:bigdataworkgroup'});

db.query(query);
//
// for(var i=0; i<graph.nodes.length; i++) {
//     server.createNode('news', {name: graph.nodes[i]});
// }

// utils.writeGraphToFile(subset.nodes, subset.edges);
