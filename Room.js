class Room {
    constructor(id) {
        this.users = {};
        this.id = id;
        this.tournament = false;
        this.pasttours = [];
        this.lasttour = [false, false, 0];
        this.loadSettings();
    }

    loadSettings() {
        const PATH = `./rooms/${this.id}.json`;
        if (!FS.existsSync(PATH)) FS.copyFileSync("./rooms/config-example.json", PATH);
        this.settings = JSON.parse(FS.readFileSync(PATH));
        this.repeat = this.settings.repeat;
        if (this.settings.hellothere) {
            this.hellothere = {
                last: 0,
            };
        }
        if (this.settings.pasttours) {
            this.pasttours = this.settings.pasttours;
        }
        if (this.settings.lasttour) {
            this.lasttour = this.settings.lasttour;
        }
    }

    saveSettings(load = false) {
        const PATH = `./rooms/${this.id}.json`;
        this.settings.repeat = this.repeat;
        this.settings.pasttours = this.pasttours;
        this.settings.lasttour = this.lasttour;
        let settings = JSON.stringify(this.settings, null, 4);
        FS.writeFileSync(PATH, settings);
        if (load) this.loadSettings();
    }

    send(message) {
        if (this.settings.disabled) return;
        if (typeof message === typeof {}) {
            for (let i in message) {
                Send(this.id, message[i]);
            }
            return;
        }
        Send(this.id, message);
    }

    runChecks(message) {
        let now = Date.now();
        if (this.repeat) {
            let diff = (now - this.repeat.last) / 60000;
            this.repeat.msgs += 1;
            if (this.repeat.msgs >= this.repeat.minmsg && diff >= this.repeat.mintime) {
                this.repeat.last = now;
                this.repeat.msgs = 0;
                this.send(this.repeat.message);
                this.saveSettings();
            }
        }
        if (this.hellothere && toId(message) === "hellothere") {
            if (now - this.hellothere.last > 5 * 60 * 1000) {
                this.hellothere.last = now + Math.floor(Math.random() * 30 * 60 * 1000);
                return this.send("General Kenobi!");
            }
        }
    }

    leave(room) {
        for (let u in this.users) {
            let user = this.users[u];
            user.leave(this.id);
        }
        bot.emit("dereg", "room", this.id);
    }

    startTour(settings) {
        this.lasttour[0] = Date.now();
        this.tournament = new Tournament.Tournament(this, settings);
    }

    endTour(data) {
        if (this.tournament) this.tournament.end(data);
        if (this.tournament.toString()) {
            this.pasttours.push(this.tournament.toString());
            this.lasttour[0] = Date.now();
            this.lasttour[1] = this.tournament.toString();
            this.lasttour[2] = 0;
        }
        while (this.pasttours.join(", ").length > 250) this.pasttours.shift();
        this.tournament = false;
        this.saveSettings();
    }

    updateTourRules() {
        if (!this.tournament)
            throw new Error("This shouldn't happen but bot tried to update tour rules without a tour running");
        this.send(this.tournament.buildRules());
    }

    rename(oldname, newname, idle = false) {
        let id = toId(newname);
        let name = newname.substring(1);
        let rank = newname.charAt(0);
        if (!(id in Users)) {
            Utils.ObjectRename(Users, oldname, id);
            Users[id].rename(newname, idle);
        }
        Users[id].isIdle = idle;
        Utils.ObjectRename(this.users, oldname, id);
        Users[id].rooms[this.id] = rank;
    }

    can(user, rank) {
        if (!(toId(user) in Users)) return false;
        return Users[user].can(this.id, rank);
    }
}

Room.prototype.toString = function () {
    return this.id;
};

exports.add = function (id) {
    this[id] = new Room(id);
};
