var player = require('./player');
console.log('bet ->', player.bet_request({
  tournament_id: '5592bba01c450b0003000003',
  game_id: '55bc7fdea9affd00030000dc',
  round: 0,
  players: [{
    name: 'Awesome Incredible Poker Bot',
    stack: 1000,
    status: 'folded',
    bet: 0,
    version: 'Awesome Incredible Poker Bot',
    id: 0
  },
    {
      name: 'LeanNodeJS',
      stack: 990,
      status: 'active',
      bet: 10,
      hole_cards: [{rank: 'K', suit: 'clubs'},
        {rank: '8', suit: 'diamonds'}],
      version: 'LeanNodeJS fox',
      id: 1
    },
    {
      name: 'Boris',
      stack: 980,
      status: 'active',
      bet: 20,
      version: 'Boris Raiser v1.0',
      id: 2
    },
    {
      name: 'PythonPokerTeam',
      stack: 1000,
      status: 'folded',
      bet: 0,
      version: 'Inky 0.3',
      id: 3
    },
    {
      name: 'sevenbits',
      stack: 1000,
      status: 'folded',
      bet: 0,
      version: 'Crazy All In Bot',
      id: 4
    },
    {
      name: 'JBot',
      stack: 980,
      status: 'active',
      bet: 20,
      version: 'Rom dom dom! v6',
      id: 5
    }],
  small_blind: 10,
  orbits: 0,
  dealer: 0,
  community_cards: [],
  current_buy_in: 20,
  pot: 50,
  in_action: 1,
  minimum_raise: 10,
  bet_index: 6
}));