var CharactersHeadquarters = {
	initialize: function() {
    var characters = CharacterController.all();
    $("#edit-character-profile").html("");

    if (characters.length > 0) {
      var select = "<select onchange='CharactersHeadquarters.loadCharacterFields($(this).val())'>";
      select += "<option value='0'>Escolha o personagem...</option>";
      for (var i = 0; i < characters.length; i++) {
        select += "<option value='" + characters[i].id + "'>" + characters[i].name + "</option>";
      }
      select += "</select>";
      $("#choose-character").html(select);
    } else {
      $("#choose-character").html("Não há personagens disponíveis");
    }

    $("#back-to-planning-room").unbind().click(function() {
      $("#planning-room").show();
      $("#combat-room").hide();
      $("#combat-zone").hide();
      $("#characters-headquarters").hide();
    });    
  },

  loadCharacterFields: function(characterId) {
    if (characterId != 0) {
      var character = CharacterController.find(characterId);

      content = "<div id='boxChar'>";
      content += "<div>";
     
      var fields = $("#npcs").clone();
      fields.find("#npc-buttons").remove();
      $("dd:last-child", fields).remove();
      $("dt:last-child", fields).remove();
      $("span:first-child", fields).remove();
      $.each($("input", fields), function(index, item) {
        $(item).attr("id", "hq_" + $(item).attr("id"));
      });
      $("#characterClasses", fields).attr("id", "hq_" + $("#characterClasses", fields).attr("id"));
      $("#character-thumb", fields).attr("id", "hq_" + $("#character-thumb", fields).attr("id"));
      $("#npc-skills-panel", fields).attr("id", "hq_" + $("#npc-skills-panel", fields).attr("id"));
      $("#npc-class", fields).attr("id", "hq_" + $("#npc-class", fields).attr("id"));
      $("#npc-data", fields).attr("id", "hq_" + $("#npc-data", fields).attr("id"));

      content += fields.html();
      content += "</div>";
      $("#edit-character-profile").html(content);

      $("#hq_characterClasses").unbind().change(function() {
        var value = $(this).val();
        var itemClass = "";
        if (value != "")
          itemClass = "characterClasses " + value;

        $("#hq_character-thumb").attr("class", itemClass);
      });

      $("#hq_npc-data input").unbind().blur(function() {
        var attribute = $(this).attr("id").replace("hq_","");
        character[attribute] = parseInt($(this).val());
      });

      this.loadCharacter(characterId);
    } else {
      $("#edit-character-profile").html("");
    }
  },

  loadCharacter: function(characterId) {
    var self = this;
    var character = CharacterController.find(characterId);

    var characterClass = character.characterClass ? character.characterClass.toLowerCase() : "warrior";

    $("#hq_characterClasses").val(characterClass).trigger("change");

    $("#hq_level").val(character.level);
    $("#hq_fr").val(character.fr);
    $("#hq_con").val(character.con);
    $("#hq_dex").val(character.dex);
    $("#hq_agi").val(character.agi);
    $("#hq_int").val(character.intelligence);
    $("#hq_will").val(character.will);
    $("#hq_per").val(character.per);
    $("#hq_car").val(character.car);
    $("#hq_pv").val(character.pv);
    $("#hq_pm").val(character.pm);
    $("#hq_ip").val(character.ip);
    $("#hq_total").val(character.total);

    self.loadSkillList(character);

    for (var i = 0; i < character.skills.length; i++) {
      self.addSkillToList(character, character.skills[i], i);
    }
  },

  loadSkillList: function(character) {
    var self = this;
    $("#hq_npc-skills-panel").html("");
    
    var resultList = "";
    resultList += "<div class='hq_skill-title'>Perícias</div>";
    resultList += "<select id='hq_npc-skills'>";
    for (var i = 0; i < skillsList.length; i++) {
      resultList += "<option value='" + skillsList[i]["name"] +"'>" + skillsList[i]["name"] +"</option>";
    }
    resultList += "</select>";
    resultList += "<a href='javascript:;' class='hq_addSkill'>&nbsp;</a>";
    resultList += "<div id='hq_current-skills'><ul></ul></div>";
    $("#hq_npc-skills-panel").prepend(resultList);
    $(".hq_addSkill").unbind().click(function(){
      self.addSkillToList(character);
    });
  },  

  addSkillToList: function(character, skill_hash, index) {
    var self = this;
    var skill = $("#hq_npc-skills").val();
    var position = character.skills.length - 1;

    if (!skill_hash) {
      character.skills.push({"name": skill, "base": "", "attack": "0", "defense": "0"});
    }
    else {
      position = index;
      skill = skill_hash["name"];
      attack = skill_hash["attack"];
      defense = skill_hash["defense"];
    }    

    var template = "<a href='javascript:;' class='hq_removeskill'></a>";
    template += "<input type='text' class='hq_attack' value='" + attack + "'></input>";
    template += "/<input type='text' class='hq_defense' value='" + defense + "'></input>";
    $("#hq_current-skills ul").append("<li data-pos='" + (position) + "'>" + template + skill + "</li>");
     $(".hq_removeskill").unbind().click(function() {
       self.removeSkillFromList(this, character);
     });

    $("#hq_current-skills li input").unbind().blur(function() {
      var designation = $(this).attr("class").replace("hq_","");
      var pos = $(this).parent().attr("data-pos");
      debugger;
      character.skills[pos][designation] = $(this).val();
    });
  },

  removeSkillFromList: function(element, character) {
    var self = this;
    var parent = $(element).parent(); 
    var index = parent.attr('data-pos');
    parent.remove();
    character.skills.splice(index, 1);
    $.each($("#hq_current-skills li"), function(index, value) {
      $(value).attr("data-pos", index);
    });
  }  
}