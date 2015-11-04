var fn_small = require('./data/FarsNews_Small.json').data;
var kws = require('./library/keyword.js');
var clean = require('./library/clean.js');
var gUtils = require('./library/graphUtils.js');
var utils = require('./library/utils.js');


var data = clean.clean(fn_small);
var graph = kws.keywordGraph(clean.tokenize(data));
var subset = gUtils.graphSubset(graph, graph.nodes.slice(0, 100));

utils.writeGraphToFile(subset.nodes, subset.edges);
