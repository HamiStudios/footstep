const
  // modules
  colors    = require('./../src/Colors'),
  Logger    = require('./../src/Logger'),
  devNull   = require('dev-null')
;

describe('Logger.test', () => {

  let
    logger    = new Logger({
      streams: {
        verbose   : devNull(),
        info      : devNull(),
        error     : devNull(),
        warning   : devNull(),
        notice    : devNull(),
        debug     : devNull(),
        log       : devNull()
      },
      formats: {
        date   : function () {

          return 'date';

        }
      },
      eol    : '',
      verbose: true,
      debug  : true
    })
  ;

  // verbose
  test('#verbose()', () => {

    expect(colors.strip(logger.verbose('testing'))).toBe('[date] verbose: testing');

  });

  // info
  test('#info()', () => {

    expect(colors.strip(logger.info('testing'))).toBe('[date] info: testing');

  });

  // error
  test('#error()', () => {

    expect(colors.strip(logger.error('testing'))).toBe('[date] error: testing');

  });

  // warning
  test('#warning()', () => {

    expect(colors.strip(logger.warning('testing'))).toBe('[date] warning: testing');

  });

  // notice
  test('#notice()', () => {

    expect(colors.strip(logger.notice('testing'))).toBe('[date] notice: testing');

  });

  // debug
  test('#debug()', () => {

    expect(colors.strip(logger.debug('testing'))).toBe('[date] debug: testing');

  });

  // log
  test('#log()', () => {

    expect(colors.strip(logger.log('testing'))).toBe('[date] log: testing');

  });

});