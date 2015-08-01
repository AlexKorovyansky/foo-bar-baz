var request = require('sync-request');
var API_URL = 'http://rainman.leanpoker.org/rank';

module.exports = {
    rank: function(cards) {
        if (!cards) {
            return 0;    
        }
        
        var url = API_URL + '?cards=' + JSON.stringify(cards);
        var score = 0;
        try {
            var res = request('GET', url);
            var data = JSON.parse(res.getBody());
            score = data.rank / 8;
            if (score > 0.7) {
                score = 1;
            }
        } catch (e) {
            console.error('RAINMAN ERROR');
            console.error(e.trace);
        }
        
        console.info('RAINMAN RANK: ', score);
        return score;
    }
};
