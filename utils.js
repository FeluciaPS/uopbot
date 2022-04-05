const DELAY = 120;
let queue = [];
let sendNext = function () {
    if (queue.length === 0) return;
    let message = queue.splice(0, 1);
    Connection.send(message);
    setTimeout(sendNext, DELAY);
};

let sendTimeout = null;
let qSend = function (data) {
    if (Array.isArray(data)) {
        for (const toSend of data) qSend(toSend);
        return;
    }
    if (sendTimeout) {
        queue.push(data);
        return;
    }
    Connection.send(data);
    sendTimeout = setTimeout(() => {
        sendTimeout = null;
        const toSend = queue.shift();
        if (toSend) qSend(toSend);
    }, DELAY);
};

exports.send = function (room, message) {
    qSend(room + "|" + message);
};

exports.sendpm = function (user, message) {
    qSend("|/w " + user + ", " + message);
};

exports.toId = function (ting) {
    return ("" + ting).toLowerCase().replace(/[^a-z0-9]+/g, "");
};

exports.toRoomId = function (ting) {
    return ("" + ting).toLowerCase().replace(/[^a-z0-9\-]+/g, "");
};

exports.getRoom = function (room) {
    return room.replace(">", "").replace("\n", "");
};

global.Ranks = {
    "~": 0,
    "&": 1,
    "#": 2,
    "@": 3,
    "%": 4,
    "*": 5,
    "+": 6,
    " ": 7,
    "!": 8,
};

exports.SplitMessage = function (message) {
    if (message.startsWith("```") && message.endsWith("```")) {
        message = message.slice(2, message.length - 2);
    }

    let a = message.startsWith(Config.char) ? message.split(" ")[0].substring(Config.char.length) : false;
    let b = message
        .substring(a.length + 2)
        .replace(/, /g, ",")
        .split(",");
    let c = message.substring(message.indexOf(" ") + 1);
    if (c.startsWith(" ")) c = c.substring(1);
    return [a, b, c];
};

exports.ObjectRename = function (object, oldkey, newkey) {
    if (oldkey !== newkey) {
        //console.log(object);
        Object.defineProperty(object, newkey, Object.getOwnPropertyDescriptor(object, oldkey));
        delete object[oldkey];
    }
};

exports.select = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

exports.clean = function (thing) {
    return thing.toString().replace(/\r\n/g, "\n");
};

String.prototype.capitalize = function () {
    let str = this.toLowerCase();
    return str.charAt(0).toUpperCase() + str.substring(1);
};

exports.canMakeTour = function (room, user) {
    // I'm gonna use this a lot so why not make a function for it
    if (!user.can(room, "%")) return false;
    if (room.tournament) {
        room.send("A tournament is already going on.");
        return false;
    }
    return true;
};

exports.checkGenerator = function (room, meta, args, tourname = "") {
    if (args && args[0]) {
        if (args[0].startsWith("rr")) {
            let count = parseInt(args[0].substring(2));
            if (count) room.send(`/tour create ${meta}, rr,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, rr,,, ${tourname}`);
        } else if (args[0].startsWith("e")) {
            let count = parseInt(args[0].substring(1));
            if (count) room.send(`/tour create ${meta}, elim,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
        } else {
            room.send(`/tour create ${meta}, elim,,, ${tourname}`);
        }
        if (toId(args[0]) === "o") room.startTour("o");
    } else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
    if (toId(args[1]) === "o") room.startTour({official: true});
};

exports.uploadToHastebin = function (toUpload, callback) {
    let https = require("https");
    if (typeof callback !== "function") return false;
    var reqOpts = {
        hostname: "pastie.io",
        method: "POST",
        path: "/documents",
    };

    var req = https.request(reqOpts, function (res) {
        res.on("data", function (chunk) {
            try {
                var filename = JSON.parse(chunk).key;
                callback("https://pastie.io/raw/" + filename);
            } catch (e) {
                if (typeof chunk === "string" && new RegExp("/^[^<]*<!DOCTYPE html>/").test(chunk)) {
                    callback("Cloudflare-related error uploading to Hastebin: " + e.message);
                } else {
                    callback("Unknown error uploading to Hastebin: " + e.message);
                }
            }
        });
    });
    req.on("error", function (e) {
        callback("Error uploading to Hastebin: " + e.message);
    });
    req.write(toUpload);
    req.end();
};
