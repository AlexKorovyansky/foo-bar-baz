//var rainman = require('rainman-js');

module.exports = {

  VERSION: "LeanNodeJS engineered player",

  bet_request: function(game_state) {
    console.log(game_state);
    try {

      var countInPlayers = game_state.players.filter(function(player) {
        return player.status != "out";
      });

      if(game_state.current_buy_in >= 1000 && countInPlayers.length <= 2) {
        return 1000000000;
      }

      return game_state.current_buy_in - game_state.players[game_state.in_action]["bet"] + game_state.minimum_raise;
    }
    catch(e) {
      console.error(e);
      return 1000000000;
    }
  },

  showdown: function(game_state) {

  }
};