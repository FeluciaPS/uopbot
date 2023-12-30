// Import the EventEmitter class
const EventEmitter = require('events');
const { EventClockError } = require('./eventClockError.js');

// Create an instance of the EventEmitter
const Clock = new EventEmitter();

const baseOffset = {
    s: 0,
    m: 0,
    h: 0,
    d: 0
}

const validateOffset = function(offset) {
    if (!offset) return baseOffset;
    if (typeof offset != 'object') throw new EventClockError('Optional offset variable should be a string');

    for (let i in offset) {
        if (!(i in baseOffset)) throw new EventClockError(`Unknown offset property ${i}. Valid properties are ${Object.keys(baseOffset).join(', ')}`);
    }

    for (let i in baseOffset) {
        offset[i] = offset[i] || baseOffset[i]
    }

    return offset;
}

const scheduleRecurringEvent = function(name, hours, minutes, seconds, offset, initial = true) {

    offset = validateOffset(offset);

    let hour_ms = hours * 60 * 60 * 1000;
    let minute_ms = minutes * 60 * 1000;
    let second_ms = seconds * 1000;
  
 
    const now = new Date();
    let time = new Date(now);
  
    // Set time to 00:00:00
    time.setHours(0, 0, 0, 0);
  
    if (name === 'week') {
        hour_ms = 168 * 60 * 60 * 1000;
        let day = time.getDay();
        let diff = (day - offset.d) * 24 * 60 * 60 * 1000;
        time = new Date(+time - diff);
    }

    if (name === 'month') {
        // Set the time to the beginning of the next month
        time.setMonth(time.getMonth() + 1, 1);
        time.setHours(0, 0, 0, 0);
    } else if (name === 'year') {
        // Set the time to the beginning of the next year
        time.setFullYear(time.getFullYear() + 1, 0, 1);
        time.setHours(0, 0, 0, 0);
    } else {
        let interval = hour_ms + minute_ms + second_ms;
  
        // Calculate the next occurrence time for other intervals
        while (now > time) {
            let temp = +time + interval;
            time = new Date(temp);
        }
    }
  
    let timeUntilEvent = time - now;
  
    if (initial && !['month', 'year'].includes(name)) {
        let hourstring = hours ? ` ${hours}h`: '';
        let minutestring = minutes ? ` ${minutes}m`: '';
        let secondstring = seconds ? ` ${seconds}s`: '';
        console.log(`Scheduled recurring event "${name}" every${hourstring}${minutestring}${secondstring}. First trigger at ${time.toString().split('(')[0]}`);
    }
    else if (initial) {
        console.log(`Scheduled recurring event "${name}". First trigger at ${time.toString().split('(')[0]}`);
    }
  
    setTimeout(function() {
        Clock.emit(name, new Date());
        scheduleRecurringEvent(name, hours, minutes, seconds, false);
    }, timeUntilEvent).unref();
}

scheduleRecurringEvent('second', 0, 0, 1);
scheduleRecurringEvent('minute-quarter', 0, 0, 15);
scheduleRecurringEvent('minute-half', 0, 0, 30);
scheduleRecurringEvent('minute', 0, 1, 0);
scheduleRecurringEvent('hour-quarter', 0, 15, 0);
scheduleRecurringEvent('hour-half', 0, 30, 0);
scheduleRecurringEvent('hour', 1, 0, 0);
scheduleRecurringEvent('day-quarter', 6, 0, 0);
scheduleRecurringEvent('day-half', 12, 0, 0);
scheduleRecurringEvent('day', 24, 0, 0);
scheduleRecurringEvent('week', 7, 0, 0);

module.exports = Clock;