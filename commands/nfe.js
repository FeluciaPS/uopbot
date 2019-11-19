global.NFE = {
    times: [ 1, 9, 15, 20 ],
    last: parseInt(require('fs').readFileSync("./data/lastnfe.txt")),
    official: function() {
        let room = Rooms['nfe'];
        let now = new Date(Date.now());
        if (this.last === -1) return;
        let next = (this.last + 1) % this.times.length;
        let mins = now.getMinutes();
        if (mins > 9) return;
        let hours = now.getHours();
        if (hours === this.times[next]) {
            if (room.tournament) {
                if (room.tournament.official) return;
                else {
                    room.send("/wall Official time. Ending ongoing tournament");
                    room.send("/tour end");
                }
            }
            require('fs').writeFileSync("./data/lastnfe.txt", next);
            this.last = next;
            room.send("/tour create nfe, elim")
            room.startTour("o");
        }
    }
}

let canMakeTour = function(room, user) {
    // I'm gonna use this a lot so why not make a function for it
    if (room != 'nfe') return false;
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
    nfe: {
        '': 'gen8',
        gen8: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nfe', args);
        },
        gen7: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7ou', args, '[Gen 7] NFE');
            room.send('/tour rules NFE Clause, -Chansey, -Doublade, -Gligar, -Golbat, -Gurdurr, -Magneton, -Piloswine, -Porygon2, -Rhydon, -Scyther, -Sneasel, -Type: Null, -Vigoroth, -Drought, -Aurora Veil');
        },
        oras: 'gen6',
        gen6: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen6ru', args, '[Gen 6] NFE');
            room.send('/tour rules NFE Clause, +UU, +OU, +UUBL, +RUBL, +NUBL, +PUBL, +PU, +Uber, -Chansey, -Doublade, -Fletchinder, -Gligar, -Golbat, -Gurdurr, -Haunter, -Machoke, -Magneton, -Piloswine, -Porygon2, -Rhydon, -Servine, -Scyther, -Sneasel, -Vigoroth');
        },
        gen5: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen5ubers', args, '[Gen 5] NFE');
            room.send('/tour rules NFE Clause, +NU, +RU, +UU, +OU, +UUBL, +RUBL, +NUBL, +PUBL, +PU, +Uber, -Chansey, -Dusclops, -Fraxure, -Gligar, -Golbat, -Gurdurr, -Haunter, -Machoke, -Magneton, -Riolu, -Rhydon, -Piloswine, -Porygon2, -Scyther, -Vigoroth');
        },
        gen4: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen4uu', args, '[Gen 4] NFE');
            room.send('/tour rules NFE Clause, +NU, +RU, +UU, +OU, +UUBL, +RUBL, +NUBL, +PUBL, +PU, +Uber, -Chansey, -Chansey, -Dragonair, -Dusclops, -Electabuzz, -Haunter, -Machoke, -Magmar, -Magneton, -Porygon2, -Rhydon, -Scyther, -Sneasel');
        },
        gen3: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen3ru', args, '[Gen 3] NFE');
            room.send('/tour rules NFE Clause');
        },
        // OMs
        '1v1': function(room, user, args) {
            Commands.nfe1v1(room, user, args);
        },
        aaa: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7almostanyability', args, '[Gen 7] Almost Any Ability NFE');
            room.send('/tour rules NFE Clause, -Chansey, -Gurdurr, -Piloswine, -Rhydon, -Scyther, -Sneasel, -Electabuzz');
        },
        bh: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7balancedhackmons', args, '[Gen 7] BH NFE');
            room.send('/tour rules NFE Clause, -Chansey, -Porygon 2, -Type: Null, -Shell Smash');
        },
        cap: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7nfe', args, '[Gen 7] CAP NFE');
            room.send("/tour rules +Doublade, +Magneton, +Piloswine, +Sneasel, +Type: Null, +Vigoroth, +CAP");
        },
        inverse: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7nfe', args, '[Gen 7] Inverse NFE');
            room.send('/tour rules Inverse Mod');
        },
        mnm: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7mixandmega', args, '[Gen 7] Mix and Mega NFE');
            room.send('/tour rules NFE Clause, -Gurdurr, -Piloswine');
            room.send('/wall The following pokemon are not allowed to mega-evolve, if your opponent uses them tell a staff member so they can be disqualified: Chansey, Rhydon, Scyther and Gligar');
        },
        stab: 'stabmons',
        stabmons: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7stabmons', args, '[Gen 7] STABmons NFE');
            room.send("/tour rules NFE Clause, -Chansey, -Haunter, -Yanma, -Dewpider, -King's Rock, -Razor Fang");
        },
        // other
        blitz: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7nfe', args, '[Gen 7] Blitz NFE');
            room.send('/tour rules Blitz');
            room.send('/tour forcetimer on');
        },
        help: function(room, user, args) {
            if (!user.can(room, '%')) return;
            room.send('Usage: ``.nfe [type]``.');
            let types = [];
            for (let i in Commands.nfe) {
                if (typeof Commands.nfe[i] !== 'string' && i !== 'help') types.push(i);
            }
            room.send('Valid types: ' + types.join(', '));
        },
        random: function(room, user, args) {
            if (!user.can(room, '%')) return;
            let types = [];
            for (let i in Commands.nfe) {
                if (typeof Commands.nfe[i] === 'string') continue;
                if (i === "help" || i === "random") continue;
                types.push(i);
            }
            Commands.nfe[Utils.select(types)](room, user, args);
        }
    },
    nfe1v1: function (room, user, args) {
        if (room.id === 'nfe') if (!user.can(room, '%')) return;
        else if (room.id === '1v1') if (!user.can(room, '%')) return;
        else return;
        
        let otherroom = room.id === "1v1" ? "nfe" : "1v1";
        otherroom = Rooms[otherroom];
        if (room.tournament) return room.send("A tournament is already going on");
        if (room.tourcool && !user.can(room, '%')) return room.send("Tours are on cooldown for now");
        checkGenerator(room, 'gen71v1', args, '[Gen 7] NFE 1v1');
        room.send("/tour rules NFE Clause, -Chansey, -Dusclops, -Magneton, -Porygon 2, -Type: Null");
        otherroom.send(`NFE 1v1 tournament in <<${room.id}>>`);
        if (args[0] === 'o' && user.can(room, '%')) room.startTour("o");
    },    
    tourcool: function (room, user, args, val) {
        if (!user.can(room, '%')) return;
        room.tourcool = true;
        let time = isNaN(parseInt(args[0])) ? 30*60*1000 : parseInt(args[0])*60*1000
        setTimeout(function(room) {
            room.tourcool = false;
        }, time, room);
        room.send("Tours are on cooldown for the next " + time/60000 + " minutes.");
    },
    board: function (room, user, args) {
        if (room.id !== "nfe") return;
        let pm = user.can(room, "%") ? room : user;
        pm.send('Leaderboards are temporarily out of order.');
    },
    forceend: function (room, user, args) {
        if (room.id !== 'nfe') return;
        if (!user.can(room, '%')) return;
        room.send("/tour end");
    }
}
