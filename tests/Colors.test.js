const
  // modules
  colors    = require('./../src/Colors')
;

describe('methods', () => {

  // strip
  test('.strip() should remove colors from the provided string', () => {

    let
      text  = 'text'.black
    ;

    expect(colors.strip(text + '')).toBe('text');

  });

});

describe('colors', () => {

  // reset
  test('.reset should make the string normal', () => {

    expect('text'.reset).toBe('\u001b[0mtext\u001b[0m');

  });

  // black
  test('.black should make the string black', () => {

    expect('text'.black).toBe('\u001b[30mtext\u001b[0m');

  });

  // red
  test('.red should make the string red', () => {

    expect('text'.red).toBe('\u001b[31mtext\u001b[0m');

  });

  // green
  test('.green should make the string green', () => {

    expect('text'.green).toBe('\u001b[32mtext\u001b[0m');

  });

  // yellow
  test('.yellow should make the string yellow', () => {

    expect('text'.yellow).toBe('\u001b[33mtext\u001b[0m');

  });

  // blue
  test('.blue should make the string blue', () => {

    expect('text'.blue).toBe('\u001b[34mtext\u001b[0m');

  });

  // magenta
  test('.magenta should make the string magenta', () => {

    expect('text'.magenta).toBe('\u001b[35mtext\u001b[0m');

  });

  // cyan
  test('.cyan should make the string cyan', () => {

    expect('text'.cyan).toBe('\u001b[36mtext\u001b[0m');

  });

  // white
  test('.white should make the string white', () => {

    expect('text'.white).toBe('\u001b[37mtext\u001b[0m');

  });

  // gray
  test('.gray should make the string gray', () => {

    expect('text'.gray).toBe('\u001b[90mtext\u001b[0m');

  });

  // grey
  test('.grey should make the string grey', () => {

    expect('text'.grey).toBe('\u001b[90mtext\u001b[0m');

  });

});

describe('backgrounds', () => {

  // bg_black
  test('.bg_black should make the string bg_black', () => {

    expect('text'.bg_black).toBe('\u001b[40mtext\u001b[0m');

  });

  // bg_red
  test('.bg_red should make the string bg_red', () => {

    expect('text'.bg_red).toBe('\u001b[41mtext\u001b[0m');

  });

  // bg_green
  test('.bg_green should make the string bg_green', () => {

    expect('text'.bg_green).toBe('\u001b[42mtext\u001b[0m');

  });

  // bg_yellow
  test('.bg_yellow should make the string bg_yellow', () => {

    expect('text'.bg_yellow).toBe('\u001b[43mtext\u001b[0m');

  });

  // bg_blue
  test('.bg_blue should make the string bg_blue', () => {

    expect('text'.bg_blue).toBe('\u001b[44mtext\u001b[0m');

  });

  // bg_magenta
  test('.bg_magenta should make the string bg_magenta', () => {

    expect('text'.bg_magenta).toBe('\u001b[45mtext\u001b[0m');

  });

  // bg_cyan
  test('.bg_cyan should make the string bg_cyan', () => {

    expect('text'.bg_cyan).toBe('\u001b[46mtext\u001b[0m');

  });

  // bg_white
  test('.bg_white should make the string bg_white', () => {

    expect('text'.bg_white).toBe('\u001b[47mtext\u001b[0m');

  });

});

describe('bright colors', () => {

  // bright_black
  test('.bright_black should make the string bright_black', () => {

    expect('text'.bright_black).toBe('\u001b[90mtext\u001b[0m');

  });

  // bright_red
  test('.bright_red should make the string bright_red', () => {

    expect('text'.bright_red).toBe('\u001b[91mtext\u001b[0m');

  });

  // bright_green
  test('.bright_green should make the string bright_green', () => {

    expect('text'.bright_green).toBe('\u001b[92mtext\u001b[0m');

  });

  // bright_yellow
  test('.bright_yellow should make the string bright_yellow', () => {

    expect('text'.bright_yellow).toBe('\u001b[93mtext\u001b[0m');

  });

  // bright_blue
  test('.bright_blue should make the string bright_blue', () => {

    expect('text'.bright_blue).toBe('\u001b[94mtext\u001b[0m');

  });

  // bright_magenta
  test('.bright_magenta should make the string bright_magenta', () => {

    expect('text'.bright_magenta).toBe('\u001b[95mtext\u001b[0m');

  });

  // bright_cyan
  test('.bright_cyan should make the string bright_cyan', () => {

    expect('text'.bright_cyan).toBe('\u001b[96mtext\u001b[0m');

  });

  // bright_white
  test('.bright_white should make the string bright_white', () => {

    expect('text'.bright_white).toBe('\u001b[97mtext\u001b[0m');

  });

});

