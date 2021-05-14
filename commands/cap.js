module.exports = {
    cap: {
        '': 'gen8',
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8cap', args);
        },
        gen7: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen7cap', args);
        },
        oras: 'gen6',
        gen6: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen6cap', args);
            room.send("/tour rules -Cawmodore, -Aurumoth");
        },
        gen5: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen5ou', args, '[Gen 5] CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC, -Cawmodore');
        },
        gen4: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen4ou', args, '[Gen 4] CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC, -Revenankh');
        },

        // OMs
        natdex: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8nationaldex', args, '[Gen 8] National Dex CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC');
        },
        '1v1': function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] CAP 1v1');
            room.send('/tour rules -All Pokemon, +CAP, +CAP NFE, +CAP LC');
        },
        aaa: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen7almostanyability', args, '[Gen 7] Almost Any Ability CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC');
        },
        bh: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8balancedhackmons', args, '[Gen 8] BH CAP');
            room.send('/tour rules -Ubers, +CAP, +CAP NFE, +CAP LC');
        },
        nfe: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8cap', args, '[Gen 8] CAP NFE');
            room.send("/tour rules Not Fully Evolved");
        },
        monotype: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8cap', args, '[Gen 8] Monotype CAP');
            room.send("/tour rules +darmanitan-galar, +Dracovish, +Urshifu, +Spectrier, +Blaziken, -Cawmodore, -Kartana, -Magearna, -Damp Rock, -Smooth Rock, -Terrain Extender")
        },
        inverse: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8cap', args, '[Gen 8] Inverse CAP');
            room.send('/tour rules Inverse Mod');
        },
        mnm: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8mixandmega', args, '[Gen 8] Mix and Mega CAP');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC');
        },
        stab: 'stabmons',
        stabmons: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8stabmons', args, '[Gen 8] STABmons CAP');
            room.send("/tour rules +CAP, +CAP NFE, +CAP LC");
        },
        uu: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8uu', args, '[Gen 8] CAP UU');
            room.send('/tour rules +CAP, +CAP NFE, +CAP LC, -Syclant, -Krilowatt, -Tomohawk, -Cawmodore, -Volkraken, Naviathan, -Kerfluffle, -Pajantom, -Jumbao, -Smokomodo, -Equilibra, -Astrolotl');
        },
        // other
        blitz: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8cap', args, '[Gen 8] Blitz CAP');
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
