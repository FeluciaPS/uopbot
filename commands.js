global.Banlist = JSON.parse(FS.readFileSync("data/banlist.json"));
global.PokeDex = require("./data/pokedex.js");
global.fdata = require("./data/formats-data.js");
global.Items = require("./data/items.js");

let commands = {
    // Utilities
    stat: function (room, user, args) {
        let target = user.can(room, "+") ? room : user;
        args = args[0].split(" ");
        let pokemon = args[0];
        let stat = toId(args[1]);
        let invest = args[2];
        let boost = args[3];
        let stats = ["hp", "atk", "def", "spa", "spd", "spe"];

        if (!pokemon) {
            target.send("Usage: .stat [pokemon], [hp/atk/def/spa/spd/spe], [ivs:evs], [boost]");
            return [null];
        }

        if (!stat || stats.indexOf(stat) === -1) {
            target.send("No valid stat given. (hp/atk/def/spa/spd/spe)");
            return [null];
        }
        if (!invest) invest = "0";
        if (!boost) boost = "0";
        let invests = invest.split(":");
        let ev,
            iv,
            nature = 1;
        if (invests[1]) {
            if (invests[1].indexOf("+") != -1) {
                nature = "1.1";
                invests[1] = invests[1].substring(0, invests[1].length - 1);
            }
            if (invests[1].indexOf("-") != -1) {
                nature = "0.9";
                invests[1] = invests[1].substring(0, invests[1].length - 1);
            }
            ev = parseInt(invests[1]);
            iv = parseInt(invests[0]);
        } else {
            if (invests[0].indexOf("+") != -1) {
                nature = "1.1";
                invests[0] = invests[0].substring(0, invests[0].length - 1);
            }
            if (invests[0].indexOf("-") != -1) {
                nature = "0.9";
                invests[0] = invests[0].substring(0, invests[0].length - 1);
            }
            ev = parseInt(invests[0]);
            iv = 31;
        }
        let mon = PokeDex[toId(pokemon)];
        if (!mon) {
            target.send(`${pokemon} is not a valid pokemon`);
            return [null];
        }

        if (stat === "hp" && toId(pokemon) === "shedinja") return 1;
        if (boost.startsWith("+")) {
            boost = 1 + 0.5 * parseInt(boost.substring(1));
        } else if (boost.startsWith("-")) {
            boost = 1 / (1 + 0.5 * parseInt(boost.substring(1)));
        } else {
            boost = 1;
        }

        // Check for dumb shit
        if (boost > 4 || boost < 0.25) {
            target.send("Boost must be between +6 and -6");
            return [null];
        }

        if (ev > 252 || ev < 0) {
            target.send("ev must be between 0 and 252");
            return [null];
        }

        if (iv > 31 || iv < 0) {
            target.send("iv must be between 0 and 31");
            return [null];
        }

        let fin = 0;
        if (stat === "hp") {
            fin = Math.floor(mon.baseStats[stat] * 2 + iv + ev / 4 + 110);
        } else {
            fin = Math.floor((mon.baseStats[stat] * 2 + iv + ev / 4 + 5) * nature);
            fin = Math.floor(fin * boost);
        }

        target.send(fin);
    },
    th: "tourhistory",
    tourhistory: function (room, user, args) {
        if (!user.can(room, "+")) return;
        if (!room.pasttours.length) return room.send("This room has no past tours recorded.");
        room.send("**Tour history** (most recent first): " + room.pasttours.reverse().join(", "));
        room.pasttours.reverse();
    },
    lasttour: function (room, user, args) {
        if (!user.can(room, "+")) return;
        if (!room.lasttour[0]) return room.send("This room has no past tours recorded.");
        let ago = Math.floor((Date.now() - room.lasttour[0]) / 60000);
        return room.send(`**${room.lasttour[1]}** ${ago} minute${ago === 1 ? "" : "s"} ago.`);
    },
    hangmon: function (room, user, args) {
        if (!user.can(room, "%")) return;
        if (room.tournament) return room.send("You can't play hangman while a tournament is going on");
        let mons = Object.values(PokeDex);
        let mon = Utils.select(mons);
        room.send(`/hangman create ${mon.name}, Generation ${getGen(mon)}`);
    },
    mail: function (room, user, args, val) {
        let target = args[0];
        let targetid = toId(target);
        if (!val) return user.send("Usage: ``.mail [user], [message]``");
        let msg = val.substring(target.length + 1).trim();
        if (args.length < 2 || !targetid || !msg) return user.send("Usage: ``.mail [user], [message]``");
        let message = `[mail] ${user.name}: ${msg}`;
        if (message.length > 300) return user.send("Your message is too long...");
        if (Users[targetid]) return Users[targetid].send(message);
        FS.readFile(`mail/${targetid}.json`, (err, data) => {
            let maildata = [];
            if (err) {
            } else {
                try {
                    maildata = JSON.parse(data);
                } catch (e) {}
            }
            if (maildata.length === Config.mail.inboxSize) return user.send("That user's mailbox is full.");
            maildata.push(message);
            FS.writeFile(`mail/${targetid}.json`, JSON.stringify(maildata, null, 4), (err) => {
                if (err) throw err;
                user.send("Mail sent successfully.");
            });
        });
    },

    // Staff things
    settype: "st",
    st: function (room, user, args) {
        if (!user.can(room, "%")) return;
        let type = args[0];
        if (!type) return;
        console.log(type);
        if (type.startsWith("rr")) {
            let count = parseInt(type.substring(2));
            if (count) room.send("/tour settype rr,, " + count);
            else room.send("/tour settype rr");
        } else if (type.startsWith("e")) {
            let count = parseInt(type.substring(1));
            if (count) room.send("/tour settype elim,, " + count);
            else room.send("/tour settype elim");
        } else {
            room.send("Invalid type.");
        }
    },

    modnote: function (room, user, args, val) {
        console.log("test");
        if (room != user) return;
        console.log("test 2");
        if (!args[0]) return user.send("Usage: ``.modnote [room], [message]``");
        room = Utils.toRoomId(args[0]);
        console.log(Object.keys(Rooms));
        console.log(Rooms[room]);
        if (!Rooms[room]) return user.send("Room doesn't exist, or I'm not in it");
        let self = Users[toId(Config.username)];
        if (self.rooms[room] != "*") return user.send("I'm not a bot in that room");
        if (!user.can(room, "%")) return user.send("Access denied.");
        let escape = require("escape-html");
        let msg = val.substring(args[0].length + 1).trim();
        if (Config.devs.indexOf(user.id) == -1) msg = escape(msg);
        let ret = `/addrankhtmlbox %,<b>${escape(user.rooms[room])}${
            user.name
        }:</b> ${msg}<br><span style='color:#444444;font-size:10px'>Note: Only users ranked % and above can see this.</span>`;
        Send(room, ret);
    },

    setrules: function (room, user, args, val) {
        if (!user.can(room, "%")) return;
        let command = toId(args.shift());
        if (!command) return room.send("Usage: ``.setrules [add/remove/ban/unban/clear], [args]``");
        if (!room.tournament) return room.send("There is no tournament running in this room.");
        console.log(room.tournament.rules);
        if (command === "add") {
            for (let i of args) {
                let rem = false;
                for (let x = 0; x < room.tournament.rules.remrules.length; x++) {
                    if (toId(room.tournament.rules.remrules[x]) === toId(i)) {
                        rem = true;
                        room.tournament.rules.remrules.splice(x, 1);
                    }
                }
                if (!rem) room.tournament.rules.addrules.push(i);
            }
        }
        if (command === "remove") {
            for (let i of args) {
                let rem = false;
                for (let x = 0; x < room.tournament.rules.addrules.length; x++) {
                    if (toId(room.tournament.rules.addrules[x]) === toId(i)) {
                        rem = true;
                        room.tournament.rules.addrules.splice(x, 1);
                    }
                }
                if (!rem) room.tournament.rules.remrules.push(i);
            }
        }
        if (command === "ban") {
            for (let i of args) {
                let rem = false;
                for (let x = 0; x < room.tournament.rules.unbans.length; x++) {
                    if (toId(room.tournament.rules.unbans[x]) === toId(i)) {
                        rem = true;
                        room.tournament.rules.unbans.splice(x, 1);
                    }
                }
                if (!rem) room.tournament.rules.bans.push(i);
            }
        }
        if (command === "unban") {
            for (let i of args) {
                let rem = false;
                for (let x = 0; x < room.tournament.rules.bans.length; x++) {
                    if (toId(room.tournament.rules.bans[x]) === toId(i)) {
                        rem = true;
                        room.tournament.rules.bans.splice(x, 1);
                    }
                }
                if (!rem) room.tournament.rules.unbans.push(i);
            }
        }
        if (command === "clear") {
            room.send("/tour clearrules");
            room.tournament.rules = {
                bans: [],
                unbans: [],
                addrules: [],
                remrules: [],
            };
        }

        room.updateTourRules();
    },
    // Dev stuff
    git: function (room, user, args) {
        let target = user.can(room, "+") ? room : user;
        if (!target) target = user;
        let msg = "No git url is configured for this bot.";
        if (Config.git) msg = Config.git;
        target.send(msg);
    },

    rl: "reload",
    reload: function (room, user, args) {
        if (!user.can(room, "all")) return;
        bot.emit("reload", args[0], room);
    },

    update: function (room, user, args) {
        if (!user.can(room, "all")) return;
        if (!Config.git) return room.say("No git url is configured for this bot.");
        const child_process = require("child_process");
        child_process.execSync("git pull " + Config.git + " master", {
            stdio: "inherit",
        });
        room.send("Code updated to the latest version.");
    },

    js: "eval",
    eval: function (room, user, args, val) {
        if (!user.can(room, "all")) return;
        if (!room) room = user;
        if (!val) return;
        try {
            let ret = eval(val);
            if (ret !== undefined) {
                ret = ret.toString();
                if (ret.indexOf("\n") !== -1) ret = "!code " + ret;
                room.send(JSON.stringify(ret));
            }
        } catch (e) {
            room.send(e.name + ": " + e.message);
        }
    },

    ping: function (room, user, args) {
        if (!user.can(room, "all")) return;
        if (!room) room = user;
        room.send("pong!");
    },

    join: "joinroom",
    joinroom: function (room, user, args) {
        if (!user.can(room, "all")) return;
        if (!args[0]) return user.send("No room given.");
        Send("", "/j " + args[0]);
    },

    disable: function (room, user, args) {
        if (!user.can(room, "all")) return;
        room.send("Commands disabled.");
        room.settings.disabled = true;
        room.saveSettings();
    },

    echo: {
        "": "help",
        help: function (room, user, args) {
            if (!user.can(room, "%") && room !== user) return;
            if (!Users.self.can(room, "*"))
                return room.send("Usage: ``.echo create, [time interval], [message interval], [message]``");
            let ret = `<details><summary><b>Echo</b></summary><hr>`;
            ret += `<b>- create:</b> <code>.echo create, [time interval], [message interval], [message]</code> - requires % @ # & ~<br>`;
            ret += `<b>- end:</b> <code>.echo end</code> - requires % @ # & ~`;
            ret += "</details>";
            room.send("/addhtmlbox " + ret);
        },
        create: "start",
        start: function (room, user, args) {
            if (!user.can(room, "%")) return;
            if (room.repeat) return room.send("An echo is already running");
            let time_interval = parseInt(args.shift());
            let msg_interval = parseInt(args.shift());
            let message = args.join(",");

            if (!message) return this.help(room, user, args);
            if (isNaN(time_interval) || time_interval < 30)
                return room.send("time interval has to be at least 30 minutes.");
            if (isNaN(msg_interval)) return room.send("message interval has to be a number");
            let repeat = {
                msgs: 0,
                last: Date.now(),
                mintime: time_interval,
                minmsg: msg_interval,
                message: message,
            };
            room.repeat = repeat;
            room.saveSettings();
            return room.send("Repeat started");
        },
        end: function (room, user, args) {
            if (!user.can(room, "%")) return;
            if (!room.repeat) return room.send("No echo is currently running");
            let msg = room.repeat.message;
            room.repeat = false;
            room.saveSettings();
            return room.send(`Echo "${msg}" ended.`);
        },
    },
    settings: {
        '': 'help',
        help: function(room, user, args) {
            let target = user.can(room, '#') ? room : user;
            target.send("Usage: ``.settings [target], [...options]``. Valid options: clear, mutebot, unmutebot, hellothere, autohidetext, tourmessages, nostaff")
        },
        checkPerms: function(room, user, args) {
            let targetroom = room;
            if (room === user) {
                targetroom = Rooms[toRoomId(args[0])];
            }
            if (!targetroom) {
                return true;
            }
            if (!user.can(targetroom, "#")) {
                if (room === user) user.send("You do not have permission to change settings in that room.");
                return false;
            }
            return targetroom;
        },
        clear: function(room, user, args) {
            let targetroom = this.checkPerms(room, user, args);
            if (targetroom === false) return;
            if (targetroom === true) return user.send("Usage: ``.settings " + cmd + ", [room]``");

            delete targetroom.settings.disabled;
            delete targetroom.settings.hellothere;
            delete targetroom.settings.OTobj; //obsolete anyway
            delete targetroom.settings.autohide;
            delete targetroom.settings.webhook;
            delete targetroom.settings.tourhook;
            delete targetroom.settings.announcedFormats;
            delete targetroom.settings.tourRooms;
            targetroom.saveSettings();
            return room.send("All settings cleared");
        },
        disable: "mutebot",
        unmutebot: "mutebot",
        mutebot: function(room, user, args, val, time, cmd) {
            let targetroom = this.checkPerms(room, user, args);
            if (targetroom === false) return;
            if (targetroom === true) return user.send("Usage: ``.settings " + cmd + ", [room]``");

            targetroom.settings.disabled = cmd != "unmutebot";
            targetroom.saveSettings();
            room.send(`Bot messages ${cmd === "unmutebot" ? "un" : ""}muted for room ${targetroom.id}`);
        },
        hellothere: function(room, user, args) {
            let targetroom = this.checkPerms(room, user, args);
            if (targetroom === false) return;
            if (targetroom === true) return user.send("Usage: ``.settings hellothere, [room], [on/off]``");
            if (targetroom.id === toRoomId(args[0])) args.shift();

            if (args.length != 1 || !["on", "off"].includes(toId(args[0]))) {
                if (room === user) return user.send("Usage: ``.settings hellothere, [room], [on/off]``");
                return room.send("Usage: ``.settings hellothere, [on/off]``");
            }

            targetroom.settings.hellothere = toId(args[0]) === "on";
            targetroom.saveSettings();
            room.send("Hello There auto-response turned " + toId(args[0]) + " for room " + targetroom.id);
        },
        autohide: "autohidetext",
        autohidetext: function(room, user, args, val, time, cmd) {
            let targetroom = this.checkPerms(room, user, args);
            if (targetroom === false) return;
            if (targetroom === true) return user.send("Usage: ``.settings " + cmd + ", [room], [on/off]``");
            if (targetroom.id === toRoomId(args[0])) args.shift();

            if (args.length != 1 || !["on", "off"].includes(toId(args[0]))) {
                if (room === user) return user.send("Usage: ``.settings " + cmd + ", [room], [on/off]``");
                return room.send("Usage: ``.settings " + cmd + ", [on/off]``");
            }

            targetroom.settings.autohide = toId(args[0]) === "on";
            targetroom.saveSettings();
            room.send("Hello There auto-response turned " + toId(args[0]) + " for room " + targetroom.id);
        },
        tourmessages: function(room, user, args, val, time, cmd) {
            let targetroom = this.checkPerms(room, user, args);
            if (targetroom === false) return;
            if (targetroom === true) return user.send("Usage: ``.settings tourmessages, [room], [addroom/addformat/removeroom/removeformat/list], [room/format]``");
            if (targetroom.id === toRoomId(args[0])) args.shift();

            if (args.length !== 2 && args[0] != "list") {
                return room.send("Usage: ``.settings tourmessages, [room], [addroom/addformat/removeroom/removeformat/list], [room/format/\"all\"]``");
            }

            if (toId(args[0]) === "addroom") {
                let roomid = toRoomId(args[1]);
                if (!Rooms[roomid] && roomid != "all") return user.send(`I can't help you with the room ${roomid} because I'm not in it.`);
                if (!targetroom.settings.tourRooms) targetroom.settings.tourRooms = [];
                targetroom.settings.tourRooms.push(roomid);
                targetroom.saveSettings();
                return user.send("Added the room successfully.")
            }

            if (toId(args[0]) === "removeroom") {
                let roomid = toRoomId(args[1]);
                if (!targetroom.settings.tourRooms) targetroom.settings.tourRooms = [];
                if (!targetroom.settings.tourRooms.includes(roomid)) return user.send(`The room ${roomid} already isn't set up, so I can't remove it.`);
                targetroom.settings.tourRooms.splice(targetroom.settings.tourRooms.indexOf(roomid), 1);
                targetroom.saveSettings();
                return user.send("Removed the room successfully.")
            }

            if (toId(args[0]) === "addformat") {
                let format = toId(args[1]);
                if (!Tournaments.formats[format] && format != "all") return user.send(`I can't help you with the format ${format} because I can't find it.`);
                if (!targetroom.settings.announcedFormats) targetroom.settings.announcedFormats = [];
                targetroom.settings.announcedFormats.push(format);
                targetroom.saveSettings();
                return user.send("Added the format successfully.")
            }

            if (toId(args[0]) === "removeformat") {
                let format = toId(args[1]);
                if (!targetroom.settings.announcedFormats) targetroom.settings.announcedFormats = [];
                if (!targetroom.settings.announcedFormats.includes(format)) return user.send(`The format ${format} already isn't set up, so I can't remove it.`);
                targetroom.settings.announcedFormats.splice(targetroom.settings.announcedFormats.indexOf(room), 1);
                targetroom.saveSettings();
                return user.send("Removed the format successfully.")
            }

            if (toId(args[0]) === "list") {
                let ret = `I will send a message to ${targetroom.id} if a tour is made in one of the following rooms:<br>`;
                ret += `${targetroom.settings.tourRooms ? targetroom.settings.tourRooms.join(", ") : ""}<br><br>`;
                ret += `in one of the following formats:<br>`;
                ret += `${targetroom.settings.announcedFormats ? targetroom.settings.announcedFormats.join(", ") : ""}`;
                targetroom.send(`/pminfobox ${user.id}, ${ret}`);
                return;
            }
        },
        nostaff: function(room, user, args, val, time, cmd) {
            let targetroom = this.checkPerms(room, user, args);
            if (targetroom === false) return;
            if (targetroom === true) return user.send("Please ask Felucia to set this up for you.");
            if (targetroom.id === toRoomId(args[0])) args.shift();
            if (!user.can(room, "all")) return user.send("Please ask Felucia to set this up for you.");
            

            targetroom.settings.webhook = args[0]
            targetroom.saveSettings();
            room.send("Webhook set for " + targetroom.id);
        },
    }
};

let files = FS.readdirSync("commands");
for (let f in files) {
    let file = files[f];
    if (file.substring(file.length - 3) !== ".js") continue;
    if (require.cache[require.resolve("./commands/" + file)])
        delete require.cache[require.resolve("./commands/" + file)];
    let contents = require("./commands/" + file);
    Object.assign(commands, contents);
}

module.exports = commands;
