var rainman = require('./rainman');
var util = require('util');
var PokerEvaluator = require("poker-evaluator");
var ThreeCardConverter = require("./node_modules/poker-evaluator/lib/3CardConverter");

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
  } else if (RANK_SCORES[first.rank] >= 12 || RANK_SCORES[second.rank] >= 12) {
    return 0.9;
  }else if (first.suit === second.suit
      || RANK_SCORES[first.rank] >= 12 || RANK_SCORES[second.rank] >= 12  // A, K
      || Math.abs(RANK_SCORES[second.rank] - RANK_SCORES[first.rank]) == 1) { // continuous
    return 0.75
  } else {
    //return rankScore(first.rank, second.rank) / MAX_SCORE;
    return 0;
  }
  
  return 0;
}

function _convertCardsToPokerEvaluator(cards) {
  var cardsProcessed = cards.map(function(card) {
    var cardName = card.rank == "10" ? "T" : card.rank;
    var cardType = card.suit[0];
    return cardName + cardType;
  });
  return cardsProcessed;
}

function _estimateAllCards(cardsProcessed) {
  var returnValue = PokerEvaluator.evalHand(cardsProcessed).value / 36874;
  if(returnValue > 1)
    returnValue = 1;
  return returnValue;
  //return rainman.rank(cards);
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
      var allCardsProcessed = _convertCardsToPokerEvaluator(allCards);
      var allCardsEstimation = _estimateAllCards(allCardsProcessed);

      var communityCardsEstimation = 0;
      if(communityCards.length == 4) {
        // 4 cards
        var cardsProcessed = ThreeCardConverter.fillHand(_convertCardsToPokerEvaluator(communityCards));
        communityCardsEstimation = _estimateAllCards(cardsProcessed);
      } else {
        // 3,5 cards
        var cardsProcessed = _convertCardsToPokerEvaluator(communityCards);
        communityCardsEstimation = _estimateAllCards(cardsProcessed);
      }
      if (communityCardsEstimation == allCardsEstimation)
        return 0;

      return allCardsEstimation;
    }
  }
  catch(e) {
    console.error(e.stack);
    console.error(e);
    return 0.5;
  }
}

function _soft_raise(game_state) {
  var stack = game_state.players[game_state.in_action].stack;
  
  var raiseAmount = game_state.current_buy_in - game_state.players[game_state.in_action]["bet"] + game_state.minimum_raise;
  if (raiseAmount > stack / 2) {
    raiseAmount = 0;
  }
  console.info("RAISE: " + raiseAmount);
  return raiseAmount;
}

function _raise(game_state) {
  var raiseAmount = game_state.current_buy_in - game_state.players[game_state.in_action]["bet"] + game_state.minimum_raise;
  console.info("RAISE: " + raiseAmount);
  return raiseAmount;
}

function _soft_call(game_state) {
  var stack = game_state.players[game_state.in_action].stack;
  var callAmount = game_state.current_buy_in - game_state.players[game_state.in_action]["bet"];
  
  if (callAmount > stack / 4) {
    callAmount = 0;
  }
  
  console.info("CALL: " + callAmount);
  return callAmount;
}

function _call(game_state) {
  var callAmount = game_state.current_buy_in - game_state.players[game_state.in_action]["bet"];
  console.info("CALL: " + callAmount);
  return callAmount;
}

function _countOfCards(game_state) {
  var handCards = game_state.players[game_state.in_action].hole_cards;
  var communityCards = game_state.community_cards ? game_state.community_cards : [];
  return handCards.length + communityCards.length;
}

var bluff = null;
var lastGameId = "";
module.exports = {

  VERSION: "LeanNodeJS KAVAI 16:51",

  bet_request: function(game_state) {
    if(game_state.game_id != lastGameId) {
      console.log("New game");
      bluff = null;
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
        //if (inPlayers.length > 2 && (game_state.current_buy_in >= (currentPlayer.stack / 10))) {
        //  if (stateEstimation > 0.5)
        //    return _raise(game_state);
        //  else
        //    return 0;
        //}

        if (stateEstimation > 0.95) {
          if (game_state.current_buy_in > currentPlayer.stack / 2)
            return _call(game_state);
          else
            return currentPlayer.stack / 2;
        } else if (stateEstimation > 0.85) {
          if (game_state.current_buy_in > currentPlayer.stack / 4)
            return _call(game_state);
          else
            return currentPlayer.stack / 4;
        } else {
          return 0
        }
      }
      else {
        // 5+ cards
        if (stateEstimation == 0) {
          if(bluff == null && countOfCards == 5 && Math.random() < 0.314) {
            console.log("bluffing set");
            bluff = "yes";
          } else {
            bluff = "no";
          }
          if(bluff == "yes") {
            console.log("bluffing");
            return _call(game_state);
          }
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