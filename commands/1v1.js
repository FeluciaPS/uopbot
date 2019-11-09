global.OT1v1 = {
    schedule: [ 
        ["mono", "1v1", "1v1"],
        ["1v1", "1v1", "gen41v1"],
        ["2v2", "gen51v1", "uu1v1"],
        ["1v1", "mono", "1v1"],
        ["gen61v1", "1v1", "2v2"],
        ["gen41v1", "uu1v1", "gen51v1"],
        ["1v1", "gen61v1", "1v1"]
    ],
    times: [1, 9, 17],
    day: parseInt(require('fs').readFileSync("./data/last1v1.txt", 'utf8').split(" ")[0]),
    last: parseInt(require('fs').readFileSync("./data/last1v1.txt", 'utf8').split(" ")[1]),
    official: function() {
        let room = Rooms['1v1'];
        let now = new Date(Date.now());
        let next = (this.last + 1) % this.times.length;
        let day = next === 0 ? (this.day + 1) % 7 : this.day;
        let mins = now.getMinutes();
        if (mins > 15) return;
        let hours = now.getHours();
        let end = false;
        if (hours === this.times[next]) {
            if (room.tournament) {
                if (room.tournament.official) return;
                else {
                    room.send("/wall Official time. Ending ongoing tournament");
                    room.send("/tour end");
                    end = true;
                }
            }
            require('fs').writeFileSync("./data/last1v1.txt", `${day} ${next}`);
            this.day = day;
            this.last = next;
            let type = this.schedule[day][next];
            room.send('/modnote OFFICIAL: ' + type);
            if (end) setTimeout(Commands[type], 3950, room, Users.staff, ["o"]);
            else Commands[type](room, Users.staff, ["o"]);
        }
    }
}

let canMakeTour = function(room, user) {
    // I'm gonna use this a lot so why not make a function for it
    if (room != '1v1' && room != '1v1typechallenge' && room != '1v1oldgens') return false;
    if (!user.can(room, "%")) return false;
    if (room.tournament) {
        room.send("A tournament is already going on.");
        return false;
    }
    return true;
}

