module.exports = {
    nfe: {
        '': 'gen8',
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8nfe', args);
        },
        gen7: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen7ou', args, '[Gen 7] NFE');
            room.send('/tour rules Not Fully Evolved, -Chansey, -Doublade, -Gligar, -Golbat, -Gurdurr, -Magneton, -Piloswine, -Porygon2, -Rhydon, -Scyther, -Sneasel, -Type: Null, -Vigoroth, -Drought, -Aurora Veil');
        },
        oras: 'gen6',
        gen6: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen6ru', args, '[Gen 6] NFE');
            room.send('/tour rules Not Fully Evolved, +All Pokemon, -Chansey, -Doublade, -Magneton, -Porygon2, -Rhydon, -Scyther, -Arena Trap, -Drought, -Moody, -Shadow Tag, -Swagger, -Baton Pass');
        },
        gen5: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen5ubers', args, '[Gen 5] NFE');
            room.send('/tour rules Not Fully Evolved, -Chansey, -Dusclops, -Fraxure, -Gligar, -Golbat, -Gurdurr, -Haunter, -Machoke, -Magmar, -Magneton, -Riolu, -Rhydon, -Piloswine, -Porygon2, -Scyther, -Vigoroth');
        },
        gen4: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen4uu', args, '[Gen 4] NFE');
            room.send('/tour rules Not Fully Evolved, +NU, +RU, +UU, +OU, +UUBL, +RUBL, +NUBL, +PUBL, +PU, +Uber, -Chansey, -Dragonair, -Dusclops, -Electabuzz, -Haunter, -Machoke, -Magmar, -Magneton, -Porygon2, -Rhydon, -Scyther, -Sneasel');
        },
        gen3: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen3nu', args, '[Gen 3] NFE');
            room.send('/tour rules Not Fully Evolved, -Abra, -Diglett, -Dragonair, -Golbat, -Haunter, -Metang, -Vigoroth, -Light Ball');
        },
        // OMs
        natdex: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8nationaldex', args, '[Gen 8] National Dex NFE');
            room.send('/tour rules Not Fully Evolved, -Type: Null, -Chansey, -Rhydon, -Porygon 2, -Doublade');
        },
        '1v1': function (room, user, args) {
            Commands.nfe1v1(room, user, args);
        },
        aaa: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen7almostanyability', args, '[Gen 7] Almost Any Ability NFE');
            room.send('/tour rules Not Fully Evolved, -Chansey, -Gurdurr, -Piloswine, -Rhydon, -Scyther, -Sneasel, -Electabuzz');
        },
        ubers: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8nfe', args, '[Gen 8] NFE Ubers');
            room.send('/tour rules +Doublade, +Gurdurr, +Ivysaur, +Mr. Mime-Galar, +Pawniard, +Rhydon, +Rufflet, +Sneasel, +Type: Null, !Dynamax Clause');
        },
        bh: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8balancedhackmons', args, '[Gen 7] BH NFE');
            room.send('/tour rules Not Fully Evolved, -Chansey, -Porygon 2, -Type: Null, -Shell Smash');
        },
        cap: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8nfe', args, '[Gen 8] CAP NFE');
            room.send("/tour rules +Doublade, +Type: Null, +CAP NFE, +CAP LC");
        },
        uu: function(room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8nfe', args, '[Gen 8] NFE UU');
            room.send('/tour rules -Thwackey, -Gurdurr, -Electabuzz, -Piloswine, -Golbat, -Raboot, -Kadabra, -Pikachu, -Clefairy, -Wartortle, -Tangela, -Hattrem, -Corsola-Galar, -Magmar, -Carkol, -Togetic, -Gabite, -Mr. Mime-Galar, -Dusclops, -Klang, -Charjabug, -Mareanie, -Ferroseed, -Slowpoke, -Marshtomp, -Fraxure, -Lampent, -Krokorok');
            room.send('/tour autostart 10');
            room.send('.exclude');
        },
        inverse: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8nfe', args, '[Gen 8] Inverse NFE');
            room.send('/tour rules Inverse Mod');
        },
        mnm: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen7mixandmega', args, '[Gen 7] Mix and Mega NFE');
            room.send('/tour rules Not Fully Evolved, -Gurdurr, -Piloswine');
            room.send('/wall The following pokemon are not allowed to mega-evolve, if your opponent uses them tell a staff member so they can be disqualified: Chansey, Rhydon, Scyther and Gligar');
        },
        stab: 'stabmons',
        stabmons: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen7stabmons', args, '[Gen 7] STABmons NFE');
            room.send("/tour rules Not Fully Evolved, -Chansey, -Haunter, -Yanma, -Dewpider, -King's Rock, -Razor Fang");
        },
        // other
        blitz: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8nfe', args, '[Gen 8] Blitz NFE');
            room.send('/tour rules Blitz');
            room.send('/tour forcetimer on');
        },
        help: function (room, user, args) {
            if (!user.can(room, '%')) return;
            room.send('Usage: ``.nfe [type]``.');
            let types = [];
            for (let i in Commands.nfe) {
                if (typeof Commands.nfe[i] !== 'string' && i !== 'help') types.push(i);
            }
            room.send('Valid types: ' + types.join(', '));
        },
        random: function (room, user, args) {
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
        if (room.id === 'nfe')
            if (!user.can(room, '%')) return;
            else if (room.id === '1v1')
            if (!user.can(room, '%')) return;
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
        let time = isNaN(parseInt(args[0])) ? 30 * 60 * 1000 : parseInt(args[0]) * 60 * 1000
        setTimeout(function (room) {
            room.tourcool = false;
        }, time, room);
        room.send("Tours are on cooldown for the next " + time / 60000 + " minutes.");
    },
    forceend: function (room, user, args) {
        if (room.id !== 'nfe') return;
        if (!user.can(room, '%')) return;
        room.send("/tour end");
    }
}
