var exp = {};
module.exports = exp;

exp.graphSubset = function(graph, _subset) {
    var subset = new Set(_subset);
    var nodes = [];
    var subsetNums = new Map();
    graph.nodes.forEach(function(node, index) {
        if( subset.has(node) ) {
            subsetNums.set(index, nodes.length);
            nodes.push(node);
        }
    });
    var edges = [];
    graph.edges.forEach(function(edge){
        if( subsetNums.has(edge.source) && subsetNums.has(edge.target) ) {
            edges.push({
                source: subsetNums.get(edge.source),
                target: subsetNums.get(edge.target),
                value: edge.value,
            });
        }
    });

    return {
        nodes: nodes,
        edges: edges,
    };
};
