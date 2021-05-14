/**
 * Returns a Date object converted to Eastern Time
 */
let getESTDate = function () {
    let now = Date.now();

    // Subtract 5 hours to convert from UTC to EST
    let est = now - 5 * 60 * 60 * 1000

    return new Date(est);
}

/*
 *  Officials object
 *  key: roomid
 *  - schedule || formats: schedule is for a repeating weekly schedule (string[] or string[][]), formats for a repeating daily schedule (string[]). 
 *      use these correctly or the bot will majorly freak out
 *  - monthly: true to use a locally configurable monthly schedule instead.
 *  - times: the times at which to hold tournaments, UTC by default
 *  - EST: set to true if you want to note down the times in UTC-5 (note: doesn't change with daylight savings)
 *  - forcepublic: true for forcing public tour games
 *  - forcetimer: true to force timer in tour games
 *  - scouting: true to ban scouting
 *  - modjoin: true to disallow modjoin
 *  - scrappie: true to have the bot send .official on tour creation, to denote it as an official tour for Scrappie
 *  - autostart: autostart in minutes
 *  - autodq: autodq in minutes
 *  - args: optional set of arguments to pass into the tournament command
 */

global.Officials = {
    "1v1": {
        schedule: [
            ["gen7", "gen6", "monopoke", "gen8"], // Monday
            ["gen5", "gen4", "gen8", "gen7"], // Tuesday
            ["monopoke", "gen8", "gen6", "gen5"], // Wednesday
            ["gen8", "gen7", "gen4", "gen3"], // Thursday
            ["gen8", "gen6", "gen7", "gen8"], // Friday
            ["gen5", "gen4", "gen8", "gen6"], // Saturday
            ["gen3", "gen8", "gen5", "gen4"], // Sunday
        ],
        times: [2, 8, 14, 20],
        EST: true,
        scouting: true,
        scrappie: true,
        command: "1v1",
        autostart: 7,
		handler: function(room) {
			room.send(".board");
		}
    },
    "2v2": {
        schedule: [
            ["gen8", "gen6", "gen8"],
            ["gen5", "gen8", "gen8"],
            ["gen8", "gen8", "gen7"],
            ["gen6", "gen8", "gen8"],
            ["gen8", "gen8", "gen5"],
            ["gen8", "gen7", "gen8"],
            ["gen8", "gen8", "gen8"],
        ],
        times: [5, 13, 21],
        EST: true,
        scouting: true,
        scrappie: true,
        command: "2v2",
        autostart: 7,
    },
    "anythinggoes": {
        schedule: [
            "galar",
            "galar",
            "gen7",
            "natdex",
            "gen6",
            "galar",
            "gen7",
        ],
        times: [18],
        scouting: true,
        command: "ag",
        autostart: 7,
		handler: function(room) {
			room.send("/wall Rules: https://pastebin.com/raw/Z3SgDjjL")
		}
    },
    "capproject": {
        formats: ["gen8", "gen8", "gen8", "gen8"],
        times: [2, 12, 18, 22],
        scrappie: true,
        command: "cap",
    },
    "nationaldex": {
        times: [0, 18, 19, 22, 23],
        formats: ["gen8", "gen8", "gen8", "gen8", "gen8"],
        scrappie: true,
        command: "natdex",
    },
    "nationaldexuu": {
        times: [17, 21],
        formats: ["uu", "uu"],
        scrappie: true,
        command: "natdex",
    },
    "nfe": {
        times: [1, 9, 15, 20],
        formats: ["gen8", "gen8", "gen8", "gen8"],
        scrappie: true,
        scouting: true,
        command: "nfe",
        autostart: 7,
    },
    "othermetas": {
        schedule: [
            "bh",
            "mnm",
            "aaa",
            "stab",
            "camo",
            "omotm",
            "lcotm",
        ],
        times: [21],
        forcepublic: true,
		forcetimer: true,
        scouting: true,
        command: "othermetas",
		handler: function (room, format) {
			room.send(`/wall The daily tour!`);
			room.send(`!om ${format}`);
			if (meta !== 'omotm' && format !== 'lcotm') {
				room.send(`!rfaq ${format}samples`);
			}
		}
    },
	"overused": {
		schedule: {},
		monthly: true,
		EST: true,
		command: "overused",
	},

	// Overarching official tournament function.
	// This will make so many things so much better.
	official: function () {
		for (let i in this) {
			if (i === "official") continue;
			let room = Rooms[i];

			// Bot is not in the room.
			if (!room) continue;

			let data = this[i];

			// Tour has already been made.
			if (data.hasStarted) {
				//console.log(`${i} - tour has already started`);
				continue;
			}

			// Some current date/time settings.
			let now = data.est ? getESTDate() : new Date(Date.now());
			let day = now.getDay() - 1;
        	if (day < 0) day = 6;

			// We don't do tours not at a full hour. Deal with it.
			if (now.getMinutes() > 5) continue;

			// Check if a tour should be made at all
			// and check the format if so
			let format = false;
			if (data.monthly) {
				if (!data.schedule[now.getDate()]) {
					// There is no tour scheduled for today.
					continue;
				}
				let today = data.schedule[now.getDate()];
				if (!today[now.getHours]) {
					// There is no tour scheduled for right now.
					continue;
				}
				format = today[now.getHours()];
			} else if (data.formats) {
				let index = data.times.indexOf(now.getHours());
				if (index === -1) {
					// There's no tour scheduled for right now.
					continue;
				}
				format = data.formats[index];
			} else if (data.schedule) {
				let index = data.times.indexOf(now.getHours());
				if (index === -1) {
					// There's no tour scheduled for right now.
					continue;
				}
				format = typeof data.schedule[0] === "string" ? data.schedule[day] : data.schedule[day][index];
			} else {
				// Something went wrong
				continue;
			}

			if (!data.command) {
				// is bad
				console.log(`No tour command given for ${i}`);
				continue;
			}

			if (!Commands[data.command]) {
				// is also bad
				console.log(`Invalid tour command for ${i}: ${data.command}`);
				continue;
			}

			if (!Commands[data.command][format]) {
				// is equally bad
				console.log(`Invalid subcommand for ${i}-${data.command}: ${format}`);
				continue;
			}

			if (room.tournament) {
				if (room.tournament.official) return console.log(`${i}: Official tour already exists`);
				else {
					room.send("/wall Official time. Ending ongoing tournament");
					room.send("/tour end");
					room.endTour();
				}
			}

			room.send("/modnote OFFICIAL: " + format);
			Commands[data.command][format](room, Users.staff, data.args ? [...data.args] : []);
			room.startTour(data)

			handler(room, format);

			data.hasStarted = true;
			setTimeout(() => {
				data.hasStarted = false
			}, 30 * 1000 * 60);
		}        
    }
}

