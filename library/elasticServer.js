var exp = {};
module.exports = exp;

var utils = require('./utils.js');

var queryOptions = {
    host: '88.80.172.32',
    path: '/db/data/cypher',
    port: '80',
    method: 'POST',
    auth: 'admin:DVAzai94115',
    headers: {
        // 'Host': 'node49444-bigdata.jelastic.elastx.net',
        // 'Content-Length': '30',
        // 'Authorization': 'Basic YWRtaW46RFZBemFpOTQxMTU=',
    },
};

exp.query = function(query) {
    return new Promise(function(resolve, reject){

        console.log(query);
        var output = '';
        var options = utils.clone(queryOptions);
        var params = JSON.stringify({
            query: query
        });
        options.headers['Content-Length'] = '' + params.length;

        var http = require('http');
        var req = http.request(options, function(res){
            res.on('data', function(data){
                output += data;
            });
            res.on('end', function(data){
                resolve(JSON.parse(output));
                console.log('done!!!');
            });
        });

        req.write(params);

        req.end();
    });
};

exp.deleteAll = function() {
    exp.query('MATCH (x) - [z] -> (y) DELETE z');
    exp.query('MATCH (n) DELETE n');
};

exp.createNode = function(nodeType, properties) {
    var type, prop;
    if( typeof(nodeType) === 'undefined' )
        type = '';
    else
        type = ':' + nodeType;

    if( typeof(properties) === 'undefined' )
        props = '';
    else {
        props = ' {';
        var first = true;
        for(var p in properties) {
            if( !first )
                props += ',';
            props += p + ':"' + properties[p] + '"';
            first = false;
        }
        props += '}';
    }

    exp.query('CREATE (n' + type + props + ')');

};
