global.OtherMetas = {
    schedule: [
        ['bh'],
        ['mnm'],
        ['aaa'],
        ['stab'],
        ['camo'],
        ['omotm'],
        ['lcotm'],
    ],
    times: [21],
    hasStarted: false,
    official: function() {
        let room = Rooms['othermetas'];
        let now = new Date(Date.now());
        let day = now.getDay()-1;
        if (day < 0) day = 6;
        if (!this.times.includes(now.getHours())) return;
        if (now.getMinutes() > 5) return;
        let nextid = OtherMetas.times.indexOf(now.getHours());
        if (this.hasStarted) return console.log('Tour has already started');
        if (room.tournament) {
            if (room.tournament.official) return console.log('OM: Official tour already exists');
            else {
                room.send("/wall Official time. Ending ongoing tournament");
                room.send("/tour end");
                room.endTour();
            }
        }
        let type = this.schedule[day][nextid];
        room.send('/modnote OFFICIAL: ' + type);
        this.hasStarted = true;
        Commands['othermetas'][type](room, Users.staff, ["o"]);
        setTimeout(() => {OtherMetas.hasStarted = false}, 30*1000*60);
    }
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
    }
    else {
        room.send(`/tour create ${meta}, elim,,, ${tourname}`);
        room.send(`/wall The daily tour!`);
        room.send(`!om ${meta}`);
        if (meta !== 'omotm' && meta !== 'lcotm') {
            room.send(`!rfaq ${meta}samples`);
        }
    }
}

module.exports = {
    othermetas: {
        bh: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'bh');
            if (args[0] === 'o') room.startTour('ot')
        },
        mnm: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'mnm', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        aaa: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'aaa', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        stab: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'stab');
            if (args[0] === 'o') room.startTour('ot')
        },
        camo: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'camo');
            if (args[0] === 'o') room.startTour('ot')
        },
        omotm: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'omotm');
            if (args[0] === 'o') room.startTour('ot')
        },
        lcotm: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'lcotm');
            if (args[0] === 'o') room.startTour('ot')
        },
    },
};
