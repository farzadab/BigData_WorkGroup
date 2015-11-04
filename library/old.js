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
