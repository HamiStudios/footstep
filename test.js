const Footstep = require(__dirname + "/index.js");

let log = new Footstep({
	debug: true,
	verbose: true,
	store: {
		enabled: true,
		separateFiles: true
	}
});

log.debug("Test debug message");
log.err("Test error message");
log.error("Test error message");
log.info("Test info message");
log.notice("Test notice message");
log.verbose("Test verbose message");
log.warn("Test warning message");
log.warning("Test warning message");