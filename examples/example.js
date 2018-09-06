const { Logger, Colors } = require('./../index');
const logger = new Logger();

logger
  .log('Hello World'.red.underline, { 'can log': true })
  .clear()
  .blank()
  .log('Hello World'.bright_blue.inverse, { 'can log': true })
  .info('Hello World'.bright_yellow)
;
