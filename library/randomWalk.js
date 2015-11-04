/*
    random walk:

    create graph matrix E (n*n) using n-gram (close words)
    normalize so that sum of each row is 1

    V' = [1/n ... 1/n];

    while !converge:
        V *= E
*/

var exp = {};
module.exports = exp;

var sumFunc = function(a, b) { return a+b; };

function prod(vec, mat) {
    var ret = vec.map(function(){ return 0; });
    mat.forEach(function(adj, i){
        adj.forEach(function(edge, j){
            ret[edge[0]] += edge[1] * vec[i];
        });
    });
    return ret;
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
        var newArray = [];
        for (var i = 0; i < dim; i++) {
            newArray[i] = createNDimArray(rest);
        }
        return newArray;
    } else {
         return undefined;
    }
}

exp.randomWalk = function(matrix) {
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
        // if( cnt % 10 === 0 )
        //     console.log('\titeration number ' + cnt + ' done');
    }
    return v_prime;
};
