'use strict'

global.BLT = {
	next: false,
	last: false,
	tours: [
		'gen8',
		'gen8',
		'gen8',
		'gen7',
		'gen6',
		'gen5'
	],
	getNext: function() {
		if (BLT.next) return BLT.next;
		let x = Object.assign([], BLT.tours);
		if (BLT.last) x.splice(x.indexOf(BLT.last), 1);
		BLT.next = x[Math.floor(Math.random() * x.length)];
		return BLT.next;
	},
	times: [
		1,
		7,
		13,
		19
	],
	points: {},
	leaderboard: function() {
		let board = [];
		for (let i in this.points) {
			board.push([this.points[i].name, this.points[i].points]);
		}
		board = board.sort((a, b) => {return b[1] - a[1]});
		let html = "<center><div style='overflow-x:auto;max-height:327px'><details OPEN><summary>BLT Leaderboard top 12</summary>";
		html += `<table style='border-spacing:0px;text-align:center'><tr><th style="padding:5px;border:1px solid black;border-radius:5px 0px 0px 0px">#</th><th style="border:1px solid black">Name</th><th style="padding:3px;border:1px solid black;border-radius:0px 5px 0px 0px">Score</th></tr>`;
		for (let i = 0; i < board.length; i++) {
			if (i === 12) {
				html += '</table><details><summary>lower ranks</summary>';
				html += `<table style='border-spacing:0px;text-align:center'><tr><th style="padding:5px;border:1px solid black;border-radius:5px 0px 0px 0px">#</th><th style="border:1px solid black">Name</th><th style="padding:3px;border:1px solid black;border-radius:0px 5px 0px 0px">Score</th></tr>`;
			}
			if (i === 9 || i === board.length - 1) html += `<tr><td style="padding:5px;border:1px solid black;border-radius:0px 0px 0px 5px">${i+1}</td><td style="padding:5px;border:1px solid black">${board[i][0]}</td><td style="padding:5px;border:1px solid black;border-radius:0px 0px 5px 0px">${board[i][1]}</td></tr>`;
			else html += `<tr><td style="padding:5px;border:1px solid black">${i+1}</td><td style="padding:5px;border:1px solid black">${board[i][0]}</td><td style="padding:5px;border:1px solid black">${board[i][1]}</td></tr>`;
		}
		html += "</table>"
		if (board.length > 12) html += "</details>";
		html += "</details></div></center>";
		return html;
	},
	loadpoints: function() {
		if (!FS.existsSync('./data/BLT.json')) FS.writeFileSync('./data/BLT.json', '{}');
		this.points = JSON.parse(FS.readFileSync('./data/BLT.json'));
	},
	savepoints: function() {
		FS.writeFileSync('./data/BLT.json', JSON.stringify(this.points, null, 4));
	},
	addpoints: function(first, second, thirds = []) {
		let fobj = this.points[toId(first)];
		if (!fobj) fobj = {};
		fobj.name = first;
		fobj.points = fobj.points ? fobj.points + 3 : 3;
		this.points[toId(fobj.name)] = fobj;

		let sobj = this.points[toId(second)];
		if (!sobj) sobj = {};
		sobj.name = second;
		sobj.points = sobj.points ? sobj.points + 2 : 2;
		this.points[toId(sobj.name)] = sobj;

		if (thirds[0]) {
			let tobj = this.points[toId(thirds[0])];
			if (!tobj) tobj = {};
			tobj.name = thirds[0];
			tobj.points = tobj.points ? tobj.points + 1 : 1;
			this.points[toId(tobj.name)] = tobj;
		}
		if (thirds[1]) {
			let tobj = this.points[toId(thirds[1])];
			if (!tobj) tobj = {};
			tobj.name = thirds[1];
			tobj.points = tobj.points ? tobj.points + 1 : 1;
			this.points[toId(tobj.name)] = tobj;
		}
		this.savepoints();
	}
}

BLT.loadpoints();

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

