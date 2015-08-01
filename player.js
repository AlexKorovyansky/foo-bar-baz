var rainman = require('./rainman');

RANK_SCORES = {
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
  "8": 7,
  "9": 8,
  "10": 9,
  "J": 10,
  "Q": 11,
  "K": 12,
  "A": 13
};

MAX_SCORE = 338;

function rankScore(rank1, rank2) {
  return RANK_SCORES[rank1] * RANK_SCORES[rank1] + RANK_SCORES[rank2] * RANK_SCORES[rank2];
}

/**
 * Return from 0.0 to 1.0
 * 0.0 - very bad hand
 * 1.0 = awesome hand
 * @param {object} hole_cards
 * @param {string} hole_cards.rank
 * @param {string} hole_cards.suit
 * @returns {number}
 * @private
 */
function _estimateHand(hole_cards) {
  var first = hole_cards[0];
  var second = hole_cards[1];
  if (first.rank === second.rank) {
    return 1;
  } else if (first.suit === second.suit) {
    return 0.75
  } else {
    return rankScore(first.rank, second.rank) / MAX_SCORE;
  }
  
  return 0;
}

function _estimateAllCards(cards) {
  return rainman(cards);
}

function _estimateState(game_state) {
  try {
    if (!game_state.community_cards || game_state.community_cards.length == 0) {
      // Without community cards
      var handEstimation = _estimateHand(game_state.players[game_state.in_action].hole_cards);
      return handEstimation;

    } else {
      // With community cards
      // TODO
      /*var hand = game_state.players[game_state.in_action].hole_cards;
       var communityCards = game_state.community_cards;
       var allCards = hand.concat(communityCards);
       var allCardsEstimation = _estimateAllCards(allCards);
       console.log("rainman", allCardsEstimation);*/

      var handEstimation = _estimateHand(game_state.players[game_state.in_action].hole_cards);
      return handEstimation;
    }
  }
  catch(e) {
    console.error(e);
    return 0.5;
  }
}

function _raise(game_state) {
  return game_state.current_buy_in - game_state.players[game_state.in_action]["bet"] + game_state.minimum_raise;
}

function _call(game_state) {
  return game_state.current_buy_in - game_state.players[game_state.in_action]["bet"];
}

module.exports = {

  VERSION: "LeanNodeJS fox",

  bet_request: function(game_state) {
    console.log(game_state);
    try {
      var inPlayers = game_state.players.filter(function(player) {
        return player.status != "out";
      });

      var stateEstimation = _estimateState(game_state);


      if(stateEstimation < 0.5
          && (stateEstimation / 0.5) < Math.random()) {
        return 0;
      }
      else if(stateEstimation == 1) {
        if(game_state.current_buy_in > 500)
          return _raise(game_state);
        else
          return 500;
      }

      /*if(game_state.current_buy_in >= 1000 && inPlayers.length <= 2) {
        console.info("game_state.current_buy_in >= 1000 && inPlayers.length <= 2");
        if(Math.random() > 0.5 || stateEstimation == 1) {
          return 1000000000;
        } else {
          return 0;
        }
      }*/

      if(inPlayers.length > 2 && game_state.current_buy_in >= 1000) {
        if(stateEstimation > 0.5)
          return _raise(game_state);
        else
          return 0;
      }

      if(stateEstimation < 0.75) {
        return _call(game_state);
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