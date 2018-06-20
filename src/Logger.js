const
  // modules
  util      = require('util'),
  os        = require('os'),
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
      /* istanbul ignore next */
      message   : function (data) {

        return data.message;

      },
      /* istanbul ignore next */
      type      : function (data) {

        switch (data.type) {
          case 'verbose':
            return data.type.toString().bold.cyan;
          case 'info':
            return data.type.toString().cyan;
          case 'error':
            return data.type.toString().red;
          case 'warning':
            return data.type.toString().yellow;
          case 'notice':
            return data.type.toString().bg_blue.white;
          case 'debug':
            return data.type.toString().bg_white.black;
          case 'log':
            return data.type;
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
 * @param {Stream} [options.streams.verbose]
 * @param {Stream} [options.streams.info]
 * @param {Stream} [options.streams.error]
 * @param {Stream} [options.streams.warning]
 * @param {Stream} [options.streams.notice]
 * @param {Stream} [options.streams.debug]
 * @param {Stream} [options.streams.log]
 * @param {String} [options.format]
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

  this.options = merge(defaults, this.options, options);

};

/**
 * Format the arguments into the `format` option
 *
 * @private
 * @param {any} args
 */
Logger.prototype._format = function () {

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
Logger.prototype.verbose = function () {

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

    // write the formatted log output to the verbose stream
    this.options.streams.verbose.write(
      formatted
    );

    return formatted;

  }

};


/**
 * Info log output
 *
 * @param {any} args
 */
Logger.prototype.info = function () {

  let
    // create array with log type and log args
    args      = [
      'info',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  // write the formatted log output to the info stream
  this.options.streams.info.write(
    formatted
  );

  return formatted;

};


/**
 * Error log output
 *
 * @param {any} args
 */
Logger.prototype.error = function () {

  let
    // create array with log type and log args
    args      = [
      'error',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  // write the formatted log output to the error stream
  this.options.streams.error.write(
    formatted
  );

  return formatted;

};


/**
 * Warning log output
 *
 * @param {any} args
 */
Logger.prototype.warning = function () {

  let
    // create array with log type and log args
    args      = [
      'warning',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  // write the formatted log output to the warning stream
  this.options.streams.warning.write(
    formatted
  );

  return formatted;

};


/**
 * Notice log output
 *
 * @param {any} args
 */
Logger.prototype.notice = function () {

  let
    // create array with log type and log args
    args      = [
      'notice',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  // write the formatted log output to the notice stream
  this.options.streams.notice.write(
    formatted
  );

  return formatted;

};


/**
 * Debug log output (only if debug is true)
 *
 * @param {any} args
 */
Logger.prototype.debug = function () {

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

    // write the formatted log output to the debug stream
    this.options.streams.debug.write(
      formatted
    );

    return formatted;

  }

};


/**
 * Standard log output
 *
 * @param {any} args
 */
Logger.prototype.log = function () {

  let
    // create array with log type and log args
    args      = [
      'log',
      ...arguments
    ],
    // format the message
    formatted = this._format.apply(this, args)
  ;

  // write the formatted log output to the log stream
  this.options.streams.log.write(
    formatted
  );

  return formatted;

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
