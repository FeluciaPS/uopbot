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

module.exports = {
    natdex: {
        "": "gen9",
        gen9: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9nationaldex", args);
        },
        uu: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9nationaldexuu", args);
        },
        bh: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9nationaldexbh", args);
            room.send("!rfaq BH");
        },
        mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9nationaldexmonotype", args);
        },
        gen8mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldexmonotype", args, "[Gen 8] National Dex Monotype");
            room.send("/wall Samples: https://www.smogon.com/forums/posts/8742407");
        },
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldex", args);
        },
        gen8uu: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldexuu", args);
        },
        gen8bh: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldexbh", args);
            room.send("!rfaq BH");
        },
        "gen81v1": function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen81v1", args, "[Gen 8] National Dex 1v1");
            room.send(buildRuleset("natdex"));
        },
        stab: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8stabmons", args, "[Gen 8] National Dex STABmons");
            room.send(buildRuleset("ndstab"));
        },
        aaa: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8almostanyability", args, "[Gen 8] National Dex AAA");
            room.send(buildRuleset("ndaaa"));
        },
        gen8mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldexmonotype", args);
        },
        camo: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8camomons", args, "[Gen 8] National Dex Camomons");
            room.send(buildRuleset("ndcamo"));
        },
        monoubers: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "nationaldexubers", args, "[Gen 9] NatDex Monotype Ubers");
            room.send("/tour rules -Bright Powder, -Calyrex-Shadow, Dynamax Clause, Evasion Moves Clause, -Focus Band, -Gengarite, -King's Rock, -Lax Incense, -Marshadow, Mega Rayquaza Clause, Terastal Clause, -Moody, OHKO Clause, -Quick Claw, Same Type Clause, Sleep Clause Mod, Species Clause, -Ultranecrozium Z, -Zacian, -Zacian-Crowned");
        },
        threat: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;

            // I can't be bothered to implement nonrandom monothreat
            const types = [
                "Normal",
                "Fire",
                "Water",
                "Grass",
                "Electric",
                "Ice",
                "Fighting",
                "Poison",
                "Ground",
                "Flying",
                "Psychic",
                "Bug",
                "Rock",
                "Ghost",
                "Dark",
                "Dragon",
                "Steel",
                "Fairy",
            ];

            const dayTypes = {
                0: [ "Ground", "Rock", false ],
                1: [ "Water", "Fire", "Grass" ],
                2: [ "Dark", "Fighting", "Psychic" ],
                3: [ "Steel", "Fairy", "Dragon" ],
                4: [ "Electric", "Ice", "Flying" ],
                5: [ "Normal", "Ghost", false ],
                6: [ "Bug", "Poison", false ],
            }

            const day = new Date(Date.now()).getDay();

            const typeOptions = dayTypes[day];
            let type = typeOptions[Math.floor(Math.random() * typeOptions.length)];
            
            // Type shold always be random as of now but I ain't deleting the above code
            type = false;


            if (!type) type = types[Math.floor(Math.random() * types.length)];

            Utils.checkGenerator(room, "gen9nationaldexmonotype", args, "[Gen 9] Monothreat " + type);
            room.send(`/tour rules Force Monotype = ${type}`);
            room.send(`/tour autostart 8`);
            room.send("/tour scouting off");
            room.send("!rfaq threat");
        },
    },
};
