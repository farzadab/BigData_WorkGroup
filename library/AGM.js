var exp = {};
module.exports = exp;

var sylvester = require('sylvester');

exp.getAdjByNode = function(edges) {
    var adj = [];

    function create(v) {
        if( typeof(adj[v]) == 'undefined' )
            adj[v] = [];
    }

    edges.forEach(function(edge){
        create(edge.source);
        adj[edge.source].push(edge.target);
    });

    for(var i=0; i<adj.length; i++)
        create(i);

    return adj;
};

exp.getInitF = function(numNodes, numComs) {
    var F = [];
    for(var i=0; i<numNodes; i++) {
        F[i] = [];
        for(var j=0; j<numComs; j++)
            F[i][j] = Math.random();
        F[i] = $V(F[i]);
    }
    return F;
};

exp.calcGradient = function(F, adj) {
    var sumAll = F.reduce(function(x, y) { return x.add(y); } );

    var grad = [];
    for(var v=0; v<F.length; v++) {
        grad[v] = F[v].subtract(sumAll);
        for(var j=0; j<adj[v].length; j++) {
            var u = adj[v][j];
            var mult = Math.exp( - F[v].dot(F[u]) );
            grad[v] = grad[v]
                        .add(F[u].multiply(
                            // TODO correct this part (the 0.9999)
                            mult / (1 - mult * (0.9999)) - 1
                        ));
        }
    }
    return grad;
};

exp.checkConverge = function(grad, eps) {
    if( typeof(eps) == 'undefined' )
        eps = 1e-5;

    for(var i=0; i<grad.length; i++) {
        for(var j=1; j<=grad[i].cols(); j++) {
            if( Math.abs(grad[i].e(j)) > eps )
                return false;
        }
    }
    return true;
};

exp.BigClam = function(edges, numComs, alpha) {
    function maxWithZero(value) { return Math.max(value, 0); }
    if( typeof(numComs) == 'undefined' )
        numComs = 5;
    if( typeof(alpha) == 'undefined' )
        alpha = 0.05;

    var adj = exp.getAdjByNode(edges);
    var numNodes = adj.length;

    var F = exp.getInitF(numNodes, numComs);

    for(var iter=0; iter<100; iter++) {
        var grad = exp.calcGradient(F, adj);

        var flag = true;

        for(var i=0; i<numNodes; i++) {
            var temp = F[i].add(grad[i].multiply(alpha)).map(maxWithZero);
            if( Math.abs(F[i].subtract(temp).max()) > 1e-5 )
                flag = false;
            F[i] = temp;
        }
        if( flag )
            break;
    }

    for(var j=0; j<F.length; j++)
        console.log(F[j]);
    return F;
};

// to test execute the line below
// var agm = require('./library/AGM.js');

// TODO: remove this after test
exp.BigClam([
    {source: 1, target: 2},
    {source: 2, target: 1},
    {source: 1, target: 3},
    {source: 3, target: 1},
    {source: 4, target: 3},
    {source: 4, target: 2},
    {source: 2, target: 4},
    {source: 3, target: 4},
    {source: 3, target: 5},
    {source: 3, target: 6},
    {source: 5, target: 3},
    {source: 5, target: 6},
    {source: 6, target: 3},
    {source: 6, target: 5},
    {source: 6, target: 7},
    {source: 6, target: 0},
    {source: 0, target: 6},
    {source: 7, target: 6},
    {source: 7, target: 8},
    {source: 0, target: 8},
    {source: 8, target: 0},
    {source: 8, target: 7},
], 3);
