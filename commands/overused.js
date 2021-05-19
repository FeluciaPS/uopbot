module.exports = {
    natdex: {
        '': 'gen8',
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen8overused', args, args[0] === "official" ? "[Gen 8] OURLT" : undefined);
        },
        gen7: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen7overused', args, args[0] === "official" ? "[Gen 7] OURLT" : undefined);
        },
		gen6: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen6overused', args, args[0] === "official" ? "[Gen 6] OURLT" : undefined);
        },
		gen5: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen5overused', args, args[0] === "official" ? "[Gen 5] OURLT" : undefined);
        },
		gen4: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen4overused', args, args[0] === "official" ? "[Gen 4] OURLT" : undefined);
        },
		gen3: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen3overused', args, args[0] === "official" ? "[Gen 3] OURLT" : undefined);
        },
		gen2: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen2overused', args, args[0] === "official" ? "[Gen 2] OURLT" : undefined);
        },
		gen2: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen1overused', args, args[0] === "official" ? "[Gen 1] OURLT" : undefined);
        },
    },
}