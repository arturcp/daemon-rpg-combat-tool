var Character = function (){
  this.id = 0;
  this.name = "";
  this.race = "";
  this.ally = false;
  this.fr = 0;
  this.con = 0;
  this.dex = 0;
  this.agi = 0;
  this.intelligence = 0;
  this.will = 0;
  this.per = 0;
  this.car = 0;

  this.initiative = 0;
  //this.initiativeModifier = 0;
  this.currentBattleId = 0;
  this.currentSkillIndex = 0;

  this.characterType = "PC";
  this.characterClass = "sorcerer";

  this.skills = [];

	this.addAttributes = function(fr, con, dex, agi, intelligence, will, per, car) {
    this.fr = fr;
    this.con = con;
    this.dex = dex;
    this.agi = agi;
    this.intelligence = intelligence;
    this.will = will;
    this.per = per;
    this.car = car;
  };

  this.chooseBestDefensiveSkill = function() {
    var maxDefenseValue = 0;
    var bestIndex = 0;

    $.each(this.skills, function(index, skill) {
      if (skill.defense > maxDefenseValue) {
        maxDefenseValue = skill.defense;
        bestIndex = index;
      }
    });

    return this.skills[bestIndex];   
  }
}