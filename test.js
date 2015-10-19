    // var linearAlgebra = require('linear-algebra')(),     // initialise it
// Vector = linearAlgebra.Vector,
// Matrix = linearAlgebra.Matrix;
// var Matrix = require('vektor').matrix;
// var Vector = require('vektor').vector;

var fs = require('fs');

var bad_chars = {
    'ي': 'ی',
    'ك': 'ک',
    'ئ': 'ی',
};

var stopWords = new Set(require('./data/stopwords.json'));

function nonStopWord(word) { return !stopWords.has(word); }

function tokenize(data) {
    for(var i=0; i<data.length; i++) {
        for(var ch in bad_chars)
            data[i].text = data[i].text.replace(ch, bad_chars[ch]);
        data[i].tokens = data[i].text.split(' ').filter(nonStopWord);
    }
    return data;
}


/*
    random walk:

    create graph matrix E (n*n) using n-gram (close words)
    normalize so that sum of each row is 1

    V' = [1/n ... 1/n];

    while !converge:
        V *= E
*/

var divFunc = function(divisor){
    return function(item){ return item / divisor; };
};

var div2ndFunc = function(divisor){
    return function(item){ return [item[0], item[1] / divisor]; };
};

var sumFunc = function(a, b) { return a+b; };

function prod(vec, mat) {  // TODO: check this once more
    var ret = vec.map(function(){ return 0; });
    mat.forEach(function(adj, i){
        adj.forEach(function(edge, j){
            ret[edge[0]] += edge[1] * vec[i];
        });
    });
    return ret;
    // return vec.map(function(item, i){
    //     return vec.map(function(item, j){
    //         return vec[j] * mat[j][i];
    //     }).reduce(sumFunc);
    // });
}

function check_diff(v1, v2, eps) {
    return v1.map(function(item, i) {
        return ( Math.abs(item - v2[i]) < eps ? true : false );
    }).reduce(function(a, b) { return a && b; } );
}

function createNDimArray(dimensions) {
    if (dimensions.length > 0) {
        var dim = dimensions[0];
        var rest = dimensions.slice(1);
        var newArray = new Array();
        for (var i = 0; i < dim; i++) {
            newArray[i] = createNDimArray(rest);
        }
        return newArray;
    } else {
         return undefined;
    }
}

function randomWalk(matrix) {
    v_prime = [];
    for(var i=0; i<matrix.length; i++)
        v_prime[i] = 1/matrix.length;

    var cnt = 0;
    while(true) {
        new_v = prod(v_prime, matrix);

        if( check_diff(new_v, v_prime, 1e-4) )
            break;

        v_prime = new_v;

        cnt++;
        if( cnt % 10 === 0 )
            console.log('\titeration number ' + cnt + ' done');
    }
    return v_prime;
}

// for check run: randomWalk([ [0.5,0.5], [0.2,0.8] ]);
// it must be equal to [2/7, 5/7] with 1e-6 error

function addToMap(mp, item) {
    if(!mp.has(item))
        mp.set(item, mp.size);
}

function createMatrix(data, n) {
    var words = new Map();
    for(var i=0; i<data.length; i++)
        for(var j=0; j<data[i].tokens.length; j++)
            addToMap(words, data[i].tokens[j]);

    // console.log('\tnumber of words: ' + words.size);
    // var matrix = createNDimArray([words.size, words.size]);
    // console.log('\tcreated 2D matrix');
    // for(var i=0; i<matrix.length; i++)
    //     for(var j=0; j<matrix[i].length; j++)
    //         matrix[i][j] = 0;
    var adj = [];
    for(var i=0; i<words.size; i++)
        adj[i] = [];

    for(var i=0; i<data.length; i++)
        for(var j=0; j<data[i].tokens.length-n+1; j++)
            for(var k=1; k<n; k++) {
                var u = words.get(data[i].tokens[j]);
                var v = words.get(data[i].tokens[j+k]);
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
        adj[i] = adj[i].slice(0, p+1).map(div2ndFunc(sum));
    }
    // for(var i=0; i<matrix.length; i++)
    //     adj[i] = adj[i].map(divFunc(adj[i].reduce(sumFunc)));

    var nodes = [];
    words.forEach(function(num, word){nodes[num] = word;});

    return {
        edges: adj,
        nodes: nodes,
    }
}

function khoshgelify(data){
    var out = Array(data.length);
    for(var i=0; i<data.length; i++)
        out[i] = {
            date: (data[i].date || [''])[0],
            text: (data[i].body || [''])[0],
        };
    return out;
}

function union_set(set1, set2){
    var out = new Set(set1);
    set2.forEach(function(item){
        out.add(item);
    });
    return out;
}

function intersection_set(set1, set2){
    var out = new Set();
    set1.forEach(function(item){
        if(set2.has(item))
            out.add(item);
    });
    return out;
}

function find_sim(tok1, tok2){
    return (intersection_set(new Set(tok1), new Set(tok2)).size /
             union_set(new Set(tok1), new Set(tok2)).size);
}

function similiarity(data_a, data_b){
    var cnt = 0;
    for(var i=0; i<data_a.length; i++)
        for(var j=0; j<data_b.length; j++){
            var sim = find_sim(data_a[i].tokens, data_b[j].tokens);
            if( sim < 1 && sim > 0.5 ){
                cnt ++;
                if( cnt % 10 === 0){
                    console.log('' + cnt + ' , ' + (i*data_b.length+j));
                }
                // console.log('/-----------------------------------/');
                // console.log(data_a[i].text);
                // console.log('$$$$$$$$');
                // console.log(data_b[j].text);
            }
        }
}

var fn_small = require('./data/FarsNews_Small.json').data;

khoshgel = khoshgelify(fn_small);

tokenize(khoshgel);

console.log('starting....');
graph = createMatrix(khoshgel, 10);
console.log('made matrix....');
// console.log(graph);
// console.log(graph.nodes);
probs = randomWalk(graph.edges);
// console.log(probs.slice(0, 10));


// fs.writeFile('./data/keyword.json', JSON.stringify({
//     nodes: graph.nodes,
//     probs: probs
// }), function(err){
//     if( err )
//         return console.log(err);
//     console.log('file was saved as data/keyword.json');
// });

// similiarity(khoshgel, khoshgel);

/*
    change algorithm to find keywords on just a single news

    make keyword graph

*/
