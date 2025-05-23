/**
 * Returns a Date object converted to Eastern Time
 */
let getESTDate = function () {
    let now = Date.now();

    // Subtract 5 hours to convert from UTC to EST
    let est = now - 5 * 60 * 60 * 1000;

    return new Date(est);
};

const PATH = "./data/schedules";
const fs = require("fs");

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
 * 
 *  - linecountbeta: true to use the beta code for doing official tours by lines
 *  - randomformats: weighted object (key: string formatname. Valud: int weight) with random tour formats to choose from
 *  - minlines: minimum lines between tours
 *  - mintime: minimum time between tours
 * 
 *  - room: room to target for when "key" doesn't work for some reason (cough 1v1 potd)
 */

global.Officials = {
    "1v1potd": {
        formats: ['monopoke', 'monopoke'],
        times: [6, 18],
        room: '1v1',
        command: 'potd',
        autostart: 7,
        soft: true
    },
    "1v1tlt": {
        formats: ['gen9', 'gen9', 'gen9', 'gen9'],
        times: [ 5, 11, 17, 23 ],
        room: '1v1',
        command: '1v1',
        officialname: 'TLT',
        args: ['e2'],
        autostart: 7,
        scouting: true,
        handler: function(room, format) {
            room.send("!rfaq tlt");
            room.send("/tour name TLT [Gen 9] 1v1");
            if (!room.settings.officialhook) return;
            let request = require('request');
            request({url:room.settings.officialhook, body: {content:`<@&708404210890309653> **${format}** TLT tournament created. Starting in ${this.autostart} minutes!`}, method:"POST", json:true});
        },
        nextotprefix: 'TLT',
        disable: true
    },
    "1v1": {
        schedule: [
            [ "gen2", "gen9", "gen9" ], // Monday
            [ "gen9", "gen4", "gen9" ], // Tuesday
            [ "gen9", "gen9", "gen6" ], // Wednesday
            [ "gen3", "gen9", "gen9" ], // Thursday
            [ "gen9", "gen5", "gen9" ], // Friday
            [ "gen9", "gen9", "gen7" ], // Saturday
            [ "gen9", "gen8", "gen9" ], // Sunday
        ],
        times: [9, 15, 21],
        EST: true,
        scouting: true,
        scrappie: true,
        officialname: true,
        command: "1v1",
        autostart: 7,
        handler: function (room, format) {
            room.send(".board");
            if (!room.settings.officialhook) return;
            let request = require('request');
            request({url:room.settings.officialhook, body: {content:`<@&887737042786746369> **Official ${format}** tournament created. Starting in ${this.autostart} minutes!`}, method:"POST", json:true});
        },
        linecountbeta: true,
        randomformats: {
            gen9: 7,
            gen8: 1,
            gen7: 1,
            gen6: 1,
            gen5: 1,
            gen4: 1,
            gen3: 1,
            gen2: 1
        },
        minlines: 250,
        mintime: 1.55 * 60, // At least 1.55 hours between tours
        soft: true
    },
    anythinggoes: {
        schedule: ["gen9", "gen7", "galar", "gen6", "gen9", "gen7", "gen9"],
        times: [18],
        scouting: true,
        command: "ag",
        autostart: 7,
        autodq: 2
    },
    capproject: {
        schedule: [
            ["gen9", "gen9", "gen9", "gen9"], // Monday
            ["gen9", "gen9", "gen9", "gen5"], // Tuesday
            ["gen9", "gen9", "gen9", "gen6"], // Wednesday
            ["gen9", "gen9", "gen9", "gen7"], // Thursday
            ["gen9", "gen8", "gen9", "gen9"], // Friday
            ["gen9", "gen9", "gen9", "gen8"], // Saturday
            ["gen9", "gen7", "gen9", "gen9"], // Sunday
        ],
        times: [2, 12, 18, 22],
        scrappie: true,
        command: "cap",
        handler: function (room) {
            room.send("/wall Rules: https://pastebin.com/raw/Z3SgDjjL");
        },
    },
    deutsche: {
        times: [18],
        randomformats: {
            gen9randombattle: 1,            gen8randombattle: 1,
            gen7randombattle: 1,            gen6randombattle: 1,
            gen5randombattle: 1,            gen4randombattle: 1,
            gen3randombattle: 1,            gen2randombattle: 1,
            gen1randombattle: 1,            gen7letsgorandombattle: 1,
            bdsprandombattle: 1,            gen6firstbloodrandombattle: 1,
            gen9monotyperandombattle: 1,    gen9randomdoublesbattle: 1,
            gen8battlefactory: 1,           gen9battlefactory: 1,
            gen8bssfactory: 1,              randombattlemayhem: 1,
            randomroulette: 1,              challengecup6v6: 1
        }
    },
    smogondoubles: {
        schedule: {},
        monthly: true,
        EST: true,
        command: "overused",
        soft: true
    },
    monotype: {
        schedule: [
            ["gen9", "tera", "gen6", "lc", "gen5", "gen9"], // Monday
            [], // Tuesday
            [], // Wednesday
            [], // Thursday
            ["gen9", "gen5", "gen8", "gen7", "gen6", "gen9"], // Friday
            ["uu", "gen7", "gen9", "gen9", "gen8", "natdex"], // Saturday
            ["gen6", "gen9", "threat", "cap", "gen9", "gen5"], // Sunday
        ],
        altschedule: [
            ["lc", "gen7", "gen9", "gen9", "tera", "gen8"], // Monday
            [], // Tuesday
            [], // Wednesday
            [], // Thursday
            ["gen7", "gen6", "gen9", "gen9", "gen5", "gen8"], // Friday
            ["gen9", "gen8", "natdex", "uu", "gen7", "gen9"], // Saturday
            ["cap", "gen9", "gen5", "gen6", "gen9", "threat"], // Sunday
        ],
        times: [8, 9, 10, 20, 21, 22],
        EST: true,
        scrappie: true,
        officialname: "Tour Nights",
        command: "mono",
        handler: function (room) {
            room.send("!rfaq samples");
        },
    },
    nationaldexou: {
        times: [0, 8, 9, 10, 18, 19, 20, 22],
        formats: ["gen9", "gen9", "gen9", "gen8", "gen8","gen9", "gen8", "gen9"],
        scrappie: true,
        command: "natdex",
    },
    nationaldexuu: {
        times: [14, 17, 19, 21],
        formats: ["uu", "uu", "uu", "uu"],
        scrappie: true,
        command: "natdex",
        autostart: 5,
        autodq: 5
    },
    nationaldexmonotype: {
        times: [0, 8, 10, 12, 14, 16, 18, 20, 22],
        formats: ["mono", "mono", "threat", "mono", "gen8mono", "mono", "monoru", "mono", "monoubers"],
        scrappie: true,
        EST: true,
        command: "natdex"
    },
    nfe: {
        times: [1, 20],
        formats: ["gen8", "gen8"],
        scrappie: true,
        scouting: true,
        command: "nfe",
        autostart: 5,
    },
    othermetas: {
        schedule: [
            ["camomons", "bh"], 
            ["convergence", "aaa"], 
            ["forte", "mnm"], 
            ["shared", "stab"], 
            ["crossevo", "godlygift"], 
            ["revelation", "inheritance"], 
            ["trademarked", "pic"]
        ],
        times: [18, 21],
        forcepublic: true,
        forcetimer: true,
        scouting: true,
        command: "othermetas",
        handler: function (room, format) {
            room.send(`/wall The daily tour!`);
            room.send(`!om ${format}`);
        },
    },
    overused: {
        schedule: {},
        monthly: true,
        EST: true,
        command: "overused",
        autostart: 5,
        handler: function (room, format) {
            if (format === "gen8") room.send(`!rfaq gen8samples`);
            else room.send(`!rfaq roasamples`);
        },
        args: ["official"],
    },
    rby: {
        times: [3, 9, 15, 21],
        formats: ["ou", "randbats", "ou", "randbats"],
        command: "rby",
        autostart: 7,
    },

    // Overarching official tournament function.
    // This will make so many things so much better.
    official: function (msgroom) {
        // Fill in room.pasttours[2] if it doesn't exist
        if (!msgroom.lasttour[2]) msgroom.lasttour[2] = 0;
        msgroom.lasttour[2]++;

        // Save every 50 lines, that should be good enough.
        if (msgroom.lasttour[2] % 50 == 0) msgroom.saveSettings();
        for (let i in this) {
            if (i === "official") continue;
            let data = this[i];
            if (data.disable) continue;
            let room = data.room ? Rooms[data.room] : Rooms[i];

            // Bot is not in the room.
            if (!room) continue;


            // Tour has already been made.
            if (data.hasStarted) {
                //console.log(`${i} - tour has already started`);
                continue;
            }

            // Some current date/time settings.
            let now = data.EST ? getESTDate() : new Date(Date.now());
            let day = now.getDay() - 1; // 0 = monday
            if (day < 0) day = 6;

            // We don't do tours not at a full hour. Deal with it.
            if (now.getMinutes() > 5 && !data.linecountbeta) continue;

            // Check if a tour should be made at all
            // and check the format if so
            let format = false;
            let randomformat = false;
            if (data.monthly) {
                if (data.schedule[now.getDate()]) {
                    // There is a tour scheduled for today.
                    let today = data.schedule[now.getDate()];
                    if (today[now.getHours()]) {
                        // There is a tour scheduled for right now.
                        format = today[now.getHours()];
                    }                
                }
            } else if (data.formats) {
                let index = data.times.indexOf(now.getHours());
                if (index !== -1) {
                    // There's a tour scheduled for right now.
                    format = data.formats[index];
                }
            } else if (data.schedule) {
                let index = data.times.indexOf(now.getHours());
                if (index !== -1) {
                    const week = Math.floor(now / (1000 * 60 * 60 * 24 * 7));
                    let schedule = data.altschedule && week % 2 ? data.altschedule : data.schedule;
                    
                    // There's a tour scheduled for right now.
                    format = typeof schedule[day] === "string" ? schedule[day] : schedule[day][index];
                }
            } else if (data.randomformats && !data.linecountbeta) {
                // Random tour formats, weighted.
                let max = 0;
                for (let formatname in data.randomformats) {
                    max += data.randomformats[formatname];
                }

                let roll = Math.floor(Math.random() * max);
                let n = 0;
                for (let formatname in data.randomformats) {
                    n += data.randomformats[formatname];
                    if (n > roll) {
                        format = formatname;
                        break;
                    }
                }

                let index = data.times.indexOf(now.getHours());
                if (index === -1) format = false;
            }

            if (format && room.settings.ignorenext) {
                room.settings.ignorenext--;
                room.send(`/mn OFFICIAL SKIPPED: ${format}`);
                data.hasStarted = true;
                setTimeout(() => {
                    data.hasStarted = false;
                }, 7 * 1000 * 60);
                continue;
            }
            if (!format && data.linecountbeta) {
                // When was the last tour?
                let time_since_last_tour = Date.now() - room.lasttour[0];

                // We need that in minutes
                time_since_last_tour = time_since_last_tour / (1000 * 60);
                
                console.log(time_since_last_tour, data.mintime);
                if (time_since_last_tour < data.mintime)
                    continue;

                console.log(room.lasttour[2], data.minlines);
                // Messages?
                if (room.lasttour[2] < data.minlines)
                    continue;

                if (room.settings.ignorenext) {
                    room.settings.ignorenext--;
                    room.send(`/mn OFFICIAL SKIPPED: ${format}`);
                    data.hasStarted = true;
                    room.lasttour[0] = Date.now();
                    room.lasttour[2] = 0;
                    room.saveSettings();
                    setTimeout(() => {
                        data.hasStarted = false;
                    }, 7 * 1000 * 60);
                    continue;
                }
                
                // Random tour formats, weighted.
                let max = 0;
                for (let formatname in data.randomformats) {
                    max += data.randomformats[formatname];
                }

                let roll = Math.floor(Math.random() * max);
                let n = 0;
                for (let formatname in data.randomformats) {
                    n += data.randomformats[formatname];
                    if (n > roll) {
                        format = formatname;
                        randomformat = true;
                        break;
                    }
                }
            }

            if (!format) 
                continue;

            if (!data.command && !Tournament.formats[format]) {
                // is bad
                console.log(`No tour command given for ${i}`);
                continue;
            }

            if (now.getMinutes() > 5 && !randomformat) continue;
            if (!Commands[data.command] && !Tournament.formats[format]) {
                // is also bad
                console.log(`Invalid tour command for ${i}: ${data.command}`);
                continue;
            }

            if (data.command && !Commands[data.command][format] && !Tournament.formats[format]) {
                // is equally bad
                console.log(`Invalid subcommand for ${i}-${data.command}: ${format}`);
                continue;
            }

            if (room.tournament) {
                if (room.tournament.official) return console.log(`${i}: Official tour already exists`);
                else if (!data.soft) {
                    room.send("/wall Official time. Ending ongoing tournament");
                    room.send("/tour end");
                    room.endTour();
                }
            }

            // Make sure the linetours don't double fire. Kinda hacky but we'll take it.
            room.lasttour[2] = 0;
            room.saveSettings();

            room.send("/modnote OFFICIAL: " + format);
            if (!data.command || !Commands[data.command][format]) {
                room.send(`/tour new ${format}, elim`);
            }
            else {
                Commands[data.command][format](room, Users.staff, data.args ? [...data.args] : []);
            }
            room.startTour(data);

            if (data.handler) data.handler(room, format);

            data.hasStarted = true;
            setTimeout(() => {
                data.hasStarted = false;
            }, 30 * 1000 * 60);
        }
    },
};