module.exports = {
    nextot: function (room, user, args) {
        let rooms = [];
        let targetroom = false;
        for (let i in user.rooms) {
            let robj = Rooms[i];
            if (room !== user && robj !== room) continue;
            if (!Officials[i]) continue;
            if (!Users.self.can(robj, '*')) continue; // bot isn't auth in the room, can't start official tours, so no point displaying them.
            if (Users.self.rooms[i] === "*") targetroom = robj; // this is useful later 
            let obj = Officials[i];

			// Sorry I can't be asked to write this right now
			if (obj.monthly) continue;

            let r = "";
            let now = obj.est ? getESTDate() : new Date(Date.now());
            let nhours = now.getHours();
            let next = obj.times[0];
            for (let i in obj.times) {
                if (nhours >= obj.times[i]) next = obj.times[(parseInt(i) + 1) % obj.times.length];
            }
            
            let hours = next - nhours;
            let minutes = 60 - now.getMinutes();
            if (minutes < 60) hours -= 1;
            else minutes = 0;
            let daycorrect = -1;
            while (hours < 0) {
                hours += 24;
                daycorrect += 1;
            }
            
            /*let now2 = new Date(Date.now() - 5 * 60 * 1000);
            let nhours = now2.getHours();
            let next = obj.times[0];
            for (let i in obj.times) {
                if (nhours >= obj.times[i]) next = obj.times[(parseInt(i) + 1) % obj.times.length];
            }
            let hours = next - now.getHours();
            
            //if (next === 0) hours += 24;
            let minutes = 60 - now.getMinutes();
            if (minutes < 60) hours -= 1;
            else minutes = 0;
            while (hours >= 24) hours -= 24;*/
            let meta = '';
            next = obj.times.indexOf(next);
            if (obj.formats) meta = obj.formats[next];
            else {
                let day = now.getDay() - 1 + daycorrect;
                while (day < 0) day += 7;
                let hours = next - now.getHours();
                if (hours < 0) {
                    day = (day + 1) % 7;
                }
                meta = typeof obj.schedule[0] === "string" ? obj.schedule[day] : obj.schedule[day][next];
            }
            while (hours < 0) hours += 24;
            let timestr = "in " + (hours !== 0 ? hours + " hour" + (hours === 1 ? '' : 's') : '') + (hours !== 0 && minutes !== 0 ? ' and ' : '') + (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? '' : 's') : '');
            if (hours >= 23 && minutes >= 55) timestr = "should've just started";
            r += `<b>${robj.name}</b> - ${meta} ${timestr}`;
            rooms.push(r);
        }
        if (!rooms.length) {
            if (room === user) return user.send("You're not in any rooms that have Official Tours configured");
            else return user.send('No official tours configured for this room');
        }
        if (rooms.length === 1) {
            rooms[0] = rooms[0].replace('<b>', '**').replace('</b>', '**');
            if (!user.can(room, '+')) { // room is either PM or permission denied
                return user.send(rooms[0]);
            } else return room.send(rooms[0]);
        }
        // multiple rooms, command was used in PM.
        let ret = rooms.join('<br>');
        targetroom.send(`/pminfobox ${user.id}, ${ret}`);
    }
}
