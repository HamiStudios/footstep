const colors = require("colors");
const dotprop = require("dot-prop");
const path = require("path");
const fs = require("fs");
const os = require("os");
const mkdirp = require("mkdirp");

const typeColours = {
	verbose: "grey",
	info: "cyan",
	error: "red",
	warning: "yellow",
	notice: "blue",
	debug: "green"
};

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


function mergeObjects(obj1, obj2) {
	let newObject = obj1;
	let obj2Keys = Object.keys(obj2);

	for (let i = 0; i < obj2Keys.length; i++) {
		let key = obj2Keys[i];

	    if(typeof newObject[key] !== "undefined") {
	    	if(typeof obj2[key] === "object") {
	    		newObject[key] = mergeObjects(newObject[key], obj2[key]);
			} else {
	    		newObject[key] = obj2[key];
			}
		} else {
	    	newObject[key] = obj2[key];
		}
	}

	return newObject;
}

function replaceFormat(message, data) {
	if(message.toString().search(/{{(.*?)}}/g) !== -1) {

		let matches = message.toString().match(/{{(.*?)}}/g);
		for (let i = 0; i < matches.length; i++) {
		    let valueMatch = matches[i].replace("{{", "").replace("}}", "").trim();
		    let value = dotprop.get(data, valueMatch);

			if(typeof value === "function") {
				value = value(data);
			}

			message = message.toString().replace(matches[i], value);
		}

		return replaceFormat(message, data);
	}

	return message;
}

function logVars(options, message, data, type) {
	let format = options.format;
	let replaceData = options.formats;
	replaceData = Object.assign(options.formats, (data || {}));
	replaceData["log_type"] = type;
	replaceData["message"] = message;

	return {
		format: format,
		replaceData: replaceData
	};
}

function log(options, type, message) {
	if(options.print) {
		switch (type) {
			case "error":
				console.error(message);
				break;
			case "info":
				console.info(message);
				break;
			default:
				console.log(message);
				break;
		}
	}

	if(options.store.enabled) {
		if(typeof options.store.callback === "function") {
			options.store.callback();
		}

		let addToLog = function (filePath) {
			let fileMessage = message;
			let stripMatches = fileMessage.match(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g);
			if(stripMatches !== null) {
				for (let i = 0; i < stripMatches.length; i++) {
					fileMessage = fileMessage.replace(stripMatches[i], "");
				}
			}

			fs.appendFile(filePath, fileMessage + os.EOL, function () {
				if(typeof options.store.complete === "function") {
					options.store.complete();
				}
			});
		};

		let addToFile = function (err) {
			if(err) {
				console.error(err);
			} else {
				let dir = path.resolve(options.store.directory).toString();

				if(options.store.separateFiles) {
					addToLog(dir + "/" + options.store.files[type]);
				} else {
					addToLog(dir + "/" + options.store.file);
				}
			}
		};

		let dir = path.resolve(options.store.directory).toString();
		if(!fs.existsSync(dir)) {
			mkdirp(dir, addToFile);
		} else {
			addToFile();
		}

	}
}

function Footstep(options) {
	options = mergeObjects(defaultOptions, options);


	/**
	 * Create a verbose log
	 *
	 * @param message Message to log
	 * @param data The data to pass
	 */
	this.verbose = function (message, data) {
		if(options.verbose) {
			let vars = logVars(options, message, data, "verbose");
			log(options, "verbose", options.prefix + replaceFormat(vars.format, vars.replaceData));
		}
	};


	/**
	 *	Create a info log
	 *
	 * @param message message to log
	 * @param data The data to pass
	 */
	this.info = function (message, data) {
		let vars = logVars(options, message, data, "info");
		log(options, "info", options.prefix + replaceFormat(vars.format, vars.replaceData));
	};


	/**
	 *	Create a error log
	 *
	 * @param message message to log
	 * @param data The data to pass
	 */
	this.error = function (message, data) {
		let vars = logVars(options, message, data, "error");
		log(options, "error", options.prefix + replaceFormat(vars.format, vars.replaceData));
	};


	/**
	 *	Create a warning log
	 *
	 * @param message message to log
	 * @param data The data to pass
	 */
	this.warning = function (message, data) {
		let vars = logVars(options, message, data, "warning");
		log(options, "warning", options.prefix + replaceFormat(vars.format, vars.replaceData));
	};


	/**
	 *	Create a notice log
	 *
	 * @param message message to log
	 * @param data The data to pass
	 */
	this.notice = function (message, data) {
		let vars = logVars(options, message, data, "notice");
		log(options, "notice", options.prefix + replaceFormat(vars.format, vars.replaceData));
	};


	/**
	 *	Create a debug log
	 *
	 * @param message message to log
	 * @param data The data to pass
	 */
	this.debug = function (message, data) {
		if(options.debug) {
			let vars = logVars(options, message, data, "debug");
			log(options, "debug", options.prefix + replaceFormat(vars.format, vars.replaceData));
		}
	};


	/**
	 * Set verbose to true or value
	 *
	 * @param value The value to set
	 */
	this.setVerbose = function (value) {
		options.verbose = value;
	};


	/**
	 * Set debug to true or value
	 *
	 * @param value The value to set
	 */
	this.setDebug = function (value) {
		options.debug = value;
	};



	return {
		verbose: this.verbose,
		info: this.info,
		error: this.error,
		err: this.error,
		warning: this.warning,
		warn: this.warning,
		notice: this.notice,
		debug: this.debug,
		setVerbose: this.setVerbose,
		setDebug: this.setDebug
	};
}


module.exports = Footstep;