"use strict";

global.BLT = {
    next: false,
    last: false,
    tours: ["gen9", "gen9", "gen9", "gen9", "gen8", "gen7", "gen6", "gen5"],
    getNext: function () {
        if (BLT.next) return BLT.next;
        let x = Object.assign([], BLT.tours);
        if (BLT.last) x.splice(x.indexOf(BLT.last), 1);
        BLT.next = x[Math.floor(Math.random() * x.length)];
        return BLT.next;
    },
    times: [1, 7, 13, 19],
    points: {},
    leaderboard: function () {
        let board = [];
        for (let i in this.points) {
            board.push([this.points[i].name, this.points[i].points]);
        }
        board = board.sort((a, b) => {
            return b[1] - a[1];
        });
        let html =
            "<center><div style='overflow-x:auto;max-height:327px'><details OPEN><summary>BLT Leaderboard top 12</summary>";
        html += `<table style='border-spacing:0px;text-align:center'><tr><th style="padding:5px;border:1px solid black;border-radius:5px 0px 0px 0px">#</th><th style="border:1px solid black">Name</th><th style="padding:3px;border:1px solid black;border-radius:0px 5px 0px 0px">Score</th></tr>`;
        for (let i = 0; i < board.length; i++) {
            if (i === 12) {
                html += "</table><details><summary>lower ranks</summary>";
                html += `<table style='border-spacing:0px;text-align:center'><tr><th style="padding:5px;border:1px solid black;border-radius:5px 0px 0px 0px">#</th><th style="border:1px solid black">Name</th><th style="padding:3px;border:1px solid black;border-radius:0px 5px 0px 0px">Score</th></tr>`;
            }
            if (i === 9 || i === board.length - 1)
                html += `<tr><td style="padding:5px;border:1px solid black;border-radius:0px 0px 0px 5px">${
                    i + 1
                }</td><td style="padding:5px;border:1px solid black">${
                    board[i][0]
                }</td><td style="padding:5px;border:1px solid black;border-radius:0px 0px 5px 0px">${
                    board[i][1]
                }</td></tr>`;
            else
                html += `<tr><td style="padding:5px;border:1px solid black">${
                    i + 1
                }</td><td style="padding:5px;border:1px solid black">${
                    board[i][0]
                }</td><td style="padding:5px;border:1px solid black">${board[i][1]}</td></tr>`;
        }
        html += "</table>";
        if (board.length > 12) html += "</details>";
        html += "</details></div></center>";
        return html;
    },
    loadpoints: function () {
        if (!FS.existsSync("./data/BLT.json")) FS.writeFileSync("./data/BLT.json", "{}");
        this.points = JSON.parse(FS.readFileSync("./data/BLT.json"));
    },
    savepoints: function () {
        FS.writeFileSync("./data/BLT.json", JSON.stringify(this.points, null, 4));
    },
    addpoints: function (first, second, thirds = []) {
        let fobj = this.points[toId(first)];
        if (!fobj) fobj = {};
        fobj.name = first;
        fobj.points = fobj.points ? fobj.points + 3 : 3;
        this.points[toId(fobj.name)] = fobj;

        let sobj = this.points[toId(second)];
        if (!sobj) sobj = {};
        sobj.name = second;
        sobj.points = sobj.points ? sobj.points + 2 : 2;
        this.points[toId(sobj.name)] = sobj;

        if (thirds[0]) {
            let tobj = this.points[toId(thirds[0])];
            if (!tobj) tobj = {};
            tobj.name = thirds[0];
            tobj.points = tobj.points ? tobj.points + 1 : 1;
            this.points[toId(tobj.name)] = tobj;
        }
        if (thirds[1]) {
            let tobj = this.points[toId(thirds[1])];
            if (!tobj) tobj = {};
            tobj.name = thirds[1];
            tobj.points = tobj.points ? tobj.points + 1 : 1;
            this.points[toId(tobj.name)] = tobj;
        }
        this.savepoints();
    },
};

BLT.loadpoints();

