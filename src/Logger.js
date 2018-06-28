const
  // modules
  util      = require('util'),
  os        = require('os'),
  stream    = require('stream'),
  merge     = require('circle-assign'),
  colors    = require('./Colors'),

  // variables
  defaults  = {
    streams       : {
      verbose   : process.stdout,
      info      : process.stdout,
      error     : process.stderr,
      warning   : process.stdout,
      notice    : process.stdout,
      debug     : process.stdout,
      log       : process.stdout,
      clear     : process.stdout
    },
    format        : `${'['.gray}{{date}}${']'.gray} {{type}}: {{message}}`,
    formats       : {
      date      : function () {

        let
          date    = new Date(),
          hours   = ('0' + date.getHours()).slice(-2),
          minutes = ('0' + date.getMinutes()).slice(-2),
          seconds = ('0' + date.getSeconds()).slice(-2)
        ;

        return `${hours}:${minutes}:${seconds}`.magenta;

      },
      message   : function (data) {

        return data.message;

      },
      type      : function (data) {

        switch (data.type) {
          case 'verbose':
            return ` ${data.type.toString()} `.bg_magenta.white;
          case 'info':
            return ` ${data.type.toString()} `.bright_bg_cyan.black;
          case 'error':
            return ` ${data.type.toString()} `.bg_red.white;
          case 'warning':
            return ` ${data.type.toString()} `.bright_bg_yellow.black;
          case 'notice':
            return ` ${data.type.toString()} `.bg_blue.white;
          case 'debug':
            return ` ${data.type.toString()} `.bg_white.black;
          case 'log':
            return ` ${data.type.toString()} `;
        }

      }
    },
    prefix        : '',
    suffix        : '',
    eol           : os.EOL,
    debug         : false,
    verbose       : false,
    maxLogHistory : 50,
    clearCodes    : {
      full          : '\x1b[2J',
      standard      : '\x1b[0f'
    }
  }
