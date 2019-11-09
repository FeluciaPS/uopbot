global.NFE = {
    times: [ 1, 9, 15, 20 ],
    last: parseInt(require('fs').readFileSync("./data/lastnfe.txt")),
    official: function() {
        let room = Rooms['nfe'];
        let now = new Date(Date.now());
        if (this.last === -1) return;
        let next = (this.last + 1) % this.times.length;
        let mins = now.getMinutes();
        if (mins > 9) return;
        let hours = now.getHours();
        if (hours === this.times[next]) {
            if (room.tournament) {
                if (room.tournament.official) return;
                else {
                    room.send("/wall Official time. Ending ongoing tournament");
                    room.send("/tour end");
                }
            }
            require('fs').writeFileSync("./data/lastnfe.txt", next);
            this.last = next;
            room.send("/tour create nfe, elim")
            room.startTour("o");
        }
    }
}

let isGenerator = function(arg) {
    if (arg.startsWith("rr")) {
        if (arg.length === 2) return true;
        if (parseInt(arg.substring(2))) return true;
        return false;
    }
    else if (arg.startsWith("e")) {
        if (arg.length === 1) return true;
        if (parseInt(arg.substring(1))) return true;
        return false;
    }
    else {
        return false;
    }
}

module.exports = {
    nfe: function(room, user, args) {
        if (room.id !== 'nfe') return;
        if (!user.can(room, '%')) return;
        if (room.tournament) return room.send("A tournament is already going on");
        if (room.tourcool && !user.can(room, '%')) return room.send("Tours are on cooldown for now");
        if (toId(args[0]) === "cap") {
            args.shift();
            this.capnfe(room, user, args);
        }
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create nfe, rr,, " + count);
                else room.send("/tour create nfe, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create nfe, elim,, " + count);
                else room.send("/tour create nfe, elim");
            }
            else {
                room.send("/tour create nfe, elim")
            }
        }
        else room.send("/tour create nfe, elim")
        if (toId(args[0]) === 'blitz') {
		room.send("/tour rules Blitz");
		room.send("/tour forcetimer on");
	}
	if (toId(args[0]) === 'inverse') {
		room.send('/tour rules Inverse Mod');
		room.send('/tour name [Gen 7] Inverse NFE');
	}
	if (toId(args[0]) === 'aaa') {
		room.send('/tour rules [Gen 7] Almost Any Ability, +Doublade, +Gligar, +Golbat, +Magneton, +Porygon2, +Type: Null, +Vigoroth, -Electabuzz');
		room.send('/tour name [Gen 7] Almost Any Ability NFE');
	}
        if (args[0] === 'o' && user.can(room, '%')) room.startTour("o");
    },
    gen6nfe: function (room, user, args) {
        if (room.id !== 'nfe' || !user.can(room, '%')) return;
        
        if (room.tournament) return room.send("A tournament is already going on");
        if (room.tourcool && !user.can(room, '%')) return room.send("Tours are on cooldown for now");
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create gen6ru, rr,, " + count);
                else room.send("/tour create gen6ru, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create gen6ru, elim,, " + count);
                else room.send("/tour create gen6ru, elim");
            }
            else {
                room.send("/tour create gen6ru, elim");
            }
        }
        else room.send("/tour create gen6ru, elim");
        room.send("/tour name [Gen 6] NFE");
        room.send("/tour rules [Gen 7] NFE, +UU, +OU, +UUBL, +RUBL, +NUBL, +PUBL, +PU, +Uber, -Chansey, -Doublade, -Fletchinder, -Gligar, -Golbat, -Gurdurr, -Haunter, -Machoke, -Magneton, -Piloswine, -Porygon2, -Rhydon, -Servine, -Scyther, -Sneasel, -Vigoroth");
        if (args[0] === 'o' && user.can(room, '%')) room.startTour("o");
    },
    gen5nfe: function (room, user, args) {
        if (room.id !== 'nfe' || !user.can(room, '%')) return;
        
        if (room.tournament) return room.send("A tournament is already going on");
        if (room.tourcool && !user.can(room, '%')) return room.send("Tours are on cooldown for now");
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create gen5ubers, rr,, " + count);
                else room.send("/tour create gen5ubers, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create gen5ubers, elim,, " + count);
                else room.send("/tour create gen5ubers, elim");
            }
            else {
                room.send("/tour create gen5ubers, elim");
            }
        }
        else room.send("/tour create gen5ubers, elim");
        room.send("/tour name [Gen 5] NFE");
        room.send("/tour rules [Gen 7] NFE, +NU, +RU, +UU, +OU, +UUBL, +RUBL, +NUBL, +PUBL, +PU, +Uber, -Chansey, -Dusclops, -Fraxure, -Gligar, -Golbat, -Gurdurr, -Haunter, -Machoke, -Magneton, -Riolu, -Rhydon, -Piloswine, -Porygon2, -Scyther, -Vigoroth");
        if (args[0] === 'o' && user.can(room, '%')) room.startTour("o");
    },
    gen4nfe: function (room, user, args) {
        if (room.id !== 'nfe' || !user.can(room, '%')) return;
        
        if (room.tournament) return room.send("A tournament is already going on");
        if (room.tourcool && !user.can(room, '%')) return room.send("Tours are on cooldown for now");
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create gen4uu, rr,, " + count);
                else room.send("/tour create gen4uu, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create gen4uu, elim,, " + count);
                else room.send("/tour create gen4uu, elim");
            }
            else {
                room.send("/tour create gen4uu, elim");
            }
        }
        else room.send("/tour create gen4uu, elim");
        room.send("/tour name [Gen 4] NFE");
        room.send("/tour rules [Gen 7] NFE, +NU, +RU, +UU, +OU, +UUBL, +RUBL, +NUBL, +PUBL, +PU, +Uber, -Chansey, -Chansey, -Dragonair, -Dusclops, -Electabuzz, -Haunter, -Machoke, -Magmar, -Magneton, -Porygon2, -Rhydon, -Scyther, -Sneasel");
        if (args[0] === 'o' && user.can(room, '%')) room.startTour("o");
    },
    nfe1v1: function (room, user, args) {
        if (room.id === 'nfe') if (!user.can(room, '%')) return;
        else if (room.id === '1v1') if (!user.can(room, '%')) return;
        else return;
        
        let otherroom = room.id === "1v1" ? "nfe" : "1v1";
        otherroom = Rooms[otherroom];
        if (room.tournament) return room.send("A tournament is already going on");
        if (room.tourcool && !user.can(room, '%')) return room.send("Tours are on cooldown for now");
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create 1v1, rr,, " + count);
                else room.send("/tour create 1v1, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create 1v1, elim,, " + count);
                else room.send("/tour create 1v1, elim");
            }
            else {
                room.send("/tour create 1v1, elim");
            }
        }
        else room.send("/tour create 1v1, elim");
        room.send("/tour name [Gen 7] NFE 1v1");
        room.send("/tour rules [Gen 7] NFE, -Dusclops");
        otherroom.send(`NFE 1v1 tournament in <<${room.id}>>`);
        if (args[0] === 'o' && user.can(room, '%')) room.startTour("o");
    },
    capnfe: function (room, user, args) {
        if (room.id !== 'nfe' || !user.can(room, '%')) return;
        
        if (room.tournament) return room.send("A tournament is already going on");
        if (room.tourcool && !user.can(room, '%')) return room.send("Tours are on cooldown for now");
        if (args) {
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send("/tour create NFE, rr,, " + count);
                else room.send("/tour create NFE, rr");
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send("/tour create NFE, elim,, " + count);
                else room.send("/tour create NFE, elim");
            }
            else {
                room.send("/tour create NFE, elim");
            }
        }
        else room.send("/tour create NFE, elim");
        room.send("/tour name [Gen 7] CAP NFE");
        room.send("/tour rules +Doublade, +Magneton, +Piloswine, +Sneasel, +Type: Null, +Vigoroth, Allow CAP");
        if (args[0] === 'o' && user.can(room, '%')) room.startTour("o");
    },
    tourcool: function (room, user, args, val) {
        if (!user.can(room, '%')) return;
        room.tourcool = true;
        let time = isNaN(parseInt(args[0])) ? 30*60*1000 : parseInt(args[0])*60*1000
        setTimeout(function(room) {
            room.tourcool = false;
        }, time, room);
        room.send("Tours are on cooldown for the next " + time/60000 + " minutes.");
    },
    oldnfe: function (room, user, args, val) {
        if (room.id !== 'nfe') return;
        if (!user.can(room, '%')) return;
        if (room.tournament) return room.send("A tournament is already going on");
        let mode = "none";
        let meta = Banlist.nfe.meta;
        if (args) {
            if (args[1]) mode = toId(args[1]);
            meta = mode === "1v1" ? "1v1" : Banlist.nfe.meta;
            if (args[0].startsWith("Rules:")) {
                args[0] = "e";
                args[1] = "none";
                args[2] = val.substring(6);
            }
            if (args[0] && !isGenerator(args[0])) {
                args[1] = args[0];
                args[0] = "e";
            }
            if (args[0].startsWith("rr")) {
                let count = parseInt(args[0].substring(2));
                if (count) room.send(`/tour create ${meta}, rr,, ` + count);
                else room.send(`/tour create ${meta}, rr`);
            }
            else if (args[0].startsWith("e")){
                let count = parseInt(args[0].substring(1));
                if (count) room.send(`/tour create ${meta}, elim,, ` + count);
                else room.send(`/tour create ${meta}, elim`);
            }
            else {
                room.send(`/tour create ${meta}, elim`)
            }
        }
        else room.send(`/tour create ${meta}, elim`);

        // ----------- //
        // set ruleset //
        // ----------- //
        let ruleset = "/tour rules ";
        if (!args[2]) args[2] = "";
        
        // Tour mode things
        if (mode === "inverse") ruleset += "Inverse Mod, ";
        if (mode === "monotype") ruleset += "Same Type Clause, ";
        
        if (Banlist.nfe.bans.length) ruleset += "-" + Banlist.nfe.bans.join(", -");
        if (Banlist.nfe.unbans.length) ruleset += ", +" + Banlist.nfe.unbans.join(", +");
        
        // -------------------------------- //
        // Start sending things to the room //
        // -------------------------------- //
        room.send(ruleset);
        
        // Set tour name
		if (mode === "inverse") room.send("/tour name Inverse NFE");
        else if (mode === "monotype") room.send("/tour name Monotype NFE");
        else if (mode === "1v1") room.send("/tour name [Gen 7] NFE 1v1");
        else room.send("/tour name [Gen 7] NFE");
    },
    board: function (room, user, args) {
        if (room.id !== "nfe") return;
        let pm = user.can(room, "%") ? room : user;
        pm.send('Leaderboards are temporarily out of order.');
    },
    forceend: function (room, user, args) {
        if (room.id !== 'nfe') return;
        if (!user.can(room, '%')) return;
        room.send("/tour end");
    }
}
