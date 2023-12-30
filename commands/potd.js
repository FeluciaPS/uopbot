const Clock = require('../EventClock');

let potd = {};

let selectPotd = function(room) {
    let banlist = banlists[room].gen9;
    
    let keys = Object.keys(PokeDex).filter(key => {
        let dex = PokeDex[key];
        if (!fdata[key]) console.log(key);
        if (!fdata[key] || fdata[key].isNonStandard) return false;
        if (Object.values(dex.baseStats).reduce((partialSum, a) => partialSum + a, 0) < 420) return false;
        if (banlist.includes(dex.name) || (dex.baseSpecies && banlist.includes(dex.baseSpecies))) return false;
        return true;
    });

    let selectedPOTD = Utils.select(keys);

    potd[room] = selectedPOTD;
}

Clock.on('minute', (timestamp) => {
    console.log(`Minute event fired ${timestamp}`);
})

module.exports = {
    potd: function(room, user, args) {
        if (!user.can(room, '+')) return;

        if (!potd['1v1']) selectPotd('1v1');
        user.send(`The POTD is ${potd['1v1']}`);
    }
}