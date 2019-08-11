
exports.phrases = [];
exports.monitor = function(user, message) {
    let p = toId(user) + toId(message);
    for (let i in this.phrases) {
        if (p.match(this.phrases[i])) {
            if (!Users['unleashourpassion']) return;
            return Users['unleashourpassion'].send(user + ": " + message);
        }
    }
}