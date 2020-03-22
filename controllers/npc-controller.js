var NpcController = {

  npcIdCount: 18,
  current: null,

  randomize: function(characterClass) {
    var m = new MersenneTwister();
    var level = Math.floor((m.random() * 20) + 1);
    var attributes = 100 + level;

    var fr = Math.floor((m.random() * 9) + 9);
    var con = Math.floor((m.random() * 9) + 9);
    var dex = Math.floor((m.random() * 9) + 9);
    var agi = Math.floor((m.random() * 9) + 9);
    var intelligence = Math.floor((m.random() * 9) + 9);
    var will = Math.floor((m.random() * 9) + 9);
    var per = Math.floor((m.random() * 9) + 9);
    var car = Math.floor((m.random() * 9) + 9);

    var pv = Math.ceil((fr + con) / 2) + level;


    var id = Object.keys(CharacterController.characters).length + 1;
    var data = {
      "characterType": "NPC",
      "level": level,
      "fr":    fr,
      "con":   con,
      "dex":   dex,
      "agi":   agi,
      "intelligence":  intelligence,
      "will":  will,
      "per":   per,
      "car":   car,
      "pv":    pv,
      "total": 0,
      "pm": 0,
      "ip": 0,
      "name": "[NPC " + this.npcIdCount + "] " + Names.get(),
      "id": id,
      "initiative": 0,
      "initiativeModifier": 0
    }

    var character = CharacterController.createCharacter(
      data.id,
      data.name,
      "Human",
      characterClass,
      [data.fr, data.con, data.dex, data.agi, data.intelligence, data.will, data.per, data.car],
      false,
      data.level,
      data.pv,
      data.pm,
      data.ip
    );

    character.characterType = "NPC";
    character.total = 0;
    character.initiative = 0;
    character.initiativeModifier = 0;

    this._adjustAttributesLimits(attributes, character);
    this._adjustAttributesForClass(characterClass, character);
    character.currentPv = character.pv;
    this.current = character;

    return character;
  },

  /**************** private ***************/

  _adjustAttributesLimits:function(totalPoints, attributes) {
  	var count = attributes.fr + attributes.con + attributes.dex + attributes.agi + 
  		attributes.intelligence + attributes.will + attributes.per + attributes.car;
    attributes.total = count;
    
    if (totalPoints == count)
      return;
    
    var m = new MersenneTwister();
    var difference = Math.abs(totalPoints - count);
    var randomNumber = 0;
    var signal = 1;

    for (var i = 0; i < difference; i++)
    { 
      randomNumber = Math.floor((m.random() * 8) + 1);
      signal = totalPoints > count ? 1 : -1;
      switch(randomNumber)
      {
        case 1:
          attributes.fr = attributes.fr + signal;
          break;
        case 2:
          attributes.con = attributes.con + signal;
          break;
        case 3:
          attributes.dex = attributes.dex + signal;
          break;
        case 4:
          attributes.agi = attributes.agi + signal;
          break;
        case 5:
          attributes.intelligence = attributes.intelligence + signal;
          break;
        case 6:
          attributes.will = attributes.will + signal;
          break;
        case 7:
          attributes.per = attributes.per + signal;
          break;
        case 8:
          attributes.car = attributes.car + signal;
          break;
      }
    }
    attributes.total =  attributes.fr + attributes.con + attributes.dex + attributes.agi + 
      attributes.intelligence + attributes.will + attributes.per + attributes.car;
  },

  _adjustAttributesForClass:function(characterClass, attributes) {
      var m = new MersenneTwister();
      switch(characterClass)
      {
        case "cleric":
          attributes.fr  = attributes.fr + 1;
          attributes.car = attributes.car + 1;
          attributes.agi = attributes.agi - 2;
          break;
        case "sorcerer":
          attributes.intelligence = attributes.intelligence + 2;
          attributes.will = attributes.will + 2;
          attributes.fr   = attributes.fr - 2;
          attributes.con  = attributes.con - 2;

          var initialMagicPower = Math.floor((m.random() * 5));
          var pms = [1,2,3,5,7];
          attributes.pm  = pms[initialMagicPower] + (attributes.level - 1);
          break;
        case "paladin":
          attributes.con = attributes.con + 1;
          attributes.dex = attributes.dex + 1;
          attributes.per = attributes.per - 2;
          attributes.ip = Math.floor((m.random() * 7) + 1);
          break;
        case "ranger":
          attributes.dex = attributes.dex + 1;
          attributes.per = attributes.per + 2;
          attributes.car = attributes.car - 1;
          attributes.intelligence = attributes.intelligence - 1;
          attributes.ip = Math.floor((m.random() * 3));
          break;
        case "rogue":
          attributes.agi = attributes.agi + 1;
          attributes.dex = attributes.dex + 1;
          attributes.fr  = attributes.fr  - 1;
          attributes.con = attributes.con - 1;
          attributes.ip = Math.floor((m.random() * 2));
          break;
        case "warrior":
          attributes.fr  = attributes.fr  + 1;
          attributes.con = attributes.con + 1;
          attributes.dex = attributes.dex + 2;
          attributes.per = attributes.per - 2;
          attributes.intelligence = attributes.intelligence - 2;
          attributes.ip = Math.floor((m.random() * 5) + 1);
          break;
      }
  }
}