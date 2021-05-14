module.exports = {
    othermetas: {
        bh: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, 'bh', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        mnm: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, 'mnm', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        aaa: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, 'aaa', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        stab: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, 'stab', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        camo: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, 'camo', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        omotm: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, 'omotm', args);
            if (args[0] === 'o') room.startTour('ot')
        },
        lcotm: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, 'lcotm', args);
            if (args[0] === 'o') room.startTour('ot')
        },
    },
};
