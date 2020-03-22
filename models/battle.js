var Battle = function() {
  this.id = "";
  this.currentTurn = -1;
  this.charactersIds = [];

  this.addCharacter = function(characterId) {
    var iCharacterId = parseInt(characterId);
    if (this.charactersIds.indexOf(iCharacterId) === -1) {
      this.charactersIds.push(iCharacterId);
      return true;
    } else {
      return false;
    }
  }

  this.removeCharacter = function(characterId) {
    var iCharacterId = parseInt(characterId);
    var index = this.charactersIds.indexOf(iCharacterId);
    if (index > -1) {
      this.charactersIds.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
}