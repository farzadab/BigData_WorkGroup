var bad_chars = {
    'ي': 'ی',
    'ك': 'ک',
    'ئ': 'ی',
};

var stopWords = new Set(require('../data/stopwords.json'));

var exp = {};
module.exports = exp;

function nonStopWord(word) { return !stopWords.has(word); }

exp.tokenize = function(data) {
    var tokens = [];
    for(var i=0; i<data.length; i++) {
        for(var ch in bad_chars)
            data[i].text = data[i].text.replace(ch, bad_chars[ch]);
        // data[i].tokens = data[i].text.split(' ').filter(nonStopWord);
        tokens[i] = data[i].text.split(' ').filter(nonStopWord);
    }
    return tokens;
    // return data;
};

exp.clean = function(data){
    var out = Array(data.length);
    for(var i=0; i<data.length; i++)
        out[i] = {
            date: (data[i].date || [''])[0],
            text: (data[i].body || [''])[0],
        };
    return out;
};
