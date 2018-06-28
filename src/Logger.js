const
  // modules
  util      = require('util'),
  os        = require('os'),
  stream    = require('stream'),
  merge     = require('circle-assign'),
  colors    = require('./Colors'),

  // variables
  defaults  = {
    streams   : {
      verbose   : process.stdout,
      info      : process.stdout,
      error     : process.stderr,
      warning   : process.stdout,
      notice    : process.stdout,
      debug     : process.stdout,
      log       : process.stdout
    },
    format    : `${'['.gray}{{date}}${']'.gray} {{type}}: {{message}}`,
    formats   : {
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
            return ` ${data.type} `;
        }

      }
    },
    prefix    : '',
    suffix    : '',
    eol       : os.EOL,
    debug     : false,
    verbose   : false,
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
 * @param {String|Function} [options.format]
 * @param {Function} [options.formats.date]
 * @param {Function} [options.formats.message]
 * @param {Function} [options.formats.type]
 * @param {String} [options.prefix]
 * @param {String} [options.suffix]
 * @param {Boolean} [options.debug]
 * @param {Boolean} [options.verbose]
 * @returns {Logger}
 */
function Logger(options) {

  // merge the options with the default options
  this.options = merge(defaults, options);

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

    return formatted;

  } else if(typeof this.options.streams[type] === 'function') { // check if the stream is a function

    // run the function with the formatted argument
    this.options.streams[type](formatted);

    return formatted;

  } else {

    return new Error(`Stream for '${type}' is not a Writable stream or function.`);

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
    replace   = formatted.match(/{{(.*?)}}/g)
  ;

  // go through all the replaceable values and set them accordingly
  for (let i = 0; i < replace.length; i++) {

    let
      // value without {{ }} (function name)
      value   = replace[i].replace(/{{\s?/g, '').replace(/\s?}}/g, ''),

      // array of arguments (log args)
      args    = [ ...arguments ],

      // data for the format functions
      data    = {
        message : util.format.apply(null, args.slice(1, args.length)), // remove log type from arguments before formatting them
        type    : arguments[0],
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

  // return the formatted output with the system EOL
  return this.options.prefix + formatted + this.options.suffix + this.options.eol;

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

    return this._log('verbose', formatted);

  } else {

    return false;

  }

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

  return this._log('info', formatted);

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

  return this._log('error', formatted);

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

  return this._log('warning', formatted);

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

  return this._log('notice', formatted);;

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
      args      = [
        'debug',
        ...arguments
      ],
      // format the message
      formatted = this._format.apply(this, args)
    ;

    return this._log('debug', formatted);

  } else {

    return false;

  }

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

  return this._log('log', formatted);

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
