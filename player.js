var rainman = require('./rainman');
var util = require('util');

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
  } else if (first.suit === second.suit
      || first.rank >= 12 || second.rank >= 12  // A, K
      || Math.abs(second.rank - first.rank) == 1) { // continuous
    return 0.75
  } else {
    return rankScore(first.rank, second.rank) / MAX_SCORE;
  }
  
  return 0;
}

function _estimateAllCards(cards) {
  return rainman.rank(cards);
}

function _estimateState(game_state) {
  try {
    if (!game_state.community_cards || game_state.community_cards.length == 0) {
      // Without community cards
      var handEstimation = _estimateHand(game_state.players[game_state.in_action].hole_cards);
      return handEstimation;

    } else {
      // With community cards
      var hand = game_state.players[game_state.in_action].hole_cards;
      var communityCards = game_state.community_cards;
      var allCards = hand.concat(communityCards);
      var allCardsEstimation = _estimateAllCards(allCards);
      return allCardsEstimation;
    }
  }
  catch(e) {
    console.error(e.stack);
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

function _countOfCards(game_state) {
  var handCards = game_state.players[game_state.in_action].hole_cards.length;
  var communityCards = game_state.community_cards ? game_state.community_cards.length : [];
  return handCards.length + communityCards.length;
}

var lastGameId = "";
module.exports = {

  VERSION: "LeanNodeJS fox",

  bet_request: function(game_state) {
    if(game_state.game_id != lastGameId) {
      console.log("New game");
    }
    lastGameId = game_state.game_id;

    //console.log(game_state);
    console.log(util.inspect(game_state, { showHidden: false, depth: null }));

    try {
      var inPlayers = game_state.players.filter(function(player) {
        return player.status != "out";
      });
      var currentPlayer = game_state.players[game_state.in_action];
      var countOfCards = _countOfCards(game_state);
      var stateEstimation = _estimateState(game_state);

      if(countOfCards == 2) {
        // 2 cards
        if (inPlayers.length > 2 && (game_state.current_buy_in >= (currentPlayer.stack / 10))) {
          if (stateEstimation > 0.5)
            return _raise(game_state);
          else
            return 0;
        }

        if (stateEstimation < 0.5) {
          return 0;
        }
        else if (stateEstimation < 0.75) {
          return _call(game_state);
        }
        else if (stateEstimation >= 0.75 && stateEstimation < 0.95) {
          if (game_state.current_buy_in > currentPlayer.stack / 3)
            return _call(game_state);
          else
            return currentPlayer.stack / 3;
        }
        else if (stateEstimation >= 0.95) {
          if (game_state.current_buy_in > currentPlayer.stack / 2)
            return _call(game_state);
          else
            return currentPlayer.stack / 2;
        }
      }
      else {
        // 5+ cards
        if (stateEstimation == 0) {
          return 0;
        }
        else if (stateEstimation > 0 && stateEstimation < 0.5) {
          return _call(game_state);
        }
        else if (stateEstimation >= 0.5) {
          return 10000000;
        }
      }

      console.info("Default behaviour");
      return _raise(game_state);
    }
    catch(e) {
      console.error(e.stack);
      console.error(e);
      return 0;
    }
  },

  showdown: function(game_state) {

  }
};