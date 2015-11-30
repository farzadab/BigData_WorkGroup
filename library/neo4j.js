var exp = {};
module.exports = exp;

var utils = require('./utils.js');

exp.db = function(options) {
    var queryOptions = {
        host: '127.0.0.1',
        path: '/db/data/cypher',
        port: '7474',
        method: 'POST',
        // auth: 'neo4j:neo4j',
        headers: {
        },
    };

    for(var op in options)
        queryOptions[op] = options[op];

    return {
        query: function(query) {
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
                    console.log(JSON.parse(output));
                });
            });

            req.write(params);

            req.end();
        },

        deleteAll: function() {
            exp.query('MATCH (x) - [z] -> (y) DELETE z');
            exp.query('MATCH (n) DELETE n');
        },

        createNode: function(nodeType, properties) {
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

        },
    };
};
