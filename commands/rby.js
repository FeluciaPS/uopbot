module.exports = {
	rby: {
		'': help,
		ou: function (room, user, args) {
			if (!Utils.canMakeTour(room, user)) return;
			Utils.checkGenerator(room, 'gen1ou', args);
		},
		uu: function (room, user, args) {
			if (!Utils.canMakeTour(room, user)) return;
			Utils.checkGenerator(room, 'gen1uu', args);
		},
		nu: function (room, user, args) {
			if (!Utils.canMakeTour(room, user)) return;
			Utils.checkGenerator(room, 'gen1nu', args);
		},
		nb4: function (room, user, args) {
			if (!Utils.canMakeTour(room, user)) return;
			Utils.checkGenerator(room, 'gen1ou', args, '[Gen 1] No Big 4');
			room.send('/tour rules -Tauros, -Chansey, -Snorlax, -Exeggutor');
		},
		nb3: function (room, user, args) {
			if (!Utils.canMakeTour(room, user)) return;
			Utils.checkGenerator(room, 'gen1ou', args, '[Gen 1] No Big 3');
			room.send('/tour rules -Tauros, -Chansey, -Snorlax');
		},
		tbou: "tradebacks",
		tradebacks: function (room, user, args) {
			if (!Utils.canMakeTour(room, user)) return;
			Utils.checkGenerator(room, 'gen1tradebacksou', args);
		},
		uber: function (room, user, args) {
			if (!Utils.canMakeTour(room, user)) return;
			Utils.checkGenerator(room, 'gen1ubers', args);
		},
		monotype: function (room, user, args) {
			if (!Utils.canMakeTour(room, user)) return;
			Utils.checkGenerator(room, 'gen1ou', args, '[Gen 1] Monotype');
			room.send('/tour rules +Same Type Clause');
		},
		help: function (room, user, args) {
			if (!user.can(room, '%')) return;
			room.send('Usage: ``.rby [type]``.');
			let types = [];
			for (let i in Commands['rby']) {
				if (typeof Commands['rby'][i] !== 'string' && i !== 'help') types.push(i);
			}
			room.send('Valid types: ' + types.join(', '));
		},
		random: function (room, user, args) {
			if (!user.can(room, '%')) return;
			let types = [];
			for (let i in Commands['rby']) {
				if (typeof Commands['rby'][i] !== 'string' && i !== 'help' && i !== 'random' && i !== 'chill') types.push(i);
			}
			Commands['ag'][Utils.select(types)](room, user, args);
		}
	}
}