module.exports = {
    // BLT stuff
    addbltpoints: function (room, user, args) {
        if (!user.can(Rooms["monotype"], "@")) return;
        if (args.length !== 2)
            return room.send("Usage: ``addbltpoints [user], [points]`` (you can use negative values)");
        if (isNaN(parseInt(args[1])))
            return room.send("Usage: ``addbltpoints [user], [points]`` (you can use negative values)");
        let tobj = BLT.points[toId(args[0])];
        if (!tobj) tobj = {};
        tobj.name = args[0];
        tobj.points = tobj.points ? tobj.points + parseInt(args[1]) : parseInt(args[1]);
        BLT.points[toId(tobj.name)] = tobj;
        if (tobj.points <= 0) delete BLT.points[toId(tobj.name)];
        Rooms["monotype"].send(`/modnote ${parseInt(args[1])} BLT points given to ${args[0].trim()} by ${user.name}`);
        return user.send("Done.");
    },
    startblt: function (room, user, args) {
        if (!user.can(room, "+")) return;
        if (room.id !== "monotype" && !room.id.includes("test")) return;
        let format = BLT.getNext();
        BLT.last = format;
        BLT.next = false;
        room.send(`/tour create ${format}monotype, elim,,, Official ${Tournament.formats[format + "monotype"]}`);
        room.send("/tour scouting disallow");
        room.startTour({
            blt: true,
            official: true,
            officialname: "BLT Qualifiers"
        });
    },
    nextblt: function (room, user, args) {
        let target = user.can(room, "+") ? room : user;
        if (room.id !== "monotype" && !room.id.includes("test")) target = user;
        let now = new Date(Date.now() - 20 * 60 * 1000);
        let nhours = now.getHours();
        let next = BLT.times[0];
        for (let i in BLT.times) {
            if (nhours >= BLT.times[i]) next = BLT.times[(parseInt(i) + 1) % BLT.times.length];
        }
        now = new Date(Date.now());
        let hours = next - now.getHours();
        if (next === BLT.times[0]) hours += 24;
        let minutes = 60 - now.getMinutes();
        if (minutes < 60) hours -= 1;
        else minutes = 0;
        if (hours >= 24) hours -= 24;
        let timestr =
            "in " +
            (hours !== 0 ? hours + " hour" + (hours === 1 ? "" : "s") : "") +
            (hours !== 0 && minutes !== 0 ? " and " : "") +
            (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? "" : "s") : "");
        if (hours < 0)
            return target.send(
                `The ${Tournament.formats[BLT.getNext() + "monotype"]} BLT qualifier should have started ${
                    60 - Math.abs(minutes)
                } ago`
            );
        let ret = `The next official Monotype BLT qualifier tournament will be ${
            Tournament.formats[BLT.getNext() + "monotype"]
        } ${timestr}.`;
        target.send(ret);
    },
    bltrank: function (room, user, args) {
        if (toId(args[0]) === "reset") {
            if (!user.can(Rooms["monotype"], "#")) return;
            BLT.points = {};
            BLT.savepoints();
            return room.send("Leaderboard reset.");
        }
        let target = user.can(room, "+") ? room : user;
        if (room.id !== "monotype" && !room.id.includes("test")) target = user;
        if (target === user) {
            let target = BLT.points[user.id];
            if (!target) user.send("You don't have any points.");
            else {
                let board = [];
                for (let i in BLT.points) {
                    if (BLT.points[i].points <= 0) continue;
                    board.push([i, BLT.points[i].points]);
                }
                board = board.sort((a, b) => {
                    return b[1] - a[1];
                });
                for (let i in board) {
                    board[i] = board[i][0];
                }
                user.send(`You are ranked **${board.indexOf(user.id) + 1}** with ${target.points} points.`);
            }
        } else {
            room.send(`/adduhtml bltboard, ${BLT.leaderboard()}`);
        }
    },
    mono: {
        // Old (and current) generations
        "": "gen9",
        gen9: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9monotype", args);
            room.send("/tour scouting off");
        },
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8monotype", args);
            room.send("/tour scouting off");
        },
        gen7: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen7monotype", args);
            room.send("/tour scouting off");
        },
        gen6: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen6monotype", args);
            room.send("/tour scouting off");
        },
        gen5: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen5monotype", args);
            room.send("/tour scouting off");
        },
        gen4: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen4ou", args, "[Gen 4] Monotype");
            room.send("/tour rules Same Type Clause");
            room.send("/tour scouting off");
        },
        gen3: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen3ou", args, "[Gen 3] Monotype");
            room.send("/tour rules Same Type Clause");
            room.send("/tour scouting off");
        },
        // Mixups with other smogon metagames
        "1v1": function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen71v1", args, "[Gen 7] Monotype 1v1");

            // Build ruleset
            let ruleset = "/tour rules Same Type Clause, ";
            if (Banlist.monotype.bans.length) ruleset += "-" + Banlist.monotype.bans.join(", -") + ", ";
            if (Banlist.monotype.unbans.length) ruleset += "+" + Banlist.monotype.unbans.join(", +") + ", ";
            ruleset = ruleset.substring(0, ruleset.length - 2);
            room.send(ruleset);
            room.send("/tour scouting off");
        },
        lc: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9lc", args, "[Gen 9] Monotype LC");
            room.send("/tour rules Same Type Clause");
            room.send("/tour scouting off");
        },
        uber: "ubers",
        ubers: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "nationaldexubers", args, "[NatDex] Monotype Ubers");
            room.send("/tour rules -Bright Powder, -Calyrex-Shadow, Dynamax Clause, Evasion Moves Clause, -Focus Band, -Gengarite, -King's Rock, -Lax Incense, -Marshadow, Mega Rayquaza Clause, Terastal Clause, -Moody, OHKO Clause, -Quick Claw, Same Type Clause, Sleep Clause Mod, Species Clause, -Ultranecrozium Z, -Zacian, -Zacian-Crowned, +Miraidon");
            room.send("/tour scouting off");
        },
        // Mixups with OMs
        almostanyability: "aaa",
        aaa: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8almostanyability", args, "[Gen 8] Monotype Almost Any Ability");
            room.send(
                "/tour rules Same Type Clause, +Buzzwole, +Zeraora, -Dragapult, -Dracovish, -Dragonite, -Keldeo, -Urshifu, -Urshifu-Rapid-Strike, -Melmetal, -Psychic Surge, -Triage, -Damp Rock, -Terrain Extender"
            );
            room.send("/tour scouting off");
        },
        stab: "stabmons",
        stabmons: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen8stabmons", args, "[Gen 8] Monotype STABmons");
            room.send(
                "/tour rules Same Type Clause, -Blaziken, -Dracovish, -Dragapult, -Landorus-Incarnate, -Magearna, -Terrain Extender, -Damp Rock, +Darmanitan-Galar, +Porygon Z, +Thundurus, +Arena Trap"
            );
            room.send("/tour scouting off");
        },
        mixandmega: "mnm",
        mnm: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen7mixandmega", args, "[Gen 7] Monotype Mix and Mega");
            room.send(
                "/tour rules Same Type Clause, -Aggronite, -Altarianite, -Ampharosite, -Audinite, -Charizardite X, -Gyaradosite, -Lopunnite, -Mewtwonite X, -Pinsirite, -Sceptilite, -Red Orb"
            );
            room.send("/tour scouting off");
        },
        // Other monotype
        mrb: "monotyperandombattle",
        random: "monotyperandombattle",
        monotyperandombattle: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9monotyperandombattle", args);
        },
        blitz: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9monotype", args, "[Gen 9] Blitz Monotype");
            room.send("/tour rules Blitz");
            room.send("/tour forcetimer on");
            room.send("/tour scouting off");
        },
        doubles: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9doublesou", args, "[Gen 9] Doubles Monotype");
            room.send("/tour rules Same Type Clause, -Terrain Extender, -Smooth Rock, -Damp Rock");
            room.send("/tour scouting off");
        },
        chill: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, "gen9monotype", args);
            room.startTour("chill");
        },
        // Threat
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

            let type = types[Math.floor(Math.random() * types.length)];
            
            // Type shold always be random as of now but I ain't deleting the above code
            type = false;


            if (!type) type = types[Math.floor(Math.random() * types.length)];

            Utils.checkGenerator(room, "gen9monotype", args, "[Gen 9] Monothreat " + type);
            room.send(`/tour rules Force Monotype = ${type}`);
        },
    },
    cc1v1: function (room, user, args) {
        if (!Utils.canMakeTour(room, user)) return;
        Utils.checkGenerator(room, "challengecup1v1", args);
    },
};
