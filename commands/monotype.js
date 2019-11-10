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
    if (args && args[0]) {
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
module.exports = {
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
		if (!canMakeTour(room, user)) return;
		let type = toId(args[0]);
		let banlist = false;
		if (type === 'bug') {
			banlist = "+Accelgor, +Araquanid, + Araquanid-Totem, +Ariados, +Armaldo, +Beautifly, +Beedrill, +Beedrill-Mega, +Butterfree, +Buzzwole, +Crustle, +Durant, +Dustox, +Escavalier, +Forretress, +Galvantula, +Golisopod, +Heracross, +Heracross-Mega, +Illumise, +Kricketune, +Leavanny, +Ledian, +Masquerain, +Mothim, +Ninjask, +Parasect, +Pinsir, +Pinsir-Mega, +Ribombee, +Ribombee-Totem, +Scizor, +Scizor-Mega, +Scolipede, +Scyther, +Shedinja, +Shuckle, +Silvally-Bug, +Venomoth, +Vespiquen, +Vikavolt, +Vikavolt-Totem, +Vivillon, +Vivillon-Fancy, +Vivillon-Pokeball, +Volbeat, +Volcarona, +Wormadam, +Wormadam-Sandy, +Wormadam-Trash, +Yanmega";
		}
		if (type === "dark") {
			banlist = "+Absol, +Absol-Mega, +Bisharp, +Cacturne, +Crawdaunt, +Drapion, +Greninja, +Guzzlord, +Honchkrow, +Houndoom, +Houndoom-Mega, +Hydreigon, +Incineroar, +Krookodile, +Liepard, +Malamar, +Mandibuzz, +Mightyena, +Muk-Alola, +Murkrow, +Pangoro, +Persian-Alola, +Raticate-Alola, +Raticate-Alola-Totem, +Sableye, +Sableye-Mega, +Scrafty, +Sharpedo, +Sharpedo-Mega, +Shiftry, +Silvally-Dark, +Skuntank, +Sneasel, +Spiritomb, +Tyranitar, +Tyranitar-Mega, +Umbreon, +Weavile, +Zoroark";
		}
		if (type === "dragon") {
			banlist = "";
		}
		if (type === "electric") {
			banlist = "+Ampharos, +Ampharos-Mega, +Dedenne, +Eelektross, +Electivire, +Electrode, +Emolga, +Galvantula, +Golem-Alola, +Heliolisk, +Jolteon, +Lanturn, +Luxray, +Magneton, +Magnezone, +Manectric, +Manectric-Mega, +Minun, +Oricorio-Pom-Pom, +Pachirisu, +Pikachu, +Pikachu-Alola, +Pikachu-Hoenn, +Pikachu-Kalos, +Pikachu-Original, +Pikachu-Sinnoh, +Pikachu-Unova, +Plusle, +Raichu, +Raichu-Alola, +Raikou, +Rotom, +Silvally-Electric, +Stunfisk, +Tapu Koko, +Thundurus, +Togedemaru, +Vikavolt, +Xurkitree, +Zapdos, +Zebstrika, +Zeraora";
		}
		if (type === "fairy") {
			banlist = "";
		}
		if (type === "fighting") {
			banlist = "";
		}
		if (type === "fire") {
			banlist = "+Arcanine, +Blacephalon, +Camerupt, +Chandelure, +Charizard, +Charizard-Mega-X, +Charizard-Mega-Y, +Darmanitan, +Darmanitan-Zen, +Delphox, +Emboar, +Entei, +Flareon, +Heatmor, +Heatran, +Houndoom, +Houndoom-Mega, +Incineroar, +Infernape, +Magcargo, +Magmortar, +Marowak-Alola, +Marowak-Alola-Totem, +Moltres, +Ninetales, +Oricorio, +Pyroar, +Rapidash, +Rotom-Heat, +Salazzle, +Salazzle-Totem, +Silvally-Fire, +Simisear, +Talonflame, +Torkoal, +Turtonator, +Typhlosion, +Victini, +Volcanion, +Volcarona, -Ninetales-Alola";
		}
		if (type === "flying") {
			banlist = "+Aerodactyl, +Aerodactyl-Mega, +Altaria, +Archeops, +Articuno, +Beautifly, +Braviary, +Butterfree, +Celesteela, +Charizard, +Charizard-Mega-Y, +Chatot, +Crobat, +Delibird, +Dodrio, +Dragonite, +Drifblim, +Emolga, +Farfetch'd, +Fearow, +Gligar, +Gliscor, +Golbat, +Gyarados, +Hawlucha, +Honchkrow, +Jumpluff, +Landorus, +Landorus-Therian, +Ledian, +Mandibuzz, +Mantine, +Masquerain, +Minior, +Moltres, +Mothim, +Murkrow, +Ninjask, +Noctowl, +Noivern, +Oricorio, +Oricorio-Pau, +Oricorio-Pom-Pom, +Oricorio-Sensu, +Pelipper, +Pidgeot, +Pidgeot-Mega, +Rayquaza-Mega, +Rotom-Fan, +Salamence, +Scyther, +Sigilyph, +Silvally-Flying, +Skarmory, +Staraptor, +Swanna, +Swellow, +Swoobat, +Talonflame, +Thundurus, +Thundurus-Therian, +Togekiss, +Tornadus, +Tornadus-Therian, +Toucannon, +Tropius, +Unfezant, +Vespiquen, +Vivillon, +Vivillon-Fancy, +Vivillon-Pokeball, +Xatu, +Yanmega, +Zapdos";
		}
		if (type === "ghost") {
			banlist = "+Banette, +Banette-Mega, +Blacephalon, +Chandelure, +Cofagrigus, +Decidueye, +Dhelmise, +Doublade, +Drifblim, +Dusclops, +Dusknoir, +Froslass, +Gengar, +Golurk, +Gourgeist, +Gourgeist-Small, +Gourgeist-Large, +Gourgeist-Super, +Haunter, +Hoopa, +Jellicent, +Marowak-Alola, +Marowak-Alola-Totem, +Mimikyu, +Mimikyu-Totem, +Mismagius, +Oricorio-Sensu, +Palossand, +Rotom, +Sableye, +Sableye-Mega, +Shedinja, +Silvally-Ghost, +Spiritomb, +Trevenant";
		}
		if (type === "grass") {
			banlist = "+Abomasnow, +Abomasnow-Mega, +Amoonguss, +Bellossom, +Breloom, +Cacturne, +Carnivine, +Celebi, +Cherrim, +Chesnaught, +Cradily, +Decidueye, +Dhelmise, +Exeggutor, +Exeggutor-Alola, +Ferroseed, +Ferrothorn, +Gogoat, +Gourgeist, +Jumpluff, +Kartana, +Leafeon, +Leavanny, +Lilligant, +Ludicolo, +Lurantis, +Maractus, +Meganium, +Parasect, +Roselia, +Roserade, +Rotom-Mow, +Sawsbuck, +Sceptile, +Serperior, +Shaymin, +Shiftry, +Shiinotic, +Silvally-Grass, +Simisage, +Sunflora, +Tangela, +Tangrowth, +Tapu Bulu, +Torterra, +Trevenant, +Tropius, +Tsareena, +Venusaur, +Venusaur-Mega, +Victreebel, +Vileplume, +Virizion, +Whimsicott, +Wormadam";
		}
		if (type === "ground") {
			banlist = "";
		}
		if (type === "ice") {
			banlist = "";
		}
		if (type === "normal") {
			banlist = "";
		}
		if (type === "poison") {
			banlist = "";
		}
		if (type === "psychic") {
			banlist = "+Alakazam, +Alakazam-Mega, +Azelf, +Beheeyem, +Bronzong, +Bruxish, +Celebi, +Chimecho, +Claydol, +Cresselia, +Delphox, +Espeon, +Exeggutor, +Gallade, +Gallade-Mega, +Gardevoir, +Gardevoir-Mega, +Girafarig, +Gothitelle, +Grumpig, +Hoopa, +Hypno, +Jirachi, +Jynx, +Latias, +Latias-Mega, +Latios, +Latios-Mega, +Lunatone, +Malamar, +Medicham, +Meloetta, +Meowstic, +Mesprit, +Metagross, +Mew, +Mr. Mime, +Musharna, +Necrozma, +Oranguru, +Oricorio-Pa'u, +Raichu-Alola, +Reuniclus, +Sigilyph, +Silvally-Psychic, +Slowbro, +Slowbro-Mega, +Slowking, +Solrock, +Starmie, +Swoobat, +Unown, +Uxie, +Victini, +Wobbuffet, +Xatu";
		}
		if (type === "rock") {
			banlist = "";
		}
		if (type === "steel") {
			banlist = "";
		}
		if (type === "water") {
			banlist = "";
		}

		if (banlist === false) return room.send("Invalid type.");
		if (!banlist) return room.send("Sorry, that type hasn't been coded yet.");

		checkGenerator(room, 'gen7monotype', args);
		type = type[0].toUpperCase() + type.substring(1);
		room.send(`/tour name [Gen 7] Monothreat ${type}`);
		room.send(`/tour rules ${banlist}, -Uber, -OU, -UU, -RU, -NU, -PU, -ZU, -NFE, -LC Uber, -LC, -UUBL, -RUBL, -NUBL, -PUBL`);
		room.send(`!rfaq monothreat`);
	},
	cc1v1: function(room, user, args) {
		if (!canMakeTour(room, user)) return;
		checkGenerator(room, 'challengecup1v1', args);
	}
}