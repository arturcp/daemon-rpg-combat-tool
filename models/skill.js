var Skill = function (){
    this._attributesList = ["fr", "con", "dex","agi","intelligence","will","per","car"];
  	this.name = "";
    this.attack = 0;
    this.defense = 0;
    this.base = 0;

    this.isDefensive = function() {
      return this.defense > 0;
    }

    this.getBase = function() {
      return this._attributesList[this.base];
    }

    this.setBase = function(attribute) {
      this.base = this._attributesList.indexOf(attribute);
    }
}