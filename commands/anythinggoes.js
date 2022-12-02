module.exports = {
    ag: {
        "": "gen9",
        gen9: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9anythinggoes", args);
        },
        natdex: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8nationaldexag", args);
        },
        galar: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8anythinggoes", args);
        },
        usum: "gen7",
        gen7: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen7anythinggoes", args);
        },
        oras: "gen6",
        gen6: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen6anythinggoes", args);
        },
        inverse: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "nationaldexag", args, "[NatDex] Inverse AG");
            room.send("/tour rules Inverse Mod");
        },
        monotype: "mono",
        mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "nationaldexag", args, "[NatDex] Monotype AG");
            room.send("/tour rules Same Type Clause");
        },
        help: function (room, user, args) {
            if (!user.can(room, "%")) return;
            room.send("Usage: ``.ag [type]``.");
            let types = [];
            for (let i in Commands["ag"]) {
                if (typeof Commands["ag"][i] !== "string" && i !== "help") types.push(i);
            }
            room.send("Valid types: " + types.join(", "));
        },
        random: function (room, user, args) {
            if (!user.can(room, "%")) return;
            let types = [];
            for (let i in Commands["ag"]) {
                if (typeof Commands["ag"][i] !== "string" && i !== "help" && i !== "random" && i !== "chill")
                    types.push(i);
            }
            Commands["ag"][Utils.select(types)](room, user, args);
        },
    },
};
