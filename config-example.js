/*
 * User details
 */

exports.username = "";
exports.password = "";

/*
 * Other
 */

// Please use full room names, and not aliases. Some code relies on these arrays.
exports.rooms = [];

// Hidden rooms that shouldn't be leaked.
exports.privaterooms = [...exports.rooms];

// Command char
exports.char = ".";

// Devs are big important people be careful who you add here
exports.devs = [];

// Git
exports.git = "";

// I don't remember what this variable does but the bot crashes if it doesn't exist
exports.tours = {};

// YouTube room webhook
exports.youtubehook = "";

/*
 * Mail
 */

exports.mail = {
    inboxSize: 5,
    bans: [],
};
