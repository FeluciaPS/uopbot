let moncountrule = ''
global.OT2v2 = {
    schedule: [ 
        ["gen8", "gen6", "gen8"],
        ["gen5", "gen8", "gen8"],
        ["gen8", "gen8", "gen7"],
        ["gen6", "gen8", "gen8"],
        ["gen8", "gen8", "gen5"],
        ["gen8", "gen7", "gen8"],
        ["gen8", "gen8", "gen8"],
    ],
    times: [2, 10, 18],
    official: function() {
        let room = Rooms['2v2'];
        let now = new Date(Date.now());
        let day = now.getDay();
        if (!this.times.includes(now.getHours())) return;
        if (now.getMinutes() > 5) return;
        let nextid = OT2v2.times.indexOf(now.getHours());
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
        Commands['2v2'][type](room, Users.staff, ["o"]);
        setTimeout(() => {OT2v2.hasStarted = false}, 30*1000*60);
    }
}

let canMakeTour = function(room, user) {
    // I'm gonna use this a lot so why not make a function for it
    if (room != '2v2') return false;
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
    '2v2': {
        '': 'gen8',
        gen8: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen82v2doubles', args);
        },
        gen7: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7doublesou', args, '[Gen 7] 2v2 Doubles');
            room.send('/tour rules Two vs Two, Accuracy Moves Clause, Z-Move Clause, +Gengar-Mega, -Kangaskhan-Mega, -Salamence-Mega, -Final Gambit, -Focus Sash, -Tapu Lele, -Perish Song' + moncountrule);
        },
        oras: 'gen6',
        gen6: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen6doublesou', args, '[Gen 6] 2v2 Doubles');
            room.send('/tour rules Two vs Two, -Perish Song, -Focus Sash, -Kangaskhan-Mega' + moncountrule);
        },
        bw: 'gen5',
        gen5: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen5doublesou', args, '[Gen 5] 2v2 Doubles');
            room.send('/tour rules Two vs Two, -Perish Song, -Focus Sash' + moncountrule);
        },
        dp: 'gen4',
        gen4: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen4doublesou', args, '[Gen 4] 2v2 Doubles');
            room.send('/tour rules Two vs Two, -Perish Song, -Focus Sash' + moncountrule);
        },
        inverse: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen82v2doubles', args, '[Gen 8] Inverse 2v2');
            room.send('/tour rules Inverse Mod');
        },
        monotype: 'mono',
        mono: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen82v2doubles', args, '[Gen 8] Monotype 2v2');
            room.send('/tour rules Same Type Clause');
        },
        chill: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen82v2doubles', args);
            room.startTour('chill');
        },
        help: function(room, user, args) {
            if (!user.can(room, '%')) return;
            room.send('Usage: ``.2v2 [type]``.');
            let types = [];
            for (let i in Commands['2v2']) {
                if (typeof Commands['2v2'][i] !== 'string' && i !== 'help') types.push(i);
            }
            room.send('Valid types: ' + types.join(', '));
        },
        random: function(room, user, args) {
            if (!user.can(room, '%')) return;
            let types = [];
            for (let i in Commands['2v2']) {
                if (typeof Commands['2v2'][i] !== 'string' && i !== 'help' && i !== 'random' && i !== 'chill') types.push(i);
            }
            Commands['2v2'][Utils.select(types)](room, user, args);
        }
    }
};
