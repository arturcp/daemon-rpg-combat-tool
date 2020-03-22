var BattleController = {
  current: 0,
  battles: {},

  find:function(battleId) {
    return this.battles[battleId];
  },

  delete: function(id) {
    this.battles[id] = null;
  },

  add: function(battle) {
    this.battles[battle.id] = battle;
  }
}