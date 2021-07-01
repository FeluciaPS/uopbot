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
        "": "gen8",
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldex", args);
        },
        uu: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldexuu", args);
        },
        bh: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldexbh", args);
            room.send("!rfaq BH");
        },
        "1v1": function (room, user, args) {
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
        mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldexmonotype", args);
        },
        camo: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8camomons", args, "[Gen 8] National Dex Camomons");
            room.send(buildRuleset("ndcamo"));
        },
    },
};
