global.NatDex = { // this doesn't belong here but who cares
    times: [ 0, 20, 21, 22, 23 ],
    formats: [ 'uu', 'uu', 'gen8', 'gen8', 'gen8' ],
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
            let args = ["o"];
            if (next < 2) args = []
            Commands['natdex'][this.formats[next]](room, Users.staff, args);
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
            checkGenerator(room, 'gen8nationaldex', args, '[Gen 8] National Dex UU');
            room.send('/tour rules -Blacephalon, -Chansey, -Clefable, -Corviknight, -Darmanitan-Galar, -Dracovish, -Dragapult, -Excadrill, -Ferrothorn, -Garchomp, -Gliscor, -Greninja, -Greninja-Ash, -Heatran, -Kartana, -Kommo-o, -Landorus-Therian, -Lopunny-Mega, -Magearna, -Magnezone, -Melmetal, -Metagross-Mega, -Pelipper, -Rotom-Heat, -Scizor-Mega, -Serperior, -Slowbro, -Swampert-Mega, -Tangrowth, -Tapu Fini, -Tapu Koko, -Tapu Lele, -Tornadus-Therian, -Toxapex, -Volcarona, -Zapdos, -Aegislash, -Alakazam-Mega, -Azumarill, -Charizard-Mega-X, -Charizard-Mega-Y, -Cinderace, -Deoxys-Defense, -Dragonite, -Gallade-Mega, -Grimmsnarl, -Hawlucha, -Heracross-Mega, -Hoopa-Unbound, -Hydreigon, -Latias-Mega, -Latios, -Latios-Mega, -Manaphy, -Mawile-Mega, -Medicham-Mega, -Mew, -Pinsir-Mega, -Staraptor, -Thundurus-Base, -Victini, -Aurora Veil, -Drizzle, -Drought');
            room.send('!rfaq National Dex UU');
        }
    },
  }
