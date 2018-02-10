# footstep
footstep is a simple logger for [nodejs](https://nodejs.org/en/)


### Installation
```
$ npm install --save footstep
```

### Setup
```javascript
const Footstep = require("footstep");

let logger = new Footstep(options);
```

### Usage
```javascript
logger.verbose("message");
logger.info("message");
logger.error("message");
logger.err("message");
logger.warning("message");
logger.warn("message");
logger.notice("message");
logger.debug("message");
logger.setVerbose(true);
logger.setDebug(true);
```

#### Message Formatting
Messages follow the format specified in the options. Formats can be changed by creating new format functions in the options and passing the function name to in the format.

Default Format:
```text
[{{date}} {{type}}] {{message}}
```
Output:
```text
[09/02/2018 23:37:24 info] Test info message
```

`{{date}}` and `{{type}}` are replaced with the function return value from the format functions.
`{{message}}` is replaced by the message past to the log function.

You can create your own format function in the options like so:
```javascript
let logger = new Footstep({
	format: "{{message}} {{dow}}",
	formats: {
		dow: function() {
			let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			let date = new Date();
			return days[date.getDay()];
		}
	}
});

logger.info("The day of the week is:");
```
This will return the day of the week when used in the log format.

Output:
```text
The day of the week is: Friday
```

You can also pass data to these functions
```javascript
let logger = new Footstep({
	format: "{{message}} {{ip}}",
	formats: {
		ip: function(data) {
			return data.ip
		}
	}
});

logger.info("User IP Address:", {
	ip: "192.168.1.0"
});
```

Output:
```text
User IP Address: 192.168.1.0
```

#### Storing to a log file
Footstep has built in support to add your logs to a file. Simply start by enabling `store`.
```javascript
let logger = new Footstep({
	store: {
		enabled: true
	}
});
```
This will now start storing logs into a file. Default location is `<project>/logs/`. You change the log directory with the following option.
```javascript
let logger = new Footstep({
	store: {
		enabled: true,
		directory: __dirname + "/secret_logs/"
	}
});
```

You can also choose whether to store logs in a single file or split them between there own files `debug.log`, `error.log`, `info.log`, `notice.log`, `verbose` and `warning.log`. You can achieve this by enabling `separateFiles`. 
```javascript
let logger = new Footstep({
	store: {
		enabled: true,
		separateFiles: true
	}
});
```

If you want to change the names of the files you can change the bundled log file or each separate log file.
```javascript
let logger = new Footstep({
	store: {
		enabled: true,
		file: "footstep.log", // bundled log file
		files: { // used when separateFiles is set to true
			debug: "debug.log",
			error: "error.log",
			info: "info.log",
			notice: "notice.log",
			verbose: "verbose.log",
			warning: "warning.log"
		}
	}
});
```

There is also 2 callback functions for when logging to files has `started` and `complete` you can attach a function to them like so   
```javascript
let logger = new Footstep({
	store: {
		enabled: true,
		started: function() {
			// logging to a file
		},
		complete: function() {
			// file logging complete
		}
	}
});
```

If you want you can disable console output and only allow logging to files by disabling `print`. You can also disable `verbose` and `debug` logs via the options or with `Footstep.setVerbose()` and `Footstep.setDebug()`
```javascript
let logger = new Footstep({
	print: false,
	verbose: false,
	debug: false
});
```

You can also add a prefix to all log messages by setting the `prefix` value in the options
```javascript
let logger = new Footstep({
	prefix: "[PREFIX] "
});
```


### Default Footstep Options
```javascript
const defaultOptions = {
	format: "[{{date}} {{type}}] {{message}}",
	formats: {
		date: function () {
			let date = new Date();
			let dateFormat =
				("0" + date.getDate()).slice(-2) + "/" +
				("0" + (date.getMonth()+1)).slice(-2) + "/" +
				date.getFullYear() + " " +
				("0" + date.getHours()).slice(-2) + ":" +
				("0" + date.getMinutes()).slice(-2) + ":" +
				("0" + date.getSeconds()).slice(-2);

			return colors.magenta(dateFormat);
		},
		type: function (data) {
			return colors[typeColours[data.log_type]](data.log_type);
		}
	},
	prefix: "",
	debug: false,
	verbose: false,
	print: true,
	store: {
		enabled: false,
		separateFiles: false,
		started: null,
		complete: null,
		file: "footstep.log",
		files: {
			debug: "debug.log",
			error: "error.log",
			info: "info.log",
			notice: "notice.log",
			verbose: "verbose.log",
			warning: "warning.log"
		},
		directory: path.dirname(require.main.filename) + "/logs/"
	}
};
```