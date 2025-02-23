const core = require("@actions/core");

async function run() {
    core.info("I am a custome JS action");
}
run();

/**
 * Libs needed
 *  npm i @actions/core@1.10.1 --save-exact
 */
