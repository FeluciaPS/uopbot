class Room {
    constructor(id) {
        this.users = {};
        this.id = id;
        this.tournament = false;
		this.pasttours = [];
    }
    
    send(message) {
        if (typeof message === typeof {}) {
            for (let i in message) {
                Send(this.id, message[i])
            }
            return;
        }
        Send(this.id, message);
    }
    
    leave(room) {
        for (let u in this.users) {
            let user = this.users[u];
            user.leave(this.id);
        }
        bot.emit('dereg', 'room', this.id);
    }
    
    startTour(settings) {
        this.tournament = new Tournament.Tournament(this, settings);
    }
    
    endTour(data) {
        if (this.tournament) this.tournament.end(data);
        this.tournament = false;
    }
    
    updateTourRules() {
        if (!this.tournament) throw new Error("This shouldn't happen but bot tried to update tour rules without a tour running");
        this.send(this.tournament.buildRules());
    }

    rename(oldname, newname) {
        let id = toId(newname);
        let name = newname.substring(1);
        let rank = newname.charAt(0);
        if (!(id in Users)) {
            Utils.ObjectRename(Users, oldname, id);
            Users[id].rename(newname);
        }
        Utils.ObjectRename(this.users, oldname, id);
        Users[id].rooms[this.id] = rank;    
    }
    
    can(user, rank) {
        if (!(toId(user) in Users)) return false;
        return Users[user].can(this.id, rank);
    }
}

Room.prototype.toString = function() {
	return this.id;
}

exports.add = function(id) {
    this[id] = new Room(id);
}