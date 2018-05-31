const
  // modules
  colors    = require('./../src/Colors')
;

// start  \u001b[ m
// end    \u001b[ m

describe('Colors.test', () => {

  // strip
  test('#strip()', () => {

    let
      text  = 'text'.black
    ;

    expect(colors.strip(text + '')).toBe('text');

  });

  // black
  test('.black', () => {

    expect('text'.black).toBe('\u001b[30mtext\u001b[39m');

  });

  test('#black()', () => {

    expect(colors.black('text')).toBe('\u001b[30mtext\u001b[39m');

  });

  // blue
  test('.blue', () => {

    expect('text'.blue).toBe('\u001b[34mtext\u001b[39m');

  });

  test('#blue()', () => {

    expect(colors.blue('text')).toBe('\u001b[34mtext\u001b[39m');

  });

  // cyan
  test('.cyan', () => {

    expect('text'.cyan).toBe('\u001b[36mtext\u001b[39m');

  });

  test('#cyan()', () => {

    expect(colors.cyan('text')).toBe('\u001b[36mtext\u001b[39m');

  });

  // gray
  test('.gray', () => {

    expect('text'.gray).toBe('\u001b[90mtext\u001b[39m');

  });

  test('#gray()', () => {

    expect(colors.gray('text')).toBe('\u001b[90mtext\u001b[39m');

  });

  // green
  test('.green', () => {

    expect('text'.green).toBe('\u001b[32mtext\u001b[39m');

  });

  test('#green()', () => {

    expect(colors.green('text')).toBe('\u001b[32mtext\u001b[39m');

  });

  // grey
  test('.grey', () => {

    expect('text'.grey).toBe('\u001b[90mtext\u001b[39m');

  });

  test('#grey()', () => {

    expect(colors.grey('text')).toBe('\u001b[90mtext\u001b[39m');

  });

  // magenta
  test('.magenta', () => {

    expect('text'.magenta).toBe('\u001b[35mtext\u001b[39m');

  });

  test('#magenta()', () => {

    expect(colors.magenta('text')).toBe('\u001b[35mtext\u001b[39m');

  });

  // red
  test('.red', () => {

    expect('text'.red).toBe('\u001b[31mtext\u001b[39m');

  });

  test('#red()', () => {

    expect(colors.red('text')).toBe('\u001b[31mtext\u001b[39m');

  });

  // white
  test('.white', () => {

    expect('text'.white).toBe('\u001b[37mtext\u001b[39m');

  });

  test('#white()', () => {

    expect(colors.white('text')).toBe('\u001b[37mtext\u001b[39m');

  });

  // yellow
  test('.yellow', () => {

    expect('text'.yellow).toBe('\u001b[33mtext\u001b[39m');

  });

  test('#yellow()', () => {

    expect(colors.yellow('text')).toBe('\u001b[33mtext\u001b[39m');

  });

});