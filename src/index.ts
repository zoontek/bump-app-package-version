import * as core from "@actions/core";

async function wait(milliseconds: number): Promise<string> {
  return new Promise((resolve) => {
    if (isNaN(milliseconds)) {
      throw new Error("milliseconds not a number");
    }

    setTimeout(() => resolve("done!"), milliseconds);
  });
}

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput("milliseconds");

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`);

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString());
    await wait(parseInt(ms, 10));
    core.debug(new Date().toTimeString());

    // Set outputs for other workflow steps to use
    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
