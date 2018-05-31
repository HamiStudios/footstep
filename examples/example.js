const
  { Logger,
    Colors }  = require('./../index'),
  logger      = new Logger()
;

logger.log('Hello World'.red.underline, { 'can log': true });