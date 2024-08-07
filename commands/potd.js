const Clock = require('../EventClock');

let potd = {};

let buildPotdBox = function(room) {
    if (!room.id) room = Rooms[toId(room)];

    let potd = room.settings.potd;
    let mondata = PokeDex[potd];
    //let iconURL = `https://play.pokemonshowdown.com/sprites/ani/${mondata.name.toLowerCase().replace(/\s/g, '')}.gif`;
    let iconURL = `https://chiy.uk/256/${mondata.name.toLowerCase().replace(/\s/g, '%20')}`;
    let name = mondata.name;
    let box = ``
        + `<center>`
        + `<div style="width: 400px; position:relative; height: 192px">`
        + `<div style="width:128px; height:192px; background-image: url(${iconURL}); background-size: 160px;`
        + ` background-position: center; background-repeat: no-repeat; position:absolute; left: 16px">`
        + `</div>`
        + `<div style="position:absolute; right:16px; width:240px; padding-top:24px">`
        + `The <b>Pokémon of the Day</b> is <b>${name}.</b><hr>`
        + `Use this opportunity to use ${name} on ladder, build sets with the community, and participate in the two `
        + `<b>Monopoke ${name}</b> tournaments today, at Noon and Midnight UTC-5. `
        + `Use <code>/servertime</code> to see the current time.</div></div></center>`

    return box;
}

let selectPotd = function(room, replace = false) {
    // For now this'll do
    if (!Rooms[room] || !banlists[room]) return;
    let roomobj = Rooms[room];
    let banlist = banlists[room].gen9;
    
    let keys = Object.keys(PokeDex).filter(key => {
        if (key === "ditto") return true;
        let dex = PokeDex[key];
        if (!fdata[key] || fdata[key].isNonstandard) return false;
        if (Object.values(dex.baseStats).reduce((partialSum, a) => partialSum + a, 0) < 420) return false;
        if (banlist.includes(dex.name) || (dex.baseSpecies && banlist.includes(dex.baseSpecies))) return false;
        return true;
    });

    if (!roomobj.settings.potdhistory) roomobj.settings.potdhistory = [];

    let selectedPOTD = Utils.select(keys);
    while (roomobj.settings.potdhistory.includes(selectedPOTD)) selectedPOTD = Utils.select(keys);
    
    roomobj.settings.potd = selectedPOTD;
    if (!replace) {
        if (roomobj.settings.potdhistory.length == 7) roomobj.settings.potdhistory.shift();
        roomobj.settings.potdhistory.push(selectedPOTD);
    }
    else {
        roomobj.settings.potdhistory[roomobj.settings.potdhistory.length - 1] = selectedPOTD;
    }
    roomobj.saveSettings();

    if (Users.felucia) Users.felucia.send('The new POTD is ' + selectedPOTD);
}

Clock.on('day', (timestamp) => {
    selectPotd('1v1');
})

Clock.on('hour-half', (timestamp) => {
    if (timestamp.getHours() % 5 != 0 || timestamp.getMinutes() != 30) return;

    // Slightly delay to ensure a new POTD is picked before we trigger displaying it.
    setTimeout(() => {
        Rooms['1v1'].send(`/adduhtml potd, ${buildPotdBox('1v1')}`);
    }, 1000)
})

module.exports = {
    potd: {
        '': function(room, user, args) {
            if (!user.can(room, '+')) return;

            if (!Rooms['1v1'].settings.potd) return user.send("No potd selected. Did the bot restart or crash...?");
            if (room === user) {
                return user.send(`The POTD is ${Rooms['1v1'].settings.potd}`);
            }
            if (room.id === "1v1") {
                return room.send(`/adduhtml potd, ${buildPotdBox('1v1')}`)
            }
        },
        monopoke: function(room, user, args) {
            if (room.id !== '1v1') return;
            Commands.monopoke[""](room, user, [room.settings.potd]);
            Commands.potd[""](room, user, []);
        },
        set: function(room, user, args) {
            if (!user.can(Rooms['1v1'], '#')) return;
            selectPotd('1v1', true);
        }
    }
}