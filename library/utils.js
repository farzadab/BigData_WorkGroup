var exp = {};
module.exports = exp;

var fs = require('fs');


exp.divFunc = function(divisor){
    return function(item){ return item / divisor; };
};

exp.div2ndFunc = function(divisor){
    return function(item){ return [item[0], item[1] / divisor]; };
};

exp.addToMap = function(mp, item) {
    if(!mp.has(item))
        mp.set(item, mp.size);
};

exp.unionSetMutable = function(set1, set2){
    set2.forEach(function(item){
        set1.add(item);
    });
};

exp.union_set = function(set1, set2){
    var out = new Set(set1);
    unionSetMutable(out, set2);
    return out;
};

exp.writeGraphToFile = function(nodes, edges) {
    fs.writeFile('./data/keywordGraph.json', JSON.stringify({
        nodes: nodes,
        edges: edges
    }), function(err){
        if( err )
            return console.log(err);
        console.log('file saved in data/keywordGraph.json');
    });
};

exp.range = function(start, edge, step) {
  // If only one number was passed in make it the edge and 0 the start.
  if (arguments.length == 1) {
    edge = start;
    start = 0;
  }

  // Validate the edge and step numbers.
  edge = edge || 0;
  step = step || 1;

  // Create the array of numbers, stopping befor the edge.
  for (var ret = []; (edge - start) * step > 0; start += step) {
    ret.push(start);
  }
  return ret;
};
