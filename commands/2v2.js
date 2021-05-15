let moncountrule = 'max team size = 4, min team size = 2, picked team size = 2';

module.exports = {
    '2v2': {
        '': 'gen8',
        gen8: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen82v2doubles', args);
        },
        gen7: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen7doublesou', args, '[Gen 7] 2v2 Doubles');
            room.send('/tour rules Accuracy Moves Clause, Z-Move Clause, +Gengar-Mega, -Kangaskhan-Mega, -Salamence-Mega, -Final Gambit, -Focus Sash, -Tapu Lele, +Snorlax, -Perish Song, ' + moncountrule);
        },
        oras: 'gen6',
        gen6: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen6doublesou', args, '[Gen 6] 2v2 Doubles');
            room.send('/tour rules Accuracy Moves Clause, -Perish Song, -Focus Sash, -Kangaskhan-Mega, ' + moncountrule);
        },
        bw: 'gen5',
        gen5: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen5doublesou', args, '[Gen 5] 2v2 Doubles');
            room.send('/tour rules Accuracy Moves Clause, -Perish Song, -Focus Sash, -Kingdra, ' + moncountrule);
        },
        dp: 'gen4',
        gen4: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen4doublesou', args, '[Gen 4] 2v2 Doubles');
            room.send('/tour rules Two vs Two, -Perish Song, -Focus Sash, ' + moncountrule);
        },
        inverse: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen82v2doubles', args, '[Gen 8] Inverse 2v2');
            room.send('/tour rules Inverse Mod');
        },
        monotype: 'mono',
        mono: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen82v2doubles', args, '[Gen 8] Monotype 2v2');
            room.send('/tour rules Same Type Clause');
        },
        chill: function (room, user, args) {
            if (!Utils.canMakeTour(room, user)) return;
            Utils.checkGenerator(room, 'gen82v2doubles', args);
            room.startTour('chill');
        },
        help: function (room, user, args) {
            if (!user.can(room, '%')) return;
            room.send('Usage: ``.2v2 [type]``.');
            let types = [];
            for (let i in Commands['2v2']) {
                if (typeof Commands['2v2'][i] !== 'string' && i !== 'help') types.push(i);
            }
            room.send('Valid types: ' + types.join(', '));
        },
        random: function (room, user, args) {
            if (!user.can(room, '%')) return;
            let types = [];
            for (let i in Commands['2v2']) {
                if (typeof Commands['2v2'][i] !== 'string' && i !== 'help' && i !== 'random' && i !== 'chill') types.push(i);
            }
            Commands['2v2'][Utils.select(types)](room, user, args);
        }
    }
};
