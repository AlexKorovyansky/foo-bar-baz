var rainman = require('./rainman');

/**
 * Return from 0.0 to 1.0
 * 0.0 - very bad hand
 * 1.0 = awesome hand
 */
function _estimateHand(hole_cards) {
  return 0.5;
};

function _estimateAllCards(cards) {
  return 0.5;
}

function _estimateState(game_state) {

  if(!community_cards.community_cards || community_cards.community_cards.length == 0) {
    // Without community cards
    return 0.5;

  } else {
    // With community cards
    var handEstimation = _estimateHand(game_state.players[game_state.in_action].hole_cards);
    return handEstimation;
  }
}

function _raise(game_state) {
  return game_state.current_buy_in - game_state.players[game_state.in_action]["bet"] + game_state.minimum_raise;
}

module.exports = {

  VERSION: "LeanNodeJS engineered player tuna",

  bet_request: function(game_state) {
    console.log(game_state);
    try {
      var inPlayers = game_state.players.filter(function(player) {
        return player.status != "out";
      });

      var stateEstimation = _estimateState(game_state);
      if(stateEstimation == 0)
        return 0;

      if(stateEstimation == 1)
        return 500;

      /*if(game_state.current_buy_in >= 1000 && inPlayers.length <= 2) {
        console.info("game_state.current_buy_in >= 1000 && inPlayers.length <= 2");
        if(Math.random() > 0.5 || stateEstimation == 1) {
          return 1000000000;
        } else {
          return 0;
        }
      }*/

      if(inPlayers.length > 2 && game_state.current_buy_in >= 1000) {
        if(stateEstimation == 1)
          return _raise(game_state);
        else
          return 0;
      }

      console.info("Default behaviour");
      return _raise(game_state);
    }
    catch(e) {
      console.error(e);
      return 1000000000;
    }
  },

  showdown: function(game_state) {

  }
};