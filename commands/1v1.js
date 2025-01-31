if (!global.banlists) global.banlists = {};

banlists['1v1'] = {
    gen9: [
        'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Cinderace', 'Chi-Yu', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 
        'Deoxys-Speed', 'Dialga', 'Dialga-Origin',
        'Dragonite', 'Eternatus', 'Flutter Mane', 'Gholdengo', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Jirachi', 'Koraidon', 'Kyogre',
        'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Meloetta', 'Mew', 'Mewtwo', 'Mimikyu', 'Miraidon', 'Necrozma', 
        'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Cornerstone', 'Ogerpon-Hearthflame', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Reshiram', 
        'Scream Tail', 'Shaymin-Sky', 'Snorlax', 'Solgaleo', 'Terapagos',
        'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 
    ],
    gen8: [
        'Calyrex-Ice', 'Calyrex-Shadow', 'Cinderace', 'Dialga', 'Dragonite', 'Eternatus', 'Genesect', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Jirachi',
        'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Melmetal', 'Mew', 'Mewtwo', 'Mimikyu', 'Necrozma', 'Necrozma-Dawn-Wings',
        'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Reshiram', 'Sableye', 'Snorlax', 'Solgaleo', 'Victini', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned',
        'Zamazenta', 'Zamazenta-Crowned', 'Zekrom'
    ],
    gen7: [
        'Arceus', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Deoxys-Defense', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon',
        'Ho-Oh', 'Kangaskhan-Mega', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Marshadow', 'Mew', 'Mewtwo',
        'Mimikyu', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky',
        'Snorlax', 'Solgaleo', 'Tapu Koko', 'Xerneas', 'Yveltal', 'Zekrom'
    ],
    gen6: [
        'Arceus', 'Blaziken', 'Charizard-Mega-Y', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Deoxys-Defense', 'Dialga',
        'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kangaskhan-Mega', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
        'Palkia', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Snorlax', 'Xerneas', 'Yveltal', 'Zekrom'
    ],
    gen5: [
        'Arceus', 'Blaziken', 'Cottonee', 'Darkrai', 'Deoxys', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh',
        'Jirachi', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mew', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram',
        'Shaymin-Sky', 'Togekiss', 'Victini', 'Whimsicott', 'Zekrom'
    ],
    gen4: [
        'Arceus', 'Darkrai', 'Deoxys-Attack', 'Deoxys-Base', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga', 'Garchomp',
        'Giratina', 'Groudon', 'Ho-Oh', 'Jirachi', 'Kyogre', 'Latias', 'Latios', 'Lugia', 'Machamp', 'Manaphy', 'Mew',
        'Mewtwo', 'Palkia', 'Porygon-Z', 'Rayquaza', 'Salamence', 'Shaymin', 'Shaymin-Sky', 'Snorlax', 'Togekiss',
    ],
    gen3: [
        'Clefable', 'Deoxys-Base', 'Deoxys-Attack', 'Deoxys-Defense',
        'Deoxys-Speed', 'Groudon', 'Ho-Oh', 'Kyogre', 'Latias', 'Latios',
        'Lugia', 'Mew', 'Mewtwo', 'Rayquaza', 'Slaking', 'Snorlax', 'Suicune',
        'Zapdos'
    ]
}

let buildRuleset = function (meta) {
    let banlist = Banlist[meta];
    let ret = "/tour rules ";
    let rules = [];
    for (let x of banlist.addrules) rules.push(x);
    for (let x of banlist.remrules) rules.push(`!${x}`);
    for (let x of banlist.bans) rules.push(`-${x}`);
    for (let x of banlist.unbans) rules.push(`+${x}`);
    return ret + rules.join(", ");
};

let findPMRoom = function (user) {
    for (let i in Rooms) {
        if (!Users.self.can(Rooms[i], "*")) continue;
        if (Rooms[i].users[user]) return Rooms[i];
    }
    return false;
};

