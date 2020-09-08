global.NatDex = { // this doesn't belong here but who cares
    times: [ 17, 18, 21, 22, 23 ],
    last: parseInt(require('fs').readFileSync("./data/lastnatdex.txt")),
    official: function() {
        let room = Rooms['nationaldex'];
        let now = new Date(Date.now());
        if (this.last === -1) return;
        let next = (this.last + 1) % this.times.length;
        let mins = now.getMinutes();
        if (mins > 10) return;
        let hours = now.getHours();
        if (hours === this.times[next]) {
            if (room.tournament) {
                if (room.tournament.official) return;
                else {
                    room.send("/wall Official time. Ending ongoing tournament");
                    room.send("/tour end");
                    room.endTour();
                }
            }
            require('fs').writeFileSync("./data/lastnatdex.txt", next);
            this.last = next;
            console.log("natdex official")
            Commands['natdex']['gen8'](room, Users.staff, ["o"]);
        }
    }
}

global.NatDexOMs = { // this doesn't belong here but who cares
    schedule: [
        ["1v1", "1v1"],
        ["bh", "bh"],
        ["stab", "stab"],
        ["aaa", "aaa"],
        ["camo", "camo"],
        ["uu", "uu"],
        ["mono", "mono"],
    ],
    times: [ 16, 20 ],
    day: parseInt(require('fs').readFileSync("./data/lastnatdexom.txt", 'utf8').split(" ")[0]),
    last: parseInt(require('fs').readFileSync("./data/lastnatdexom.txt", 'utf8').split(" ")[1]),
    started: false,
    official: function() {
        let room = Rooms['nationaldexoms'];
        let now = new Date(Date.now());
        let day = now.getDay()-1;
        if (day < 0) day = 6;
        if (!this.times.includes(now.getHours())) return;
        if (now.getMinutes() > 5) return;
        let nextid = this.times.indexOf(now.getHours());
        if (this.started) {
            return console.log('tour has already started');
        }
        if (room.tournament) {
            if (room.tournament.official) {
                return console.log('National Dex OMs: Official tour already exists');
            } else {
                room.send("/wall Official time. Ending ongoing tournament.");
                room.send("/tour end");
                room.endTour();
            }
        }
        let type = this.schedule[day][nextid];
        room.send('/modnote OFFICIAL: ' + type);
        this.started = true;
        Commands['natdex'][type](room, Users.staff, ["o"]);
        setTimeout(() => this.started = false, 30*1000*60);
    }
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

module.exports = {
    natdex: {
        '': 'gen8',
        gen8: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'gen8nationaldex', args);
        },
        uu: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'gen8nationaldexuu', args);
        },
        bh: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'gen8nationaldexbh', args);
            room.send('!rfaq BH');
        },
        '1v1': function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'gen81v1', args, '[Gen 8] National Dex 1v1');
            room.send(buildRuleset('natdex'));
        },
        stab: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'gen8stabmons', args, '[Gen 8] National Dex STABmons');
            room.send(buildRuleset('ndstab'));
        },
        aaa: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'gen8almostanyability', args, '[Gen 8] National Dex AAA');
            room.send(buildRuleset('ndaaa'));
        },
        mono: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'gen8monotype', args, '[Gen 8] National Dex Monotype');
            room.send(buildRuleset('ndmono'));
        },
        camo: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'gen8camomons', args, '[Gen 8] National Dex Camomons');
            room.send(buildRuleset('ndcamo'));
        },
    },
  }