describe('bright backgrounds', () => {

  // bright_bg_black
  test('.bright_bg_black should make the string bright_bg_black', () => {

    expect('text'.bright_bg_black).toBe('\u001b[100mtext\u001b[0m');

  });

  // bright_bg_red
  test('.bright_bg_red should make the string bright_bg_red', () => {

    expect('text'.bright_bg_red).toBe('\u001b[101mtext\u001b[0m');

  });

  // bright_bg_green
  test('.bright_bg_green should make the string bright_bg_green', () => {

    expect('text'.bright_bg_green).toBe('\u001b[102mtext\u001b[0m');

  });

  // bright_bg_yellow
  test('.bright_bg_yellow should make the string bright_bg_yellow', () => {

    expect('text'.bright_bg_yellow).toBe('\u001b[103mtext\u001b[0m');

  });

  // bright_bg_blue
  test('.bright_bg_blue should make the string bright_bg_blue', () => {

    expect('text'.bright_bg_blue).toBe('\u001b[104mtext\u001b[0m');

  });

  // bright_bg_magenta
  test('.bright_bg_magenta should make the string bright_bg_magenta', () => {

    expect('text'.bright_bg_magenta).toBe('\u001b[105mtext\u001b[0m');

  });

  // bright_bg_cyan
  test('.bright_cyan should make the string bright_bg_cyan', () => {

    expect('text'.bright_bg_cyan).toBe('\u001b[106mtext\u001b[0m');

  });

  // bright_bg_white
  test('.bright_bg_white should make the string bright_bg_white', () => {

    expect('text'.bright_bg_white).toBe('\u001b[107mtext\u001b[0m');

  });

});

describe('styles', () => {

  // bold
  test('.bright_bg_black should make the string bold', () => {

    expect('text'.bold).toBe('\u001b[1mtext\u001b[0m');

  });

  // faint
  test('.faint should make the string faint', () => {

    expect('text'.faint).toBe('\u001b[2mtext\u001b[0m');

  });

  // italic
  test('.italic should make the string italic', () => {

    expect('text'.italic).toBe('\u001b[3mtext\u001b[0m');

  });

  // underline
  test('.underline should make the string underline', () => {

    expect('text'.underline).toBe('\u001b[4mtext\u001b[0m');

  });

  // slow_blink
  test('.slow_blink should make the string slow_blink', () => {

    expect('text'.slow_blink).toBe('\u001b[5mtext\u001b[0m');

  });

  // rapid_blink
  test('.rapid_blink should make the string rapid_blink', () => {

    expect('text'.rapid_blink).toBe('\u001b[6mtext\u001b[0m');

  });

  // inverse
  test('.inverse should make the string inverse', () => {

    expect('text'.inverse).toBe('\u001b[7mtext\u001b[0m');

  });

  // hidden
  test('.hidden should make the string hidden', () => {

    expect('text'.hidden).toBe('\u001b[8mtext\u001b[0m');

  });

  // strikethrough
  test('.strikethrough should make the string strikethrough', () => {

    expect('text'.strikethrough).toBe('\u001b[9mtext\u001b[0m');

  });

  // framed
  test('.framed should make the string framed', () => {

    expect('text'.framed).toBe('\u001b[51mtext\u001b[0m');

  });

  // encircled
  test('.encircled should make the string encircled', () => {

    expect('text'.encircled).toBe('\u001b[52mtext\u001b[0m');

  });

  // overlined
  test('.overlined should make the string overlined', () => {

    expect('text'.overlined).toBe('\u001b[53mtext\u001b[0m');

  });

});
