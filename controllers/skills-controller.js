var SkillController = {
  randomize: function(quantity, characterClass) {
    if (characterClass == "") characterClass = undefined;
    var self = this;
    var m = new MersenneTwister();

    var isCompleted = false;

    //deve haver ao menos uma perícia de ataque e uma de defesa. Senão, recomeçar.
    while (!isCompleted) {
      var index = 0;
      var result = [];
      var usedNumbers = [];
      var totalAttack = 0;
      var totalDefense = 0;
      for (var i = 0; i < quantity; i++) {
        index = self._sortANumber(skillsList, characterClass);

        while (usedNumbers.indexOf(index) != -1 || !this._canCharacterHaveSkill(characterClass, skillsList[index])) {
          index = self._sortANumber(skillsList, characterClass);
        }

        usedNumbers.push(index);
        result.push(skillsList[index]);
        var skill = result[result.length - 1];

        if (skill["limitedTo"] !== "defense")
          skill["attack"] = Math.floor((m.random() * 100) + 1);
        else
          skill["attack"] = 0;

        if (skill["limitedTo"] !== "attack")
          skill["defense"] = Math.floor((m.random() * 100) + 1);
        else
          skill["defense"] = 0;

        if (skill["attack"] > 0)
          totalAttack += 1;

        if (skill["defense"] > 0)
          totalDefense += 1;

      }

      isCompleted = totalAttack > 0 && totalDefense > 0;
    }

    return result;
  },

  /*private */
  // Verifica se a classe do personagem é compatível com a perícia escolhida
  _canCharacterHaveSkill: function(characterClass, skill) {
    if (!skill["baseClass"])
      return true;
    
    if (skill["baseClass"] == characterClass)
      return true;

    return false;
  },

  // Sorteia uma perícia levando em consideração a classe do personagem e a exigência da perícia
  // Algumas perícias só existem para determinadas classes.
  _sortANumber: function(skillsList, characterClass) {
    var m = new MersenneTwister();
    var index = Math.floor((m.random() * skillsList.length));
    
    while (!this._canCharacterHaveSkill(characterClass, skillsList[index])) {
      index = Math.floor((m.random() * skillsList.length));
    }

    return index;
  }
}