module.exports = {
    nextot: function(room, user, args) {
        let now = new Date(Date.now());
        let ret = "";
        if (room === user) {
            let in1v1 = user.can(Rooms['1v1'], ' ');
            let inNFE = user.can(Rooms['nfe'], ' ');
            let targetroom = inNFE ? Rooms['nfe'] : (in1v1 ? Rooms['1v1'] : user );
            if (targetroom !== user) {
                ret += `/pminfobox ${user.id}, `;
            }
            let rooms = [];
            if (in1v1) {
                let r = ""
                let next = (OT1v1.last + 1) % OT1v1.times.length;
                let day = next === 0 ? (OT1v1.day + 1) % 7 : OT1v1.day;
                let hours = OT1v1.times[next] - now.getHours();
                if (next === 0) hours += 24;
                let minutes = 60 - now.getMinutes();
                if (minutes < 60) hours -= 1;
                else minutes = 0;
                let timestr = "in " + (hours !== 0 ? hours + " hour" + (hours === 1 ? '' : 's') : '') + (hours !== 0 && minutes !== 0 ? ' and ' : '') + (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? '' : 's') : '');
                if (hours <= 0 && minutes <= 0) timestr = "should've already started";
                r += "<b>1v1:</b>";
                if (targetroom === user) r = r.replace(/<\/?b>/gi, '**');
                r += ` ${OT1v1.schedule[day][next]} ${timestr}`;
                rooms.push(r);
            }
            if (inNFE) {
                let r = ""
                let next = (NFE.last + 1) % NFE.times.length;
                let hours = NFE.times[next] - now.getHours();
                if (next === 0) hours += 24;
                let minutes = 60 - now.getMinutes();
                if (minutes < 60) hours -= 1;
                else minutes = 0;
                let timestr = "in " + (hours !== 0 ? hours + " hour" + (hours === 1 ? '' : 's') : '') + (hours !== 0 && minutes !== 0 ? ' and ' : '') + (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? '' : 's') : '');
                if (hours <= 0 && minutes <= 0) timestr = "should've already started";
                r += `<b>NFE</b> ${timestr}`;
                rooms.push(r);
            }
            targetroom.send(ret + rooms.join("<br>"));
        }
        else {
            if (room.id === '1v1') {
                let targetroom = user.can(room, '+') ? room : user;
                let next = (OT1v1.last + 1) % OT1v1.times.length;
                let day = next === 0 ? (OT1v1.day + 1) % 7 : OT1v1.day;
                let hours = OT1v1.times[next] - now.getHours();
                if (next === 0) hours += 24;
                let minutes = 60 - now.getMinutes();
                if (minutes < 60) hours -= 1;
                else minutes = 0;
                let timestr = "in " + (hours !== 0 ? hours + " hour" + (hours === 1 ? '' : 's') : '') + (hours !== 0 && minutes !== 0 ? ' and ' : '') + (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? '' : 's') : '');
                if (hours <= 0 && minutes <= 0) timestr = "should've already started";
                ret += `**${OT1v1.schedule[day][next]}** ${timestr}`;
                targetroom.send(ret);
            }
            else if (room.id === 'nfe') {
                let targetroom = user.can(room, '+') ? room : user;
                let next = (NFE.last + 1) % NFE.times.length;
                let hours = NFE.times[next] - now.getHours();
                if (next === 0) hours += 24;
                let minutes = 60 - now.getMinutes();
                if (minutes < 60) hours -= 1;
                else minutes = 0;
                let timestr = "in " + (hours !== 0 ? hours + " hour" + (hours === 1 ? '' : 's') : '') + (hours !== 0 && minutes !== 0 ? ' and ' : '') + (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? '' : 's') : '');
                if (hours <= 0 && minutes <= 0) timestr = "should've already started";
                ret += `**NFE** ${timestr}`;
                targetroom.send(ret);
            }
        }
    },
    '1v1om': function(room, user, args) {
        if (room != '1v1' && room != '1v1typechallenge') return false;
        if (!user.can(room, "%")) return false;
        let text = "/addhtmlbox ";
        text += "[Gen 7] 1v1, [Gen 7] UU 1v1, [Gen 7] LC 1v1, [Gen 7] 2v2 Doubles<br>";
        text += "<a href='https://www.smogon.com/forums/threads/1v1-old-gens.3646875/'>1v1 Past Gens</a>: [Gen 6] 1v1, [Gen 5] 1v1, [Gen 4] 1v1, [Gen 3] 1v1<br>";
        text += "<a href='https://www.smogon.com/forums/threads/1v1-oms.3648454/'>1v1 OMs</a>: AAA 1v1, AG 1v1, Inverse 1v1, Monotype 1v1, No Z 1v1, STABmons 1v1";
        room.send(text);
    },
    randtour: function(room, user, args) {
        let tourtypes = [
            "1v1",
            "2v2",
            "gen61v1",
            "gen51v1",
            "gen41v1",
            "gen31v1",
            "aaa1v1",
            "ag1v1",
            "inverse1v1",
            "mono1v1",
            "noz1v1",
            "stab1v1",
            "uu1v1",
            "monopoke"
        ]
        Commands[Utils.select(tourtypes)](room, user, args);
    },
    chill: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        Commands['1v1'](room, user, ["rr"]);
        room.startTour("chill");
    },
    '1v1': function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create 1v1, rr,, " + count);
                else room.send("/tour create 1v1, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create 1v1, elim,, " + count);
                else room.send("/tour create 1v1, elim");
            }
            else {
                room.send("/tour create 1v1, elim")
            }
        }
        else room.send("/tour create 1v1, elim");
        if (args[0] === 'o') room.startTour("o"); // Make a tour object manually instead of doing it in parser so the "Official" flag can be passed
    },
    '2v2': function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create 2v2, rr,, " + count);
                else room.send("/tour create 2v2, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create 2v2, elim,, " + count);
                else room.send("/tour create 2v2, elim");
            }
            else {
                room.send("/tour create 2v2, elim")
            }
        }
        else room.send("/tour create 2v2, elim");
        if (args[0] === 'o') room.startTour("o"); // Make a tour object manually instead of doing it in parser so the "Official" flag can be passed
    },
    oras1v1: 'gen61v1',
    oars: 'gen61v1',
    gen61v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create gen61v1, rr,, " + count);
                else room.send("/tour create gen61v1, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create gen61v1, elim,, " + count);
                else room.send("/tour create gen61v1, elim");
            }
            else {
                room.send("/tour create gen61v1, elim")
            }
        }
        else room.send("/tour create gen61v1, elim");
        if (args[0] === 'o') room.startTour("o"); // Make a tour object manually instead of doing it in parser so the "Official" flag can be passed
    },
    bw1v1: 'gen51v1',
    gen51v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create gen51v1, rr,, " + count);
                else room.send("/tour create gen51v1, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create gen51v1, elim,, " + count);
                else room.send("/tour create gen51v1, elim");
            }
            else {
                room.send("/tour create gen51v1, elim")
            }
        }
        else room.send("/tour create gen51v1, elim");
        if (args[0] === 'o') room.startTour("o"); // Make a tour object manually instead of doing it in parser so the "Official" flag can be passed
    },
    dp1v1: 'gen41v1',
    gen41v1: function(room, user, args) {
        if (!Tournament.formats['gen41v1']) return this.oldgen41v1(room, user, args);
        if (!canMakeTour(room, user)) return;
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create gen41v1, rr,, " + count);
                else room.send("/tour create gen41v1, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create gen41v1, elim,, " + count);
                else room.send("/tour create gen41v1, elim");
            }
            else {
                room.send("/tour create gen41v1, elim")
            }
        }
        else room.send("/tour create gen41v1, elim");
        if (args[0] === 'o') room.startTour("o"); // Make a tour object manually instead of doing it in parser so the "Official" flag can be passed

    },
    oldgen41v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        let bl = Banlist.gen41v1;
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send(`/tour create ${bl.meta}, rr,, ${count}`);
                else room.send(`/tour create ${bl.meta}, rr`);
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send(`/tour create ${bl.meta}, elim,, ${count}`);
                else room.send(`/tour create ${bl.meta}, elim`);
            }
            else {
                room.send(`/tour create ${bl.meta}, elim`)
            }
        }
        let ruleset = "/tour rules Team Preview, "
        if (bl.bans.length) ruleset += "-" + bl.bans.join(", -") + ", ";
        if (bl.unbans.length) ruleset += "+" + bl.unbans.join(", +") + ", ";
        ruleset = ruleset.substring(0, ruleset.length - 2);
        room.send("/tour name [Gen 4] 1v1");
        room.send(ruleset);
        if (args[0] === 'o') room.startTour("o"); // Make a tour object manually instead of doing it in parser so the "Official" flag can be passed
    },
    adv1v1: 'gen31v1',
    gsc1v1: 'gen31v1',
    gen31v1: function(room, user, args) {
        if (!Tournament.formats['gen31v1']) return this.oldgen31v1(room, user, args);
        if (!canMakeTour(room, user)) return;
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create gen31v1, rr,, " + count);
                else room.send("/tour create gen31v1, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create gen31v1, elim,, " + count);
                else room.send("/tour create gen31v1, elim");
            }
            else {
                room.send("/tour create gen31v1, elim")
            }
        }
        else room.send("/tour create gen31v1, elim");
        if (args[0] === 'o') room.startTour("o"); // Make a tour object manually instead of doing it in parser so the "Official" flag can be passed

    },
    oldgen31v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        let bl = Banlist.gen31v1;
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send(`/tour create ${bl.meta}, rr,, ${count}`);
                else room.send(`/tour create ${bl.meta}, rr`);
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send(`/tour create ${bl.meta}, elim,, ${count}`);
                else room.send(`/tour create ${bl.meta}, elim`);
            }
            else {
                room.send(`/tour create ${bl.meta}, elim`)
            }
        }
        let ruleset = "/tour rules Team Preview, "
        if (bl.bans.length) ruleset += "-" + bl.bans.join(", -") + ", ";
        if (bl.unbans.length) ruleset += "+" + bl.unbans.join(", +") + ", ";
        ruleset = ruleset.substring(0, ruleset.length - 2);
        room.send("/tour create " + bl.meta + ", elim");
        room.send("/tour name [Gen 3] 1v1");
        room.send(ruleset);
        if (args[0] === 'o') room.startTour("o"); // Make a tour object manually instead of doing it in parser so the "Official" flag can be passed
    },
    aaa1v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        let ruleset = "/tour rules !Obtainable Abilities, -" + Banlist.aaa['ability-bans'].join(', -') + ", -" + Banlist.aaa['mon-bans'].join(', -'); // Yes I realize this doesn't properly work if there aren't any ability-bans or mon-bans. I'll tackle that if we ever get to that point
        if (Banlist.aaa.unbans) ruleset += ", +" + Banlist.aaa['unbans'].join(', +')
        Commands['1v1'](room, user, args);
        room.send(ruleset);
        room.send("/tour name [Gen 7] AAA 1v1");
    },
    ag1v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        let ruleset = "/tour rules !" + Banlist.ag.join(', !') + ", +" + Banlist['1v1'].join(', +') + ", +Detect + Fightinium Z, +Focus Sash, +Perish Song";
        Commands['1v1'](room, user, args);
        room.send(ruleset);
        room.send("/tour name [Gen 7] AG 1v1");
    },
    inverse1v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        let ruleset = "/tour rules Inverse Mod, "
        if (Banlist.inverse.bans.length) ruleset += "-" + Banlist.inverse.bans.join(", -") + ", ";
        if (Banlist.inverse.unbans.length) ruleset += "+" + Banlist.inverse.unbans.join(", +") + ", ";
        ruleset = ruleset.substring(0, ruleset.length - 2);
        Commands['1v1'](room, user, args);
        room.send(ruleset);
        room.send("/tour name [Gen 7] Inverse 1v1");
    },
    monotype1v1: 'mono1v1',
    mono1v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        let ruleset = "/tour rules Same Type Clause, "
        if (Banlist.monotype.bans.length) ruleset += "-" + Banlist.monotype.bans.join(", -") + ", ";
        if (Banlist.monotype.unbans.length) ruleset += "+" + Banlist.monotype.unbans.join(", +") + ", ";
        ruleset = ruleset.substring(0, ruleset.length - 2);
        Commands['1v1'](room, user, args);
        room.send(ruleset);
        room.send("/tour name [Gen 7] Monotype 1v1");
    },
    noz1v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        Commands['1v1'](room, user, args);
        room.send("/tour rules Z-Move Clause");
        room.send("/tour name [Gen 7] No Z 1v1");
    },
    stabmons1v1: 'stab',
    stab1v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        let ruleset = "/tour rules STABmons Move Legality, "
        if (Banlist.stabmons.bans.length) ruleset += "-" + Banlist.stabmons.bans.join(", -") + ", ";
        if (Banlist.stabmons.unbans.length) ruleset += "+" + Banlist.stabmons.unbans.join(", +") + ", ";
        ruleset = ruleset.substring(0, ruleset.length - 2);
        Commands['1v1'](room, user, args);
        room.send(ruleset);
        room.send("/tour name [Gen 7] STABmons 1v1");
    },
    uu1v1: function(room, user, args) {
        if (!canMakeTour(room, user)) return;
        let ruleset = "/tour rules -" + Banlist.uu.join(', -');
        Commands['1v1'](room, user, args);
        room.send(ruleset);
        room.send("/tour name [Gen 7] UU 1v1");
    }
};
