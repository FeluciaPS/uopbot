global.OT1v1 = {
    schedule: [ 
        ["ubers", "gen8", "gen8"],
        ["gen8", "gen8", "gen4"],
        ["gen3", "gen5", "gen7"],
        ["gen8", "mono", "gen8"],
        ["gen6", "gen8", "gen3"],
        ["gen4", "gen7", "gen5"],
        ["gen8", "gen6", "gen8"],
    ],
    times: [1, 9, 17],
    day: parseInt(require('fs').readFileSync("./data/last1v1.txt", 'utf8').split(" ")[0]),
    last: parseInt(require('fs').readFileSync("./data/last1v1.txt", 'utf8').split(" ")[1]),
    official: function() {
        let room = Rooms['1v1'];
        let now = new Date(Date.now());
        let day = now.getDay() % 7; // Modulus 7 isn't necessary but just in case this functions differently from what I think it does
        let mins = now.getMinutes();
        if (mins > 15) return;
        let hours = now.getHours();
        let now2 = new Date(Date.now() - 20*60*1000);
        let nhours = now2.getHours();
        let next = OT1v1.times[0];
        for (let i in OT1v1.times) {
            if (nhours >= OT1v1.times[i]) next = OT1v1.times[(parseInt(i)+1)%OT1v1.times.length];
        }
        if (hours === next) {
            if (room.tournament) {
                if (room.tournament.official) return;
                else {
                    room.send("/wall Official time. Ending ongoing tournament");
                    room.send("/tour end");
                    room.endTour();
                }
            }
            require('fs').writeFileSync("./data/last1v1.txt", `${day} ${next}`);
            this.day = day;
            this.last = next;
            let type = this.schedule[day][next];
            room.send('/modnote OFFICIAL: ' + type);
            Commands['1v1'][type](room, Users.staff, ["o"]);
        }
    }
}

let canMakeTour = function(room, user) {
    // I'm gonna use this a lot so why not make a function for it
    if (room != '1v1') return false;
    if (!user.can(room, "%")) return false;
    if (room.tournament) {
        room.send("A tournament is already going on.");
        return false;
    }
    return true;
}

