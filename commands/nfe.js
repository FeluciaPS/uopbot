global.NFE = {
    times: [ 1, 9, 15, 20 ],
    formats: [ 'gen8', 'gen8', 'gen8', 'gen8' ],
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
                    room.endTour();
                }
            }
            require('fs').writeFileSync("./data/lastnfe.txt", next);
            this.last = next;
            Commands['nfe']['gen8'](room, Users.staff, ["o"]);
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
            room.send('/tour rules Not Fully Evolved, -Chansey, -Doublade, -Gligar, -Golbat, -Gurdurr, -Magneton, -Piloswine, -Porygon2, -Rhydon, -Scyther, -Sneasel, -Type: Null, -Vigoroth, -Drought, -Aurora Veil');
        },
        oras: 'gen6',
        gen6: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen6ru', args, '[Gen 6] NFE');
            room.send('/tour rules Not Fully Evolved, +UU, +OU, +UUBL, +RUBL, +NUBL, +PUBL, +PU, +Uber, -Chansey, -Doublade, -Fletchinder, -Gligar, -Golbat, -Gurdurr, -Haunter, -Machoke, -Magneton, -Monferno, -Pawniard, -Piloswine, -Porygon2, -Rhydon, -Servine, -Scyther, -Sneasel, -Vigoroth');
        },
        gen5: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen5ubers', args, '[Gen 5] NFE');
            room.send('/tour rules Not Fully Evolved, -Chansey, -Dusclops, -Fraxure, -Gligar, -Golbat, -Gurdurr, -Haunter, -Machoke, -Magmar, -Magneton, -Riolu, -Rhydon, -Piloswine, -Porygon2, -Scyther, -Vigoroth');
        },
        gen4: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen4uu', args, '[Gen 4] NFE');
            room.send('/tour rules Not Fully Evolved, +NU, +RU, +UU, +OU, +UUBL, +RUBL, +NUBL, +PUBL, +PU, +Uber, -Chansey, -Dragonair, -Dusclops, -Electabuzz, -Haunter, -Machoke, -Magmar, -Magneton, -Porygon2, -Rhydon, -Scyther, -Sneasel');
        },
        //this is being rebooted after PL, will be unbanning most of the tier and retrying w more public push
        gen3: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen3nu', args, '[Gen 3] NFE');
            room.send('/tour rules Not Fully Evolved, -Abra, -Diglett, -Dragonair, -Golbat, -Haunter, -Metang, -Vigoroth, -Light Ball');
        },
        // OMs
        natdex: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nationaldex', args, '[Gen 8] National Dex NFE');
            room.send('/tour rules Not Fully Evolved, -Type: Null, -Chansey, -Rhydon, -Porygon 2, -Doublade');
        },
        '1v1': function(room, user, args) {
            Commands.nfe1v1(room, user, args);
        },
        aaa: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen7almostanyability', args, '[Gen 7] Almost Any Ability NFE');
            room.send('/tour rules Not Fully Evolved, -Chansey, -Gurdurr, -Piloswine, -Rhydon, -Scyther, -Sneasel, -Electabuzz');
        },
        ubers: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nfe', args, '[Gen 8] NFE Ubers');
            room.send('/tour rules +Doublade, +Gurdurr, +Ivysaur, +Mr. Mime-Galar, +Pawniard, +Rhydon, +Rufflet, +Sneasel, +Type: Null, !Dynamax Clause');
        },
        bh: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8balancedhackmons', args, '[Gen 8] BH NFE');
            room.send('/tour rules Not Fully Evolved, -Chansey, -Doublade, -Mr. Mime-Galar, -Porygon 2, -Raboot, -Sneasel, -Type: Null, -Fishious Rend, -Bolt Beak, -Light Ball, Dynamax Clause');
        },
        cap: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nfe', args, '[Gen 8] CAP NFE');
            room.send("/tour rules +Doublade, +Type: Null, +CAP NFE, +CAP LC");
        },
        inverse: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nfe', args, '[Gen 8] Inverse NFE');
            room.send('/tour rules Inverse Mod');
        },
        mnm: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8mixandmega', args, '[Gen 8] Mix and Mega NFE');
            room.send('/tour rules Not Fully Evolved');
            room.send('/wall The following pokemon are not allowed to mega-evolve, if your opponent uses them tell a staff member so they can be disqualified: Chansey, Doublade, Gurdurr, Haunter, Ivysaur, Magneton, Mr. Mime Galar, Pawniard, Porygon2, Rhydon, Rufflet, Scyther, Sneasel, Type:Null.');
        },
        stab: 'stabmons',
        stabmons: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8stabmons', args, '[Gen 8] STABmons NFE');
            room.send("/tour rules Not Fully Evolved, -Chansey, -Haunter, -Yanma, -Dewpider, -King's Rock, -Razor Fang");
        },
        camo: 'camomons',
        camomons: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nfe', args, '[Gen 8] Camomons NFE');
            room.send("/tour rules gen8camomons");
        },
        //putting this in oms bc i don't know where else to
        uu: 'NFE UU',
        uu: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nfe', args, '[Gen 8] NFE UU');
            room.send("/tour rules -Brionne, -Carkol, -Charjabug, -Clefairy, -Corsola-Galar, -Duosion, -Dusclops, -Ferroseed, -Hakamo-o, -Hattrem, -Kadabra, -Klang, -Lampent, -Linoone-Galar, -Machoke, -Mareanie, -Marill, -Palpitoad, -Pikachu, -Piloswine, -Raboot, -Roselia, -Slowpoke, -Tangela, -Thwackey, -Togetic, -Trapinch, -Vibrava, -Vullaby, -Wartortle");
            room.send("/wall Usage Stats used here: https://www.smogon.com/stats/2020-06-DLC1/gen8nfe-1630.txt");
        },
        // other
        blitz: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen8nfe', args, '[Gen 8] Blitz NFE');
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
        checkGenerator(room, 'gen81v1', args, '[Gen 8] NFE 1v1');
        room.send("/tour rules Not Fully Evolved, -Type: Null");
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
    forceend: function (room, user, args) {
        if (room.id !== 'nfe') return;
        if (!user.can(room, '%')) return;
        room.send("/tour end");
    }
}
