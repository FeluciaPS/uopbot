try {
    ("use strict");
    const child_process = require("child_process");

    try {
        require.resolve("websocket");
    } catch (e) {
        console.log("Installing dependencies...");
        child_process.execSync("npm install --production", {
            stdio: "inherit",
        });
    }

    // Event emitter
    let events = require("events");
    global.bot = new events.EventEmitter();
    global.logger = require("./logger.js");

    // Config
    global.FS = require("fs");
    if (!FS.existsSync('./config.js')) {
        global.Config = require("./config-example.js");
        logger.emit("error", "Config.js doesn't exist. Cloning from config-example.js...");
        FS.copyFile("config-example.js", "config.js", function () {});
    }
    else global.Config = require('./config.js');

    // Globals

    global.Utils = require("./utils.js");
    global.toId = Utils.toId;
    global.colors = require("colors");
    global.automod = require("./automod.js");
    global.Parse = require("./parser.js");
    global.Rooms = require("./Room.js");
    global.Users = require("./User.js");
    global.Tournament = require("./Tournament.js");
    global.Commands = require("./commands.js");
    global.Send = Utils.send;
    global.Sendpm = Utils.sendpm;
    global.Monitor = require("./monitor.js");
    global.Reminder = require("./Reminder.js");

    // Connect
    let psurl = "wss://sim.smogon.com/showdown/websocket";
    let WebSocketClient = require("websocket").client;
    let websocket = new WebSocketClient();
    websocket.connect(psurl);

    global.Connection = "";
    websocket.on("connect", function (connection) {
        Connection = connection;
        connection.on("message", function (message) {
            let data = message.utf8Data;
            let parts = data.split("|");
            if (toId(parts[1]) == "error") {
                console.log(data);
            } else bot.emit(toId(parts[1]), parts, data);
        });

        connection.on("close", function () {
            setTimeout(process.exit, 30 * 1000); // Force stayalive for 30 seconds
        });
        connection.on("connectFailed", function () {
            setTimeout(process.exit, 30 * 1000); // Force stayalive for 30 seconds
        });
    });

    let files = {
        logger: ["logger", "logger.js"],
        parser: ["Parse", "parser.js"],
        commands: ["Commands", "commands.js"],
        config: ["Config", "config.js"],
        utils: ["Utils", "utils.js"],
        rooms: ["Rooms", "Room.js"],
        users: ["Users", "User.js"],
    };

    bot.on("reload", (file, room) => {
        let all = file === "all";
        if (file === "parser" || all) {
            let events = bot.eventNames();
            for (let e in events) {
                let ev = events[e];
                if (ev === "reload") continue;
                bot.removeAllListeners(ev);
            }
        }
        for (let f in files) {
            if (file !== f && !all) continue;
            let dt = files[f];
            eval("delete require.cache[require.resolve('./" + dt[1] + "')];");
            eval(dt[0] + " = require('./" + dt[1] + "');");
            Send(room, f + " reloaded.");
        }
    });
} catch (e) {
    console.log(e);
    setTimeout(process.exit, 30000); // Bot cannot restart more than once every 30 seconds no matter what.
}
