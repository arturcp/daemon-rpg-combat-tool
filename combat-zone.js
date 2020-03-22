var CombatZone = {
	list: $("#initiative-list"),
  action: $("#action"),
	panel: $("#panel"),
  currentBattleId: 0,
  currentTurn: 0,
  currentAttackSkill: null,
  currentDefenseSkill: null,
  currentAttacker: null,
  currentDefender: null,

  initialize: function(battleId) {
    this.currentBattleId = battleId;
    var battle = BattleController.find(battleId);
    var self = this;

    this.list.html("");
    this.currentTurn = battle.turn || 0;
    this.currentAttackSkill = null;
    this.currentDefenseSkill = null;
    this.currentAttacker = null;
    this.currentDefender = null;

    $("#roll-initiative").unbind().click(function() {
      self._beforeInitiative(battleId);
    });

    $("#end-combat").unbind().click(function() {
      if (confirm("tem certeza que deseja encerrar este combate?")) {
        InitiativeController.listsForBattle[self.currentBattleId] = {};
        var battleDiv = $("#" + self.currentBattleId);
        Game.removeBattle(self.currentBattleId, battleDiv);

        self.currentBattleId = 0;
        self.currentTurn = 0;
        self.currentAttackSkill = null;
        self.currentDefenseSkill = null;
        self.currentAttacker = null;
        self.currentDefender = null;          

        $("#to-planning-room").trigger("click");
      }
    });

    if (!$.isEmptyObject(InitiativeController.listsForBattle[this.currentBattleId]) && battle.currentTurn >= 0) {
      this.list.html(this.loadTableOfDuels(battle));
      this._loadTurn(battle.currentTurn);
    } else {
      $("#action").html("");
    }
  },

  /******** private ***********/

  // Pré-lista de iniciativas, para que o usuário possa escolher as ações dos personagens. A
  // lista já vem pré-escolhida de forma aleatória.
  _beforeInitiative: function(battleId) {
    var battle = BattleController.find(battleId);
    //if (battle.currentTurn >= battle.charactersIds.length) {
      battle.currentTurn = -1;
      this.currentTurn = 0;
    //}

    this.list.html("");

    var result = "<ul>";
    var listOfSkills = "";
    var skillIndex = 0;
    var m = new MersenneTwister();
    InitiativeController.initializeLists(battleId);
    this.loadListsForBattle(battle);

    this.startToChooseTargets(battleId);

    var listOfOpponents = "";
    var currentList = "";

    $.each(battle.charactersIds, function(index_char, id) {
      character = CharacterController.find(id);
      if (character.pv > 0) {
        listOfSkills = "<select id='skills_" + character.id + "' >";
        skillIndex = Math.floor((m.random() * character.skills.length));
        character["currentSkillIndex"] = skillIndex;
        $.each(character.skills, function(index, skill) {
          if (skill["attack"] > 0)
            listOfSkills += "<option value='" + index + "' " + (index === skillIndex ? "selected='selected'" : "") + ">" + skill["name"] + "</option>";  
        });
        
        listOfSkills += "</select>";

        listOfOpponents = "<select data-character='" + character.id + "' class='choose-enemy-list'>";
        currentList = character.ally ? InitiativeController.listsForBattle[battle.id].enemies : InitiativeController.listsForBattle[battle.id].allies;
        $.each(currentList, function(index_opponents, opponent) {
          listOfOpponents += "<option value='" + opponent.id + "' " + (opponent.id == character.adversary.id ? "selected='selected'": "") + ">" + opponent.name + "</option>";
        });

        listOfOpponents += "</select>";

        result += "<li><span class='left'>" + character["name"] + "</span><span class='right'> contra </span>" + listOfOpponents + " com " + listOfSkills + "</li>";
      }
    });

    result += "</ul>";
    result += "<div><a id='calculate-initiatives' href='javascript: CombatZone.rollInitiative();'>Calcular</a></div>";

    $("#action").html(result);

    $(".choose-enemy-list").unbind().change(function() {
      var id = $(this).attr("data-character");
      var character = CharacterController.find(id);
      var adversary = CharacterController.find($(this).val());
      character.adversary = adversary;
    });
  },

  rollInitiative: function() {
    this._clearLog();
    this._loadInitiativeList(this.currentBattleId);
  },

  _compare: function(property) {
    return function (a, b) {
        return parseInt(b[property]) - parseInt(a[property]);
    };
  },

  // Escolhe uma perícia aleatoriamente, levando em conta se o objetivo é ataque ou defesa,
  // pois há perícias excluivas para um caso e para o outro.
  _randomSkill: function(skillList, designation) {
    var m = new MersenneTwister();
    var totalDefense = 0;
    var totalAttack = 0;
    var index = 0;
    
    $.each(skillList, function(index, skill) {
      if (skill["attack"] > 0)
        totalAttack += 1;
      else if (skill["defense"] > 0)
        totalDefense += 1;
    });
    
    if (designation === "attack" && totalAttack == 0)
      return 0;
    else if (designation === "defense" && totalDefense == 0)
      return 0;
    else {
      index = Math.floor((m.random() * skillList.length));
      while (skillList[index][designation] <= 0) {
        index = Math.floor(m.random() * skillList.length);
      }
    }
    return index;
  },

  // Calcula as iniciativas e monta a lista de turnos na ordem em que eles
  // devem acontecer
  _loadInitiativeList: function(battleId) {
    this._log("Calculando iniciativas...");

    var self = this;
    var battle  = BattleController.find(battleId);
    battle.currentTurn = 0;
    var m = new MersenneTwister();
    var lists = InitiativeController.listsForBattle[battle.id];

    $.each(battle.charactersIds, function(index, id) {
      character = CharacterController.find(id);
      if (character.pv > 0) {
        character.currentSkillIndex = $("#skills_" + character.id).val();
        var val = Math.floor((m.random() * 9) + 1);
        var weaponIniciative = parseInt(character.skills[character.currentSkillIndex].initiative);
        character.initiative = val + character.agi + weaponIniciative;
        self._log("Iniciativa de " + character.name + " = " + val + " + " + character.agi + " (agi)  " + (weaponIniciative < 0 ? "" : "+ ") + weaponIniciative + " (iniciativa da arma) = " + character.initiative);
      } else {
        self._log(character.name + " está morto(a) e não participa das iniciativas");          
      }
    });

    self._log("<hr />");

    lists.all = lists.all.sort(this._compare("initiative"));

    self._log("Iniciativas ordenadas...");
    $.each(lists.all, function(index, character) {
      self._log(character["name"] + ": " + character["initiative"]);
    });

    self._log("<hr />");

    //self.startToChooseTargets(battleId);

    this.list.html(this.loadTableOfDuels(battle));
    this._loadTurn(0);
  },

  startToChooseTargets: function(battleId) {
    var lists = InitiativeController.listsForBattle[battleId];
    var self = this;

    $.each(lists.all, function(index, character) {
      if (character.ally) {
        self._chooseTarget(character, lists.enemies);
      } else {
        self._chooseTarget(character, lists.allies);
      }
    });
  },

  loadTableOfDuels: function(battle) {
    var lists = InitiativeController.listsForBattle[battle.id];
    var table = "<table>";
    $.each(lists.all, function(index, character) {
      table += "<tr " + (index === battle.currentTurn ? "class='current'" : "") + " data-pos='" + index + "'>";
      if (character.adversary) {
        table += "<td id='" + character.id + "' class='" + (character.ally ? "ally" : "enemy") + "-color left-item'>" + character.name + "</td>";
        table += "<td class='vs'>x</td>";
        table += "<td id='" + character.adversary.id + "' class='" + (character.adversary.ally ? "ally" : "enemy") + "-color right-item'>" + character.adversary.name + "</td>";
      }

      table += "</tr>";
    });

    table += "</table>";
    return table;
  },

  // Load the lists of allies and enemies, making each living character choose his or her own opponent.
  loadListsForBattle: function(battle) {
    var self = this;
    var character = null;
    var lists = InitiativeController.listsForBattle[battle.id];

    $.each(battle.charactersIds, function(index, id) {
      character = CharacterController.find(id);
      if (character.pv > 0) {
        if (character.ally) {
          lists.allies.push(character);
        } else {
          lists.enemies.push(character);
        }

        lists.all.push(character);
      }
    });
  },

  // Escolhe o alvo do personagem em um combate. Cada um deve escolher um alvo para atacar,
  // e se defender daqueles que o escolheram.
  _chooseTarget: function(character, characterList) {
    var index = Math.floor(Math.random() * characterList.length);
    character.adversary = characterList[index];
  },

  _log: function(message) {
    $("#panel").append(message + "<br />").scrollTop($("#panel")[0].scrollHeight);
  },

  _clearLog: function() {
    $("#panel").html("");
  },

  // Monta a página para que se possa interagir dentro de um turno
  _loadTurn: function(turn) {
    var self = this;
    var battle = BattleController.find(self.currentBattleId);
    battle.currentTurn = turn;

    $("#action").html("<div id='attacker'></div><div id='defender'></div>");

    var row = $("tr[data-pos='" + turn + "']");
    var columns = $("td", row);
    if (columns.length == 3) {
      var attacker = CharacterController.find($(columns[0]).attr("id"));
      var defender = CharacterController.find($(columns[2]).attr("id"));

      // Carregar primeiro o defensor, para que o atacante tenha o valor da perícia certa
      // na hora de montar o box de dice roller
      self._loadCharacterProfile(defender, "defender", attacker);
      self._loadCharacterProfile(attacker, "attacker", defender);
    }
  },

  // Carrega os dados de um personagem durante um turno.
  _loadCharacterProfile:function(character, div, enemy) {
    var isAttacker = div == "attacker";
    var self = this;
 
    if (character.pv > 0) {
     var m = new MersenneTwister();
      var content = "";
      $("#diceResult").hide();
      $("#damage-options").hide();
      content += "<u>" + character["name"] + "</u>";
      content += "<br /><br />";
      if (isAttacker) {
        content += "Iniciativa atual: " + character["initiative"];
      }

      content += "<br />";

      content += "Ação:";
      content += "<br />";
      var change = "onchange='javascript: CombatZone.changeSkillOnList(this, " + character.id + ");'";
      listOfSkills = "<select id='data_skills_" + character.id + "' " + change + " class='" + div + "'>";

      var skillIndex = character["currentSkillIndex"];    
      if (!isAttacker) {
        skillIndex = self._randomSkill(character.skills, "defense");
      }
      
      $.each(character.skills, function(index, skill) {
        if (isAttacker && skill["attack"] > 0)
         listOfSkills += "<option value='" + index + "' " + (index == skillIndex ? "selected='selected'" : "") + ">" + skill["name"] + "</option>";
        else if (skill["defense"] > 0)
         listOfSkills += "<option value='" + index + "' " + (index == skillIndex ? "selected='selected'" : "") + ">" + skill["name"] + "</option>";
      });
      
      listOfSkills += "</select>";
      
      if (isAttacker) {
        self.currentAttackSkill  = character.skills[skillIndex];
        self.currentAttacker     = character;
        self._log("Atacante (" + character.name + ") -> " + self.currentAttackSkill.name + " (ataque): " + self.currentAttackSkill.attack + " | " + self.currentAttackSkill.name + " (defesa): " + self.currentAttackSkill.defense);
      } else {
        self.currentDefenseSkill = character.skills[skillIndex];
        self.currentDefender     = character;
        self._log("Defensor (" + character.name + ") -> " + self.currentDefenseSkill.name + " (ataque): " + self.currentDefenseSkill.attack + " | " + self.currentDefenseSkill.name + " (defesa): " + self.currentDefenseSkill.defense);
      }

      content += listOfSkills;
      content += "<div class='valueOfSKillDisplay'><div>Valor da perícia</div>";
      if (isAttacker) {
        content += "<span id='valueOfSkill_" + character.id + "'>" + self.currentAttackSkill.attack + "</span>";
      } else {
        content += "<span id='valueOfSkill_" + character.id + "'>" + self.currentDefenseSkill.defense + "</span>";
      }
      content += "</div>";

      content += "<br /><br />";
      content += "<div style='border: 1px dashed #000; float: left; width: 380px; margin-left: 13px'>";
      content += this._printAttribute("Fr",   character.fr, true);
      content += this._printAttribute("Con",  character.con);
      content += this._printAttribute("Dex",  character.dex);
      content += this._printAttribute("Agi",  character.agi, true);
      content += this._printAttribute("Int",  character.intelligence, true);
      content += this._printAttribute("Will", character.will);
      content += this._printAttribute("Per",  character.per);
      content += this._printAttribute("Car",  character.car, true);
      content += "</div>";
      content += "<br /><br />";
      
      content += "<dl style='margin-top: 10px'> \
          <dt>LVL</dt> \
          <dd><input type='text' id='level_" + character.id + "' value='" + character.level + "'/></dd> \
          <dt>PV</dt> \
          <dd><input type='text' id='pv_" + character.id + "' value='" + character.pv + "'/></dd> \
          <dt>PM</dt> \
          <dd><input type='text' id='pm_" + character.id + "' value='" + character.pm + "'/></dd> \
          <dt>IP</dt> \
          <dd><input type='text' id='ip_" + character.id + "' value='" + character.ip + "'/></dd> \
        </dl>";

      if (isAttacker) {
        content += self.buildDiceBox();
        content += "<div id='diceResult'>";
        content += "</div>";
        content += "<div id='damage-options'>";
        content += "</div>";
        content += "<div id='fast-forward-div'><a href='javascript:;'' id='fast-forward'> Avançar até próximo turno de PC</a>| </div>";
        content += "<div id='next-combat-div'><a href='javascript:;'' id='next-combat'> Próximo turno </a></div>";
      }

      $("#" + div).html(content);

      $("#level_" + character.id).unbind().blur(function() {
        self._log("Mudança de nível de " + character.name + ": de " + character.level + " para " + $(this).val());
        character.level = $(this).val();
      });
      $("#pv_" + character.id).unbind().blur(function(e) {
        if (e == undefined)
          self._log("Mudança de PV de " + character.name + ": de " + character.pv + " para " + $(this).val());
        
        character.pv = $(this).val();
      });
      $("#pm_" + character.id).unbind().blur(function() {
        self._log("Mudança de PM de " + character.name + ": de " + character.pm + " para " + $(this).val());
        character.pm = $(this).val();
      });
      $("#ip_" + character.id).unbind().blur(function() {
        self._log("Mudança de IP de " + character.name + ": de " + character.ip + " para " + $(this).val());
        character.ip = $(this).val();
      });

      $("#damage-options").unbind().click(function() {
        var damage = $(this).attr("data-value");
        var pvInput = $("#pv_" + self.currentDefender.id);
        var pv = parseInt(pvInput.val());
        pvInput.val(pv - damage);
        pvInput.trigger("blur");
        $(this).attr("data-value", 0);
        $(this).hide();
        self._log("Remoção de pontos de vida de " + self.currentDefender.name + ": " + pv + " - " + damage + " = " + pvInput.val());
      });
    } else {
      self.deadCharacterManagement(isAttacker, character, div);

      $("#choose-another-opponent").unbind().change(function() {
        var defender = CharacterController.find($(this).val());
        self._loadCharacterProfile(defender, "defender", enemy);
        self.currentDefenseSkill = defender.chooseBestDefensiveSkill();
        self._log("Escolha da melhor defesa: " + self.currentDefenseSkill.name + "(" + self.currentDefenseSkill.defense + ")");
        self.currentDefender = defender;

        $("#data_skills_" + defender.id + " option:contains(" + self.currentDefenseSkill.name + ")").attr('selected', true);
        $("#data_skills_" + defender.id).trigger('change');
        $("#attacker #rollTurnDice").remove();
        $("#attacker #diceResult").before(self.buildDiceBox());        
        
      });
    }

    $("#next-combat").unbind().click(function() {
      var battle = BattleController.find(self.currentBattleId);

      if (battle.currentTurn < battle.charactersIds.length) {
        self._log("Fim do turno");
        self._log("<hr/>");

        battle.currentTurn += 1;
        $("#initiative-list table .current").removeClass("current");
        $("#initiative-list table tr[data-pos=" + battle.currentTurn + "]").addClass("current");
        self._loadTurn(battle.currentTurn);
      } else {
        $("#initiative-list").html("");
        self.initialize(battle.id);
      }
    });

    $("#fast-forward").unbind().click(function() {
      self._log("Iniciando combates automáticos");
      var battle = BattleController.find(self.currentBattleId);

      do {
        var value = parseInt($("#rollTurnDice a").attr("data-value"));
        if (value) {
          javascript:CombatZone.rollDice(value);

          if ($("#damage-options").is(":visible")) {
            $("#damage-options").trigger("click");
          }
        }

        $("#next-combat").trigger("click");
      } while (self.currentAttacker && self.currentDefender && self.currentAttacker.characterType != "PC" && self.currentDefender.characterType != "PC" && battle.currentTurn < battle.charactersIds.length);

      self._log("<hr/>");
    });    
  },

  deadCharacterManagement: function(isAttacker, character, div) {
    var content = "";
    var msg     = "";

    if (isAttacker) {
      content = "<div id='next-combat-div'><a href='javascript:;'' id='next-combat'> Próximo turno </a></div>";
      msg     = "<span class='out-of-combat'>" + character.name + " está fora de combate e não pode atacar </span>";
      this.currentAttackSkill = null;
      this.currentAttacker = null;
    }
    else {
      msg = "<span class='out-of-combat'>" + character.name + " está fora de combate e não pode se defender </span>";
      this.currentDefenseSkill = null;
      this.currentDefender = null;
      content = "Escolha outro adversário: <br/>";
      content += "<select id='choose-another-opponent'>";
      content += "<option value='0'>Escolha um oponente...</option>";

      var charList = character.ally ? InitiativeController.listsForBattle[this.currentBattleId].allies : InitiativeController.listsForBattle[this.currentBattleId].enemies;
      $.each(charList, function(index_opponents, opponent) {
        if (opponent.id != character.id)
        content += "<option value='" + opponent.id + "' " + (opponent.id == character.adversary.id ? "selected='selected'": "") + ">" + opponent.name + "</option>";
      });

      content += "</select>";
    }

    var img = "<img src='images/rip.jpg' style='padding-left: 60px;padding-top: 8px;' />"

    $("#" + div).html(msg + img + content);
  },

  buildDiceBox: function() {
    var content = "<div id='rollTurnDice'>";
    content += this._loadRollTurnDice(this.currentAttackSkill, this.currentDefenseSkill);
    content += "</div>";
    return content;
  },

  changeSkillOnList: function(element, characterId){
    var self = this;
    var character = CharacterController.find(characterId);
    var skill = character.skills[$(element).val()];
    var isAttacker = $(element).attr("class") == "attacker";
    var field = isAttacker ? "attack" : "defense";

    if (isAttacker) {
      this.currentAttackSkill = skill;
      self._log("Atacante (" + character.name + ") -> " + self.currentAttackSkill.name + " (ataque): " + self.currentAttackSkill.attack + " | " + self.currentAttackSkill.name + " (defesa): " + self.currentAttackSkill.defense);
    }
    else {
      this.currentDefenseSkill = skill;
      self._log("Defensor (" + character.name + ") -> " + self.currentDefenseSkill.name + " (ataque): " + self.currentDefenseSkill.attack + " | " + self.currentDefenseSkill.name + " (defesa): " + self.currentDefenseSkill.defense);
    }

    $("#valueOfSkill_" + characterId).text(skill[field]);
    if (this.currentAttackSkill && this.currentDefenseSkill) {
      $("#rollTurnDice").html(this._loadRollTurnDice(this.currentAttackSkill, this.currentDefenseSkill));
    }
  },

  // Exibe um atributo no painel de dados do personagem
  _printAttribute:function(name, value, bg) {
    content = "";
    content += "<dl style='background-color:" + (bg ? "#ccc" : "#EFEEF1") + "''>";
    content += "<dt>" + name + "</dt>";
    content += "<dd>" + value + "</dd>";
    content += "</dl>";
    return content;
  },

  // Monta o dado para que o usuário possa clicar e calcular o valor de acerto ou erro,
  // baseado nos dados dos personagens que estão duelando
  _loadRollTurnDice: function(attackSkill, defenseSkill) {
    if (!attackSkill || !defenseSkill)
      return "";

    var modifierValue = parseInt($("#testModifier").val()) || 0;
    var total = attackSkill["attack"] + this.currentAttacker[attackSkill.base] - defenseSkill["defense"] - this.currentDefender[defenseSkill.base] + modifierValue + 50;
    var modifier = "<input id='testModifier' onblur='javascript:CombatZone.changeModifier();'' data-value='" + total + "' value='" + modifierValue + "'/>";
    var dice = "<a data-value='" + total + "' href='javascript:CombatZone.rollDice(" + total + ")'><img id='roll' src='images/icons/Random.png'></a>";
    var content = "";
    
    content += "<div>";
    content += attackSkill.attack + this.currentAttacker[attackSkill.base];
    content += " - ";
    content += defenseSkill.defense + this.currentDefender[defenseSkill.base];
    content += " + 50 "; 
    content += " + ";
    content += modifier; 
    content += " = <span>"; 
    content += total;
    content += "%</span> ";
    content += dice;
    content += "</div>";
    
    this._logRollData(attackSkill, defenseSkill);
 
    return content;
  },

  changeModifier: function() {
    var attackSkill = this.currentAttackSkill; 
    var defenseSkill = this.currentDefenseSkill; 
    $("#rollTurnDice").html(this._loadRollTurnDice(attackSkill, defenseSkill));
  },

  rollDice: function(value) {
    var result = this.roll(value);
    $("#diceResult").css("color", result.color).css("border", "1px solid " + result.color);
    $("#diceResult").html(result.status + "<br/>" + result.value);
    var damageOptions = $("#damage-options");
    if (result.status == "Acerto" || result.status == "Acerto crítico") {
      var damage = DamageController.parse(this.currentAttackSkill["damage"]);

      if (damage) {
        var modifier = "";
        
        if (damage.modifier > 0)
          modifier = " + " + damage.modifier + " ";
        
        damageOptions.html("Clique para causar " + damage.value + " de dano").show();
        damageOptions.attr("data-value", damage.value);
        this._log("Cálculo do dano: " + damage.diceCount + "d" + damage.diceFaces + modifier + " = " + damage["value"]);

      } else {
        damageOptions.html("Esta perícia não causa danos");
        damageOptions.attr("data-value", 0);
      }
    }
    else {
      damageOptions.html("").hide();
      damageOptions.attr("data-value", 0);
    }
    $("#diceResult").show();
  },

  roll: function(value) {
    var m = new MersenneTwister();
    var result = Math.floor((m.random() * 100) + 1);
    var status = "";
    var color = "";
    if (result <= Math.floor(value / 4)) {
      status = "Acerto crítico";
      color = "#85229E";
    }
    else if (result >= 95) {
      status = "Erro crítico";
      color = "red";
    }
    else if (result > value) {
      status = "Erro";
      color = "#C47777";
    }
    else {
      status = "Acerto";
      color = "green";
    }

    this._log("Resultado dos dados: 1d100 = " + result + ". " + status);

    return {
      "value": result,
      "status": status,
      "color": color
    };
  },

  _logRollData: function(attackSkill, defenseSkill) {
    var modifier = parseInt($("#testModifier").val()) || 0;
    var total = attackSkill["attack"] + this.currentAttacker[attackSkill.base] - defenseSkill["defense"] - this.currentDefender[defenseSkill.base] + 50 + modifier;

    var content = attackSkill.attack;
    content += " + " + this.currentAttacker[attackSkill.base] + "(" + attackSkill.base + ")";
    content += " - ";
    content += defenseSkill.defense;
    content += " - " + this.currentDefender[defenseSkill.base] + "(" + defenseSkill.base + ")";
    content += " + 50 "; 
    content += " + ";
    content += modifier; 
    content += " = "; 
    content += total;
    content += "%";
    this._log("Chance de acerto - " + attackSkill.name + " x " + defenseSkill.name + ": " + content);
  }
}