var InitiativeController = {
	listsForBattle: {},
	
  initializeLists: function(battleId) {
    InitiativeController.listsForBattle[battleId] = {}
    InitiativeController.listsForBattle[battleId].allies  = [];
    InitiativeController.listsForBattle[battleId].enemies = [];
    InitiativeController.listsForBattle[battleId].all     = [];
	}
}