;


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
function Logger(options) {

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
Logger.prototype.setOptions = function(options) {

  this.options = merge(this.options, options);

};

Logger.prototype._log = function(type, formatted) {

  if(this.options.streams[type] !== undefined &&
     typeof this.options.streams[type].write === 'function') { // check if the stream is a Writable stream
    
    // write the formatted log output to the stream
    this.options.streams[type].write(
      formatted
    );

    return true;

  } else if(typeof this.options.streams[type] === 'function') { // check if the stream is a function

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
Logger.prototype._format = function() {

  // log format and array of
  let
    formatted = this.options.format,
    replace   = formatted.match(/{{(.*?)}}/g),
    args    = [ ...arguments ],
    type      = args[0],
    message   = util.format.apply(null, args.slice(1, args.length)) // remove log type from arguments before formatting them
  ;

  // go through all the replaceable values and set them accordingly
  for (let i = 0; i < replace.length; i++) {

    let
      // value without {{ }} (function name)
      value   = replace[i].replace(/{{\s?/g, '').replace(/\s?}}/g, ''),

      // data for the format functions
      data    = {
        message : message,
        type    : type,
        options : this.options
      }
    ;

    // check if format function exists
    if(typeof this.options.formats[value] === 'function') {

      // format the message using that function
      formatted = formatted.replace(replace[i], this.options.formats[value](data));

    } else {

      // just set it as the value
      formatted = formatted.replace(replace[i], this.options.formats[value]);

    }

  }

  let
    returnValue = this.options.prefix + formatted + this.options.suffix + this.options.eol
  ;

  this._addToLogHistory({
    type      : type,
    message   : message,
    output    : returnValue,
    stream    : type.toLowerCase(),
    timestamp : new Date()
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
Logger.prototype._addToLogHistory = function(log) {

  if(!Array.isArray(this._past_logs)) {

    this._past_logs = [];

  }

  // checks if the logs is larger thant the max size
  if(this._past_logs.length >= this.options.maxLogHistory) {

    // removes the first log in the array
    this._past_logs.shift();

    // this is done to reduce the amount of logs kept in memory
    // to save memory on larger applications

  }

  this._past_logs.push(log);

};

/**
 * Get the past logs
 *
 * @returns {Object[]} The past logs
 */
Logger.prototype.getPastLogs = function() {

  return this._past_logs;

};

/**
 * Clear the console screen (performs on stdout)
 *
 * @param {boolean} [full=true] Whether to perform a full clear
 */
Logger.prototype.clear = function(full) {

  if(full === undefined ||
    full === null ||
    typeof full !== 'boolean') {

    full = true;

  }

  let
    streamWrite = this.options.streams.clear,
    code        = full ? this.options.clearCodes.full : this.options.clearCodes.standard,
    history_log = {
      type      : 'clear',
      message   : code,
      output    : code,
      stream    : 'clear',
      timestamp : new Date()
    }
  ;

  if(streamWrite !== undefined &&
    typeof streamWrite.write === 'function') { // check if the stream is a Writable stream

    streamWrite.write(code);

  } else if(typeof streamWrite === 'function') { // check if the stream is a function

    streamWrite(code);

  } else {

    history_log.error = new Error(`Stream for 'clear' is not a Writable stream or function.`);

  }

  this._addToLogHistory(history_log);

  return this;

};

/**
 * Print a blank line to the specified stream (defaults to stdout)
 *
 * @param {string} [stream] The stream key
 */
Logger.prototype.blank = function(stream) {

  let
    streamWrite = process.stdout,
    history_log = {
      type      : 'blank',
      message   : '\n',
      output    : '\n',
      stream    : stream || 'stdout',
      timestamp : new Date()
    }
  ;

  if(stream !== undefined &&
    stream !== null &&
    typeof stream === 'string') {

    streamWrite = this.options.streams[stream];

  }

  if(streamWrite !== undefined &&
    typeof streamWrite.write === 'function') { // check if the stream is a Writable stream

    streamWrite.write('\n');

  } else if(typeof streamWrite === 'function') { // check if the stream is a function

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
Logger.prototype.verbose = function() {

  // if verbose is enabled proceed
  if(this.options.verbose) {

    let
      // create array with log type and log args
      args      = [
        'verbose',
        ...arguments
      ],
      // format the message
      formatted = this._format.apply(this, args)
    ;

    this._log('verbose', formatted);

  }

  return this;

};


/**
 * Info log output
 *
 * @param {any} args
 */
Logger.prototype.info = function() {

  let
    // create array with log type and log args
    args      = [
      'info',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  this._log('info', formatted);

  return this;

};


/**
 * Error log output
 *
 * @param {any} args
 */
Logger.prototype.error = function() {

  let
    // create array with log type and log args
    args      = [
      'error',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  this._log('error', formatted);

  return this;

};


/**
 * Warning log output
 *
 * @param {any} args
 */
Logger.prototype.warning = function() {

  let
    // create array with log type and log args
    args      = [
      'warning',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  this._log('warning', formatted);

  return this;

};


/**
 * Notice log output
 *
 * @param {any} args
 */
Logger.prototype.notice = function() {

  let
    // create array with log type and log args
    args      = [
      'notice',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  this._log('notice', formatted);

  return this;

};


/**
 * Debug log output (only if debug is true)
 *
 * @param {any} args
 */
Logger.prototype.debug = function() {

  // if debug is enabled proceed
  if(this.options.debug) {

    let
      // create array with log type and log args
      args = [
        'debug',
        ...arguments
      ],
      // format the message
      formatted = this._format.apply(this, args)
    ;

    this._log('debug', formatted);

  }

  return this;

};


/**
 * Standard log output
 *
 * @param {any} args
 */
Logger.prototype.log = function() {

  let
    // create array with log type and log args
    args      = [
      'log',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  this._log('log', formatted);

  return this;

};


/**
 * Set whether verbose should execute
 *
 * @param {Boolean} value
 * @returns {Boolean}
 */
Logger.prototype.setVerbose = function(value) {

  this.options.verbose = value;
  return value;

};


/**
 * Set whether debug should execute
 *
 * @param {Boolean} value
 * @returns {Boolean}
 */
Logger.prototype.setDebug = function(value) {

  this.options.debug = value;
  return value;

};


module.exports = Logger;
