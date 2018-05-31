const
  // modules
  util      = require('util'),
  os        = require('os'),
  stream    = require('stream'),
  isObject  = function(item) {

    return (item && typeof item === 'object' && !Array.isArray(item));

  },
  merge     = function (target, source) {

    let output = Object.assign({}, target);

    if(isObject(target) && isObject(source)) {

      Object.keys(source).forEach(key => {

        if(isObject(source[key]) && !(source[key] instanceof stream)) {

          if(!(key in target)) {

            Object.assign(output, { [key]: source[key] });

          } else {

            output[key] = merge(target[key], source[key]);

          }

        } else {

          Object.assign(output, { [key]: source[key] });

        }

      });

    }

    return output;

  },
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
    eol       : os.EOL,
    debug     : false,
    verbose   : false,
  }
;


/**
 * Create a new Logger instance
 *
 * @param {Object} [options]
 * @param {Stream} [options.streams.verbose
 * @param {Stream} options.streams.info
 * @param {Stream} options.streams.error
 * @param {Stream} options.streams.warning
 * @param {Stream} options.streams.notice
 * @param {Stream} options.streams.debug
 * @param {Stream} options.streams.log
 * @param {String} options.format
 * @param {Function} options.formats.date
 * @param {Function} options.formats.message
 * @param {Function} options.formats.type
 * @param {String} options.prefix
 * @param {Boolean} options.debug
 * @param {Boolean} options.verbose
 * @returns {Logger}
 */
module.exports = function (options) {

  // merge the options with the default options
  this.options = merge(defaults, options || {});

  // ref to this for the functions
  let
    self  = this
  ;


  /**
   * Format the arguments into the `format` option
   *
   * @private
   * @param {any} args
   */
  this._format = function () {

    // log format and array of
    let
      formatted = self.options.format,
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
          options : self.options
        }
      ;

      // check if format function exists
      if(typeof self.options.formats[value] === 'function') {

        // format the message using that function
        formatted = formatted.replace(replace[i], self.options.formats[value](data));

      }

    }

    // return the formatted output with the system EOL
    return self.options.prefix + formatted + self.options.eol;

  };

  /**
   * Verbose log output (only if verbose is true)
   *
   * @param {any} args
   */
  this.verbose = function () {

    // if verbose is enabled proceed
    if(self.options.verbose) {

      let
        // create array with log type and log args
        args      = [
          'verbose',
          ...arguments
        ],
        // format the message
        formatted = this._format.apply(null, args)
      ;

      // write the formatted log output to the verbose stream
      self.options.streams.verbose.write(
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
  this.info = function () {

    let
      // create array with log type and log args
      args      = [
        'info',
        ...arguments
      ],
      // format the message
      formatted = this._format.apply(null, args)
    ;

    // write the formatted log output to the info stream
    self.options.streams.info.write(
      formatted
    );

    return formatted;

  };


  /**
   * Error log output
   *
   * @param {any} args
   */
  this.error = function () {

    let
      // create array with log type and log args
      args      = [
        'error',
        ...arguments
      ],
      // format the message
      formatted = this._format.apply(null, args)
    ;

    // write the formatted log output to the error stream
    self.options.streams.error.write(
      formatted
    );

    return formatted;

  };


  /**
   * Warning log output
   *
   * @param {any} args
   */
  this.warning = function () {

    let
      // create array with log type and log args
      args      = [
        'warning',
        ...arguments
      ],
      // format the message
      formatted = this._format.apply(null, args)
    ;

    // write the formatted log output to the warning stream
    self.options.streams.warning.write(
      formatted
    );

    return formatted;

  };


  /**
   * Notice log output
   *
   * @param {any} args
   */
  this.notice = function () {

    let
      // create array with log type and log args
      args      = [
        'notice',
        ...arguments
      ],
      // format the message
      formatted = this._format.apply(null, args)
    ;

    // write the formatted log output to the notice stream
    self.options.streams.notice.write(
      formatted
    );

    return formatted;

  };


  /**
   * Debug log output (only if debug is true)
   *
   * @param {any} args
   */
  this.debug = function () {

    // if debug is enabled proceed
    if(self.options.debug) {

      let
        // create array with log type and log args
        args      = [
          'debug',
          ...arguments
        ],
        // format the message
        formatted = this._format.apply(null, args)
      ;

      // write the formatted log output to the debug stream
      self.options.streams.debug.write(
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
  this.log = function () {

    let
      // create array with log type and log args
      args      = [
        'log',
        ...arguments
      ],
      // format the message
      formatted = this._format.apply(null, args)
    ;

    // write the formatted log output to the log stream
    self.options.streams.log.write(
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
  this.setVerbose = function (value) {

    self.options.verbose = value;
    return value;

  };


  /**
   * Set whether debug should execute
   *
   * @param {Boolean} value
   * @returns {Boolean}
   */
  this.setDebug = function (value) {

    self.options.debug = value;
    return value;

  };


  return this;

};
