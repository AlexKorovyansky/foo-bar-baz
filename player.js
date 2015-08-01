var rainman = require('./rainman');

module.exports = {

  VERSION: "LeanNodeJS engineered player tuna",

  bet_request: function(game_state) {
    console.log(game_state);
    try {

      if(Math.random() > 0.5) {
        console.info("Math.random() > 0.5");
        return 60;
      }

      var inPlayers = game_state.players.filter(function(player) {
        return player.status != "out";
      });

      if(game_state.current_buy_in >= 1000 && inPlayers.length <= 2) {
        console.info("game_state.current_buy_in >= 1000 && inPlayers.length <= 2");
        return 1000000000;
      }

      console.info("Default behaviour");
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