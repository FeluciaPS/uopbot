module.exports = {
    hellothere: {
		'': function(room, user, args) {
			if (!user.can(room, '%')) return;
			room.send('General Kenobi!');
		},
		on: function(room, user, args) {
			if (!user.can(room, '#')) return;
			room.settings.hellothere = true;
			room.saveSettings();
			room.loadSettings();
			room.send('Hello There auto response enabled');
		},
		off: function(room, user, args) {
			if (!user.can(room, '#')) return;
			room.settings.hellothere = false;
			room.saveSettings();
			room.loadSettings();
			room.send('Hello There auto response disabled');
		},
		toggle: function(room, user, args) {
			if (!user.can(room, '#')) return;
			room.settings.hellothere = !room.settings.hellothere;
			room.saveSettings();
			room.loadSettings();
			room.send(`Hello There auto response ${room.settings.hellothere ? 'en' : 'dis'}abled`);
		},
	}
}
