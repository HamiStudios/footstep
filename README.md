![footstep logo](logo.png)

# footstep  
footstep is a simple robust logger for [nodejs](https://nodejs.org/en/)  

[![Build Status](https://travis-ci.org/HamiStudios/footstep.svg?branch=master)](https://travis-ci.org/HamiStudios/footstep)
[![Coverage Status](https://coveralls.io/repos/github/HamiStudios/footstep/badge.svg?branch=master)](https://coveralls.io/github/HamiStudios/footstep?branch=master)
[![npm version](https://img.shields.io/npm/v/@hamistudios/footstep.svg)](https://www.npmjs.com/package/@hamistudios/footstep)
[![license](https://img.shields.io/github/license/hamistudios/footstep.svg)](https://github.com/hamistudios/footstep/blob/master/LICENSE.md)


# Installation  
```  
$ npm install --save @hamistudios/footstep  
```

# Documentation

## Logger

#### Setup  
```javascript  
const { Logger } = require("footstep");  
  
let logger = new Logger(options);  
```  

#### Usage  
```javascript  
logger.verbose("Hello World");  // => [10:34:35] verbose: Hello World
logger.info("Hello World");     // => [10:34:35] info: Hello World
logger.error("Hello World");    // => [10:34:35] error: Hello World
logger.warning("Hello World");  // => [10:34:35] warning: Hello World
logger.notice("Hello World");   // => [10:34:35] notice: Hello World
logger.debug("Hello World");    // => [10:34:35] debug: Hello World
logger.log("Hello World");      // => [10:34:35] log: Hello World
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
const options = {
  format  : '[{{dow}}] {{message}}',
  formats : {
    dow     : function() {
      let days  = [ 'Sunday','Monday','Tuesday',
        'Wednesday','Thursday','Friday', 'Saturday' ],
      let date  = new Date();
      
      return days[date.getDay()];  
    }  
  }
};

let logger = new Logger(options);

logger.log('Hello World'); // => [Thursday] Hello World 
```  
  
#### Streams
  
You can set the stream to anything with the instance of [`Stream`](https://nodejs.org/api/stream.html) including process.stdout, process.stderr, fs streams, HTTP streams etc.

### Methods

#### .setVerbose
Set whether verbose logs should be sent to the stream.

##### Syntax
```javascript
logger.setVerbose(boolean: value)
```

#### .setDebug
Set whether debug logs should be sent to the stream.

##### Syntax
```javascript
logger.setDebug(boolean: value)
```

#### .clear
Clear the log output

##### Syntax
```javascript
logger.clear(full: boolean)
```

#### .blank
Print a blank line to the specified stream

Syntax
```javascript
logger.blank([StreamName: stream])
```

Example
```javascript
logger.blank(StreamName.ERROR); // print a blank line to the error stream
```


#### .getPastLogs
Get an array of past logs (max log history specified via `options.maxLogHistory`)

Syntax
```javascript
logger.getPastLogs()
```

#### .pad
Add padding to an array of strings to make them all the same length

Syntax
```javascript
logger.pad(string[]: strings, [boolean: start=true])
```

Example
```javascript
logger.pad(['test', 'testing']); // => ['   test', 'testing']
logger.pad(['test', 'testing'], false); // => ['test   ', 'testing']
```

#### .verbose
Print to the verbose stream

Syntax
```javascript
logger.verbose(any[]: args)
```

Example
```javascript
logger.verbose('Sum (5+5)', 10);
```

#### .info
Print to the info stream

Syntax
```javascript
logger.info(any[]: args)
```

Example
```javascript
logger.info('Sum (5+5)', 10);
```

#### .error
Print to the error stream

Syntax
```javascript
logger.error(any[]: args)
```

Example
```javascript
logger.error('Sum (5+5)', 10);
```

#### .warning
Print to the warning stream

Syntax
```javascript
logger.warning(any[]: args)
```

Example
```javascript
logger.warning('Sum (5+5)', 10);
```

#### .notice
Print to the notice stream

Syntax
```javascript
logger.notice(any[]: args)
```

Example
```javascript
logger.notice('Sum (5+5)', 10);
```

#### .debug
Print to the debug stream

Syntax
```javascript
logger.debug(any[]: args)
```

Example
```javascript
logger.debug('Sum (5+5)', 10);
```

#### .log
Print to the log stream

Syntax
```javascript
logger.log(any[]: args)
```

Example
```javascript
logger.log('Sum (5+5)', 10);
```

## Colors
Footstep has built in support for colors and styles, you can use these to bring your logs to life.

### Usage
```javascript  
const { Colors } = require("footstep");

console.log('I am red and underlined'.red.underline);  
console.log('I am blue and bold'.blue.bold);  
console.log('I am black with a white background'.black.bg_white);  
console.log('I am black with a red background'.red.inverse);
console.log(color.strip('I am no color'.yellow));
```

### List of colors & styles
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
