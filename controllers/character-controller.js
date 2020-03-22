var CharacterController = {
  characters: {},

  all: function() {
    var output = [];
    var self = this;

    for (var key in self.characters) {
        output.push(self.characters[key]);
    }
    return output;
  },

  add: function(character) {
    this.characters[character.id] = character;
  },

  find: function(characterId) {
    return this.characters[characterId];
  },

  addPcs: function() {
    this.createCharacter(1,  "Anelyn",     "Elf",      "Pirate",     [10,13,16,19,10,15,11,21], true, 15,27,00,01);
    this.createCharacter(2,  "Hannet",     "Human",    "Sorcerer",   [10,11,13,12,22,30,14,13], true, 15,26,36,00);
    this.createCharacter(3,  "Krurin",     "Kowkan",   "Warrior",    [19,13,17,19,13,11,14,09], true, 15,31,00,00);
    this.createCharacter(4,  "Yshir",      "Half-elf", "Rogue",      [13,13,17,19,17,10,15,11], true, 15,28,00,00);
    this.createCharacter(5,  "Liná",       "Human",    "Sorcerer",   [08,10,09,11,18,20,16,13], true, 05,14,00,00);
    this.createCharacter(6,  "Hauteff",    "Elf",      "Sorcerer",   [09,14,13,21,13,17,14,19], true, 20,12,50,00);
    this.createCharacter(7,  "Axel",       "Human",    "Warrior",    [14,18,12,17,10,18,09,17], true, 15,28,00,03);
    this.createCharacter(8,  "Aang",       "Human",    "Bard",       [19,10,16,11,13,15,16,15], true, 15,28,20,00);
    this.createCharacter(9,  "Julian",     "Human",    "Rogue",      [10,12,18,15,16,14,19,12], true, 16,26,00,00);
    this.createCharacter(10, "Daphne",     "Elf",      "Pirate",     [16,18,11,16,13,11,16,17], true, 18,34,00,00);
    this.createCharacter(11, "Gaia",       "Human",    "Necromancer",[18,11,15,18,12,17,15,14], true, 20,33,50,00);
    this.createCharacter(12, "Nathanael",  "Hariel",   "Angel",      [15,20,20,20,30,30,20,20], false,75,90,99,10);
    this.createCharacter(13, "Vasahiah",   "Hariel",   "Angel",      [16,17,15,11,12,13,17,17], true, 18,35,00,00);
    this.createCharacter(14, "Seheiah",    "Hariel",   "Angel",      [16,16,12,13,19,18,14,12], true, 20,33,00,00);
    this.createCharacter(15, "Reikiel",    "Hariel",   "Angel",      [17,14,15,14,12,17,12,17], true, 18,33,00,00);
    this.createCharacter(16, "Mikael",     "Hariel",   "Angel",      [17,15,10,17,12,18,10,17], true, 16,32,20,02);
    this.createCharacter(17, "Nith-Haiah", "Hariel",   "Angel",      [16,15,15,16,15,12,17,14], true, 20,35,00,00);
  },

  createCharacter: function(id, name, race, characterClass, attributes, ally, level, pv, pm, ip) {
    var character = new Character();
    character.id  = id;
    character.name = name;
    character.race = race;
    character.characterClass = characterClass;
    character.characterType  = "PC";
    character.ally = ally;
    character.fr = attributes[0];
    character.con = attributes[1];
    character.dex = attributes[2];
    character.agi = attributes[3];
    character.intelligence = attributes[4];
    character.will = attributes[5];
    character.per = attributes[6];
    character.car = attributes[7];
    character.level = level;
    character.pv = pv;
    character.pm = pm;
    character.ip = ip;
    //character.skills = SkillController.randomize(5, characterClass);
    character.skills = this.setSkill(character.name);
    this.characters[id] = character;
    return character;
  },

  setSkill: function(name) {
    var result = [];
    switch (name) {
        case "Anelyn":
          result.push(this.prepareSkill(4, 151, 121));  //Artes Marciais
          result.push(this.prepareSkill(1, 121, 71));   //Adaga
          result.push(this.prepareSkill(23, 30, 30));   //Sabre
          result.push(this.prepareSkill(11, 161, 131)); //Dança
        break;
        case "Hannet":
          result.push(this.prepareSkill(8, 10, 10));    //Briga
          result.push(this.prepareSkill(32, 10, 10));   //Bastão
          result.push(this.prepareSkill(25, 150, 150)); //Magia nível 1
          result.push(this.prepareSkill(26, 150, 150)); //Magia nível 2
          result.push(this.prepareSkill(27, 150, 150)); //Magia nível 3
          result.push(this.prepareSkill(28, 150, 150)); //Magia nível 4
          result.push(this.prepareSkill(29, 150, 150)); //Magia nível 5
          result.push(this.prepareSkill(30, 150, 150)); //Magia nível 6
          result.push(this.prepareSkill(31, 150, 150)); //Magia nível 7
          result.push(this.prepareSkill(14, 0, 10));    //Esquiva
        break;
        case "Krurin":
          result.push(this.prepareSkill(8, 70, 70));    //Briga
          result.push(this.prepareSkill(12, 107, 107)); //Espada curta
          result.push(this.prepareSkill(33, 87, 00));   //Garras
          result.push(this.prepareSkill(14, 79, 100));  //Esquiva
          result.push(this.prepareSkill(11, 0, 05));    //Dança
        break;
        case "Yshir":
          result.push(this.prepareSkill(8, 130, 140));   //Briga
          result.push(this.prepareSkill(12, 90, 90));    //Espada curta
          result.push(this.prepareSkill(1, 57, 27));     //Adaga
          result.push(this.prepareSkill(14, 0, 150));    //Esquiva
        break;
        case "Liná":
          result.push(this.prepareSkill(8, 21, 21));   //Briga
          result.push(this.prepareSkill(25, 70, 70));  //Magia nível 1
          result.push(this.prepareSkill(26, 70, 70));  //Magia nível 2
          result.push(this.prepareSkill(27, 70, 70));  //Magia nível 3
          result.push(this.prepareSkill(28, 70, 70));  //Magia nível 4
          result.push(this.prepareSkill(14, 0, 41));   //Esquiva
        break;
        case "Hauteff":
          result.push(this.prepareSkill(8, 30, 10));    //Briga
          result.push(this.prepareSkill(25, 200, 200)); //Magia nível 1
          result.push(this.prepareSkill(26, 200, 200)); //Magia nível 2
          result.push(this.prepareSkill(27, 200, 200)); //Magia nível 3
          result.push(this.prepareSkill(28, 200, 200)); //Magia nível 4
          result.push(this.prepareSkill(29, 200, 200)); //Magia nível 5
          result.push(this.prepareSkill(30, 200, 200)); //Magia nível 6
          result.push(this.prepareSkill(31, 200, 200)); //Magia nível 7
          result.push(this.prepareSkill(14, 0, 70));    //Esquiva
        break;
        case "Axel":
          result.push(this.prepareSkill(8, 100, 130));    //Briga
          result.push(this.prepareSkill(32, 100, 130));   //Bastão
          result.push(this.prepareSkill(14, 0, 90));      //Esquiva
          result.push(this.prepareSkill(12, 80, 90));     //Espada curta
        break;
        case "Aang":
          result.push(this.prepareSkill(8, 60, 70));    //Briga
          result.push(this.prepareSkill(25, 100, 100)); //Magia nível 1
          result.push(this.prepareSkill(26, 100, 100)); //Magia nível 2
          result.push(this.prepareSkill(27, 100, 100)); //Magia nível 3
          result.push(this.prepareSkill(28, 100, 100)); //Magia nível 4
          result.push(this.prepareSkill(29, 100, 100)); //Magia nível 5
          result.push(this.prepareSkill(14, 0, 70));    //Esquiva
        break;
        case "Julian":
          result.push(this.prepareSkill(6, 70, 70));     //Boleadeira
          result.push(this.prepareSkill(0, 0, 90));      //Acrobacia
          result.push(this.prepareSkill(1, 87, 30));     //Adaga
          result.push(this.prepareSkill(12, 60, 70));    //Espada curta
          result.push(this.prepareSkill(16, 90, 90));    //Finta
          result.push(this.prepareSkill(24, 55, 0));     //Zarabatana
          result.push(this.prepareSkill(15, 100, 10));   //Faca
        break;
        case "Daphne":
          result.push(this.prepareSkill(4, 100, 100));    //Artes Marciais
          result.push(this.prepareSkill(1, 121, 71));     //Adaga
          result.push(this.prepareSkill(23, 100, 150));   //Sabre
          result.push(this.prepareSkill(0, 0, 100));      //Acrobacia
          result.push(this.prepareSkill(8, 90, 90));      //Briga
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(16, 100, 100));   //Finta
          result.push(this.prepareSkill(21, 67, 0));      //Punhal
        break;
        case "Gaia":
          result.push(this.prepareSkill(8, 90, 90));    //Briga
          result.push(this.prepareSkill(25, 200, 200)); //Magia nível 1
          result.push(this.prepareSkill(26, 200, 200)); //Magia nível 2
          result.push(this.prepareSkill(27, 200, 200)); //Magia nível 3
          result.push(this.prepareSkill(28, 200, 200)); //Magia nível 4
          result.push(this.prepareSkill(29, 200, 200)); //Magia nível 5
          result.push(this.prepareSkill(30, 200, 200)); //Magia nível 6
          result.push(this.prepareSkill(31, 200, 200)); //Magia nível 7
          result.push(this.prepareSkill(14, 0, 150));   //Esquiva
          result.push(this.prepareSkill(34, 130, 100)); //Foice
       break;
        case "Nathanael":
          result.push(this.prepareSkill(8, 250, 250));     //Briga
          result.push(this.prepareSkill(25, 300, 300));    //Magia nível 1
          result.push(this.prepareSkill(26, 300, 300));    //Magia nível 2
          result.push(this.prepareSkill(27, 300, 300));    //Magia nível 3
          result.push(this.prepareSkill(28, 300, 300));    //Magia nível 4
          result.push(this.prepareSkill(29, 300, 300));    //Magia nível 5
          result.push(this.prepareSkill(30, 300, 300));    //Magia nível 6
          result.push(this.prepareSkill(31, 300, 300));    //Magia nível 7
          result.push(this.prepareSkill(14, 250, 250));    //Esquiva
          result.push(this.prepareSkill(12, 250, 250));    //Espada curta
          result.push(this.prepareSkill(13, 250, 250));    //Espada curta
        break;
        case "Vasahiah":
          result.push(this.prepareSkill(8, 100, 100));    //Briga
          result.push(this.prepareSkill(12, 100, 100));   //Espada curta
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(25, 100, 100));   //Magia nível 1
          result.push(this.prepareSkill(26, 100, 100));   //Magia nível 2
        break;
        case "Seheiah":
          result.push(this.prepareSkill(8, 100, 100));    //Briga
          result.push(this.prepareSkill(12, 100, 100));   //Espada curta
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(25, 100, 100));   //Magia nível 1
          result.push(this.prepareSkill(26, 100, 100));   //Magia nível 2
        break;
        case "Reikiel":
          result.push(this.prepareSkill(8, 100, 100));    //Briga
          result.push(this.prepareSkill(12, 100, 100));   //Espada curta
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(25, 100, 100));   //Magia nível 1
          result.push(this.prepareSkill(26, 100, 100));   //Magia nível 2
        break;
        case "Mikael":
          result.push(this.prepareSkill(8, 100, 100));    //Briga
          result.push(this.prepareSkill(12, 100, 100));   //Espada curta
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(25, 100, 100));   //Magia nível 1
          result.push(this.prepareSkill(26, 100, 100));   //Magia nível 2
        break;
        case "Nith-Haiah":
          result.push(this.prepareSkill(8, 100, 100));    //Briga
          result.push(this.prepareSkill(12, 100, 100));   //Espada curta
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(14, 0, 100));     //Esquiva
          result.push(this.prepareSkill(25, 100, 100));   //Magia nível 1
          result.push(this.prepareSkill(26, 100, 100));   //Magia nível 2
        break;
    }

    return result;
  },

  prepareSkill: function(index, attack, defense) {
    var skill = Object.create(skillsList[index]);
    skill["attack"] = attack;
    skill["defense"] = defense;
    return skill;
  }
}