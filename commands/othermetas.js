let checkGenerator = function (room, meta, args, tourname = '') {
    if (args && args[0]) {
        if (args[0].startsWith("rr")) {
            let count = parseInt(args[0].substring(2));
            if (count) room.send(`/tour create ${meta}, rr,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, rr,,, ${tourname}`);
        } else if (args[0].startsWith("e")) {
            let count = parseInt(args[0].substring(1));
            if (count) room.send(`/tour create ${meta}, elim,, ${count}, ${tourname}`);
            else room.send(`/tour create ${meta}, elim,,, ${tourname}`);
        } else {
            room.send(`/tour create ${meta}, elim,,, ${tourname}`)
        }
    } else {
        room.send(`/tour create ${meta}, elim,,, ${tourname}`);
        room.send(`/tour scouting disallow`);
        room.send(`/tour forcepublic on`);
        room.send(`/tour forcetimer on`);
        room.send(`/wall The daily tour!`);
        room.send(`!om ${meta}`);
        if (meta !== 'omotm' && meta !== 'lcotm') {
            room.send(`!rfaq ${meta}samples`);
        }
    }
}

module.exports = {
    othermetas: {
        bh: function (room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'bh', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        mnm: function (room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'mnm', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        aaa: function (room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'aaa', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        stab: function (room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'stab', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        camo: function (room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'camo', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        omotm: function (room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'omotm', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        lcotm: function (room, user, args) {
            if (!user.can(room, "%")) return false;
            if (room.tournament) {
                room.send("A tournament is already going on.");
                return false;
            }
            checkGenerator(room, 'lcotm', args);
            if (args[0] === 'o') room.startTour('ot')
        },
    },
};
