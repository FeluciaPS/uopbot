global.CAP = {
    times: [2, 12, 18, 22],
    formats: ['gen8', 'gen8', 'gen8', 'gen8'],
    started: false,
    official: function () {
        let room = Rooms['capproject'];
        let now = new Date(Date.now());
        if (!this.times.includes(now.getHours())) return;
        if (this.started) return;
        let next = now.getHours();
        let mins = now.getMinutes();
        if (mins > 5) return;
        let hours = now.getHours();
        if (room.tournament) {
            if (room.tournament.official) return;
            else {
                room.send("/wall Official time. Ending ongoing tournament");
                room.send("/tour end");
                room.endTour();
            }
        }
        this.started = true;
        Commands['cap'][this.formats[this.times.indexOf(next)]](room, Users.staff, ["o"]);
        room.send('/wall Rules: https://pastebin.com/raw/Z3SgDjjL');
        setTimeout(() => {
            CAP.started = false
        }, 30 * 60 * 1000);
    }
}

let canMakeTour = function (room, user) {
    // I'm gonna use this a lot so why not make a function for it
    if (room != 'capproject') return false;
    if (!user.can(room, "%")) return false;
    if (room.tournament) {
        room.send("A tournament is already going on.");
        return false;
    }
    return true;
}

let checkGenerator = function (room, meta, args, tourname = '') {
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
            room.send(`/tour create ${meta}, elim,,, ${tourname}`)
        }
        if (toId(args[0]) === 'o') room.startTour('o');
    } else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
    if (toId(args[1]) === 'o') room.startTour('o');
}

module.exports = {
    cap: {
        '': 'gen8',
        gen8: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8cap', args);
        },
        gen7: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7cap', args);
        },
        oras: 'gen6',
        gen6: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen6cap', args);
        },
        gen5: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen5ou', args, '[Gen 5] CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC');
        },
        gen4: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen4ou', args, '[Gen 4] CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC');
        },

        // OMs
        natdex: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nationaldex', args, '[Gen 8] National Dex CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC');
        },
        '1v1': function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen81v1', args, '[Gen 8] CAP 1v1');
            room.send('/tour rules -All Pokemon, +CAP, +CAP NFE, +CAP LC');
        },
        aaa: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7almostanyability', args, '[Gen 7] Almost Any Ability CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC');
        },
        bh: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8balancedhackmons', args, '[Gen 8] BH CAP');
            room.send('/tour rules -Ubers, +CAP, +CAP NFE, +CAP LC');
        },
        nfe: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8cap', args, '[Gen 8] CAP NFE');
            room.send("/tour rules Not Fully Evolved");
        },
        inverse: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8cap', args, '[Gen 8] Inverse CAP');
            room.send('/tour rules Inverse Mod');
        },
        mnm: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8mixandmega', args, '[Gen 8] Mix and Mega CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC');
        },
        stab: 'stabmons',
        stabmons: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8stabmons', args, '[Gen 8] STABmons CAP');
            room.send("/tour rules +CAP, +CAP NFE, +CAP LC");
        },
        uu: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8uu', args, '[Gen 8] CAP UU');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC, -Syclant, -Krilowatt, -Tomohawk, -Cawmodore, -Volkraken, Naviathan, -Kerfluffle, -Pajantom, -Jumbao, -Smokomodo, -Equilibra, -Astrolotl');
        },
        // other
        blitz: function (room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8cap', args, '[Gen 8] Blitz CAP');
            room.send('/tour rules Blitz');
            room.send('/tour forcetimer on');
        },
        help: function (room, user, args) {
            if (!user.can(room, '%')) return;
            room.send('Usage: ``.cap [type]``.');
            let types = [];
            for (let i in Commands.cap) {
                if (typeof Commands.cap[i] !== 'string' && i !== 'help') types.push(i);
            }
            room.send('Valid types: ' + types.join(', '));
        },
        random: function (room, user, args) {
            if (!user.can(room, '%')) return;
            let types = [];
            for (let i in Commands.cap) {
                if (typeof Commands.cap[i] === 'string') continue;
                if (i === "help" || i === "random") continue;
                types.push(i);
            }
            Commands.cap[Utils.select(types)](room, user, args);
        }
    }
}