module.exports = {
    othermetas: {
        bh: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "bh", args);
            if (args[0] === "o") room.startTour("ot");
        },
        mnm: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "mnm", args);
            if (args[0] === "o") room.startTour("ot");
        },
        aaa: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "aaa", args);
            if (args[0] === "o") room.startTour("ot");
        },
        stab: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "stab", args);
            if (args[0] === "o") room.startTour("ot");
        },
        godlygift: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "godlygift", args);
            if (args[0] === "o") room.startTour("ot");
        },
        nfe: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "nfe", args);
            if (args[0] === "o") room.startTour("ot");
        },
        camomons: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "camomons", args);
            if (args[0] === "o") room.startTour("ot");
        },
        omotm: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "omotm", args);
            if (args[0] === "o") room.startTour("ot");
        },
        lcotm: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "lcotm", args);
            if (args[0] === "o") room.startTour("ot");
        },
        pic: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen9partnersincrime", args);
            if (args[0] === "o") room.startTour("ot");
        },
        convergence: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen9convergence", args);
            if (args[0] === "o") room.startTour("ot");
        },
        forte: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen9fortemons", args);
            if (args[0] === "o") room.startTour("ot");
        },
        shared: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen9sharedpower", args);
            if (args[0] === "o") room.startTour("ot");
        },
        crossevo: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen9crossevolution", args);
            if (args[0] === "o") room.startTour("ot");
        },
        revelation: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen9revelationmons", args);
            if (args[0] === "o") room.startTour("ot");
        },
        trademarked: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen9trademarked", args);
            if (args[0] === "o") room.startTour("ot");
        },
        inheritance: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen9inheritance", args);
            if (args[0] === "o") room.startTour("ot");
        }
    },
};
