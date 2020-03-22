var Game = {
  containerSelector: "#combats",
  templateSelector: "#combat-template",
  container: null,
  battles: [],
  lastBattleId: 0,

  initialize: function(selector) {
    if (selector) {
      this.containerSelector = selector;
    }

    container = $(this.containerSelector);
  },

	newBattle: function() {
    var self = this;
    var template = $(this._cloneCombatTemplate());
    container.append(template);

    var battle = new Battle();
    this.lastBattleId += 1;
    battle.id = this.lastBattleId;
    BattleController.add(battle);

    template.attr("id", this.lastBattleId);
    $(".outer", template).fadeOut(1500);
    $(".inner .content", template).html(this.lastBattleId);
    this._handleRemoveCombateEvent(template);

    if (this.lastBattleId >= 100) {
      $(".inner .content", template).css("font-size", "65px");
    }

    $(".inner .content", template).click(function() {
      var id = template.attr("id");
      $("#to-combat-room").trigger("click");
      $("#combat-room h1").text("Combate " + id);
      BattleController.current = id;
      CombatRoom.loadCharactersForBattle(id);
      CombatRoom.loadPCsForBattle(id);
      CombatRoom.loadNpcsForBattle(id);
    });
	},

  /*********** private *************/

  _cloneCombatTemplate: function() {
    var template = $(this.templateSelector).html();
    return template;
  },

  _handleRemoveCombateEvent: function(elem) {
    var self = this;
    $(".remove-combat", elem).click(function() {
      if (confirm("Tem certeza que deseja excluir?")) {
        var id = elem.attr("id");
        self.removeBattle(id, elem);
      }
    });
  },

  removeBattle: function(battleId, elem) {
    var battle = BattleController.find(battleId);
    var character = null;
    $.each(battle.charactersIds, function(index, id) {
      character = CharacterController.find(id);
      character.currentBattleId = 0;
      character.currentSkillIndex = -1;
    })

    BattleController.delete(battleId);
    elem.remove();
  }
}

$(document).ready(function(){
  Game.initialize();
  CharacterController.addPcs();
  $("#new-combat").click(function(){
    Game.newBattle();
  });

  $("#to-planning-room").click(function() {
    $("#planning-room").show();
    $("#combat-room").hide();
    $("#combat-zone").hide();
    $("#characters-headquarters").hide();
  });

  $("#to-combat-room").click(function() {
    $("#planning-room").hide();
    $("#combat-room").show();
    $("#combat-zone").hide();
    $("#characters-headquarters").hide();
  });


  $("#to-combat-zone").click(function() {
    $("#planning-room").hide();
    $("#combat-room").hide();
    $("#combat-zone").show();
    $("#characters-headquarters").hide();
    CombatZone.initialize(BattleController.current);
  });

  $("#to-characters-headquarters").click(function() {
    $("#planning-room").hide();
    $("#combat-room").hide();
    $("#combat-zone").hide();
    $("#characters-headquarters").show();
    CharactersHeadquarters.initialize();
  });  
});