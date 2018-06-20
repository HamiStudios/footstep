const
  // modules
  colors    = require('./../src/Colors'),
  Logger    = require('./../src/Logger'),
  stream    = require('stream')
;

let
  logger  = undefined
;

describe('generic tests', () => {

  beforeEach(() => {

    let
      devNull = new stream.Writable
    ;

    devNull._write = function(chunk, encoding, callback) {

      callback();

    };

    logger    = new Logger({
      streams: {
        verbose   : () => {},
        info      : devNull,
        error     : () => {},
        warning   : 'invalid',
        notice    : () => {},
        debug     : () => {},
        log       : () => {}
      },
      eol    : '',
      verbose: true,
      debug  : true
    });

  });

  test('logging should return the formatted message', () => {

    expect(logger.log('test')).toBeTruthy(); // can't check the message since {date} should be anything

  });

  test('when logging to a stream it should write the formatted message to the stream', () => {

    expect(logger.info('test')).toBeTruthy();

  });

  test('when the specified stream is not a Writable stream or a function it should error', () => {

    expect(logger.warning('test')).toBeInstanceOf(Error);

  });

  test('test if formats which are not functions just set the value instead', () => {

    logger.setOptions({
      format: '[{{date}}] {{type}}: {{message}} {{nonFunction}}',
      formats: {
        date: 'date',
        nonFunction: 'notAFunc'
      }
    });

    expect(logger.log('test')).toBe('[date]  log : test notAFunc');

  });

  test('.verbose() logs when `verbose` is true', () => {

    logger.options.verbose = true;

    expect(logger.verbose('test')).toBeTruthy();

  });

  test('.debug() logs when `debug` is true', () => {

    logger.options.debug = true;

    expect(logger.debug('test')).toBeTruthy();

  });

  test('.verbose() does not logs when `verbose` is false', () => {

    logger.options.verbose = false;

    expect(logger.verbose('test')).toBeFalsy();

  });

  test('.debug() does not logs when `debug` is false', () => {

    logger.options.debug = false;

    expect(logger.debug('test')).toBeFalsy();

  });

});

describe('option methods', () => {

  beforeAll(() => {

    logger    = new Logger({
      streams: {
        verbose   : () => {},
        info      : () => {},
        error     : () => {},
        warning   : () => {},
        notice    : () => {},
        debug     : () => {},
        log       : () => {}
      },
      eol    : '',
      verbose: true,
      debug  : true
    });

  });

  test('.setOptions() should modify the Logger options', () => {

    logger.setOptions({
      eol: '>'
    });

    expect(logger.options.eol).toBe('>');

  });

  test('.setDebug() should set whether the logger should output debug logs', () => {

    logger.setDebug(false);

    expect(logger.options.debug)
      .toBe(false);

  });

  test('.setVerbose() should set whether the logger should output verbose logs', () => {

    logger.setVerbose(false);

    expect(logger.options.verbose)
      .toBe(false);

  });

});

describe('log methods', () => {

  beforeEach(() => {

    logger    = new Logger({
      streams: {
        verbose   : () => {},
        info      : () => {},
        error     : () => {},
        warning   : () => {},
        notice    : () => {},
        debug     : () => {},
        log       : () => {}
      },
      eol    : '',
      verbose: true,
      debug  : true
    });

    logger.options.formats.date = jest.fn(function () {

      return 'date';

    });

  });

  test('.verbose() should format the arguments into a verbose log', () => {

    expect(colors.strip(logger.verbose('testing'))).toBe('[date]  verbose : testing');

  });

  test('.info() should format the arguments into a info log', () => {

    expect(colors.strip(logger.info('testing'))).toBe('[date]  info : testing');

  });

  test('.error() should format the arguments into a error log', () => {

    expect(colors.strip(logger.error('testing'))).toBe('[date]  error : testing');

  });

  test('.warning() should format the arguments into a warning log', () => {

    expect(colors.strip(logger.warning('testing'))).toBe('[date]  warning : testing');

  });

  test('.notice() should format the arguments into a notice log', () => {

    expect(colors.strip(logger.notice('testing'))).toBe('[date]  notice : testing');

  });

  test('.debug() should format the arguments into a debug log', () => {

    expect(colors.strip(logger.debug('testing'))).toBe('[date]  debug : testing');

  });

  test('.log() should format the arguments into a log log', () => {

    expect(colors.strip(logger.log('testing'))).toBe('[date]  log : testing');

  });

});