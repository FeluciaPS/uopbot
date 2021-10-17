let colors = require("colors");
let events = require("events");
module.exports = logger = new events.EventEmitter();

let fill = function(str, len) {
    while (str.length < len) str += " ";
    return str;
}

logger.on("error", function (msg) {
    console.log(`[${"ERROR".red}] ${msg}`);
});

logger.on("cmd", (cmd, args) => {
    console.log(`[${cmd.blue}] ${args}`);
});

logger.on("log", (msg) => {
    console.log(`[${" MSG ".green}] ${msg}`);
});

logger.on("chat", (room, user, msg) => {
    if (msg.startsWith("/uhtml") || msg.startsWith("/raw")) return;
    let longestRoom = 0;
    for (let i in Rooms) {
        if (i == "add") continue;
        if (Rooms[i].name.length > longestRoom) longestRoom = Rooms[i].name.length;
    }
    let roompart = fill(Rooms[room].name, longestRoom);
    console.log(`${roompart} | ${fill(user.trim(), 20)} | ${msg.trim()}`);
});