let checkGenerator = function(room, meta, args, tourname = '') {
    if (args && args[0]) {
        if (args[0].startsWith("rr")) {
            let count = parseInt(args[0].substring(2));
            if (count) room.send(`/tour create ${meta}, rr,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, rr,,, ${tourname}`);
        }
        else if (args[0].startsWith("e")){
            let count = parseInt(args[0].substring(1));
            if (count) room.send(`/tour create ${meta}, elim,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
        }
        else {
            room.send(`/tour create ${meta}, elim,,, ${tourname}`)
        }
        if (toId(args[0]) === 'o') room.startTour('o');
    }
    else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
    if (toId(args[1]) === 'o') room.startTour('o');
}

module.exports = {
	// BLT stuff
	addbltpoints: function(room, user, args) {
		if (!user.can(Rooms['monotype'], '@')) return;
		if (args.length !== 2) return room.send('Usage: ``addbltpoints [user], [points]`` (you can use negative values)');
		if (isNaN(parseInt(args[1]))) return room.send('Usage: ``addbltpoints [user], [points]`` (you can use negative values)');
		let tobj = BLT.points[toId(args[0])];
		if (!tobj) tobj = {};
		tobj.name = args[0];
		tobj.points = tobj.points ? tobj.points + parseInt(args[1]) : parseInt(args[1]);
		BLT.points[toId(tobj.name)] = tobj;
		if (tobj.points <= 0) delete BLT.points[toId(tobj.name)];
		Rooms['monotype'].send(`/modnote ${parseInt(args[1])} BLT points given to ${args[0].trim()} by ${user.name}`);
		return user.send('Done.');
	},
	startblt: function(room, user, args) {
		if (!user.can(room, '%')) return;
		if (room.id !== "monotype" && !room.id.includes('test')) return;
		let format = BLT.getNext();
		BLT.last = format;
		BLT.next = false;
		room.send(`/tour create ${format}monotype, elim,,, Official ${Tournament.formats[format + 'monotype']}`);
		room.send('/tour scouting disallow');
		room.startTour('blt');
	},
	nextblt: function(room, user, args) {
		let target = user.can(room, '+') ? room : user;
		if (room.id !== "monotype" && !room.id.includes('test')) target = user;
		let now = new Date(Date.now() - 20*60*1000);
		let nhours = now.getHours();
		let next = BLT.times[0];
		for (let i in BLT.times) {
			if (nhours >= BLT.times[i]) next = BLT.times[(parseInt(i)+1)%BLT.times.length];
		}
		now = new Date(Date.now());
        let hours = next - now.getHours();
        if (next === BLT.times[0]) hours += 24;
        let minutes = 60 - now.getMinutes();
        if (minutes < 60) hours -= 1;
        else minutes = 0;
        if (hours >= 24) hours -= 24;
        let timestr = "in " + (hours !== 0 ? hours + " hour" + (hours === 1 ? '' : 's') : '') + (hours !== 0 && minutes !== 0 ? ' and ' : '') + (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? '' : 's') : '');
        if (hours < 0) return target.send(`The ${Tournament.formats[BLT.getNext() + "monotype"]} BLT qualifier should have started ${60 - Math.abs(minutes)} ago`);
        let ret = `The next official Monotype BLT qualifier tournament will be ${Tournament.formats[BLT.getNext() + "monotype"]} ${timestr}.`;
		target.send(ret);
	},
	bltrank: function(room, user, args) {
		if (toId(args[0]) === "reset") {
			if (!user.can(Rooms['monotype'], '#')) return;
			BLT.points = {};
			BLT.savepoints();
			return room.send('Leaderboard reset.');
		}
		let target = user.can(room, '+') ? room : user;
		if (room.id !== "monotype" && !room.id.includes('test')) target = user;
		if (target === user) {
			let target = BLT.points[user.id];
			if (!target) user.send("You don't have any points.");
			else {
				let board = [];
				for (let i in BLT.points) {
					if (BLT.points[i].points <= 0) continue;
					board.push([i, BLT.points[i].points]);
				}
				board = board.sort((a, b) => {return b[1] - a[1]});
				for (let i in board) {
					board[i] = board[i][0];
				}
				user.send(`You are ranked **${board.indexOf(user.id) + 1}** with ${target.points} points.`);
			}
		}
		else {
			room.send(`/adduhtml bltboard, ${BLT.leaderboard()}`);
		}
	},
	mono: {
		// Old (and current) generations
		'': 'gen8',
		gen8: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen8monotype', args);
			room.send('/tour scouting off');
		},
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
			checkGenerator(room, 'gen4ou', args, '[Gen 4] Monotype');
			room.send('/tour rules Same Type Clause');
			room.send('/tour scouting off');
		},
		gen3: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen3ou', args, '[Gen 3] Monotype');
			room.send('/tour rules Same Type Clause');
			room.send('/tour scouting off');
		},
		// Mixups with other smogon metagames
		'1v1': function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen71v1', args, '[Gen 7] Monotype 1v1');

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
			checkGenerator(room, 'gen8lc', args, '[Gen 8] Monotype LC');
			room.send('/tour rules Same Type Clause, +Cutiefly, +Vulpix-Alola, +Chlorophyll');
			room.send('/tour scouting off');
		},
		uber: 'ubers',
		ubers: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7ubers', args, '[Gen 7] Monotype Ubers');
			room.send('/tour rules Same Type Clause, -Marshadow');
			room.send('/tour scouting off');
		},
		// Mixups with OMs
		almostanyability: 'aaa',
		aaa: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen8almostanyability', args, '[Gen 8] Monotype Almost Any Ability');
			room.send('/tour rules Same Type Clause, +Buzzwole, +Zeraora, -Dragapult, -Dracovish, -Dragonite, -Keldeo, -Urshifu, -Urshifu-Rapid-Strike, -Melmetal, -Psychic Surge, -Triage, -Damp Rock, -Terrain Extender');
			room.send('/tour scouting off');
		},
		stab: 'stabmons',
		stabmons: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen8stabmons', args, '[Gen 8] Monotype STABmons');
			room.send('/tour rules Same Type Clause, -Blaziken, -Dracovish, -Dragapult, -Landorus-Incarnate, -Magearna, -Terrain Extender, -Damp Rock, +Darmanitan-Galar, +Porygon Z, +Thundurus, +Arena Trap')
			room.send('/tour scouting off');
		},
		mixandmega: 'mnm',
		mnm: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7mixandmega', args, '[Gen 7] Monotype Mix and Mega');
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
			checkGenerator(room, 'gen7monotype', args, '[Gen 7] Blitz Monotype');
			room.send('/tour rules Blitz');
			room.send('/tour forcetimer on');
			room.send('/tour scouting off');
		},
		doubles: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7doublesou', args, '[Gen 7] Doubles Monotype');
			room.send('/tour rules Same Type Clause, -Terrain Extender, -Smooth Rock, -Damp Rock');
			room.send('/tour scouting off');
		},
		chill: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7monotype', args);
			room.startTour('chill');
		},
		
		// Old gen mashups
		gen7lc: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7lc', args, '[Gen 7] Monotype LC');
			room.send('/tour rules Same Type Clause, +Vulpix-Base, +Gothita, +Misdreavus, +Wingull, +Trapinch');
			room.send('/tour scouting off');
		},
		gen7almostanyability: 'gen7aaa',
		gen7aaa: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7almostanyability', args, '[Gen 7] Monotype Almost Any Ability');
			room.send('/tour rules Same Type Clause, -Aegislash, -Genesect, -Magearna, -Minior, -Naganadel, -Noivern, -Zygarde, -Zygarde-10%, -Damp Rock, -Smooth Rock, -Terrain Extender, -Mawilite, -Medichamite, -Metagrossite, -Psychic Surge, +Victini, +Weavile');
			room.send('/tour scouting off');
		},
		gen7stab: 'gen7stabmons',
		gen7stabmons: function(room, user, args) {
			if (!canMakeTour(room, user)) return;
			checkGenerator(room, 'gen7stabmons', args, '[Gen 7] Monotype STABmons');
			room.send('/tour rules Same Type Clause, -boomburst, -zygarde, -zygarde-10%, -battle bond, -smooth rock, -damp rock, -hoopa-unbound, -celebrate, -conversion, -trick-or-treat, -forest’s curse, -happy hour, -hold hands, -purify, +deoxys-speed, +deoxys-defense, -sketch, +blacephalon, +porygonz, +thundurus-base ,+aerodactyl, +araquanid')
			room.send('/tour scouting off');
		},
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
			banlist = "+Altaria, +Ampharos-Mega, +Axew, +Bagon, +Charizard-Mega-X, +Deino, +Dragalge, +Dragonair, +Dragonite, +Drampa, +Dratini, +Druddigon, +Exeggutor-Alola, +Flygon, +Fraxure, +Gabite, +Garchomp, +Gible, +Goodra, +Goomy, +Guzzlord, +Hakamo-o, +Haxorus, +Hydreigon, +Jangmo-o, +Kingdra, +Kommo-o, +Kyurem, +Latias, +Latios, +Noibat, +Noivern, +Rayquaza-Mega, +Salamence, +Sceptile-Mega, +Shelgon, +Silvally-Dragon, +Sliggoo, +Turtonator, +Tyrantrum, +Tyrunt, +Vibrava, +Zweilous, +Zygarde-10%, +Altaria-Mega, +Garchomp-Mega, +Latias-Mega, +Latios-Mega";
		}
		if (type === "electric") {
			banlist = "+Ampharos, +Ampharos-Mega, +Dedenne, +Eelektross, +Electivire, +Electrode, +Emolga, +Galvantula, +Golem-Alola, +Heliolisk, +Jolteon, +Lanturn, +Luxray, +Magneton, +Magnezone, +Manectric, +Manectric-Mega, +Minun, +Oricorio-Pom-Pom, +Pachirisu, +Pikachu, +Pikachu-Alola, +Pikachu-Hoenn, +Pikachu-Kalos, +Pikachu-Original, +Pikachu-Sinnoh, +Pikachu-Unova, +Plusle, +Raichu, +Raichu-Alola, +Raikou, +Rotom, +Silvally-Electric, +Stunfisk, +Tapu Koko, +Thundurus, +Togedemaru, +Vikavolt, +Xurkitree, +Zapdos, +Zebstrika, +Zeraora";
		}
		if (type === "fairy") {
			banlist = "+Altaria-Mega, +Aromatisse, +Audino-Mega, +Azumarill, +Azurill, +Carbink, +Clefable, +Clefairy, +Cleffa, +Comfey, +Cottonee, +Cutiefly, +Dedenne, +Diancie, +Flabébé, +Floette, +Florges, +Gardevoir, +Granbull, +Igglybuff, +Jigglypuff, +Kirlia, +Klefki, +Marill, +Mawile, +Mime Jr., +Mimikyu, +Morelull, +Mr. Mime, +Ninetales-Alola, +Primarina, +Ralts, +Ribombee, +Shiinotic, +Silvally-Fairy, +Slurpuff, +Snubbull, +Spritzee, +Swirlix, +Sylveon, +Tapu Bulu, +Tapu Fini, +Tapu Koko, +Togekiss, +Togepi, +Togetic, +Whimsicott, +Wigglytuff, -Mawile-Mega, +Audino-Mega, +Diancie-Mega, +Gardevoir-Mega";
		}
		if (type === "fighting") {
			banlist = "+Bewear, +Breloom, +Buzzwole, +Chesnaught, +Cobalion, +Combusken, +Conkeldurr, +Crabominable, +Crabrawler, +Croagunk, +Emboar, +Gallade, +Gurdurr, +Hakamo-o, +Hariyama, +Hawlucha, +Heracross, +Hitmonchan, +Hitmonlee, +Hitmontop, +Infernape, +Keldeo, +Kommo-o, +Lucario, +Machamp, +Machoke, +Machop, +Makuhita, +Mankey, +Medicham, +Meditite, +Mienfoo, +Mienshao, +Monferno, +Pancham, +Pangoro, +Passimian, +Pignite, +Poliwrath, +Primeape, +Riolu, +Sawk, +Scrafty, +Scraggy, +Silvally-Fighting, +Stufful, +Terrakion, +Throh, +Timburr, +Toxicroak, +Tyrogue, +Virizion, -Medicham-Mega, +Gallade-Mega, +Heracross-Mega";
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
			banlist = "+Baltoy, +Barboach, +Camerupt, +Claydol, +Cubone, +Diggersby, +Diglett, +Diglett-Alola, +Donphan, +Drilbur, +Dugtrio, +Dugtrio-Alola, +Excadrill, +Flygon, +Gabite, +Garchomp, +Gastrodon, +Geodude, +Gible, +Gligar, +Gliscor, +Golem, +Golett, +Golurk, +Graveler, +Hippopotas, +Hippowdon, +Krokorok, +Krookodile, +Landorus-Therian, +Landorus, +Larvitar, +Mamoswine, +Marowak, +Marshtomp, +Mudbray, +Mudsdale, +Nidoking, +Nidoqueen, +Nincada, +Numel, +Onix, +Palossand, +Palpitoad, +Phanpy, +Piloswine, +Pupitar, +Quagsire, +Rhydon, +Rhyhorn, +Rhyperior, +Sandile, +Sandshrew, +Sandslash, +Sandygast, +Seismitoad, +Silvally-Ground, +Steelix, +Stunfisk, +Swampert, +Swinub, +Torterra, +Trapinch, +Vibrava, +Whiscash, +Wooper, +Wormadam-Sandy, +Zygarde-10%, +Camerupt-Mega, +Garchomp-Mega, +Steelix-Mega, +Swampert-Mega";
		}
		if (type === "ice") {
			banlist = "+Abomasnow, +Amaura, +Articuno, +Aurorus, +Avalugg, +Beartic, +Bergmite, +Castform-Snowy, +Cloyster, +Crabominable, +Cryogonal, +Cubchoo, +Delibird, +Dewgong, +Froslass, +Glaceon, +Glalie, +Jynx, +Kyurem, +Lapras, +Mamoswine, +Ninetales-Alola, +Piloswine, +Regice, +Rotom-Frost, +Sandshrew-Alola, +Sandslash-Alola, +Sealeo, +Silvally-Ice, +Smoochum, +Sneasel, +Snorunt, +Snover, +Spheal, +Swinub, +Vanillish, +Vanillite, +Vanilluxe, +Vulpix-Alola, +Walrein, +Weavile, +Abomasnow-Mega, +Glalie-Mega";
		}
		if (type === "normal") {
			banlist = "+Aipom, +Ambipom, +Audino, +Azurill, +Bewear, +Bibarel, +Bidoof, +Blissey, +Bouffalant, +Braviary, +Buneary, +Bunnelby, +Castform, +Chansey, +Chatot, +Cinccino, +Deerling, +Delcatty, +Diggersby, +Ditto, +Dodrio, +Doduo, +Drampa, +Dunsparce, +Eevee, +Exploud, +Farfetch'd, +Fearow, +Fletchling, +Furfrou, +Furret, +Girafarig, +Glameow, +Gumshoos, +Happiny, +Heliolisk, +Helioptile, +Herdier, +Hoothoot, +Igglybuff, +Jigglypuff, +Kangaskhan, +Kecleon, +Komala, +Lickilicky, +Lickitung, +Lillipup, +Linoone, +Litleo, +Lopunny, +Loudred, +Meloetta, +Meowth, +Miltank, +Minccino, +Munchlax, +Noctowl, +Oranguru, +Patrat, +Persian, +Pidgeot, +Pidgeotto, +Pidgey, +Pidove, +Pikipek, +Porygon, +Porygon-Z, +Porygon2, +Purugly, +Pyroar, +Raticate, +Raticate-Alola, +Rattata, +Rattata-Alola, +Regigigas, +Rufflet, +Sawsbuck, +Sentret, +Silvally, +Skitty, +Slaking, +Slakoth, +Smeargle, +Snorlax, +Spearow, +Spinda, +Stantler, +Staraptor, +Staravia, +Starly, +Stoutland, +Stufful, +Swablu, +Swellow, +Taillow, +Tauros, +Teddiursa, +Toucannon, +Tranquill, +Trumbeak, +Type: Null, +Unfezant, +Ursaring, +Vigoroth, +Watchog, +Whismur, +Wigglytuff, +Yungoos, +Zangoose, +Zigzagoon, +Audino-Mega, +Lopunny-Mega, +Pidgeot-Mega";
		}
		if (type === "poison") {
			banlist = "+Amoonguss, +Arbok, +Ariados, +Beedrill, +Bellsprout, +Budew, +Bulbasaur, +Croagunk, +Crobat, +Dragalge, +Drapion, +Dustox, +Ekans, +Foongus, +Garbodor, +Gastly, +Gengar, +Gloom, +Golbat, +Grimer, +Grimer-Alola, +Gulpin, +Haunter, +Ivysaur, +Kakuna, +Koffing, +Mareanie, +Muk, +Muk-Alola, +Nidoking, +Nidoqueen, +Nidoran-F, +Nidoran-M, +Nidorina, +Nidorino, +Nihilego, +Oddish, +Poipole, +Qwilfish, +Roselia, +Roserade, +Salandit, +Salazzle, +Scolipede, +Seviper, +Silvally-Poison, +Skorupi, +Skrelp, +Skuntank, +Spinarak, +Stunky, +Swalot, +Tentacool, +Tentacruel, +Toxapex, +Toxicroak, +Trubbish, +Venipede, +Venomoth, +Venonat, +Venusaur, +Victreebel, +Vileplume, +Weedle, +Weepinbell, +Weezing, +Whirlipede, +Zubat, +Beedrill-Mega, +Venusaur-Mega";
		}
		if (type === "psychic") {
			banlist = "+Alakazam, +Alakazam-Mega, +Azelf, +Beheeyem, +Bronzong, +Bruxish, +Celebi, +Chimecho, +Claydol, +Cresselia, +Delphox, +Espeon, +Exeggutor, +Gallade, +Gallade-Mega, +Gardevoir, +Gardevoir-Mega, +Girafarig, +Gothitelle, +Grumpig, +Hoopa, +Hypno, +Jirachi, +Jynx, +Latias, +Latias-Mega, +Latios, +Latios-Mega, +Lunatone, +Malamar, +Medicham, +Meloetta, +Meowstic, +Mesprit, +Metagross, +Mew, +Mr. Mime, +Musharna, +Necrozma, +Oranguru, +Oricorio-Pa'u, +Raichu-Alola, +Reuniclus, +Sigilyph, +Silvally-Psychic, +Slowbro, +Slowbro-Mega, +Slowking, +Solrock, +Starmie, +Swoobat, +Unown, +Uxie, +Victini, +Wobbuffet, +Xatu";
		}
		if (type === "rock") {
			banlist = "+Aerodactyl, +Aggron, +Amaura, +Anorith, +Archen, +Archeops, +Armaldo, +Aron, +Aurorus, +Barbaracle, +Bastiodon, +Binacle, +Boldore, +Bonsly, +Carbink, +Carracosta, +Corsola, +Cradily, +Cranidos, +Crustle, +Diancie, +Dwebble, +Geodude, +Geodude-Alola, +Gigalith, +Golem, +Golem-Alola, +Graveler, +Graveler-Alola, +Kabuto, +Kabutops, +Lairon, +Larvitar, +Lileep, +Lunatone, +Lycanroc, +Magcargo, +Minior, +Nihilego, +Nosepass, +Omanyte, +Omastar, +Onix, +Probopass, +Pupitar, +Rampardos, +Regirock, +Relicanth, +Rhydon, +Rhyhorn, +Rhyperior, +Rockruff, +Roggenrola, +Shieldon, +Shuckle, +Silvally-Rock, +Solrock, +Stakataka, +Sudowoodo, +Terrakion, +Tirtouga, +Tyranitar, +Tyrantrum, +Tyrunt, +Aerodactyl-Mega, +Diancie-Mega, +Tyranitar-Mega";
		}
		if (type === "steel") {
			banlist = "+Aggron, +Aron, +Bastiodon, +Beldum, +Bisharp, +Bronzong, +Bronzor, +Celesteela, +Cobalion, +Diglett-Alola, +Doublade, +Dugtrio-Alola, +Durant, +Empoleon, +Escavalier, +Excadrill, +Ferroseed, +Ferrothorn, +Forretress, +Heatran, +Honedge, +Jirachi, +Kartana, +Klang, +Klefki, +Klink, +Klinklang, +Lairon, +Lucario, +Magearna, +Magnemite, +Magneton, +Magnezone, +Mawile, +Metagross, +Metang, +Pawniard, +Probopass, +Registeel, +Sandshrew-Alola, +Sandslash-Alola, +Scizor, +Shieldon, +Silvally-Steel, +Skarmory, +Stakataka, +Steelix, +Togedemaru, +Wormadam-Trash, +Aggron-Mega, -Mawile-Mega, +Scizor-Mega, +Steelix-Mega";
		}
		if (type === "water") {
			banlist = "+Alomomola, +Araquanid, +Azumarill, +Barbaracle, +Barboach, +Basculin, +Bibarel, +Binacle, +Blastoise, +Brionne, +Bruxish, +Buizel, +Carracosta, +Carvanha, +Castform-Rainy, +Chinchou, +Clamperl, +Clauncher, +Clawitzer, +Cloyster, +Corphish, +Corsola, +Crawdaunt, +Croconaw, +Dewgong, +Dewott, +Dewpider, +Ducklett, +Empoleon, +Feebas, +Feraligatr, +Finneon, +Floatzel, +Frillish, +Froakie, +Frogadier, +Gastrodon, +Goldeen, +Golduck, +Golisopod, +Gorebyss, +Greninja, +Gyarados, +Horsea, +Huntail, +Jellicent, +Kabuto, +Kabutops, +Keldeo, +Kingdra, +Kingler, +Krabby, +Lanturn, +Lapras, +Lombre, +Lotad, +Ludicolo, +Lumineon, +Luvdisc, +Magikarp, +Manaphy, +Mantine, +Mantyke, +Mareanie, +Marill, +Marshtomp, +Milotic, +Mudkip, +Octillery, +Omanyte, +Omastar, +Oshawott, +Palpitoad, +Panpour, +Pelipper, +Phione, +Piplup, +Politoed, +Poliwag, +Poliwhirl, +Poliwrath, +Popplio, +Primarina, +Prinplup, +Psyduck, +Pyukumuku, +Quagsire, +Qwilfish, +Relicanth, +Remoraid, +Rotom-Wash, +Samurott, +Seadra, +Seaking, +Sealeo, +Seel, +Seismitoad, +Sharpedo, +Shellder, +Shellos, +Silvally-Water, +Simipour, +Skrelp, +Slowbro, +Slowking, +Slowpoke, +Spheal, +Squirtle, +Starmie, +Staryu, +Suicune, +Surskit, +Swampert, +Swanna, +Tapu Fini, +Tentacool, +Tentacruel, +Tirtouga, +Totodile, +Toxapex, +Tympole, +Vaporeon, +Volcanion, +Wailmer, +Wailord, +Walrein, +Wartortle, +Whiscash, +Wimpod, +Wingull, +Wishiwashi, +Wooper, +Blastoise-Mega, +Gyarados-Mega, +Sharpedo-Mega, +Slowbro-Mega, +Swampert-Mega";
		}

		if (banlist === false) return room.send("Invalid type.");
		if (!banlist) return room.send("Sorry, that type hasn't been coded yet.");

		checkGenerator(room, 'gen7monotype', args, `[Gen 7] Monothreat ${type}`);
		type = type[0].toUpperCase() + type.substring(1);
		room.send(`/tour rules ${banlist}, -Uber, -OU, -UU, -RU, -NU, -PU, -ZU, -NFE, -LC Uber, -LC, -UUBL, -RUBL, -NUBL, -PUBL`);
		room.send(`!rfaq monothreat`);
	},
	cc1v1: function(room, user, args) {
		if (!canMakeTour(room, user)) return;
		checkGenerator(room, 'challengecup1v1', args);
	}
}
