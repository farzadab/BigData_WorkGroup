var randWalk = require('./randomWalk.js');
var utils = require('./utils.js');
var _ = require('../utils/underscore.js');

var exp = {};
module.exports = exp;

function createMatrix(tokens, n) {
    var words = new Map();
    for(var j=0; j<tokens.length; j++)
        utils.addToMap(words, tokens[j]);

    var adj = [];
    for(var i=0; i<words.size; i++)
        adj[i] = [];

    for(var j=0; j<tokens.length-n+1; j++)
        for(var k=1; k<n; k++) {
            var u = words.get(tokens[j]);
            var v = words.get(tokens[j+k]);
            // matrix[u][v]++;
            // matrix[v][u]++;
            adj[u].push([v, 1]);
            adj[v].push([u, 1]);
        }
    for(var i=0; i<adj.length; i++) {
        if( adj[i].length === 0 )
            continue;
        adj[i].sort();
        var p = 0, p2=0;
        var sum = adj[i][0][1];
        while(++p2 < adj[i].length) {
            sum += adj[i][p2][1];

            if( adj[i][p][0] === adj[i][p2][0] )
                adj[i][p][1] += adj[i][p2][1];
            else if( p2 != adj[i].length-1 )
                p++;
        }
        adj[i] = adj[i].slice(0, p+1).map(utils.div2ndFunc(sum));
    }

    var nodes = [];
    words.forEach(function(num, word){nodes[num] = word;});

    return {
        edges: adj,
        nodes: nodes,
    }
}


function extractKeywords(tokens, n, size) {
    var graph = createMatrix(tokens, n);
    var probs = randWalk.randomWalk(graph.edges);
    var keywords = _.zip(probs, graph.nodes)
                    .sort().reverse().slice(0,size)
                    .map(function(item) {
                        return {prob: item[0], word: item[1]};
                    });
    // console.log(keywords);
    return keywords;
}

exp.keywordGraph = function(tokens) {
    var getWord = function(item) { return item.word; };
    var addCliqueEdges = function(clique, edges, nodes) {
        for(var i=0; i<clique.length; i++)
            for(var j=i+1; j<clique.length; j++) {
                var u = nodes.get(clique[i]);
                var v = nodes.get(clique[j]);
                // adj[u].push(v);
                // adj[v].push(u);
                edges.push( u<v ? [u,v] : [v,u] );
            }
    };
    var compressEdges = function() {
        edges.sort(function(a, b) { return (a[0] != b[0] ? a[0] < b[0] : a[1] < b[1]); });
        var p=0, p2=0;
        while( p < edges.length ) {
            edges[p2] = {source: edges[p2][0], target: edges[p2][1], value: 1};

            while(  ++p < edges.length &&
                    edges[p][0] == edges[p2].source &&
                    edges[p][1] == edges[p2].target ) {
                edges[p2].value ++;
            }
            p2++;
        }
        edges = edges.slice(0, p2);
    };

    var kwsPerNews = [];
    var words = new Map();
    var addToWords = _.partial(utils.addToMap, words);
    // var adj = [];
    var edges = [];

    for(var i=0; i<tokens.length; i++) {
        var kws = extractKeywords(tokens[i], 10, 8);
        var newsWords = kws.map(getWord);
        kwsPerNews.push(kws);
        newsWords.forEach(addToWords);
        addCliqueEdges(newsWords, edges, words);
    }
    compressEdges();

    console.log('number of keywords in total:', words.size);

    var nodes = [];
    words.forEach(function(num, word) { nodes[num] = word; });

    return {
        nodes: nodes,
        edges: edges
    };
}
