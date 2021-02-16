/**
 * Returns a Date object converted to Eastern Time
 */
let getESTDate = function () {
    let now = Date.now();

    // Subtract 5 hours to convert from UTC to EST
    let est = now - 5 * 60 * 60 * 1000

    return new Date(est);
}

/*
 *   
 */
global.Officials = {
    '1v1': {
        schedule: [
            ["gen4", "gen7", "gen6", "monopoke"],
            ["gen8", "gen5", "gen4", "gen8"],
            ["gen7", "monopoke", "gen8", "gen6"],
            ["gen5", "gen8", "gen7", "gen4"],
            ["gen3", "gen8", "gen6", "gen7"],
            ["gen8", "gen5", "gen4", "gen8"],
            ["gen6", "gen3", "gen8", "gen5"],
        ],
        times: [1, 7, 13, 19],
    }
}

module.exports = {
    nextot: function (room, user, args) {
        let now = new Date(Date.now());
        let rooms = [];
        let targetroom = false;
        for (let i in user.rooms) {
            let robj = Rooms[i];
            if (room !== user && robj !== room) continue;
            if (!robj.OTobj) continue;
            if (!Users.self.can(robj, '*')) continue; // bot isn't bot in the room, can't start official tours, so no point displaying them.
            if (Users.self.rooms[i] === "*") targetroom = robj; // this is useful later 
            let obj = robj.OTobj;

            let r = ""
            let now2 = new Date(Date.now() - 5 * 60 * 1000);
            let nhours = now2.getHours();
            let next = obj.times[0];
            for (let i in obj.times) {
                if (nhours >= obj.times[i]) next = obj.times[(parseInt(i) + 1) % obj.times.length];
            }
            let hours = next - now.getHours();
            //if (next === 0) hours += 24;
            let minutes = 60 - now.getMinutes();
            if (minutes < 60) hours -= 1;
            else minutes = 0;
            while (hours >= 24) hours -= 24;
            let meta = '';
            next = obj.times.indexOf(next);
            if (obj.formats) meta = obj.formats[next];
            else {
                let day = now.getDay() - 1;
                if (day < 0) day = 6;
                let hours = next - now.getHours();
                if (hours < 0) {
                    day = (day + 1) % 7;
                }
                meta = obj.schedule[day][next];
            }
            while (hours < 0) hours += 24;
            let timestr = "in " + (hours !== 0 ? hours + " hour" + (hours === 1 ? '' : 's') : '') + (hours !== 0 && minutes !== 0 ? ' and ' : '') + (minutes !== 0 ? minutes + " minute" + (minutes === 1 ? '' : 's') : '');
            if (hours >= 23 && minutes >= 55) timestr = "should've just started";
            r += `<b>${robj.name}</b> - ${meta} ${timestr}`;
            rooms.push(r);
        }
        if (!rooms.length) {
            if (room === user) return user.send("You're not in any rooms that have Official Tours configured");
            else return user.send('No official tours configured for this room');
        }
        if (rooms.length === 1) {
            rooms[0] = rooms[0].replace('<b>', '**').replace('</b>', '**');
            if (!user.can(room, '+')) { // room is either PM or permission denied
                return user.send(rooms[0]);
            } else return room.send(rooms[0]);
        }
        // multiple rooms, command was used in PM.
        let ret = rooms.join('<br>');
        targetroom.send(`/pminfobox ${user.id}, ${ret}`);
    }
}