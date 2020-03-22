var CombatRoom = {
	loadCharactersForBattle: function(battleId, orderBy) {
    var list = "";
    var self = this;
    var battle = BattleController.find(battleId);
    
    $.each(battle.charactersIds, function(index, id) {
      var character = CharacterController.find(id);
      var isAlly = (orderBy == "Ally");
      if ((!orderBy) ||
          (orderBy && character.ally == true && isAlly) ||
          (orderBy && character.ally != true && !isAlly) 
         ) {
        list += self._createCharacterWithIcon(character, "removeCharacter", true);
      }
    });

    $("#currentCharacters ul").html(list);

    $("#currentCharacters ul li a.removeCharacter").unbind().click(function() {
      var id = $(this).attr("data-id");
      if (battle.removeCharacter(id)) {
        self.loadPCsForBattle(battleId);
        $(this).parent().remove();
      }
    });

    $(".allianceStatus").click(function() {
      var id = $(this).attr("data-id");
      var character = CharacterController.find(id);
      character.ally = !character.ally;
      self.loadCharactersForBattle(battleId);
    });
  },

  loadPCsForBattle: function(battleId) {
    var index     = 0;
    var list      = "";
    var linkClass = "";
    var self      = this;

    var battle = BattleController.find(battleId);

    $.each(CharacterController.characters, function(i, character) {
      if (character.characterType === "PC") {
        index = battle.charactersIds.indexOf(character.id);
        linkClass = index == -1 ? "addCharacter": "addedCharacter";
        list += self._createCharacterWithIcon(character, linkClass);
      }
    });

    $("#pcs ul").html(list);

    $("#pcs ul li a.addCharacter").unbind().click(function() {
      var id = $(this).attr("data-id");
      var character = CharacterController.find(id);

      if (character.currentBattleId == 0) {
        if (battle.addCharacter(id)) {
          character.currentBattleId = battleId;
          self.loadCharactersForBattle(battleId);
          $(this).removeClass("addCharacter").addClass("addedCharacter").unbind();
        }
      } else {
        alert("Este personagem já está participando de outro combate");
      }
    });
  },

  loadNpcsForBattle: function(battleId) {
    var self = this;
    $("#npcs #characterClasses").unbind().change(function() {
      var value = $(this).val();
      var itemClass = "";
      if (value != "")
        itemClass = "characterClasses " + value;

      $("#character-thumb").attr("class", itemClass);
    });

    $("#randomize-npc").unbind().click(function() {
      var count = parseInt($("#randomize-count").val());
      if (count == 0) count = 1;

      if (count == 1) {
        self._randomizeNpc(battleId);
      } else {
        for (var i = 0; i < count; i++) {
          self._randomizeNpc(battleId);
          $("#add-npc").trigger('click');
        }
      }
    });

    $("#add-npc").unbind().click(function() {
      var battle = BattleController.find(battleId);
      var character = NpcController.current;

      if (character != null) {
        character.skills = self._currentSkillList.slice();
        self._currentSkillList = [];
        CharacterController.add(character);

        if (battle.addCharacter(character.id)) {
          self.loadCharactersForBattle(battleId);
        }

        NpcController.current = null;
        $("#level").val("");
        $("#fr").val("");
        $("#con").val("");
        $("#dex").val("");
        $("#agi").val("");
        $("#int").val("");
        $("#will").val("");
        $("#per").val("");
        $("#car").val("");
        $("#pv").val("");
        $("#pm").val("");
        $("#ip").val("");
        $("#total").val("");

        self._cleanNpcSkillList();
      }
    });

    $("#randomize-count").unbind().keypress(function (e) {
      if(e.which == 13) {
        e.preventDefault();
        $("#randomize-npc").trigger("click");
      }
    });
  },

  /************* private *************/

  _randomizeNpc: function(battleId) {
    var self = this;

    var characterClasses = $("#characterClasses").val();
    var character = NpcController.randomize(characterClasses);
    character.ally = ($("#team").val() == "true");
    character.currentBattleId = battleId;

    $("#level").val(character.level);
    $("#fr").val(character.fr);
    $("#con").val(character.con);
    $("#dex").val(character.dex);
    $("#agi").val(character.agi);
    $("#int").val(character.intelligence);
    $("#will").val(character.will);
    $("#per").val(character.per);
    $("#car").val(character.car);
    $("#pv").val(character.pv);
    $("#pm").val(character.pm);
    $("#ip").val(character.ip);
    $("#total").val(character.total);

    self._loadNpcSkillList();
    self._currentSkillList = SkillController.randomize(5, characterClasses);

    for (var i = 0; i < self._currentSkillList.length; i++) {
      self._addSkillToList(self._currentSkillList[i], i);
    }
  },

  _currentSkillList: [],

  _loadNpcSkillList: function() {
    var self = this;
    this._cleanNpcSkillList();
    var resultList = "";
    resultList += "<div class='skill-title'>Perícias</div>";
    resultList += "<select id='npc-skills'>";
    for (var i = 0; i < skillsList.length; i++) {
      resultList += "<option value='" + skillsList[i]["name"] +"'>" + skillsList[i]["name"] +"</option>";
    }
    resultList += "</select>";
    resultList += "<a href='javascript:;' class='addSkill'>&nbsp;</a>";
    resultList += "<div id='current-skills'><ul></ul></div>";
    $("#npc-skills-panel").prepend(resultList);
    $(".addSkill").unbind().click(function(){
      self._addSkillToList();
    });
  },

  _cleanNpcSkillList: function() {
    this._currentSkillList = [];
    $("#npc-skills-panel").html("");
  },

  _addSkillToList: function(skill_hash, index) {
    var self = this;
    var skill = $("#npc-skills").val();
    var m = new MersenneTwister();
    var position = this._currentSkillList.length - 1;
    
    // Quando se adiciona uma perícia da lista, manualmente
    if (!skill_hash) {
      this._currentSkillList.push({"name": skill, "base": "", "attack": "", "defense": ""});
      attack = "0";
      defense = "0";
    }
    else {
      // Quando se adiciona uma perícia randomicamente, já com valores de ataque e defesa
      position = index;
      skill = skill_hash["name"];
      attack = skill_hash["attack"];
      defense = skill_hash["defense"];
    }

    var template = "<a href='javascript:;' class='removeskill'></a><input type='text' class='attack' value='" + attack + "'></input>/<input type='text' class='defense' value='" + defense + "'></input>";
    $("#current-skills ul").append("<li data-pos='" + (position) + "'>" + template + skill + "</li>");
    $(".removeskill").unbind().click(function() {
      self._removeSkillFromList(this);
    });

    $("#current-skills li input").unbind().blur(function() {
      var designation = $(this).attr("class");
      var pos = $(this).parent().attr("data-pos");
      self._currentSkillList[pos][designation] = $(this).val();
    });
  },

  _removeSkillFromList: function(element) {
    var self = this;
    var parent = $(element).parent(); 
    var index = parent.attr('data-pos');
    parent.remove();
    self._currentSkillList.splice(index, 1);
    $.each($("#current-skills li"), function(index, value) {
      $(value).attr("data-pos", index);
    })
  },

  _createCharacterWithIcon: function(character, linkClass, allianceStatus) {
    var busy = (character.currentBattleId == 0 ? "": " busy");
    var typeClass = character.characterType === "PC" ? "class='pc" + busy + "'": "class='" + busy + "'";
    var list = "";
    list += "<li>\r\n";
    list += "<a href='javascript:;' class='" + linkClass + "' data-id='" + character.id + "'>&nbsp;</a>\r\n";
    list += "<a href='javascript:;' data-id='" + character.id + "' " + typeClass + ">" + character.name + "</a>\r\n";
    if (allianceStatus)
      list += "<div class='" + (character.ally ? "ally": "enemy") + " allianceStatus' data-id='" + character.id + "'></div>";
    list += "</li>\r\n";
    return list;
  }
}