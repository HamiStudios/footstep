// npm
const util = require('util');
const os = require('os');
const merge = require('circle-assign');

// enums
const StreamName = require('./enums/StreamName');

// load colors
const colors = require('./Colors');

// variables
const defaults = {
  streams: {
    [StreamName.VERBOSE]: process.stdout,
    [StreamName.INFO]: process.stdout,
    [StreamName.ERROR]: process.stderr,
    [StreamName.WARNING]: process.stdout,
    [StreamName.NOTICE]: process.stdout,
    [StreamName.DEBUG]: process.stdout,
    [StreamName.LOG]: process.stdout,
    [StreamName.CLEAR]: process.stdout,
  },
  format: `${'['.gray}{{date}}${']'.gray} {{type}}: {{message}}`,
  formats: {
    date: function () {
      let date = new Date();
      let hours = ('0' + date.getHours()).slice(-2);
      let minutes = ('0' + date.getMinutes()).slice(-2);
      let seconds = ('0' + date.getSeconds()).slice(-2);

      return `${hours}:${minutes}:${seconds}`.magenta;
    },
    message: function (data) {
      return data.message;
    },
    type: function (data) {
      switch (data.type) {
        case StreamName.VERBOSE: {
          return ` ${data.type.toString()} `.bg_magenta.white;
        }
        case StreamName.INFO: {
          return ` ${data.type.toString()} `.bright_bg_cyan.black;
        }
        case StreamName.ERROR: {
          return ` ${data.type.toString()} `.bg_red.white;
        }
        case StreamName.WARNING: {
          return ` ${data.type.toString()} `.bright_bg_yellow.black;
        }
        case StreamName.NOTICE: {
          return ` ${data.type.toString()} `.bg_blue.white;
        }
        case StreamName.DEBUG: {
          return ` ${data.type.toString()} `.bg_white.black;
        }
        case StreamName.LOG: {
          return ` ${data.type.toString()} `;
        }
      }
    },
  },
  prefix: '',
  suffix: '',
  eol: os.EOL,
  debug: false,
  verbose: false,
  maxLogHistory: 50,
  clearCodes: {
    full: '\x1b[2J',
    standard: '\x1b[0f',
  },
};


/**
 * Create a new Logger instance
 *
 * @param {Object} [options]
 * @param {Stream|Function} [options.streams.verbose]
 * @param {Stream|Function} [options.streams.info]
 * @param {Stream|Function} [options.streams.error]
 * @param {Stream|Function} [options.streams.warning]
 * @param {Stream|Function} [options.streams.notice]
 * @param {Stream|Function} [options.streams.debug]
 * @param {Stream|Function} [options.streams.log]
 * @param {Stream|Function} [options.streams.clear]
 * @param {String|Function} [options.format]
 * @param {Function} [options.formats.date]
 * @param {Function} [options.formats.message]
 * @param {Function} [options.formats.type]
 * @param {String} [options.prefix]
 * @param {String} [options.suffix]
 * @param {Boolean} [options.debug]
 * @param {Boolean} [options.verbose]
 * @param {Object} [options.clearCodes]
 * @param {String} [options.clearCodes.full]
 * @param {String} [options.clearCodes.standard]
 * @param {number} [options.maxLogHistory]
 * @returns {Logger}
 */
function Logger(options = {}) {
  // merge the options with the default options
  this.options = merge(defaults, options);

  // create log history array
  this._past_logs = [];
}

/**
 * Set the logger options
 *
 * @param {Object} options The options to set
 */
Logger.prototype.setOptions = function (options) {
  this.options = merge(this.options, options);
};

/**
 * Write to the logs
 *
 * @param {StreamName} type The log type
 * @param {string} formatted The formatted message
 * @returns {boolean}
 * @private
 */
