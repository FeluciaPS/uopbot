const Timer = require('./Timer').Timer;

let checkOnlineStaff = function(room) {
    room = Rooms[room];
    if (!room) return;
    if (!room.settings.webhook) return;

    idlestaff = false;
    for (let user in room.users) {
        if ("#@%&".includes(Users[user].rooms[room.id])) {
            if (!Users[user].isIdle) return;
            idlestaff = true;
        }
    }

    if (!idlestaff && room.staffTimer === "nostaff") return;
    if (idlestaff && room.staffTimer === "idle") return;

    // Set staffTimer to either "idle" or "nostaff" depending on the state of the room
    if (idlestaff) room.staffTimer = "idle";
    else room.staffTimer = "nostaff";

    // no point notifying something we already know.
    if (room.staffTimer === room.onlineStaff) return;

    let time = 0;
    // increase or lower the timeout depending on if idle staff joined or left.
    if (room.stafftimeout) {
        let remaining = room.stafftimeout.getRemaining();
        remaining = remaining.minutes * 60 + remaining.seconds;
        if (idlestaff) remaining += 10*60;
        else remaining -= 10*60;
        room.stafftimeout.stop();
        time = remaining;
        if (time <= 0) time = 1;
    }

    let callback = function(room, type) {
        room.staffTimer = false;
        idlestaff = false;
        for (let user in room.users) {
            if ("#@%&".includes(Users[user].rooms[room.id])) {
                if (!Users[user].isIdle) return;
                idlestaff = true;
            }
        }

        if (type === "nostaff" && idlestaff) {
            room.stafftimeout = new Timer("10m", callback, room, type);
            room.stafftimeout.start();
            return;
        }
        let request = require('request');
        if (type === "nostaff") request({url:room.settings.webhook, body: {content:`There's not been any online staff for the past 5 minutes.`}, method:"POST", json:true});
        else request({url:room.settings.webhook, body: {content:`All online staff has been idle for the past 15 minutes.`}, method:"POST", json:true});
        room.onlineStaff = type;
    };

    room.stafftimeout = new Timer(time ? `${time}s` : `${idlestaff ? 15 : 5}m`, callback, room, room.staffTimer);
    room.stafftimeout.start();
}

bot.on("challstr", function (parts) {
    require("./login.js")(parts[2], parts[3]);
});

bot.on("updateuser", (parts) => {
    logger.emit("log", "Logged in as " + parts[2]);
    let skipnext = false;
    let found = false;
    for (let i of parts) {
        if (!found && i !== "formats") continue;
        if (!found && i === "formats") {
            found = true;
            continue;
        }
        if (skipnext) {
            skipnext = false;
            continue;
        }
        if (i.match(/,\d/)) {
            skipnext = true;
            continue;
        }

        let format = i.split(",")[0];
        Tournament.formats[toId(format)] = format;
    }
});

let natLangDict = {
    you: "Suspect Philosophy",
    me: "you",
    I: "you",
};

let lasthellothere = {
    nfe: 0,
    "1v1": 0,
};
bot.on("c", (parts) => {
    let room = Utils.getRoom(parts[0]);
    let user = Users[toId(parts[3])];
    if (!parts[4]) return;
    if (!user) {
        console.log(parts);
        return;
    }
    let message = parts[4].trim();
    for (let i in Rooms) {
        if (Rooms[i].tournament && !Rooms[i].tournament.started) Rooms[i].tournament.checkstart();
    }
    Rooms[room].runChecks(message);
    Reminder.check();
    Reminder.parse(user, Rooms[room], message);

    // Check if any official tours need starting
    Officials.official();

    // Continue as usual
    Monitor.monitor(user.name, message);
    logger.emit("chat", Utils.getRoom(parts[0]), user.name, message);
    if (message.startsWith("/log") && Rooms[room].settings.autohide) {
        if (message.includes("was muted by")) {
            let username = message.split(" was muted ")[0].split(" ").slice(1).join(" ");
            Rooms[room].send("/hidetext " + username);
        }
    }
    let time = parts[2];
    let [cmd, args, val] = Utils.SplitMessage(message);
    if (cmd in Commands) {
        if (typeof Commands[cmd] === "string") cmd = Commands[cmd];

        // Disabled commands cannot be used in the specified room
        if (Rooms[room].settings.disabledcommands && Rooms[room].settings.disabledcommands.includes(cmd)) return;

        let func = Commands[cmd];
        if (typeof func === "object") {
            let target = toId(args[0]);
            if (!target || !func[target]) {
                target = "";
                args = [""].concat(args);
            }
            if (target in func && typeof func[target] === "string") target = func[target];
            func = func[target];
            args.shift();
        }
        func(Rooms[room], user, args, val, time, cmd);
        logger.emit("cmd", cmd, val);
    }
});