let checkGenerator = function(room, meta, args, tourname = '') {
    if (args && args[0]) {
        if (args[0].startsWith("rr")) {
            let count = parseInt(args[0].substring(2));
            if (count) room.send(`/tour create ${meta}, rr,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, rr,,, ${tourname}`);
        }
        else if (args[0].startsWith("e")){
            let count = parseInt(args[0].substring(1));
            if (count) room.send(`/tour create ${meta}, elim,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
        }
        else {
            room.send(`/tour create ${meta}, elim,,, ${tourname}`)
        }
        if (toId(args[0]) === 'o') room.startTour('o');
    }
    else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
    if (toId(args[1]) === 'o') room.startTour('o');
}

let buildRuleset = function(meta) {
    let banlist = Banlist[meta];
    let ret = '/tour rules ';
    let rules = [];
    for (let x of banlist.addrules) rules.push(x);
    for (let x of banlist.remrules) rules.push(`!${x}`);
    for (let x of banlist.bans) rules.push(`-${x}`);
    for (let x of banlist.unbans) rules.push(`+${x}`);
    return ret + rules.join(', ');
}

module.exports = {
    inspireme: function(room, user, args) {
        if (!user.can(room, '+')) user.send('!randpoke 3, bst < 670, !lc, !nfe, !lcuber, !stall');
        else room.send('!randpoke 3, bst < 670, !lc, !nfe, !lcuber, !stall');
    },
    '1v1': {
        '': 'help',
        gen8: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen81v1', args);
        },
        gen7: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen71v1', args);
        },
        oras: 'gen6',
        gen6: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen61v1', args);
        },
        bw: 'gen5',
        gen5: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen51v1', args);
        },
        dp: 'gen4',
        gen4: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen41v1', args);
        },
        rse: 'gen3',
        gen3: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen31v1', args);
        },
        aaa: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen71v1', args, '[Gen 7] AAA 1v1');
            room.send(buildRuleset('aaa'));
        },
        ag: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen71v1', args, '[Gen 7] AG 1v1');
            room.send(buildRuleset('ag'));
        },
        inverse: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen71v1', args, '[Gen 7] Inverse 1v1');
            room.send(buildRuleset('inverse'));
        },
        monotype: 'mono',
        mono: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen81v1', args, '[Gen 8] Monotype 1v1');
            room.send(buildRuleset('monotype'));
        },
        nfe: function(room, user, args) {
            Commands.nfe1v1(room, user, args);
        },
        noz: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen71v1', args, '[Gen 7] No Z 1v1');
            room.send('/tour rules Z Move Clause');
        },
        stabmons: 'stab',
        stab: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen71v1', args, '[Gen 7] STABmons 1v1');
            room.send(buildRuleset('stabmons'));
        },
        ubers: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen81v1', args, '[Gen 8] Ubers 1v1');
            room.send(buildRuleset('ubers'));
        },
        uu: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen71v1', args, '[Gen 7] UU 1v1');
            room.send(buildRuleset('uu'));
        },
        chill: function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen71v1', args);
            room.startTour('chill');
        },
        '2v2': function(room, user, args) {
            if (!canMakeTour(room, user)) return;
            checkGenerator(room, 'gen82v2doubles', args);
        },
        help: function(room, user, args) {
            if (!user.can(room, '%')) return;
            room.send('Usage: ``.1v1 [type]``.');
            let types = [];
            for (let i in Commands['1v1']) {
                if (typeof Commands['1v1'][i] !== 'string' && i !== 'help') types.push(i);
            }
            room.send('Valid types: ' + types.join(', '));
        },
        random: function(room, user, args) {
            if (!user.can(room, '%')) return;
            let types = [];
            for (let i in Commands['1v1']) {
                if (typeof Commands['1v1'][i] !== 'string' && i !== 'help' && i !== 'random' && i !== 'chill') types.push(i);
            }
            Commands['1v1'][Utils.select(types)](room, user, args);
        }
    },
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
                let now2 = new Date(Date.now() - 20*60*1000);
                let nhours = now2.getHours();
                let next = OT1v1.times[0];
                for (let i in OT1v1.times) {
                    if (nhours >= OT1v1.times[i]) next = OT1v1.times[(parseInt(i)+1)%OT1v1.times.length];
                }
                now = new Date(Date.now());
                let day = now.getDay();
                let hours = next - now.getHours();
                if (OT1v1.times.indexOf(next) === 0) {
                    hours += 24;
                    day = (day + 1) % 7;
                }
                let minutes = 60 - now.getMinutes();
                if (minutes < 60) hours -= 1;
                else minutes = 0;
                if (hours >= 24) hours -= 24;
                let timestr = "in " + (hours !== 0 ? hours + " hour" + (hours === 1 ? '' : 's') : '') + (hours !== 0 && minutes !== 0 ? ' and ' : '') + (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? '' : 's') : '');
                if (hours <= 0 && minutes <= 0) timestr = "should've already started";
                r += "<b>1v1:</b>";
                if (targetroom === user) r = r.replace(/<\/?b>/gi, '**');
                let meta = OT1v1.schedule[day][OT1v1.times.indexOf(next)];
                if (meta !== '2v2') meta += ' 1v1';
                r += `${meta} ${timestr}`;
                rooms.push(r);
            }
            if (inNFE) {
                let r = ""
                let now2 = new Date(Date.now() - 20*60*1000);
                let nhours = now2.getHours();
                let next = NFE.times[0];
                for (let i in NFE.times) {
                    if (nhours >= NFE.times[i]) next = NFE.times[(parseInt(i)+1)%NFE.times.length];
                }
                now = new Date(Date.now());
                let hours = next - now.getHours();
                if (next === 0) hours += 24;
                let minutes = 60 - now.getMinutes();
                if (minutes < 60) hours -= 1;
                else minutes = 0;
                if (hours >= 24) hours -= 24;
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
                let now2 = new Date(Date.now() - 20*60*1000);
                let nhours = now2.getHours();
                let next = OT1v1.times[0];
                for (let i in OT1v1.times) {
                    if (nhours >= OT1v1.times[i]) next = OT1v1.times[(parseInt(i)+1)%OT1v1.times.length];
                }
                now = new Date(Date.now());
                let day = now.getDay();
                let hours = next - now.getHours();
                if (OT1v1.times.indexOf(next) === 0) {
                    hours += 24;
                    day = (day + 1) % 7;
                }
                let minutes = 60 - now.getMinutes();
                if (minutes < 60) hours -= 1;
                else minutes = 0;
                if (hours >= 24) hours -= 24;
                let timestr = "in " + (hours !== 0 ? hours + " hour" + (hours === 1 ? '' : 's') : '') + (hours !== 0 && minutes !== 0 ? ' and ' : '') + (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? '' : 's') : '');
                if (hours <= 0 && minutes <= 0) timestr = "should've already started";
                let meta = OT1v1.schedule[day][OT1v1.times.indexOf(next)];
                if (meta !== "2v2") meta += ' 1v1';
                ret += `**${meta}** ${timestr}`;
                targetroom.send(ret);
            }
            else if (room.id === 'nfe') {
                let targetroom = user.can(room, '+') ? room : user;
                let now2 = new Date(Date.now() - 20*60*1000);
                let nhours = now2.getHours();
                let next = NFE.times[0];
                for (let i in NFE.times) {
                    if (nhours >= NFE.times[i]) next = NFE.times[(parseInt(i)+1)%NFE.times.length];
                }
                now = new Date(Date.now());
                let hours = next - now.getHours();
                if (next === 0) hours += 24;
                let minutes = 60 - now.getMinutes();
                if (minutes < 60) hours -= 1;
                else minutes = 0;
                if (hours >= 24) hours -= 24;
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
};
