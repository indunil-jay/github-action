const core = require("@actions/core");
const exec = require("@actions/exec");

const validateBranchName = ({ branchName }) =>
    /^[a-zA-Z0-9_\-\.\/]+$/.test(branchName);

const validateDirecrorName = ({ directoryName }) =>
    /^[a-zA-Z0-9_\-\/]+$/.test(directoryName);

async function run() {
    /**
     *  1 . parse inputs : base-bracnh to check for updates
     *                     target-branch to use create the PR
     *                     github token for authentication puipose
     *                     working directory for which to chcek for depencies
     *
     *
     * 2 . Execute the npm update command within the working directory
     * 3 . Check whether there are modified package*.json  files
     * 4 . if there are modified files:
     *     1 . add and commit files to the target-branch
     *     2 . create a pr to the base branch using the octokit-api
     * 5 . Othersiwe, conclude the custom action
     */

    //1
    const baseBranch = core.getInput("base-branch");
    const targetBranch = core.getInput("target-branch");
    const githubToken = core.getInput("github-token");
    const workingDirectory = core.getInput("working-directory");
    const debug = core.getBooleanInput("debug");

    core.setSecret(githubToken);

    if (!validateBranchName({ branchName: baseBranch })) {
        core.setFailed(
            "Invalid base branch name. Brach names should include only characters, numbers,hypens, undersocres, dots and forward slashes"
        );
        return;
    }
    if (!validateBranchName({ branchName: targetBranch })) {
        core.setFailed(
            "Invalid target branch name. Brach names should include only characters, numbers,hypens, undersocres, and forward slashes"
        );
        return;
    }
    if (!validateDirecrorName({ directoryName: workingDirectory })) {
        core.setFailed(
            "Invalid directory name. Brach names should include only characters, numbers,hypens, undersocres and dots"
        );
        return;
    }

    core.info(`[js-dependency-update] :: base branch is ${baseBranch}`);
    core.info(`[js-dependency-update] :: target branch is ${targetBranch}`);
    core.info(
        `[js-dependency-update] :: working directory is ${workingDirectory}`
    );

    //2
    await exec.exec("npm update", [], { cwd: workingDirectory });

    //3
    const gitStatus = await exec.getExecOutput(
        "git status -s package*.json",
        [],
        { cwd: workingDirectory }
    );

    if (gitStatus.stdout.length > 0) {
        core.info(`[js-dependency-update] :: There are updates available!`);
    } else {
        core.info(
            `[js-dependency-update] :: No updates at this point in time!`
        );
    }

    // 4
}
run();

/**
 * Libs needed
 *  npm i @actions/core@1.10.1 --save-exact
 *  npm i @actions/exec@1.1.1  --save-exact   provdide utility for run cmd commands
 *  npm i @actions/github@6.0.0 --save-exact  provide github utiliy
 */