bot.on("pm", (parts) => {
    let room = null;
    let user = Users[toId(parts[2])];
    let message = parts[4].trim();
    if (!user) {
        Users.add(parts[2]);
        user = Users[toId(parts[2])];
    } else logger.emit("pm", user.name, message); // Note: No PM handler exists for the logger.

    if (message.startsWith("/botmsg")) {
        // Yes it's a bot message
        var botmsg = true;

        // Remove "/botmsg " from the message
        message = message.substr(8);

        // Split and retrieve the room it was used in, this should be sent in ALL instances of /botmsg.
        let split = message.split(",");
        message = Config.char + split.slice(1).join(",").trim();

        // If the room exists, the command was used in a room, else it was used in PM.
        if (Rooms[split[0]]) room = Rooms[split[0]];
    }

    let [cmd, args, val] = Utils.SplitMessage(message);
    if (cmd in Commands) {
        if (typeof Commands[cmd] === "string") cmd = Commands[cmd];
        let func = Commands[cmd];
        if (typeof func === "object") {
            let target = toId(args[0]);
            if (!target || !func[target]) {
                target = "";
                args = [""].concat(args);
            }
            if (target in func && typeof func[target] === "string") target = func[target];
            func = func[target];
            args.shift();
        }
        func(room || user, user, args, val, false, cmd);
        logger.emit("cmd", cmd, val);
    }
    if (cmd === "tco" && user.id === "vrbot" && Rooms["1v1"])
        Rooms["1v1"].send("1v1 Type Challenge official tournament in <<1v1tc>>");
    Reminder.check();
    Reminder.parse(user, user, message);
});

bot.on("j", (parts) => {
    let room = Utils.getRoom(parts[0]);
    let p = parts[2].substring(1).split("@");
    let user = parts[2].substring(0, 1) + p[0];
    let idle = p[1] === "!";
    if (!Users[toId(user)]) Users.add(user, idle);
    Users[toId(user)].join(room, user);

    // Set a variable to tell the bot staff is online
    if ("%@#&".includes(parts[2].substring(0, 1))) {
        if (room.staffTimer === "idle" && Users[toId(user)].isIdle) return;
        Rooms[room].onlineStaff = false;
        room.staffTimer = false;
        if (room.stafftimeout) {
            room.stafftimeout.stop();
            room.stafftimeout = false;
        }
    }
});

bot.on("l", (parts) => {
    let room = Utils.getRoom(parts[0]);
    let p = parts[2].slice(1).split("@");
    let user = toId(p[0]);
    // This sometimes crashes when PS sends a message to the client that a Guest is leaving the room when the guest never joined the room in the first place which honestly makes no sense.
    if (Users[user]) Users[user].leave(room);
    else logger.emit("error", `${user} can't leave ${room}`);
    checkOnlineStaff(room);
});

bot.on("n", (parts) => {
    let room = Utils.getRoom(parts[0]);
    let oldname = parts[3];
    let p = parts[2].substring(1).split("@");
    let newname = p[0];
    try {
        Rooms[room].rename(oldname, parts[2].charAt(0) + newname, p[1] === "!");
    } catch (e) {
        console.log(e);
    }

    setTimeout(checkOnlineStaff, 100, room);

    // Set a variable to tell the bot staff is online
    if ("%@#&".includes(parts[2].substring(0, 1))) {
        if (room.staffTimer === "idle" && Users[toId(user)].isIdle) return;
        Rooms[room].onlineStaff = false;
        room.staffTimer = false;
        if (room.stafftimeout) {
            room.stafftimeout.stop();
            room.stafftimeout = false;
        }
    }
});

bot.on("deinit", (parts) => {
    let room = Utils.getRoom(parts[0]);
    if (Rooms[room]) Rooms[room].leave();
});

bot.on("raw", (parts) => {
    let room = Rooms[Utils.getRoom(parts[0])];
    let data = parts[2];
    console.log(true);
    if (!data.startsWith("<div class='infobox infobox-limited'>")) return;
    data = data.substring(37, data.length - 7);
    data = data.split("<br />");
    console.log(data[0]);
    if (data[0] !== "This tournament includes:") return;
    data.shift();
    console.log(true);
    for (let line of data) {
        let i = line.indexOf("-");
        let type = toId(line.substring(0, i).replace(/<[^>]+>/g, ""));
        let targets = line.substring(i + 2).split(",");
        for (let index in targets) {
            targets[index] = targets[index].trim();
        }
        switch (type) {
            case "addedbans":
                room.tournament.rules.bans = targets;
                break;
            case "removedbans":
                room.tournament.rules.unbans = targets;
                break;
            case "addedrules":
                room.tournament.rules.addrules = targets;
                break;
            case "removedrules":
                room.tournament.rules.remrules = targets;
                break;
        }
    }
});

let announceTours = function(room, format) {
    for (let roomid in Rooms) {
        if (roomid === "add") continue;
        let targetroom = Rooms[roomid];
        if (!targetroom.settings.announcedFormats) continue;
        if (
            !targetroom.settings.tourRooms || 
            !targetroom.settings.tourRooms.includes(room.id) && 
            !targetroom.settings.tourRooms.includes("all")
        ) {
            continue;
        }
        if (
            targetroom.settings.tourRooms.includes("all") && 
            !Config.rooms.includes(room.id)
        ) continue;
        let formatid = toId(format);
        if (targetroom.settings.announcedFormats.includes(formatid) || 
            targetroom.settings.announcedFormats.includes("all")) {
                let id = "secura-" + Math.floor(Math.random() * 100000);
                let msg = `/adduhtml ${id}, <div class="infobox"><a href="/${room.id}" class="ilink"><b>${format}</b> tournament in <b>${room.name}</b></a></div>`;
                room.tournament.notifications[roomid] = id;
                targetroom.send(msg);
        }
    }
}

