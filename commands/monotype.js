'use strict'

let canMakeTour = function(room, user) {
    // I'm gonna use this a lot so why not make a function for it
    if (room != 'monotype') return false;
    if (!user.can(room, "%")) return false;
    if (room.tournament) {
        room.send("A tournament is already going on.");
        return false;
    }
    return true;
}

let checkGenerator = function(room, meta, args) {
    if (args) {
        if (args[0].startsWith("rr")) {
            let count = parseInt(args[0].substring(2));
            if (count) room.send(`/tour create ${meta}, rr,, ${count}`);
            else room.send(`/tour create ${meta}, rr`);
        }
        else if (args[0].startsWith("e")){
            let count = parseInt(args[0].substring(1));
            if (count) room.send(`/tour create ${meta}, elim,, ${count}`);
            else room.send(`/tour create ${meta}, elim`);
        }
        else {
            room.send(`/tour create ${meta}, elim`)
        }
    }
    else room.send(`/tour create ${meta}, elim`);
}
exports.commands = {
	mono: {
		// Old (and current) generations
		'': 'gen7',
		gen7: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7monotype', args);
			room.send('/tour scouting off');
		},
		gen6: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen6monotype', args);
			room.send('/tour scouting off');
		},
		gen5: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen5monotype', args);
			room.send('/tour scouting off');
		},
		gen4: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen4ou', args);
			room.send('/tour name [Gen 4] Monotype');
			room.send('/tour rules Same Type Clause');
			room.send('/tour scouting off');
		},
		gen3: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen3ou', args);
			room.send('/tour name [Gen 3] Monotype');
			room.send('/tour rules Same Type Clause');
			room.send('/tour scouting off');
		},
		// Mixups with other smogon metagames
		'1v1': function(room, user, args) {
	        if (!canMakeTour(room, user)) return;
	        checkGenerator(room, 'gen71v1', args);
			room.send("/tour name [Gen 7] Monotype 1v1");

	        // Build ruleset
	        let ruleset = "/tour rules Same Type Clause, "
	        if (Banlist.monotype.bans.length) ruleset += "-" + Banlist.monotype.bans.join(", -") + ", ";
	        if (Banlist.monotype.unbans.length) ruleset += "+" + Banlist.monotype.unbans.join(", +") + ", ";
	        ruleset = ruleset.substring(0, ruleset.length - 2);
	        room.send(ruleset);
	        room.send('/tour scouting off');
		},
		lc: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7lc', args);
			room.send('/tour name [Gen 7] Monotype LC');
			room.send('/tour rules Same Type Clause, +Vulpix-Base, +Gothita, +Misdreavus, +Wingull, +Trapinch');
			room.send('/tour scouting off');
		},
		uber: 'ubers',
		ubers: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7ubers', args);
			room.send('/tour name [Gen 7] Monotype Ubers');
			room.send('/tour rules Same Type Clause, -Marshadow');
			room.send('/tour scouting off');
		},
		// Mixups with OMs
		almostanyability: 'aaa',
		aaa: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7almostanyability', args);
			room.send('/tour name [Gen 7] Monotype Almost Any Ability');
			room.send('/tour rules Same Type Clause, -Aegislash, -Genesect, -Magearna, -Minior, -Naganadel, -Noivern, -Zygarde, -Zygarde-10%, -Damp Rock, -Smooth Rock, -Terrain Extender, -Mawilite, -Medichamite, -Metagrossite, -Psychic Surge, +Victini, +Weavile');
			room.send('/tour scouting off');
		},
		stab: 'stabmons',
		stabmons: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7stabmons', args);
			room.send('/tour name [Gen 7] Monotype STABmons');
			room.send('/tour rules Same Type Clause, -boomburst, -zygarde, -zygarde-10%, -battle bond, -smooth rock, -damp rock, -hoopa-unbound, -celebrate, -conversion, -trick-or-treat, -forest’s curse, -happy hour, -hold hands, -purify, +deoxys-speed, +deoxys-defense, -sketch, +blacephalon, +porygonz, +thundurus-base ,+aerodactyl, +araquanid')
			room.send('/tour scouting off');
		},
		mixandmega: 'mnm',
		mnm: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7mixandmega', args);
			room.send('/tour name [Gen 7] Monotype Mix and Mega');
			room.send('/tour rules Same Type Clause, -Aggronite, -Altarianite, -Ampharosite, -Audinite, -Charizardite X, -Gyaradosite, -Lopunnite, -Mewtwonite X, -Pinsirite, -Sceptilite, -Red Orb')
			room.send('/tour scouting off');
		},
		// Other monotype
		mrb: 'monotyperandombattle',
		random: 'monotyperandombattle',
		monotyperandombattle: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7monotyperandombattle', args);
		},
		blitz: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7monotype', args);
			room.send('/tour name [Gen 7] Blitz Monotype');
			room.send('/tour rules Blitz');
			room.send('/tour forcetimer on');
			room.send('/tour scouting off');
		},
		doubles: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7doublesou', args);
			room.send('/tour name [Gen 7] Doubles Monotype');
			room.send('/tour rules Same Type Clause, -Terrain Extender, -Smooth Rock, -Damp Rock');
			room.send('/tour scouting off');
		},
		chill: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7monotype', args);
			room.startTour('chill');
		}
	},
	monothreat: function (room, user, args) {
		// nothing yet
	},
	cc1v1: function(room, user, args) {
		if (!canMakeTour(room, user)) return;
		checkGenerator(room, 'challengecup1v1', args);
	}
}