let buildRuleset = function (meta) {
    let banlist = Banlist[meta];
    let ret = '/tour rules ';
    let rules = [];
    for (let x of banlist.addrules) rules.push(x);
    for (let x of banlist.remrules) rules.push(`!${x}`);
    for (let x of banlist.bans) rules.push(`-${x}`);
    for (let x of banlist.unbans) rules.push(`+${x}`);
    return ret + rules.join(', ');
}

let findPMRoom = function (user) {
    for (let i in Rooms) {
        if (!Users.self.can(Rooms[i], '*')) continue;
        if (Rooms[i].users[user]) return Rooms[i];
    }
    return false;
}

global.getGen = function (mon) {
    if (mon.num < 1) return 0;
    if (mon.num >= 810 || ['Gmax', 'Galar', 'Galar-Zen'].includes(mon.forme)) {
        return 8;
    } else if (mon.num >= 722 || (mon.forme && mon.forme.startsWith('Alola')) || mon.forme === 'Starter') {
        return 7;
    } else if (mon.forme === 'Primal') {
        return 6;
    } else if (mon.num >= 650 || (mon.forme && mon.forme.startsWith("Mega"))) {
        return 6;
    } else if (mon.num >= 494) {
        return 5;
    } else if (mon.num >= 387) {
        return 4;
    } else if (mon.num >= 252) {
        return 3;
    } else if (mon.num >= 152) {
        return 2;
    } else {
        return 1;
    }
}
let inspireMe = function (arg) {
    let banlist = [
        "Eternatus", "Jirachi", "Kyurem-Black", "Kyurem-White", "Lunala", "Marshadow",
        "Melmetal", "Mew", "Mewtwo", "Mimikyu", "Necrozma", "Necrozma-Dawn-Wings",
        "Necrozma-Dusk-Mane", "Reshiram", "Sableye", "Solgaleo", "Zacian", "Zamazenta", "Zekrom"
    ]
    let gen = 8;
    if (['sm', 'usum', '7', 'gen7'].includes(arg)) {
        banlist = [
            "Arceus", "Darkrai", "Deoxys-Base", "Deoxys-Attack", "Deoxys-Defense", "Dialga",
            "Giratina", "Groudon", "Ho-Oh", "Kangaskhan-Mega", "Kyogre", "Kyurem-Black",
            "Kyurem-White", "Lugia", "Lunala", "Marshadow", "Mewtwo", "Mimikyu", "Necrozma-Dawn-Wings",
            "Necrozma-Dusk-Mane", "Palkia", "Rayquaza", "Reshiram", "Salamence-Mega", "Shaymin-Sky",
            "Snorlax", "Solgaleo", "Tapu Koko", "Xerneas", "Yveltal", "Zekrom"
        ]
        gen = 7;
    }
    if (['xy', 'oras', '6', 'gen6'].includes(arg)) {
        banlist = [
            "Arceus", "Blaziken", "Darkrai", "Deoxys-Base", "Deoxys-Attack", "Deoxys-Defense",
            "Dialga", "Giratina", "Groudon", "Ho-Oh", "Kangaskhan-Mega", "Kyogre", "Kyurem-White",
            "Lugia", "Mewtwo", "Palkia", "Rayquaza", "Reshiram", "Salamence-Mega", "Shaymin-Sky",
            "Xerneas", "Yveltal", "Zekrom"
        ]
        gen = 6;
    }
    if (['bw', 'bw2', 'b2w2', '5', 'gen5'].includes(arg)) {
        banlist = [
            "Arceus", "Blaziken", "Darkrai", "Deoxys", "Dialga", "Giratina", "Groudon", "Ho-Oh",
            "Kyogre", "Kyurem-White", "Lugia", "Mewtwo", "Palkia", "Rayquaza", "Reshiram", "Shaymin-Sky",
            "Whimsicott", "Zekrom"
        ]
        gen = 5;
    }
    if (['dp', 'dpp', 'dppt', '4', 'gen4'].includes(arg)) {
        banlist = [
            "Latias", "Arceus", "Darkrai", "Deoxys", "Dialga", "Garchomp", "Giratina", "Groudon",
            "Ho-oh", "Kyogre", "Latios", "Lugia", "Manaphy", "Mew", "Mewtwo", "Palkia",
            "Porygon-Z", "Rayquaza", "Salamence", "Shaymin-Sky"
        ]
        gen = 4
    }
    if (['adv', 'rse', 'rs', '3', 'gen3'].includes(arg)) {
        banlist = [
            "Slaking", "Deoxys", "Deoxys-Attack", "Deoxys-Defense", "Deoxys-Speed",
            "Groudon", "Ho-Oh", "Kyogre", "Latias", "Latios", "Lugia", "Mew", "Mewtwo",
            "Rayquaza", "Snorlax", "Suicune", "Wobbuffet", "Wynaut"
        ]
        gen = 3
    }
    let valid = [];
    for (let i in PokeDex) {
        let entry = PokeDex[i];
        entry.gen = getGen(entry);
        if (!entry.gen) continue;
        if (entry.gen > gen) continue;
        if (banlist.includes(entry.name)) continue;
        if (entry.baseSpecies && banlist.includes(entry.baseSpecies.name)) continue;
        if (gen === 8 && fdata[i] && fdata[i].isNonstandard === "Past") continue;
        let n = 0;
        for (let s in entry.baseStats) n += entry.baseStats[s];
        if (n < 420) continue;
        valid.push(entry.name);
    }

    let n = [];
    let b = [];
    while (n.length < 3) {
        let rand = Math.floor(Math.random() * valid.length);
        if (n.includes(valid[rand])) continue;
        if (valid[rand].baseSpecies && b.includes(valid[rand].baseSpecies.name)) continue;
        n.push(valid[rand]);
        if (valid[rand].baseSpecies) b.push(valid[rand].baseSpecies.name)
    }
    let ret = [
        `<a href="//dex.pokemonshowdown.com/pokemon/${toId(n[0])}" target="_blank" class="subtle" style="white-space:nowrap"><psicon pokemon="${n[0]}" style="vertical-align:-7px;margin:-2px" />${n[0]}</a>`,
        `<a href="//dex.pokemonshowdown.com/pokemon/${toId(n[1])}" target="_blank" class="subtle" style="white-space:nowrap"><psicon pokemon="${n[1]}" style="vertical-align:-7px;margin:-2px" />${n[1]}</a>`,
        `<a href="//dex.pokemonshowdown.com/pokemon/${toId(n[2])}" target="_blank" class="subtle" style="white-space:nowrap"><psicon pokemon="${n[2]}" style="vertical-align:-7px;margin:-2px" />${n[2]}</a>`,
    ]
    return `<span style="color:#999999;">inspireme (gen ${gen}):</span><br />${ret.join(',')}`;
}
module.exports = {
    inspireme: function (room, user, args) {
        let target = user.can(room, '+') && room !== user && Users.self.can(room, '*') ? room : findPMRoom(user);
        let prefix = user.can(room, '+') && room !== user && Users.self.can(room, '*') ? '/addhtmlbox ' : `/pminfobox ${user.id}, `;
        console.log(target);
        let gen = toId(args[0]);
        let ret = inspireMe(gen);
        target.send(prefix + ret);
    },
    '1v1': {
        '': 'help',
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args);
        },
        gen7: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen71v1', args);
        },
        oras: 'gen6',
        gen6: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen61v1', args);
        },
        bw: 'gen5',
        gen5: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen51v1', args);
        },
        dp: 'gen4',
        gen4: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen41v1', args);
        },
        rse: 'gen3',
        gen3: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen31v1', args);
        },
        aaa: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen71v1', args, '[Gen 7] AAA 1v1');
            room.send(buildRuleset('aaa'));
        },
        ag: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen71v1', args, '[Gen 7] AG 1v1');
            room.send(buildRuleset('ag'));
        },
        natdex: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] National Dex 1v1');
            room.send(buildRuleset('natdex'));
        },
        inverse: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] Inverse 1v1');
            room.send(buildRuleset('inverse'));
        },
        monotype: 'mono',
        mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] Monotype 1v1');
            room.send(buildRuleset('monotype'));
        },
        nfe: function (room, user, args) {
            Commands.nfe1v1(room, user, args);
        },
        cap: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] CAP 1v1');
            room.send('/tour rules -All Pokemon, +CAP, +CAP NFE, +CAP LC');
        },
        lc: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] LC 1v1');
            room.send('/tour rules Little Cup, [Gen 8] LC');
        },
        noz: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen71v1', args, '[Gen 7] No Z 1v1');
            room.send('/tour rules Z Move Clause');
        },
        dmax: 'max',
        dynamax: 'max',
        dyna: 'max',
        max: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] Dynamax 1v1');
            room.send('/tour rules !Dynamax Clause');
        },
        stabmons: 'stab',
        stab: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] STABmons 1v1');
            room.send(buildRuleset('stabmons'));
        },
        ubers: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] Ubers 1v1');
            room.send(buildRuleset('ubers'));
        },
        uu: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen81v1', args, '[Gen 8] UU 1v1');
            room.send(buildRuleset('uu'));
        },
        chill: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen71v1', args);
            room.startTour('chill');
        },
        '2v2': function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen82v2doubles', args);
        },
        monopoke: function (room, user, args) {
            Commands.monopoke[''](room, user, args);
        },
        help: function (room, user, args) {
            if (!user.can(room, '%')) return;
            room.send('Usage: ``.1v1 [type]``.');
            let types = [];
            for (let i in Commands['1v1']) {
                if (typeof Commands['1v1'][i] !== 'string' && i !== 'help') types.push(i);
            }
            room.send('Valid types: ' + types.join(', '));
        },
        random: function (room, user, args) {
            if (!user.can(room, '%')) return;
            let types = [];
            for (let i in Commands['1v1']) {
                if (typeof Commands['1v1'][i] !== 'string' && i !== 'help' && i !== 'random' && i !== 'chill') types.push(i);
            }
            Commands['1v1'][Utils.select(types)](room, user, args);
        }
    },
    '1v1om': function (room, user, args) {
        if (room != '1v1' && room != '1v1typechallenge') return false;
        if (!user.can(room, "%")) return false;
        let text = "/addhtmlbox ";
        text += "[Gen 7] 1v1, [Gen 7] UU 1v1, [Gen 7] LC 1v1, [Gen 7] 2v2 Doubles<br>";
        text += "<a href='https://www.smogon.com/forums/threads/1v1-old-gens.3646875/'>1v1 Past Gens</a>: [Gen 6] 1v1, [Gen 5] 1v1, [Gen 4] 1v1, [Gen 3] 1v1<br>";
        text += "<a href='https://www.smogon.com/forums/threads/1v1-oms.3648454/'>1v1 OMs</a>: AAA 1v1, AG 1v1, Inverse 1v1, Monotype 1v1, No Z 1v1, STABmons 1v1";
        room.send(text);
    },
};