bot.on("tournament", (parts, data) => {
    let room = Rooms[Utils.getRoom(parts[0])];
    let dt = data.split("\n");
    dt.shift();
    for (let line of dt) {
        parts = line.split("|");
        let type = parts[2];
        if (type === "create") {
            if (!room.tournament) room.startTour(false);
            room.tournament.format = Tournament.formats[parts[3]];
            //if (room.tournament.official) room.tournament.name = "Official " + room.tournament.format;
            let format = Tournament.formats[toId(parts[3])] ? Tournament.formats[toId(parts[3])] : parts[3];
            announceTours(room, format);
            if (parts[6]) room.tournament.updateName(parts[6]);
            /*if (room.id === "tournaments" && toId(parts[3]).match(/gen\dcap/gi))
                Rooms["capproject"].send(`${format} tournament in <<tours>>`);
            if (room.id === "toursplaza" && toId(parts[3]).match(/gen\dcap/gi))
                Rooms["capproject"].send(`${format} tournament in <<tp>>`);
            if (room.id === "tournaments" && parts[3].match(/\dv\d/))
                Rooms[parts[3].match(/\dv\d/)[0]].send(`${format} tournament in <<tours>>`);
            if (room.id === "toursplaza" && parts[3].match(/\dv\d/))
                Rooms[parts[3].match(/\dv\d/)[0]].send(`${format} tournament in <<tp>>`);
            if (room.id === "tournaments" && parts[3].indexOf("nfe") !== -1)
                Rooms["nfe"].send(`${format} tournament in <<tours>>`);
            if (room.id === "toursplaza" && parts[3].indexOf("nfe") !== -1)
                Rooms["nfe"].send(`${format} tournament in <<tp>>`);*/
        }
        if (type === "end" || type === "forceend") room.endTour(parts[3]);
        if (type === "update") {
            let data = JSON.parse(parts[3]);
            if (data.isStarted) {
                room.tournament.start();
                return;
            }
            if (!data.format) return;
            try {
                if (room.tournament.official && room.tournament.officialname) {
                    if (data.format in Tournament.formats) {
                        room.tournament.updateName(Tournament.formats[data.format]);
                        if (!room.tournament.name.startsWith("Official"))
                            room.send(`/tour name Official ${room.tournament.name}`);
                    } else {
                        room.tournament.updateName(data.format);
                        if (!room.tournament.name.startsWith("Official"))
                            room.send(`/tour name Official ${room.tournament.name}`);
                    }
                } else {
                    if (data.format in Tournament.formats) room.tournament.updateName(Tournament.formats[data.format]);
                    else room.tournament.updateName(data.format);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        if (type === "join") {
            room.tournament.players[toId(parts[3])] = true;
        }
        if (type === "leave") {
            delete room.tournament.players[toId(parts[3])];
        }
        if (type === "autostart") {
            if (parts[3] === "off") room.tournament.setAutostart(false);
            else room.tournament.setAutostart(parseInt(parts[4]));
        }
        if (type === "start") room.tournament.start();
    }
});

bot.on("dereg", (type, name) => {
    if (type === "user") {
        delete Users[name];
    } else if (type === "room") {
        delete Rooms[name];
    } else logger.emit("error", "Invalid dereg type: " + type);
});

bot.on("init", (parts, data) => {
    let room = Utils.getRoom(parts[0]);
    logger.emit("log", "Joined " + room);
    Rooms.add(room);
    parts = data.split("\n");
    for (let l in parts) {
        let line = parts[l];
        let part = line.split("|");
        if (part[1] === "title") Rooms[room].name = part[2];
        if (part[1] === "users") {
            let users = part[2].split(",");
            for (let i in users) {
                let user = users[i];
                user = user.substring(0, 1) + user.substring(1).split("@")[0];
                if (i == 0) continue;
                if (!Users[toId(user)]) Users.add(user);
                Users[toId(user)].join(room, user);
                Users[toId(user)].isIdle = user.substring(1).split("@")[1] === "!";
            }
        }
        if (part[1] === "tournament") {
            if (part[2] === "end" || part[1] === "forceend") {
                Rooms[room].endTour(part[2] === "end" ? part[3] : part[2]);
            } else {
                if (!Rooms[room].tournament) Rooms[room].startTour("late");
            }
        }
    }
});

module.exports = {
    cmd: function (room, user, message) {
        let [cmd, args, val] = Utils.SplitMessage(message);
        if (cmd in Commands) {
            if (typeof Commands[cmd] === "string") cmd = Commands[cmd];
            Commands[cmd](Rooms[room], user, args, val);
            logger.emit("fakecmd", cmd, val);
        }
    },
};
