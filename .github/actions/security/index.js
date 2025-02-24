const core = require("@actions/core");

async function run() {
    try {
        const pr = core.getInput("pr-title");

        if (pr.startsWith("feat")) {
            core.info("PR is a Feature");
        } else {
            core.info("PR is not a Feature");
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
