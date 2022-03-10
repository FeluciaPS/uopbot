module.exports = {
    bdspmetagames: {
        ou: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen8bdspou", args);
            if (args[0] === "o") room.startTour("ot");
        },
        uu: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen8bdspuu", args);
            if (args[0] === "o") room.startTour("ot");
        },
        ru: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen8bdspru", args);
            if (args[0] === "o") room.startTour("ot");
        },
        nu: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen8bdspnu", args);
            if (args[0] === "o") room.startTour("ot");
        },
        lc: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen8bdsplc", args);
            if (args[0] === "o") room.startTour("ot");
        },
        ubers: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen8bdspubers", args);
            if (args[0] === "o") room.startTour("ot");
        },
        rands: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen8bdsprandombattle", args);
            if (args[0] === "o") room.startTour("ot");
        },
        mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return false;
            Utils.checkGenerator(room, "gen8bdspmonotype", args);
            if (args[0] === "o") room.startTour("ot");
        },
    },
};
