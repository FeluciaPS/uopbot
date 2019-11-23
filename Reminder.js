'use strict';

if (!FS.existsSync('./data/reminders.json')) FS.writeFileSync('./data/reminders.json', '{}');
let reminders = JSON.parse(FS.readFileSync('./data/reminders.json'));

/* REMINDER FORMAT
	
  '[date]': {
  	type: User/Room,
  	target: User/Room,
  	message
  }

 */

module.exports = {
	check: function() {
		let now = Date.now().toString();
		let dates = Object.keys(reminders);
		dates.push(now);
		dates = dates.sort();
		for (let stamp of dates) {
			if (stamp === now) return;
			let reminder = reminders[stamp];
			if (reminder.type === 'room') {
				let room = Rooms[reminder.target];
				if (!room) {
					Send('', '/join ' + reminder.target);
					continue;
				}
				room.send(reminder.message);
			}
			else {
				let user = Users[reminder.target];
				if (!user) { // User is offline or not in the room
					Commands.mail(Users.self, Users.self, [reminder.target, reminder.message]);
				}
				else { // Send the reminder to the user
					user.send(reminder.message);
				}
			}
			this.delete(stamp);
		}
	},
	parse: function(user, room, message) {
		if (!message.startsWith(Config.username)) return;
		message = message.substring(Config.username.length).trim();
		if (!message.toLowerCase().startsWith('remind me')) return;
		message = message.substring(11).trim();
		let parts = {};
		if (message.toLowerCase().startsWith('in')) {
			let to = message.indexOf("to");
			parts.in = message.substring(2, to).trim();
			parts.to = message.substring(to).trim();
		}
		else if (message.toLowerCase().startsWith('to')) {
			let to = message.indexOf("in");
			parts.to = message.substring(0, to).trim();
			parts.in = message.substring(to + 2).trim();
		}
		else if (message.includes("in")) {
			let to = message.indexOf("in");
			parts.to = message.substring(0, to).trim();
			parts.in = message.substring(to + 2).trim();
		}
		else {
			return "Invalid syntax.";
		}
		parts.in = parts.in.replace(/ ?and ?/gi, ',').replace(/ ?, ?/g, ',').split(',');
		let fromnow = 0;
		let timethings = {
			minutes: 0,
			hours: 0,
			days: 0,
			weeks: 0
		};
		for (let i of parts.in) {
			let x = i.split(' ');
			let type = toId(x[1]);
			let val = parseInt(x[0]);
			if (isNaN(val) || !type) continue;
			if (type.charAt(type.length-1) !== 's') type += 's';
			switch (type) {
				case 'minutes':
					fromnow += val * 1000 * 60;
					timethings.minutes += val;
					while (timethings.minutes >= 60) {
						timethings.minutes -= 60;
						timethings.hours += 1;
					}
					break;
				case 'hours':
					fromnow += val * 1000 * 60 * 60;
					timethings.hours += val;
					while (timethings.hours >= 24) {
						timethings.hours -= 24;
						timethings.days += 1;
					}
					break;
				case 'days':
					fromnow += val * 1000 * 60 * 60 * 24;
					timethings.days += val;
					while (timethings.days >= 7) {
						timethings.days -= 7;
						timethings.weeks += 1;
					}
					break;
				case 'weeks':
					fromnow += val * 1000 * 60 * 60 * 24 * 7;
					timethings.weeks += val;
					break;
				default: 
					break;
			}
		}

		let ret = [];
		if (timethings.weeks) ret.push(timethings.weeks + ' week' + (timethings.weeks === 1 ? '' : 's'));
		if (timethings.days) ret.push(timethings.days + ' day' + (timethings.days === 1 ? '' : 's'));
		if (timethings.hours) ret.push(timethings.hours + ' hour' + (timethings.hours === 1 ? '' : 's'));
		if (timethings.minutes) ret.push(timethings.minutes + ' minute' + (timethings.minutes === 1 ? '' : 's'));
		let timestr = timethings.join(' and ');
		let ands = timestr.match(/and/gi);
		while(ands.length > 1) {
			timestr = timestr.replace(' and', ',');
			ands = timestr.match(/and/gi);
		}
		let msg = parts.to;
		let endtime = Date.now() + fromnow;

		while (reminders[endtime]) endtime += 1;

		let type = "room";
		let target = room;
		if (room === user) type = "user";
		if (!user.can(room, '+')) {
			type = "user";
			target = user;
		}
		reminders[endtime.toString()] = {
		  	type,
		  	target: target.id,
		  	message: msg
		}

		target.send("I'll remind you in " + timestr);
		this.save();
	},
	delete: function(id) {
		delete reminders[id];
		this.save();
	},
	save: function() {
		FS.writeFileSync('./data/reminders.json', JSON.stringify(reminders, null, 4));
	}
}