class TimerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimerError";
    }
}

/**
 * Timer class for simple timers and repeats
 */
export class Timer {
    private duration: number;
    private timer: number | NodeJS.Timeout | undefined;
    private args: any[];
    private callback: Function | undefined;
    private endTime: number;
    private repeatCount: number;

    public constructor(time: string | number, callback?: Function, ...args: any | undefined) {
        if (typeof time === "string") {
            if (time.match(/^\d+$/)) {
                time = parseInt(time, 10);
            } else {
                time = time.replace(/\s/g, "");

                let temp: string = time
                    .replace(/\d+h/i, "")
                    .replace(/\d+m/i, "")
                    .replace(/\d+s/i, "");

                if (temp.length !== 0) {
                    let match: string[] = temp.match(/\d+[hms]/i) as string[];
                    if (match) throw new TimerError("Duplicate time unit: " + match[0]);
                    throw new TimerError("Invalid timer input: " + time);
                }

                let hours: string[] = time.match(/\d+h/i) as string[];
                let minutes: string[] = time.match(/\d+m/i) as string[];
                let seconds: string[] = time.match(/\d+s/i) as string[];
                time = 0;
                if (hours) {
                    let value: number = parseInt(hours[0].replace(/h/i, ""), 10);
                    time += value * 60 * 60;
                }
                if (minutes) {
                    let value: number = parseInt(minutes[0].replace(/m/i, ""), 10);
                    time += value * 60;
                }
                if (seconds) {
                    let value: number = parseInt(seconds[0].replace(/s/i, ""), 10);
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
    private repeatHandler() {
        if (!this.callback) {
            throw new TimerError("Repeat cannot be started if callback isn't set.");
        }
        this.repeatCount--;
        if (this.repeatCount === 0) {
            clearInterval(this.timer as NodeJS.Timeout);
        }
        this.endTime = this.duration * 1000 + Date.now();
        this.callback(...this.args);
    }

    /**
     * Sets the function callback in case you want to do that later
     * @param callback
     * @param args - optional arguments for the callback function
     */
    public setCallback(callback: Function, ...args: any) {
        this.callback = callback;
        if ([...args].length) {
            this.args = [...args];
        }
    }

    /**
     * returns the Duration
     */
    public getDuration() {
        return this.duration;
    }

    /**
     * Returns the remaining time on the timer as an object of hours, minutes, and seconds
     */
    public getRemaining(): {
        hours: number;
        minutes: number;
        seconds: number;
    } {
        let currentTime: number = Date.now();
        let timeDiff: number = this.endTime - currentTime;
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

    public getRemainingString(): string {
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

    public getDurationString(): string {
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
    public start() {
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
    public repeat(repeatCount?: number) {
        if (!repeatCount) repeatCount = -1;
        this.repeatCount = repeatCount;
        this.repeatHandler();
        this.endTime = this.duration * 1000 + Date.now();
        this.timer = setInterval(this.repeatHandler.bind(this), this.duration * 1000);
    }

    /**
     * Stops the timer
     */
    public stop() {
        clearInterval(this.timer as NodeJS.Timeout);
        clearTimeout(this.timer as NodeJS.Timeout);
    }
}
