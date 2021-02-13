global.OtherMetas = {
    time: 21,
    formats: [ 'lcotm', 'bh', 'mnm', 'aaa', 'stab', 'camo', 'omotm' ],
    last: parseInt(require('fs').readFileSync("./data/lastothermetas.txt")),
    official: function() {
        let room = Rooms['othermetas'];
        let now = new Date(Date.now());
        let day = now.getDay();
        if (this.last === -1) return;
        let next = (this.last + 1);
        let mins = now.getMinutes();
        if (mins > 10) return;
        let hours = now.getHours();
        if (hours === this.time) {
            if (room.tournament) {
                if (room.tournament.official) return;
                else {
                    room.send("/wall Daily time. Ending ongoing tournament");
                    room.send("/tour end");
                    room.endTour();
                }
            }
            require('fs').writeFileSync("./data/lastothermetas.txt", next);
            this.last = next;
            console.log("other metas daily");
            Commands['othermetas'][this.formats[day]](room, Users.staff);
        }
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
        if (toId(args[0]) === 'o') room.startTour('o');
    }
    else {
        room.send(`/tour create ${meta}, elim,,, ${tourname}`);
        room.send(`/wall The daily tour!`);
        room.send(`!om ${meta}`);
        if (meta !== 'omotm' && meta !== 'lcotm') {
            room.send(`!rfaq ${meta}samples`);
        }
    }
    if (toId(args[1]) === 'o') room.startTour('o');
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
        },
        mnm: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'mnm', args);
        },
        aaa: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'aaa', args);
        },
        stab: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'stab');
        },
        camo: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'camo');
        },
        omotm: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'omotm');
        },
        lcotm: function(room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'lcotm');
        },
    },
};
