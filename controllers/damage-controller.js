var DamageController = {
	parse: function(attributes) {
    if (attributes == "0")
      return null;
    
		var diceCount = attributes[0];
    var diceType = 6;
    if (attributes.length == 3) {
      diceType = parseInt(attributes[2]);
    } else {
      if (attributes[3] == '+')
        diceType = parseInt(attributes[2]);
      else
        diceType = parseInt(attributes[2] + attributes[3]);
    }

    var modifier = 0;   
    var parts = attributes.split('+');

    if (parts.length > 1) {
      modifier = parseInt(parts[1]);
    }

    var m = new MersenneTwister();
    var result = 0;
    for (var i = 0; i < diceCount; i++) {
      result += Math.floor((m.random() * diceType) + 1);
    }
    result += modifier;

    return {
      "diceCount": diceCount,
      "diceFaces": diceType,
      "modifier": modifier,
      "value": result
    };
	}
}