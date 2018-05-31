
# footstep  
footstep is a simple robust logger for [nodejs](https://nodejs.org/en/)  
  
  
### Installation  
```  
$ npm install --save footstep  
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
  
  
// verbose & debug will not execute if they  
// aren't enabled. You can enable/disable them  
// via the options or the following functions.  
logger.setVerbose(true);  
logger.setDebug(true);  
```
  
#### Options  
Footstep comes with a lot of useful options to help customize your log messages including, custom streams, prefixes and functional expansions.   
  
| variables       | default                                            | type     |
|-----------------|----------------------------------------------------|----------|
| streams.verbose | process.stdout                                     | Stream   |
| streams.info    | process.stdout                                     | Stream   |
| streams.error   | process.stderr                                     | Stream   |
| streams.warning | process.stdout                                     | Stream   |
| streams.notice  | process.stdout                                     | Stream   |
| streams.debug   | process.stdout                                     | Stream   |
| streams.log     | process.stdout                                     | Stream   |
| format          | [{{date}}] {{type}}: {{message}}                   | String   |
| formats.date    | [Function() {}](/src/Logger.js#L59)                | Function |
| formats.message | [Function() {}](/src/Logger.js#L71)                | Function |
| formats.type    | [Function() {}](/src/Logger.js#L76)                | Function |
| prefix          |                                                    | String   |
| eol             | [os.EOL](https://nodejs.org/api/os.html#os_os_eol) | String   |
| debug           | false                                              | Boolean  |
| verbose         | false                                              | Boolean  |

#### Custom expansions  
  
You can create custom function expansions by adding a new function to `formats`  
  
```javascript  
const  
  options = {
    format  : '[{{dow}}] {{message}}',
    formats : {
      dow     : function() {
	    let
	      days  = ['Sunday','Monday','Tuesday',
	               'Wednesday','Thursday','Friday', 
	               'Saturday'],
	      date  = new Date()
	    ;
        return days[date.getDay()];  
      }  
    }
  }
;
```  
  
Output:  
`[Thursday] Hello World`  
  
  
#### Streams  
  
You can set the stream to anything with the instance of [`Stream`](https://nodejs.org/api/stream.html) including process.stdout, process.stderr, fs streams, HTTP streams etc.


### Colors
Footstep has built in support for colors and styles with help & similar syntax to [colors.js](https://github.com/Marak/colors.js).

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
- .blue
- .cyan
- .gray
- .green
- .grey
- .magenta
- .red
- .white
- .yellow
- .bg_black
- .bg_blue
- .bg_cyan
- .bg_gray
- .bg_green
- .bg_grey
- .bg_magenta
- .bg_red
- .bg_white
- .bg_yellow
- .bold
- .dim
- .hidden
- .inverse
- .italic
- .strikethrough
- .underline
