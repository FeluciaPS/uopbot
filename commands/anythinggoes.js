global.OTAG = {
    schedule: [ 
        ["natdex"],
        ["natdex"],
        ["gen7"],
        ["galar"],
        ["gen6"],
        ["natdex"],
        ["gen7"],
    ],
    times: [18],
    official: function() {
        let room = Rooms['anythinggoes'];
        let now = new Date(Date.now());
        let day = now.getDay();
        if (!this.times.includes(now.getHours())) return;
        if (now.getMinutes() > 5) return;
        let nextid = OTAG.times.indexOf(now.getHours());
        if (this.hasStarted) return;
        if (room.tournament) {
            if (room.tournament.official) return;
            else {
                room.send("/wall Official time. Ending ongoing tournament");
                room.send("/tour end");
                room.endTour();
            }
        }
        let type = this.schedule[day][nextid];
        room.send('/modnote OFFICIAL: ' + type);
        this.hasStarted = true;
        Commands['ag'][type](room, Users.staff, ["o"]);
        setTimeout(() => {OTAG.hasStarted = false}, 30*1000*60);
    }
}

let canMakeTour = function(room, user) {
    // I'm gonna use this a lot so why not make a function for it
    if (room != 'anythinggoes') return false;
    if (!user.can(room, "%")) return false;
    if (room.tournament) {
        room.send("A tournament is already going on.");
        return false;
    }
    return true;
}

let checkGenerator = function(room, meta, args, tourname = '') {
    if (args && args[0]) {
        if (args[0].startsWith("rr")) {
            let count = parseInt(args[0].substring(2));
            if (count) room.send(`/tour create ${meta}, rr,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, rr,,, ${tourname}`);
        }
        else if (args[0].startsWith("e")){
            let count = parseInt(args[0].substring(1));
            if (count) room.send(`/tour create ${meta}, elim,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
        }
        else {
            room.send(`/tour create ${meta}, elim,,, ${tourname}`)
        }
        if (toId(args[0]) === 'o') room.startTour('o');
    }
    else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
    if (toId(args[1]) === 'o') room.startTour('o');
}

module.exports = {
    ag: {
        '': 'natdex',
        natdex: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nationaldexag', args);
        },
        galar: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8anythinggoes', args);
        },
        usum: 'gen7',
        gen7: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7anythinggoes', args);
        },
        oras: 'gen6',
        gen6: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen6anythinggoes', args);
        },
        inverse: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'nationaldexag', args, '[NatDex] Inverse AG');
            room.send('/tour rules Inverse Mod');
        },
        monotype: 'mono',
        mono: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'nationaldexag', args, '[NatDex] Monotype AG');
            room.send('/tour rules Same Type Clause');
        },
        help: function(room, user, args) {
            if (!user.can(room, '%')) return;
            room.send('Usage: ``.ag [type]``.');
            let types = [];
            for (let i in Commands['ag']) {
                if (typeof Commands['ag'][i] !== 'string' && i !== 'help') types.push(i);
            }
            room.send('Valid types: ' + types.join(', '));
        },
        random: function(room, user, args) {
            if (!user.can(room, '%')) return;
            let types = [];
            for (let i in Commands['ag']) {
                if (typeof Commands['ag'][i] !== 'string' && i !== 'help' && i !== 'random' && i !== 'chill') types.push(i);
            }
            Commands['ag'][Utils.select(types)](room, user, args);
        }
    }
};
