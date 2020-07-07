let colors = require('colors');
let events = require('events');
module.exports = logger = new events.EventEmitter();

logger.on('error', function(msg) {
    console.log(`[${"ERROR".red}] ${msg}`);
});

logger.on('cmd', (cmd, args) => {
    console.log(`[${cmd.blue}] ${args}`);
});

logger.on('log', (msg) => {
    console.log(`[${" MSG ".green}] ${msg}`);
});

logger.on('chat', (room, user, msg) => {
    if (msg.startsWith('/uhtml') || msg.startsWith('/raw')) return;
    console.log(`[${Rooms[room].name}] ${user.trim()}: ${msg.trim()}`)
});
