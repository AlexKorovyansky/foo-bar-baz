var player = require('./player');
player.bet_request({
  tournament_id: '5592bba01c450b0003000003',
  game_id: '55bc57aecc04560003000048',
  round: 14,
  players: [{
    name: 'Awesome Incredible Poker Bot',
    stack: 0,
    status: 'out',
    bet: 0,
    version: 'Awesome Incredible Poker Bot',
    id: 0
  },
    {
      name: 'LeanNodeJS',
      stack: 2235,
      status: 'active',
      bet: 30,
      hole_cards: [Object],
      version: 'LeanNodeJS engineered player',
      id: 1
    },
    {
      name: 'Boris',
      stack: 0,
      status: 'out',
      bet: 0,
      version: 'Boris Raiser v1.0',
      id: 2
    },
    {
      name: 'PythonPokerTeam',
      stack: 1010,
      status: 'active',
      bet: 30,
      version: 'Inky 0.1',
      id: 3
    },
    {
      name: 'sevenbits',
      stack: 1625,
      status: 'active',
      bet: 70,
      version: 'Crazy Bot',
      id: 4
    },
    {
      name: 'JBot',
      stack: 0,
      status: 'out',
      bet: 0,
      version: 'Default Java folding player',
      id: 5
    }],
  small_blind: 10,
  orbits: 2,
  dealer: 1,
  community_cards: [],
  current_buy_in: 70,
  pot: 130,
  in_action: 1,
  minimum_raise: 40,
  bet_index: 10
});