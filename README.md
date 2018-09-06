![footstep logo](logo.png)

# footstep  
footstep is a simple robust logger for [nodejs](https://nodejs.org/en/)  

[![Build Status](https://travis-ci.org/HamiStudios/footstep.svg?branch=master)](https://travis-ci.org/HamiStudios/footstep)
[![Coverage Status](https://coveralls.io/repos/github/HamiStudios/footstep/badge.svg?branch=master)](https://coveralls.io/github/HamiStudios/footstep?branch=master)
[![npm version](https://img.shields.io/npm/v/@hamistudios/footstep.svg)](https://www.npmjs.com/package/@hamistudios/footstep)
[![license](https://img.shields.io/github/license/hamistudios/footstep.svg)](https://github.com/hamistudios/footstep/blob/master/LICENSE.md)


### Installation  
```  
$ npm install --save @hamistudios/footstep  
```  
  
### Setup  
```javascript  
const { Logger } = require("footstep");  
  
let logger = new Logger(options);  
```  
  
### Usage  
```javascript  
logger.verbose("Hello World");  // => [10:34:35] verbose: Hello World
logger.info("Hello World");     // => [10:34:35] info: Hello World
logger.error("Hello World");    // => [10:34:35] error: Hello World
logger.warning("Hello World");  // => [10:34:35] warning: Hello World
logger.notice("Hello World");   // => [10:34:35] notice: Hello World
logger.debug("Hello World");    // => [10:34:35] debug: Hello World
logger.log("Hello World");      // => [10:34:35] log: Hello World
```

#### Helper methods
```javascript
// setting verbose & debug to true
logger.setVerbose(value: boolean)  
logger.setDebug(value: boolean)

// you can clear stdout via
logger.clear(full: boolean)

// you can also print a blank line via
logger.blank(stream: string)

// accessing log history provides and array of past
// logs (max log history specified via options.maxLogHistory)
logger.getPastLogs()

// add padding to an array of strings to make them all the same length
logger.pad(['test', 'testing']); // => ['   test', 'testing']

logger.pad(['test', 'testing'], false); // => ['test   ', 'testing']
```
  
#### Options  
Footstep comes with a lot of useful options to help customize your log messages including, custom streams, prefixes and functional expansions.   
  
| variables           | default                                            | type                 |
|-----------------    |----------------------------------------------------|----------------------|
| streams.verbose     | process.stdout                                     | Stream&#124;Function |
| streams.info        | process.stdout                                     | Stream&#124;Function |
| streams.error       | process.stderr                                     | Stream&#124;Function |
| streams.warning     | process.stdout                                     | Stream&#124;Function |
| streams.notice      | process.stdout                                     | Stream&#124;Function |
| streams.debug       | process.stdout                                     | Stream&#124;Function |
| streams.log         | process.stdout                                     | Stream&#124;Function |
| streams.clear       | process.stdout                                     | Stream&#124;Function |
| format              | [{{date}}] {{type}}: {{message}}                   | String               |
| formats.date        | [Function() {}](/src/Logger.js#L23)                | Function             |
| formats.message     | [Function() {}](/src/Logger.js#L35)                | Function             |
| formats.type        | [Function() {}](/src/Logger.js#L40)                | Function             |
| prefix              |                                                    | String               |
| eol                 | [os.EOL](https://nodejs.org/api/os.html#os_os_eol) | String               |
| debug               | false                                              | Boolean              |
| verbose             | false                                              | Boolean              |
| maxLogHistory       | 50                                                 | Integer              |
| clearCodes.full     | \x1b[2J                                            | String               |
| clearCodes.standard | \x1b[0f                                            | String               |

#### Custom expansions  
  
You can create custom function expansions by adding a new function to `formats`  
  
```javascript  
const  
  options = {
    format  : '[{{dow}}] {{message}}',
    formats : {
      dow     : function() {
        let
          days  = [ 'Sunday','Monday','Tuesday',
                    'Wednesday','Thursday','Friday', 
                    'Saturday' ],
          date  = new Date()
        ;
        
        return days[date.getDay()];  
      }  
    }
  }
;

let logger = new Logger(options);

logger.log('Hello World'); // => [Thursday] Hello World 
```  
  
#### Streams
  
You can set the stream to anything with the instance of [`Stream`](https://nodejs.org/api/stream.html) including process.stdout, process.stderr, fs streams, HTTP streams etc.


### Colors
Footstep has built in support for colors and styles, you can use these to bring your logs to life.

#### Usage
```javascript  
const { Colors } = require("footstep");

console.log('I am red and underlined'.red.underline);  
console.log('I am blue and bold'.blue.bold);  
console.log('I am black with a white background'.black.bg_white);  
console.log('I am black with a red background'.red.inverse);
console.log(color.strip('I am no color'.yellow));
```

#### List of colors & styles
- .reset
- .black
- .red
- .green
- .yellow
- .blue
- .magenta
- .cyan
- .white
- .gray
- .gray
- .bright_black
- .bright_red
- .bright_green
- .bright_yellow
- .bright_blue
- .bright_magenta
- .bright_cyan
- .bright_white
- .bg_black
- .bg_red
- .bg_green
- .bg_yellow
- .bg_blue
- .bg_magenta
- .bg_cyan
- .bg_white
- .bright_bg_black
- .bright_bg_red
- .bright_bg_green
- .bright_bg_yellow
- .bright_bg_blue
- .bright_bg_magenta
- .bright_bg_cyan
- .bright_bg_white
- .bold
- .faint
- .italic
- .underline
- .slow_blink
- .rapid_blink
- .inverse
- .hidden
- .strikethrough
- .framed
- .encircled
- .overlined