Logger.prototype._log = function (type, formatted) {
  if (this.options.streams[type] !== undefined &&
    typeof this.options.streams[type].write === 'function') { // check if the stream is a Writable stream

    // write the formatted log output to the stream
    this.options.streams[type].write(
      formatted,
    );

    return true;
  } else if (typeof this.options.streams[type] === 'function') { // check if the stream is a function
    // run the function with the formatted argument
    this.options.streams[type](formatted);

    return true;
  } else {
    this.getPastLogs()[0].error = new Error(`Stream for '${type}' is not a Writable stream or function.`);

    return false;
  }
};

/**
 * Format the arguments into the `format` option
 *
 * @private
 * @param {any} args
 */
Logger.prototype._format = function () {
  // log format and array of
  let formatted = this.options.format;
  let replace = formatted.match(/{{(.*?)}}/g);
  let args = [...arguments];
  let type = args[0];
  let message = util.format.apply(null, args.slice(1, args.length)); // remove log type from arguments before formatting them

  // go through all the replaceable values and set them accordingly
  for (let i = 0; i < replace.length; i++) {
    // value without {{ }} (function name)
    let value = replace[i].replace(/{{\s?/g, '').replace(/\s?}}/g, '');

    // data for the format functions
    let data = {
      message: message,
      type: type,
      options: this.options,
    };

    // check if format function exists
    if (typeof this.options.formats[value] === 'function') {
      // format the message using that function
      formatted = formatted.replace(replace[i], this.options.formats[value](data));
    } else {
      // just set it as the value
      formatted = formatted.replace(replace[i], this.options.formats[value]);
    }
  }

  let returnValue = this.options.prefix + formatted + this.options.suffix + this.options.eol;

  this._addToLogHistory({
    type: type,
    message: message,
    output: returnValue,
    stream: type.toLowerCase(),
    timestamp: new Date(),
  });

  // return the formatted output with the system EOL
  return returnValue;
};

/**
 * Adds the specified log to the past logs history
 *
 * @param {Object} log The log to add
 * @param {string} log.type The log type
 * @param {string} log.message The log message
 * @param {string} log.output The log outputted
 * @param {string} log.stream The log stream used
 * @param {Date} log.timestamp The time it was logged
 * @private
 */
Logger.prototype._addToLogHistory = function (log) {
  if (!Array.isArray(this._past_logs)) {
    this._past_logs = [];
  }

  // checks if the logs is larger thant the max size
  if (this._past_logs.length >= this.options.maxLogHistory) {
    // removes the first log in the array
    this._past_logs.shift();

    // this is done to reduce the amount of logs kept in memory
    // to save memory on larger applications
  }

  this._past_logs.push(log);
};

/**
 * Add padding each string so they are all the same length
 *
 * @param {string[]} strings The list of strings to pad
 * @param {boolean} [start=true] Add padding to the start
 *
 * @returns {string[]}
 */
Logger.prototype.pad = function(strings, start = true) {
  // get longest string in array
  let longest = strings.reduce((a, b) => {
    return a.length > b.length ? a : b;
  });

  // for each string
  return strings.map((string) => {
    // get the amount it needs to pad
    let padding = longest.length - string.length;

    // append a string at the start (unless specified)
    // for the amount of padding
    while(padding > 0) {
      if(start) string = ' ' + string;
      else string = string + ' ';
      padding--;
    }

    // return the string
    return string;
  });
};

/**
 * Get the past logs
 *
 * @returns {Object[]} The past logs
 */
Logger.prototype.getPastLogs = function () {
  return this._past_logs;
};

/**
 * Clear the console screen (performs on stdout)
 *
 * @param {boolean} [full=true] Whether to perform a full clear
 */
Logger.prototype.clear = function (full = true) {
  let streamWrite = this.options.streams.clear;
  let code = full ? this.options.clearCodes.full : this.options.clearCodes.standard;
  let history_log = {
    type: 'clear',
    message: code,
    output: code,
    stream: 'clear',
    timestamp: new Date(),
  };

  if (streamWrite !== undefined &&
    typeof streamWrite.write === 'function') { // check if the stream is a Writable stream

    streamWrite.write(code);
  } else if (typeof streamWrite === 'function') { // check if the stream is a function

    streamWrite(code);
  } else {
    history_log.error = new Error(`Stream for 'clear' is not a Writable stream or function.`);
  }

  this._addToLogHistory(history_log);

  return this;
};

