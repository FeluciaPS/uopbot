let moncountrule = "max team size = 4, min team size = 2, picked team size = 2";

module.exports = {
    "2v2": {
        "": "gen9",
        gen9: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen92v2doubles", args);
        },
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8doublesou", args, "[Gen 8] 2v2 Doubles");

            let bans = `Calyrex-Ice, Calyrex-Shadow, Eternatus, Jirachi, Kyurem-White, Lunala, Magearna, Marshadow, Melmetal, Mewtwo, Necrozma-Dusk Mane, Necrozma-Dawn Wings, Reshiram, Solgaleo, Tornadus, Urshifu-Rapid-Strike, Urshifu-Single-Strike, Whimsicott, Zacian, Zacian-Crowned, Zamazenta, Zamazenta-Crowned, Zekrom, Ally Switch, Focus Sash, Perish Song`;
            let rules = `Standard Doubles, Accuracy Moves Clause, Swagger Clause, Sleep Clause Mod, Team Preview`;
            bans = bans.replace(/\,\s/g, ', -');
            room.send(`/tour rules ${rules}, -${bans}, ${moncountrule}`);
        },
        gen7: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen7doublesou", args, "[Gen 7] 2v2 Doubles");

            let bans = `Ally Switch, Arceus, Dialga, Giratina, Groudon, Ho-Oh, Jirachi, Kangaskhan-Mega, Kyogre, Kyurem-White, Lugia, Lunala, Magearna, Marshadow, Mewtwo, Necrozma-Dawn-Wings, Necrozma-Dusk-Mane, Palkia, Rayquaza, Reshiram, Salamence-Mega, Solgaleo, Tapu Lele, Xerneas, Yveltal, Zekrom, Power Construct, Focus Sash, Dark Void, Final Gambit, Perish Song`;
            let rules = `Pokemon, Standard Doubles, Accuracy Moves Clause, Swagger Clause, Z-Move Clause, Sleep Clause Mod, Team Preview`;
            bans = bans.replace(/\,\s/g, ', -');
            room.send(`/tour rules ${rules}, -${bans}, ${moncountrule}`);
        },
        oras: "gen6",
        gen6: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen6doublesou", args, "[Gen 6] 2v2 Doubles");

            let bans = `Mewtwo, Lugia, Ho-Oh, Kyogre, Groudon, Rayquaza, Jirachi, Dialga, Palkia, Giratina, Giratina-Origin, Arceus, Reshiram, Zekrom, Kyurem-White, Xerneas, Yveltal, Kangaskhan-Mega, Salamence-Mega, Dark Void, Perish Song, Soul Dew, Focus Sash`;
            let rules = `Obtainable, Species Clause, OHKO Clause, Accuracy Moves Clause, Evasion Moves Clause, Moody Clause, Swagger Clause, Endless Battle Clause, HP Percentage Mod, Cancel Mod, Team Preview`;
            bans = bans.replace(/\,\s/g, ', -');
            room.send(`/tour rules ${rules}, -${bans}, ${moncountrule}`);
        },
        bw: "gen5",
        gen5: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen5doublesou", args, "[Gen 5] 2v2 Doubles");
            let bans = `Accuracy Moves Clause, -Focus Sash, -Kingdra, -Final Gambit, -Perish Song, -Ally Switch, Team Preview`;
            room.send(`/tour rules ${bans}, ${moncountrule}`);        
        },
        dp: "gen4",
        gen4: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen4doublesou", args, "[Gen 4] 2v2 Doubles");
            room.send("/tour rules Two vs Two, -Perish Song, -Focus Sash, " + moncountrule);
        },
        inverse: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen92v2doubles", args, "[Gen 9] Inverse 2v2");
            room.send("/tour rules Inverse Mod");
        },
        monotype: "mono",
        mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen92v2doubles", args, "[Gen 9] Monotype 2v2");
            room.send("/tour rules Same Type Clause");
        },
        chill: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen92v2doubles", args);
            room.startTour("chill");
        },
        help: function (room, user, args) {
            if (!user.can(room, "%")) return;
            room.send("Usage: ``.2v2 [type]``.");
            let types = [];
            for (let i in Commands["2v2"]) {
                if (typeof Commands["2v2"][i] !== "string" && i !== "help") types.push(i);
            }
            room.send("Valid types: " + types.join(", "));
        },
        random: function (room, user, args) {
            if (!user.can(room, "%")) return;
            let types = [];
            for (let i in Commands["2v2"]) {
                if (typeof Commands["2v2"][i] !== "string" && i !== "help" && i !== "random" && i !== "chill")
                    types.push(i);
            }
            Commands["2v2"][Utils.select(types)](room, user, args);
        },
    },
};
