var rainman = require('./rainman');

function _estimateHand(hole_cards) {
  return 1.0;
};

function _estimateState(game_state) {
  var handEstimation = _estimateHand(game_state.players[game_state.in_action].hole_cards);
  return handEstimation;
};

module.exports = {

  VERSION: "LeanNodeJS engineered player tuna",

  /**
   * Return from 0.0 to 1.0
   * 0.0 - very bad hand
   * 1.0 = awesome hand
   */


  bet_request: function(game_state) {
    console.log(game_state);
    try {

      var stateEstimation = _estimateState(game_state);
      if(stateEstimation == 0)
        return 0;

      var inPlayers = game_state.players.filter(function(player) {
        return player.status != "out";
      });

      if(game_state.current_buy_in >= 1000 && inPlayers.length <= 2) {
        console.info("game_state.current_buy_in >= 1000 && inPlayers.length <= 2");
        if(Math.random() > 0.5) {
          return 1000000000;
        } else {
          return 0;
        }
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