let Schedules = {
    save: function (room, data) {
        if (!fs.existsSync(PATH)) fs.mkdirSync(PATH);
        fs.writeFileSync(PATH + "/" + room + ".json", JSON.stringify(data, null, 2));
        this.load();
    },
    load: function () {
        if (!fs.existsSync(PATH)) fs.mkdirSync(PATH);
        for (let i of fs.readdirSync(PATH)) {
            let data = fs.readFileSync(PATH + "/" + i);
            data = JSON.parse(data);
            let room = i.split(".")[0];
            if (Officials[room] && Officials[room].monthly) {
                Officials[room].schedule = data;
            }
            if (data.isHiddenData) {
                Officials[room] = data;
            }
        }
    },
};

Schedules.load();

let hasOfficial = function(id) {
    if (Officials[id]) return true;
    for (let i in Officials) {
        if (Officials[i].room === id) return true;
    }
    return false;
}
module.exports = {
    nextot: function (room, user, args) {
        if (room.id === "1v1" && !user.can(room, '+')) return user.send("Please use this command in PM.");
        let rooms = {};
        let entries = [];
        let targetroom = false;
        for (let i in (toId(args[0]) === "all" ? Officials : user.rooms)) {
            let robj = Rooms[i];
            if (room !== user && robj !== room) continue;
            if (!hasOfficial(i)) continue;
            if (!Users.self.can(robj, "*")) continue; // bot isn't auth in the room, can't start official tours, so no point displaying them.
            if (Users.self.rooms[i] === "*") targetroom = robj; // this is useful later

            for (let entry in Officials) {
                let obj = Officials[entry];
                if (obj.disable) continue;
                if (entry !== i && obj.room !== i) continue;
                let officialRoom = obj.room || entry;

                // Sorry I can't be asked to write this right now
                if (obj.monthly) continue;

                let r = "";
                let now = obj.EST ? getESTDate() : new Date(Date.now());
                let next = obj.times[0];
                for (let i in obj.times) {
                    if (now.getHours() >= obj.times[i]) next = obj.times[(parseInt(i) + 1) % obj.times.length];
                }

                let tomorrow = now.getHours() > next;

                let time = next * 60 * 60 * 1000;
                let dayprogress = now.getTime() % (24 * 60 * 60 * 1000);

                if (tomorrow) dayprogress -= 24 * 60 * 60 * 1000;

                let timeremaining = Math.floor((time - dayprogress) / 1000);
                let timer = {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                };

                timer.hours = Math.floor(timeremaining / 3600);
                timer.minutes = Math.floor((timeremaining - timer.hours * 3600) / 60);
                timer.seconds = timeremaining % 60;

                let meta = "";
                next = obj.times.indexOf(next);

                if (obj.formats) meta = obj.formats[next];
                else if (!obj.schedule) {
                    meta = officialRoom;
                }
                else {
                    let day = now.getDay() - 1 + tomorrow;
                    while (day < 0) day += 7;
                    meta = typeof obj.schedule[0] === "string" ? obj.schedule[day] : obj.schedule[day][next];
                }

                let betterDuplicate = false;
                for (let i of entries) {
                    if (i[0] !== officialRoom) continue;
                    if (i[1] < timeremaining) betterDuplicate = true;
                }

                if (betterDuplicate) continue;

                entries.push([
                    officialRoom,
                    timeremaining
                ])

                let ret = [];
                if (timer.hours) {
                    ret.push(timer.hours + " hour" + (timer.hours === 1 ? "" : "s"));
                }
                if (timer.minutes) {
                    ret.push(timer.minutes + " minute" + (timer.minutes === 1 ? "" : "s"));
                }
                if (timer.seconds) {
                    ret.push(timer.seconds + " second" + (timer.seconds === 1 ? "" : "s"));
                }

                if (ret.length > 1) ret[ret.length - 1] = "and " + ret[ret.length - 1];
                ret = ret.join(ret.length === 3 ? ", " : " ");

                
                ret = "in " + ret;
                if (timeremaining < -5 * 60) ret = "should've just started";
                if (!meta) meta = "No tour scheduled"
                if (obj.nextotprefix) meta = `<b>${obj.nextotprefix}</b> ${meta}`;
                r += `<b>${officialRoom}</b> - ${meta} ${ret}`;
                rooms[officialRoom] = r;
            }
        }
        rooms = Object.values(rooms);
        if (!rooms.length) {
            if (room === user) return user.send("You're not in any rooms that have Official Tours configured");
            else return user.send("No official tours configured for this room");
        }
        if (rooms.length === 1) {
            rooms[0] = rooms[0].replace(/<\/?b>/gi, "**");
            if (!user.can(room, "+")) {
                // room is either PM or permission denied
                return user.send(rooms[0]);
            } else return room.send(rooms[0]);
        }
        // multiple rooms, command was used in PM.
        let ret = rooms.join("<br>");
        targetroom.send(`/pminfobox ${user.id}, ${ret}`);
    },
    updateschedule: function (room, user, args) {
        if (room !== user && args.length < 2) args = [room.id, ...args];
        if (args.length < 2) return user.send("Usage: ``.updateschedule [room], [url]``");
        let roomid = toId(args[0]);

        if (!Officials[roomid])
            return user.send("The specified room does not exist or does not have official tournaments configured.");
        if (!Officials[roomid].monthly) return user.send("This room does not use user-configurable schedules.");

        room = Rooms[roomid];
        if (!room)
            return user.send("I can't check if you have permission to do that, as I am not in the specified room...");
        if (!user.can(room, '@')) return user.send("Only Mods (@) and up can update this room's tournament schedule");

        let url = args[1];

        // We use https around these parts
        url = url.replace("http://", "https://");

        // Check if the url is valid
        if (!url.match(/https:\/\/(pastebin.com|hastebin.com|pastie.io)(\/raw)?\/[A-z0-9]+(?!.*\/)/)) {
            return user.send("Url provided must be a valid pastebin.com, hastebin.com, or pastie.io link");
        }

        // Convert url to a raw url
        url = url.replace(/https:\/\/(pastebin.com|hastebin.com|pastie.io)(?!\/raw)/, "https://$1/raw");

        let https = require("https");

        https
            .get(url, (res) => {
                let data = "";

                res.on("data", (d) => {
                    data += d;
                });

                res.on("end", () => {
                    // Remove ugly \r
                    data = data.replace(/\r\n?/gi, "\n");

                    // Split by line.
                    data = data.split("\n");

                    let schedule = {};

                    for (let l = 0; l < data.length; l++) {
                        let line = data[l];
                        let parts = line.split(/[|,-]/g).map((x) => x.trim());
                        let [date, time, meta] = parts;
                        if (parts.length !== 3) {
                            return user.send(`Invalid data on line ${l + 1}: ${line}`);
                        }

                        date = parseInt(date);
                        time = parseInt(time);

                        if (isNaN(date) || date < 1 || date > 31) {
                            return user.send(
                                `Invalid date input on line ${l + 1}: \`\`${line}\`\`. Must be a whole number below 31.`
                            );
                        }

                        if (isNaN(time) || time < 0 || time > 23) {
                            return user.send(
                                `Invalid time input on line ${l + 1}: \`\`${line}\`\`. Must be a whole number below 23.`
                            );
                        }

                        /*if (!Commands[Officials[roomid].command][meta]) {
                            return user.send(
                                `Invalid meta input on line ${l + 1}. Valid metas: ${Object.keys(
                                    Commands[Officials[roomid].command]
                                ).join(" ")}`
                            );
                        }*/
                        // ok everything is valid.

                        if (!schedule[date]) schedule[date] = {};
                        if (schedule[date][time]) {
                            return user.send(`Duplicate date+time ${date}-${time}`);
                        }

                        schedule[date][time] = meta;
                    }

                    if (Officials[room].isHiddenData) {
                        Officials[room].schedule = schedule;
                        Schedules.save(room, Officials[room])
                    }
                    else Schedules.save(room, schedule);
                    return user.send("Official schedule successfully updated.");
                });
            })
            .on("error", (e) => {
                console.error(e);
            });
    },
    viewschedule: function (room, user, args) {
        if (room !== user && args.length < 1) args = [room.id, ...args];
        args[0] = toId(args[0]);
        if (!Rooms[args[0]]) return user.send("Room doesn't exist");
        if (!Officials[args[0]] || !Officials[args[0]].monthly)
            return user.send("No officials configured for this room");
        if (!Object.keys(Officials[args[0]].schedule).length) return user.send("No schedule yet.");

        let header = ``;
        header += `+------+------+------+\n`;
        header += `| Date | Time | Meta |\n`;
        header += `+------+------+------+\n`;

        for (let i in Officials[args[0]].schedule) {
            let dt = Officials[args[0]].schedule[i];
            for (let x in dt) {
                header += `|   ${(i < 10 ? " " : "") + i} |   ${(x < 10 ? " " : "") + x} | ${dt[x]} |\n`;
            }
        }

        header += `+------+------+------+`;
        Utils.uploadToHastebin(header, (x) => {
            room.send(x);
        });
    },
    cancelnextot: function (room, user, args) {
        if (!user.can(room, '@')) return;

        let target = room.id;
        if (!Officials[target]) return user.send("This room doesn't have officials configured");

        if (args[0]) args[0] = +args[0];
        if (isNaN(args[0])) return user.send("Usage: ``.cancelnextot [number]``");

        if (!args[0]) args[0] = 1;
        room.settings.ignorenext = args[0];
        room.saveSettings();

        return room.send(`Next ${args[0]} official${args[0] != 1 ? 's' : ''} will be ignored.`);
    }
};
