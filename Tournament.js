let formats = {};

/*
 *  Data options
 *  - forcepublic: true for forcing public tour games
 *  - scouting: true to ban scouting
 *  - modjoin: true to disallow modjoin
 *  - scrappie: true to have the bot send .official on tour creation, to denote it as an official tour for Scrappie
 *  - autostart: autostart in minutes
 *  - autodq: autodq in minutes
 *  - forcetimer: true to force timers in the tour
 */
class Tournament {
    constructor(room, data) {
        if (!data) data = {};
        this.room = room;
        this.started = false;
        this.players = {};
        this.official = data.official || data.scrappie;
        this.blt = data.blt;
        this.chill = data.chill;
        this.notifications = {};
        this.rules = {
            bans: [],
            unbans: [],
            addrules: [],
            remrules: [],
        };
        this.name = false;
        this.format = false;
        this.officialname = data.officialname;
        if (data.late) {
            this.started = true;
            return;
        }
        if (Config.tours[room.id] && !(data.autostart || data.autodq || data.scouting)) {
            let t = Config.tours[room.id];
            this.room.send(`/tour autostart ${t[0]}`);
            this.room.send(`/tour autodq ${t[1]}`);
            if (t[2]) this.room.send("/tour scouting disallow");
        }

        // Various data things
        if (data.scrappie) room.send(".official");
        if (data.monopoke) room.send("/tour autostart 7");
        if (data.forcepublic) room.send("/tour forcepublic on");
        if (data.scouting) room.send("/tour scouting disallow");
        if (data.modjoin) room.send("/tour modjoin off");
        if (data.autostart) room.send(`/tour autostart ${data.autostart}`);
        if (data.autodq) room.send(`/tour autodq ${data.autodq}`);
        if (data.forcetimer) room.send(`/tour forcetimer on`);

        if (this.chill) room.send("/modchat +");
        this.startCheckTimer = false;
        this.autostart = false;
    }

    updateName(name) {
        this.name = name;
        this.buildNotifs();
    }

    buildNotifs(end = false) {
        for (let roomid in this.notifications) {
            let notifroom = Rooms[roomid];
            let id = this.notifications[roomid];
            let msg = `<div class="infobox"><a href="/${this.room.id}" class="ilink">`;
            msg += `<b>${this.name || this.format}</b>${this.name && this.name != this.format ? " (" + this.format + ")" : ""} tournament`;
            msg += ` in <b>${this.room.name}</b>`;
            if (end) msg += ` (ended)`;
            else if (this.started) msg += ` (started)`;
            msg += `</a></div>`
            notifroom.send(`/changeuhtml ${id}, ${msg}`)
        }
    }

    start() {
        this.started = true;
        this.buildNotifs();
    }

    checkstart() {
        if (!this.autostart) return;
        if (Date.now() < this.autostart) return;
        if (this.started) return;

        if (Object.keys(this.players).length >= 2) this.room.send("/tour start");
        else if (Users.self.can(this.room, "*")) {
            this.room.send("Not enough players... Ending tournament.");
            this.room.send("/tour end");
            this.room.endTour();
        }
    }

    setAutostart(val) {
        this.startCheckTimer = false;
        this.autostart = false;
        if (!val) return;
        let now = Date.now();
        this.autostart = now + val + 60 * 2 * 1000;
    }

    buildRules() {
        if (
            this.rules.bans.length === 0 &&
            this.rules.unbans.length === 0 &&
            this.rules.addrules.length === 0 &&
            this.rules.remrules.length === 0
        )
            return "";
        let ret = "/tour rules ";
        console.log(ret);
        for (let i of this.rules.bans) {
            ret += "-" + i + ", ";
        }
        for (let i of this.rules.unbans) {
            ret += "+" + i + ", ";
        }
        for (let i of this.rules.addrules) {
            console.log(ret, i);
            ret += i + ", ";
        }
        for (let i of this.rules.remrules) {
            ret += "!" + i + ", ";
        }
        console.log(ret);
        return ret.substring(0, ret.length - 2);
    }


    end(data) {
        if (data) {
            let dt = JSON.parse(data);
            if (this.blt) {
                let rn = dt.bracketData.rootNode;
                let first = rn.team;
                let second = rn.children[0].team === first ? rn.children[1].team : rn.children[0].team;
                let third = [
                    rn.children[0].children && rn.children[0].children[0] ? rn.children[0].children[0].team : false,
                    rn.children[1].children && rn.children[0].children[0] ? rn.children[1].children[0].team : false,
                    rn.children[0].children && rn.children[0].children[1] ? rn.children[0].children[1].team : false,
                    rn.children[1].children && rn.children[0].children[1] ? rn.children[1].children[1].team : false,
                ];
                let thirds = [];
                for (let i of third) {
                    if (!i) continue;
                    if (i !== first && i !== second) thirds.push(i);
                }
                let ret = `Congratulations to the ${
                    formats[BLT.last + "monotype"]
                } BLT qualifier tournament winners. ${first} won first place, ${second} won second place`;
                if (thirds.length) {
                    ret += `, and ${thirds[0]}${thirds[1] ? " and " + thirds[1] : ""} won third place!`;
                }
                this.room.send(ret);
                BLT.addpoints(first, second, thirds);
            } else if (this.room.id === "anythinggoes" && this.official) {
                let rn = dt.bracketData.rootNode;
                let first = rn.team;
                let second = rn.children[0].team === first ? rn.children[1].team : rn.children[0].team;
                this.room.send(
                    `/wall Congratulations to ${first} for winning the tournament, and to ${second} for being runner-up! Please put your smogon username in chat to claim your points.`
                );
            }
            if (dt.format && formats[dt.format]) this.name = formats[dt.format];
            else this.name = dt.format ? dt.format : this.name;
        }
        if (this.chill) this.room.send("/modchat ac");
        this.buildNotifs(true);
    }
}

Tournament.prototype.toString = function () {
    if (this.name) return this.name;
    if (this.format) return this.format === "unknown" ? false : this.format;
    return false;
};
module.exports = {
    Tournament: Tournament,
    formats: formats,
};
