/*

  Simple implementation of console colors and styles with use of
  some code from colors.js https://github.com/Marak/colors.js :)

 */

const
  // modules
  util          = require('util'),

  // variables
  codes         = {
    // colors
    COLORS        : {
      RESET         : [ 0 ],
      BLACK         : [ 30 ],
      RED           : [ 31 ],
      GREEN         : [ 32 ],
      YELLOW        : [ 33 ],
      BLUE          : [ 34 ],
      MAGENTA       : [ 35 ],
      CYAN          : [ 36 ],
      WHITE         : [ 37 ],
      GRAY          : [ 90 ],
      GREY          : [ 90 ]
    },

    // bright colors
    BRIGHT        : {
      BLACK         : [ 90 ],
      RED           : [ 91 ],
      GREEN         : [ 92 ],
      YELLOW        : [ 93 ],
      BLUE          : [ 94 ],
      MAGENTA       : [ 95 ],
      CYAN          : [ 96 ],
      WHITE         : [ 97 ]
    },

    // background colors
    BACKGROUND    : {
      BLACK         : [ 40 ],
      RED           : [ 41 ],
      GREEN         : [ 42 ],
      YELLOW        : [ 43 ],
      BLUE          : [ 44 ],
      MAGENTA       : [ 45 ],
      CYAN          : [ 46 ],
      WHITE         : [ 47 ]
    },

    // background colors
    BRIGHT_BACKGROUND    : {
      BLACK         : [ 100 ],
      RED           : [ 101 ],
      GREEN         : [ 102 ],
      YELLOW        : [ 103 ],
      BLUE          : [ 104 ],
      MAGENTA       : [ 105 ],
      CYAN          : [ 106 ],
      WHITE         : [ 107 ]
    },

    // styles
    STYLES        : {
      BOLD          : [ 1 ],
      FAINT         : [ 2 ],
      ITALIC        : [ 3 ],
      UNDERLINE     : [ 4 ],
      SLOW_BLINK    : [ 5 ],
      RAPID_BLINK   : [ 6 ],
      INVERSE       : [ 7 ],
      HIDDEN        : [ 8 ],
      STRIKETHROUGH : [ 9 ],
      FRAMED        : [ 51 ],
      ENCIRCLED     : [ 52 ],
      OVERLINED     : [ 53 ]
    }
  },
  funcs         = {},
  createFuncs   = function (object, prefix) {

    if(!prefix) { prefix = ''; }

    for (let i = 0; i < Object.keys(object).length; i++) {

      let
        color   = Object.keys(object)[i],
        vals    = object[color]
      ;

      /**
       * Set the arguments to the specified color
       *
       * @param {any} args The arguments
       * @returns {string} The arguments with the specified colour
       */
      let func = function () {

        let
          args    = util.format.apply(null, [ this.toString() ])
        ;

        return `\u001b[${vals[0]}m${args}\u001b[0m`;

      };

      funcs[prefix + color.toLowerCase()] = func;
      String.prototype.__defineGetter__(prefix + color.toLowerCase(), func);

    }

  }
;

/**
 * Strip colors from string(s)
 *
 * @param {String} string String to strip
 * @returns {String}
 */
function strip(string) {

  return ('' + string).replace(/\u001b\[\d+m/g, '');

}

// create color functions
createFuncs(codes.COLORS);
createFuncs(codes.BRIGHT, 'bright_');
createFuncs(codes.BACKGROUND, 'bg_');
createFuncs(codes.BRIGHT_BACKGROUND, 'bright_bg_');
createFuncs(codes.STYLES);


module.exports = {
  strip,
  ...funcs
};