/**
 * Print a blank line to the specified stream (defaults to StreamName.LOG)
 *
 * @param {StreamName} [stream] The stream name
 */
Logger.prototype.blank = function (stream = StreamName.LOG) {
  let streamWrite = this.options.streams[stream];
  let history_log = {
    type: 'blank',
    message: '\n',
    output: '\n',
    stream: stream,
    timestamp: new Date(),
  };

  if (streamWrite !== undefined &&
    typeof streamWrite.write === 'function') { // check if the stream is a Writable stream

    streamWrite.write('\n');
  } else if (typeof streamWrite === 'function') { // check if the stream is a function
    streamWrite('\n');
  } else {
    history_log.error = new Error(`Stream for '${history_log.stream}' is not a Writable stream or function.`);
  }

  this._addToLogHistory(history_log);

  return this;
};

/**
 * Verbose log output (only if verbose is true)
 *
 * @param {any} args
 */
Logger.prototype.verbose = function () {
  // if verbose is enabled proceed
  if (this.options.verbose) {
    // create array with log type and log args
    let args = [
      'verbose',
      ...arguments,
    ];
    // format the message
    let formatted = this._format.apply(this, args);

    this._log(StreamName.VERBOSE, formatted);
  }

  return this;
};

/**
 * Info log output
 *
 * @param {any} args
 */
Logger.prototype.info = function () {
  // create array with log type and log args
  let args = [
    'info',
    ...arguments,
  ];
  // format the message
  let formatted = this._format.apply(this, args);

  this._log(StreamName.INFO, formatted);

  return this;
};

/**
 * Error log output
 *
 * @param {any} args
 */
Logger.prototype.error = function () {
  // create array with log type and log args
  let args = [
    'error',
    ...arguments,
  ];
  // format the message
  let formatted = this._format.apply(this, args);

  this._log(StreamName.ERROR, formatted);

  return this;
};

/**
 * Warning log output
 *
 * @param {any} args
 */
Logger.prototype.warning = function () {
  // create array with log type and log args
  let args = [
    'warning',
    ...arguments,
  ];
  // format the message
  let formatted = this._format.apply(this, args);

  this._log(StreamName.WARNING, formatted);

  return this;
};

/**
 * Notice log output
 *
 * @param {any} args
 */
Logger.prototype.notice = function () {
  // create array with log type and log args
  let args = [
    'notice',
    ...arguments,
  ];
  // format the message
  let formatted = this._format.apply(this, args);

  this._log(StreamName.NOTICE, formatted);

  return this;
};

/**
 * Debug log output (only if debug is true)
 *
 * @param {any} args
 */
Logger.prototype.debug = function () {
  // if debug is enabled proceed
  if (this.options.debug) {
    // create array with log type and log args
    let args = [
      'debug',
      ...arguments,
    ];
    // format the message
    let formatted = this._format.apply(this, args);

    this._log(StreamName.DEBUG, formatted);
  }

  return this;
};

/**
 * Standard log output
 *
 * @param {any} args
 */
Logger.prototype.log = function () {
  // create array with log type and log args
  let args = [
    'log',
    ...arguments,
  ];
  // format the message
  let formatted = this._format.apply(this, args);

  this._log(StreamName.LOG, formatted);

  return this;
};

/**
 * Set whether verbose should execute
 *
 * @param {Boolean} value
 * @returns {Boolean}
 */
Logger.prototype.setVerbose = function (value) {
  this.options.verbose = value;
  return value;
};

/**
 * Set whether debug should execute
 *
 * @param {Boolean} value
 * @returns {Boolean}
 */
Logger.prototype.setDebug = function (value) {
  this.options.debug = value;
  return value;
};

module.exports = Logger;
