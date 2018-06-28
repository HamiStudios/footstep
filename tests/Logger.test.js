const
  // modules
  colors        = require('./../src/Colors'),
  Logger        = require('./../src/Logger'),
  { Writable }  = require('stream')
;

let
  logger  = undefined,
  devNull = new Writable()
;

devNull.write = (c, e, cb) => {
  if(typeof cb === 'function') cb();
};

devNull._write = (c, e, cb) => {
  if(typeof cb === 'function') cb();
};

describe('generic tests', () => {

  beforeEach(() => {

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
      debug  : true,
      maxLogHistory: 3
    });

  });

  test('logging should return the formatted message', () => {

    expect(logger.log('test')).toBeTruthy(); // can't check the message since {date} should be anything

  });

  test('when logging to a stream it should write the formatted message to the stream', () => {

    expect(logger.info('test')).toBeTruthy();

  });

  test('when the specified stream is not a Writable stream or a function it should error', () => {

    logger.warning('test');

    expect(logger.getPastLogs()[0].error).toBeTruthy();

  });

  test('test if formats which are not functions just set the value instead', () => {

    logger.setOptions({
      format: '[{{date}}] {{type}}: {{message}} {{nonFunction}}',
      formats: {
        date: 'date',
        nonFunction: 'notAFunc'
      }
    });

    logger.log('test');

    expect(logger.getPastLogs()[0].output).toBe('[date]  log : test notAFunc');

  });

  test('.verbose() logs when `verbose` is true', () => {

    logger.options.verbose = true;

    logger.verbose('verbose test');

    let
      last_log = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'verbose' && last_log.message === 'verbose test').toBeTruthy();

  });

  test('.debug() logs when `debug` is true', () => {

    logger.options.debug = true;

    logger.debug('debug test');

    let
      last_log = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'debug' && last_log.message === 'debug test').toBeTruthy();

  });

  test('.verbose() does not logs when `verbose` is false', () => {

    logger.options.verbose = false;

    logger.verbose('verbose test');

    let
      last_log = logger.getPastLogs()[0]
    ;

    expect(last_log).toBeFalsy();

  });

  test('.debug() does not logs when `debug` is false', () => {

    logger.options.debug = false;

    logger.debug('debug test');

    let
      last_log = logger.getPastLogs()[0]
    ;

    expect(last_log).toBeFalsy();

  });

  test('.blank() should log a blank line', () => {

    logger.blank();

    let
      last_log  = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'blank' && last_log.message === '\n').toBeTruthy();

  });

  test('.blank() should log a blank line to the specified stream (Writable Stream)', () => {

    logger.blank('info');

    let
      last_log  = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'blank' && last_log.message === '\n' && last_log.stream === 'info').toBeTruthy();

  });

  test('.blank() should log a blank line to the specified stream (Function)', () => {

    logger.blank('error');

    let
      last_log  = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'blank' && last_log.message === '\n' && last_log.stream === 'error').toBeTruthy();

  });

  test('.blank() should return an error if the specified stream stream is not a Writable stream or function', () => {

    logger.blank('warning');

    let
      last_log  = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'blank' && last_log.error).toBeTruthy();

  });

  test('.clear() should clear the specified clear stream (Writable Stream)', () => {

    logger.clear();

    let
      last_log  = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'clear' && last_log.message === '\x1b[2J' && last_log.stream === 'clear').toBeTruthy();

  });

  test('.clear() should clear the specified clear stream (Function)', () => {

    logger.clear();

    let
      last_log  = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'clear' && last_log.message === '\x1b[2J' && last_log.stream === 'clear').toBeTruthy();

  });

  test('.clear() should not perform a full clear when full is set to false', () => {

    logger.clear(false);

    let
      last_log  = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'clear' && last_log.message === '\x1b[0f' && last_log.stream === 'clear').toBeTruthy();

  });

  test('.clear() should pass the clear term code to the function if specified instead of a stream', () => {

    let
      returned_code = ''
    ;

    logger.options.streams.clear = function(code) { returned_code = code; };
    logger.options.clearCodes.full = 'CLEAR_CODE';

    logger.clear();

    expect(returned_code).toBe('CLEAR_CODE');

  });

  test('.clear() should return an error if the clear stream is not a Writable stream or function', () => {

    logger.options.streams.clear = 'invalid';

    logger.clear();

    let
      last_log  = logger.getPastLogs()[0]
    ;

    expect(last_log.type === 'clear' && last_log.error).toBeTruthy();

  });

  test('The history handler should remove the oldest log when the history is maxed out', () => {

    let
      history_object  = {
        type: 'test',
        message: 'test',
        output: 'test',
        stream: 'test',
        timestamp: new Date()
      }
    ;

    logger._addToLogHistory(history_object);
    logger._addToLogHistory(history_object);
    logger._addToLogHistory(history_object); // maxed out
    logger._addToLogHistory(history_object);

    expect(logger.getPastLogs()).toHaveLength(3);

  });

  test('The history handler should redefine the history array if modified (set to non-array)', () => {

    logger._past_logs = {};

    let
      history_object  = {
        type: 'test',
        message: 'test',
        output: 'test',
        stream: 'test',
        timestamp: new Date()
      }
    ;

    logger._addToLogHistory(history_object);

    expect(logger.getPastLogs()).toHaveLength(1);

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

    logger.verbose('testing');

    expect(colors.strip(logger.getPastLogs()[0].output)).toBe('[date]  verbose : testing');

  });

  test('.info() should format the arguments into a info log', () => {

    logger.info('testing');

    expect(colors.strip(logger.getPastLogs()[0].output)).toBe('[date]  info : testing');

  });

  test('.error() should format the arguments into a error log', () => {

    logger.error('testing');

    expect(colors.strip(logger.getPastLogs()[0].output)).toBe('[date]  error : testing');

  });

  test('.warning() should format the arguments into a warning log', () => {

    logger.warning('testing');

    expect(colors.strip(logger.getPastLogs()[0].output)).toBe('[date]  warning : testing');

  });

  test('.notice() should format the arguments into a notice log', () => {

    logger.notice('testing');

    expect(colors.strip(logger.getPastLogs()[0].output)).toBe('[date]  notice : testing');

  });

  test('.debug() should format the arguments into a debug log', () => {

    logger.debug('testing');

    expect(colors.strip(logger.getPastLogs()[0].output)).toBe('[date]  debug : testing');

  });

  test('.log() should format the arguments into a log log', () => {

    logger.log('testing');

    expect(colors.strip(logger.getPastLogs()[0].output)).toBe('[date]  log : testing');

  });

});