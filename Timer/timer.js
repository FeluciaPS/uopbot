"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
class TimerError extends Error {
    constructor(message) {
        super(message);
        this.name = "TimerError";
    }
}
/**
 * Timer class for simple timers and repeats
 */
class Timer {
    constructor(time, callback, ...args) {
        if (typeof time === "string") {
            if (time.match(/^\d+$/)) {
                time = parseInt(time, 10);
            }
            else {
                time = time.replace(/\s/g, "");
                let temp = time
                    .replace(/\d+h/i, "")
                    .replace(/\d+m/i, "")
                    .replace(/\d+s/i, "");
                if (temp.length !== 0) {
                    let match = temp.match(/\d+[hms]/i);
                    if (match)
                        throw new TimerError("Duplicate time unit: " + match[0]);
                    throw new TimerError("Invalid timer input: " + time);
                }
                let hours = time.match(/\d+h/i);
                let minutes = time.match(/\d+m/i);
                let seconds = time.match(/\d+s/i);
                time = 0;
                if (hours) {
                    let value = parseInt(hours[0].replace(/h/i, ""), 10);
                    time += value * 60 * 60;
                }
                if (minutes) {
                    let value = parseInt(minutes[0].replace(/m/i, ""), 10);
                    time += value * 60;
                }
                if (seconds) {
                    let value = parseInt(seconds[0].replace(/s/i, ""), 10);
                    time += value;
                }
            }
        }
        this.args = [...args];
        this.callback = callback;
        this.duration = time;
        this.endTime = 0;
        this.repeatCount = 0;
    }
    /**
     * Repeat helper function
     */
    repeatHandler() {
        if (!this.callback) {
            throw new TimerError("Repeat cannot be started if callback isn't set.");
        }
        this.repeatCount--;
        if (this.repeatCount === 0) {
            clearInterval(this.timer);
        }
        this.endTime = this.duration * 1000 + Date.now();
        this.callback(...this.args);
    }
    /**
     * Sets the function callback in case you want to do that later
     * @param callback
     * @param args - optional arguments for the callback function
     */
    setCallback(callback, ...args) {
        this.callback = callback;
        if ([...args].length) {
            this.args = [...args];
        }
    }
    /**
     * returns the Duration
     */
    getDuration() {
        return this.duration;
    }
    /**
     * Returns the remaining time on the timer as an object of hours, minutes, and seconds
     */
    getRemaining() {
        let currentTime = Date.now();
        let timeDiff = this.endTime - currentTime;
        timeDiff = Math.round(timeDiff / 1000);
        let timer = {
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
        timer.hours = Math.floor(timeDiff / 3600);
        timer.minutes = Math.floor((timeDiff - timer.hours * 3600) / 60);
        timer.seconds = timeDiff % 60;
        return timer;
    }
    getRemainingString() {
        let remaining = this.getRemaining();
        let ret = "";
        if (remaining.hours) {
            ret += remaining.hours + "h";
        }
        if (remaining.minutes) {
            ret += remaining.minutes + "m";
        }
        if (remaining.seconds) {
            ret += remaining.seconds + "s";
        }
        return ret;
    }
    getDurationString() {
        let timer = {
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
        timer.hours = Math.floor(this.duration / 3600);
        timer.minutes = Math.floor((this.duration - timer.hours * 3600) / 60);
        timer.seconds = this.duration % 60;
        let ret = "";
        if (timer.hours) {
            ret += timer.hours + "h";
        }
        if (timer.minutes) {
            ret += timer.minutes + "m";
        }
        if (timer.seconds) {
            ret += timer.seconds + "s";
        }
        return ret;
    }
    /**
     * Starts the timer if a callback has been set
     */
    start() {
        if (!this.callback) {
            throw new TimerError("Timer cannot be started if callback isn't set.");
        }
        this.endTime = this.duration * 1000 + Date.now();
        this.timer = setTimeout(this.callback, this.duration * 1000, ...this.args);
    }
    /**
     * Starts the timer as a repeating function
     * @param repeatCount - Optional number of iterations
     */
    repeat(repeatCount) {
        if (!repeatCount)
            repeatCount = -1;
        this.repeatCount = repeatCount;
        this.repeatHandler();
        this.endTime = this.duration * 1000 + Date.now();
        this.timer = setInterval(this.repeatHandler.bind(this), this.duration * 1000);
    }
    /**
     * Stops the timer
     */
    stop() {
        clearInterval(this.timer);
        clearTimeout(this.timer);
    }
}
exports.Timer = Timer;
