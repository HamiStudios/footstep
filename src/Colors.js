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
      RESET         : [ 0, 0 ],
      BLACK         : [ 30, 39 ],
      BLUE          : [ 34, 39 ],
      CYAN          : [ 36, 39 ],
      GRAY          : [ 90, 39 ],
      GREEN         : [ 32, 39 ],
      GREY          : [ 90, 39 ],
      MAGENTA       : [ 35, 39 ],
      RED           : [ 31, 39 ],
      WHITE         : [ 37, 39 ],
      YELLOW        : [ 33, 39 ]
    },

    // background colors
    BACKGROUND    : {
      BLACK         : [ 40, 49 ],
      BLUE          : [ 44, 49 ],
      CYAN          : [ 46, 49 ],
      GREEN         : [ 42, 49 ],
      MAGENTA       : [ 45, 49 ],
      RED           : [ 41, 49 ],
      WHITE         : [ 47, 49 ],
      YELLOW        : [ 43, 49 ]
    },

    // styles
    STYLES        : {
      BOLD          : [ 1, 22 ],
      DIM           : [ 2, 22 ],
      HIDDEN        : [ 8, 28 ],
      INVERSE       : [ 7, 27 ],
      ITALIC        : [ 3, 23 ],
      STRIKETHROUGH : [ 9, 29 ],
      UNDERLINE     : [ 4, 24 ]
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
          args    = util.format.apply(null, Object.keys(arguments).length > 0 ? arguments : [ this.toString() ])
        ;

        return `\u001b[${vals[0]}m${args}\u001b[${vals[1]}m`;

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
createFuncs(codes.BACKGROUND, 'bg_');
createFuncs(codes.STYLES);


module.exports = {
  strip,
  ...funcs
};