global.getGen = function (mon) {
    if (mon.num < 1) return 0;

    let id = toId(mon.name);
    if (PokeDex[id] && !Gen8PokeDex[id]) {
        return 9;
    } else if (mon.num >= 810 || ["Gmax", "Galar", "Galar-Zen"].includes(mon.forme)) {
        return 8;
    } else if (mon.num >= 722 || (mon.forme && mon.forme.startsWith("Alola")) || mon.forme === "Starter") {
        return 7;
    } else if (mon.forme === "Primal") {
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
};
let inspireMe = function (arg) {
    let dex = PokeDex;
    let fd = fdata;
    let banlist = banlists['1v1'].gen9;
    let gen = 9;
    if (["ss", "swsh", "8", "gen8"].includes(arg)) {
        gen = 8;
        dex = Gen8PokeDex;
        fd = Gen8fdata;
        banlist = banlists['1v1'].gen8;
    }
    if (["sm", "usum", "7", "gen7"].includes(arg)) {
        banlist = banlists['1v1'].gen7;
        gen = 7;
    }
    if (["xy", "oras", "6", "gen6"].includes(arg)) {
        banlist = banlists['1v1'].gen6
        gen = 6;
    }
    if (["bw", "bw2", "b2w2", "5", "gen5"].includes(arg)) {
        banlist = banlists['1v1'].gen5;
        gen = 5;
    }
    if (["dp", "dpp", "dppt", "4", "gen4"].includes(arg)) {
        banlist = banlists['1v1'].gen4;
        gen = 4;
    }
    if (["adv", "rse", "rs", "3", "gen3"].includes(arg)) {
        banlist = banlists['1v1'].gen3;
        gen = 3;
    }
    let valid = [];
    for (let i in dex) {
        let entry = dex[i];
        entry.gen = getGen(entry);
        if (!entry.gen) continue;
        if (entry.gen > gen) continue;
        if (banlist.includes(entry.name)) continue;
        if (entry.baseSpecies && banlist.includes(entry.baseSpecies)) continue;
        if (gen >= 8 && fd[i] && ["LGPE", "Past"].includes(fd[i].isNonstandard)) continue;
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
        if (valid[rand].baseSpecies) b.push(valid[rand].baseSpecies.name);
    }
    let ret = [
        `<a href="//dex.pokemonshowdown.com/pokemon/${toId(
            n[0]
        )}" target="_blank" class="subtle" style="white-space:nowrap"><psicon pokemon="${
            n[0]
        }" style="vertical-align:-7px;margin:-2px" />${n[0]}</a>`,
        `<a href="//dex.pokemonshowdown.com/pokemon/${toId(
            n[1]
        )}" target="_blank" class="subtle" style="white-space:nowrap"><psicon pokemon="${
            n[1]
        }" style="vertical-align:-7px;margin:-2px" />${n[1]}</a>`,
        `<a href="//dex.pokemonshowdown.com/pokemon/${toId(
            n[2]
        )}" target="_blank" class="subtle" style="white-space:nowrap"><psicon pokemon="${
            n[2]
        }" style="vertical-align:-7px;margin:-2px" />${n[2]}</a>`,
    ];
    return `<span style="color:#999999;">inspireme (gen ${gen}):</span><br />${ret.join(",")}`;
};
module.exports = {
    inspireme: function (room, user, args) {
        if (room !== user && !user.can(room, "+")) return user.send("Please use this command in private messages.");
        let target = user.can(room, "+") && room !== user && Users.self.can(room, "*") ? room : findPMRoom(user);
        if (!target) {
            user.send("I tried to send you HTML for ``.inspireme`` but I'm not in any rooms that allow me to do that...");
            user.send("(this is a bug with offline PMs)");
            return;
        }
        let prefix =
            user.can(room, "+") && room !== user && Users.self.can(room, "*")
                ? "/addhtmlbox "
                : `/pminfobox ${user.id}, `;
        let gen = toId(args[0]);
        let ret = inspireMe(gen);
        target.send(prefix + ret);
    },
    "1v1": {
        "": "help",
        gen9: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen91v1", args);
        },
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args);
        },
        gen7: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen71v1", args);
        },
        oras: "gen6",
        gen6: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen61v1", args);
        },
        bw: "gen5",
        gen5: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen51v1", args);
        },
        dp: "gen4",
        gen4: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen41v1", args);
        },
        rse: "gen3",
        gen3: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen31v1", args);
        },
        gsc: "gen2",
        gen2: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen21v1", args);
        },
        aaa: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen71v1", args, "[Gen 7] AAA 1v1");
            room.send(buildRuleset("aaa"));
        },
        ag: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen71v1", args, "[Gen 7] AG 1v1");
            room.send(buildRuleset("ag"));
        },
        natdex: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] National Dex 1v1");
            room.send(`/tour rules +Past`);
        },
        inverse: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] Inverse 1v1");
            room.send(buildRuleset("inverse"));
        },
        monotype: "mono",
        mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] Monotype 1v1");
            room.send(buildRuleset("monotype"));
        },
        nfe: function (room, user, args) {
            Commands.nfe1v1(room, user, args);
        },
        cap: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] CAP 1v1");
            room.send("/tour rules -All Pokemon, +CAP, +CAP NFE, +CAP LC");
        },
        lc: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] LC 1v1");
            room.send("/tour rules Little Cup, [Gen 8] LC");
        },
        noz: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen71v1", args, "[Gen 7] No Z 1v1");
            room.send("/tour rules Z Move Clause");
        },
        dmax: "max",
        dynamax: "max",
        dyna: "max",
        max: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] Dynamax 1v1");
            room.send("/tour rules !Dynamax Clause");
        },
        stabmons: "stab",
        stab: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] STABmons 1v1");
            room.send(buildRuleset("stabmons"));
        },
        ubers: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] Ubers 1v1");
            room.send(buildRuleset("ubers"));
        },
        uu: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] UU 1v1");
            room.send(buildRuleset("uu"));
        },
        chill: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen71v1", args);
            room.startTour("chill");
        },
        "2v2": function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen82v2doubles", args);
        },
        monopoke: function (room, user, args) {
            Commands.monopoke[""](room, user, args);
        },
        help: function (room, user, args) {
            if (!user.can(room, "%")) return;
            room.send("Usage: ``.1v1 [type]``.");
            let types = [];
            for (let i in Commands["1v1"]) {
                if (typeof Commands["1v1"][i] !== "string" && i !== "help") types.push(i);
            }
            room.send("Valid types: " + types.join(", "));
        },
        random: function (room, user, args) {
            if (!user.can(room, "%")) return;
            let types = [];
            for (let i in Commands["1v1"]) {
                if (typeof Commands["1v1"][i] !== "string" && i !== "help" && i !== "random" && i !== "chill")
                    types.push(i);
            }
            Commands["1v1"][Utils.select(types)](room, user, args);
        },
        rec: "recommended",
        recommended: function (room, user, args) {
            let key = {
                gen81v1: "gen8",
                gen71v1: "gen7",
                gen61v1: "gen6",
                gen51v1: "gen5",
                gen41v1: "gen4",
                gen31v1: "gen3",

                gen82v2doubles: "2v2",
                gen8monotype1v1: "mono",
                gen8inverse1v1: "inverse",
                gen8natdex1v1: "natdex",
                gen8nfe1v1: "nfe",
                gen8cap1v1: "cap",
                gen8lc1v1: "lc",

                gen8dynamax1v1: "max",

                gen8stabmons1v1: "stab",
                gen8ubers1v1: "ubers",
                gen8uu1v1: "uu",
                gen8monopoke: "monopoke",
                gen7monopoke: "monopoke",

                gen7ag1v1: "ag",
                gen7aaa1v1: "aaa",
                gen7noz1v1: "noz",
            };

            let regulartours = ["gen8"];
            let oldgens = ["gen7", "gen6", "gen5", "gen4", "gen3"];
            let easyoms = ["mono", "inverse", "natdex", "lc", "uu"];
            let gen7oms = ["noz", "ag", "aaa"];
            let otheroms = ["nfe", "cap", "stab", "ubers", "max"];

            let distribution = {
                regular: 0.75,
                old: 0.25,
                om: 0.15,
                monopoke: 0.15,
                gen7: 0.05,
                other: 0.05,
            };

            let defaults = {};
            let basesum = 0;

            let n = room.pasttours.length;
            for (let i in distribution) {
                defaults[i] = Math.ceil(n * distribution[i]);
                distribution[i] = Math.ceil(n * distribution[i]);
                basesum += defaults[i];
            }

            let banned = [];

            for (let t = 0; t < room.pasttours.length; t++) {
                let tour = room.pasttours[t];
                if (tour.startsWith("Official ")) tour = tour.slice(9);
                let target = key[toId(tour)];
                if (toId(tour).includes("monopoke")) target = "monopoke";
                if (!target) continue;
                if (regulartours.includes(target)) distribution.regular--;
                if (oldgens.includes(target)) distribution.old--;
                if (easyoms.includes(target)) distribution.om--;
                if (gen7oms.includes(target)) distribution.gen7--;
                if (otheroms.includes(target)) distribution.other--;
                if (target === "monopoke") distribution.monopoke--;
                if (["gen8", "monopoke"].includes(target)) continue;
                if (!banned.includes(target) && t > room.pasttours.length - 6) banned.push(target);
            }

            let sum = 0;
            for (let i in distribution) {
                if (distribution[i] <= 0) {
                    distribution[i] = 0;
                }
                sum += distribution[i];
            }

            if (sum === 0) {
                distribution = defaults;
                sum = basesum;
            }
            distribution = Object.values(distribution);

            for (let i = 1; i < distribution.length; i++) {
                distribution[i] += distribution[i - 1];
            }

            let result = Math.floor(Math.random() * sum);
            let type = "";
            if (result < distribution[0]) {
                type = regulartours[Math.floor(Math.random() * regulartours.length)];
            } else if (result < distribution[1]) {
                for (let i = oldgens.length - 1; i >= 0; i--) {
                    if (banned.includes(oldgens[i])) {
                        oldgens.splice(i, 1);
                    }
                }
                type = oldgens[Math.floor(Math.random() * oldgens.length)];
            } else if (result < distribution[2]) {
                for (let i = easyoms.length - 1; i >= 0; i--) {
                    if (banned.includes(easyoms[i])) {
                        easyoms.splice(i, 1);
                    }
                }
                type = easyoms[Math.floor(Math.random() * easyoms.length)];
            } else if (result < distribution[3]) {
                type = "monopoke";
            } else if (result < distribution[4]) {
                for (let i = gen7oms.length - 1; i >= 0; i--) {
                    if (banned.includes(gen7oms[i])) {
                        gen7oms.splice(i, 1);
                    }
                }
                type = gen7oms[Math.floor(Math.random() * gen7oms.length)];
            } else {
                for (let i = otheroms.length - 1; i >= 0; i--) {
                    if (banned.includes(otheroms[i])) {
                        otheroms.splice(i, 1);
                    }
                }
                type = otheroms[Math.floor(Math.random() * otheroms.length)];
            }
            if (!type) type = "gen8";
            Commands["1v1"][type](room, user, args);
        },
    },
    "1v1om": function (room, user, args) {
        if (room != "1v1" && room != "1v1typechallenge") return false;
        if (!user.can(room, "%")) return false;
        let text = "/addhtmlbox ";
        text += "[Gen 7] 1v1, [Gen 7] UU 1v1, [Gen 7] LC 1v1, [Gen 7] 2v2 Doubles<br>";
        text +=
            "<a href='https://www.smogon.com/forums/threads/1v1-old-gens.3646875/'>1v1 Past Gens</a>: [Gen 6] 1v1, [Gen 5] 1v1, [Gen 4] 1v1, [Gen 3] 1v1<br>";
        text +=
            "<a href='https://www.smogon.com/forums/threads/1v1-oms.3648454/'>1v1 OMs</a>: AAA 1v1, AG 1v1, Inverse 1v1, Monotype 1v1, No Z 1v1, STABmons 1v1";
        room.send(text);
    },
};
