import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

async function run() {
  const token = getInput("gh-token");
  const label = getInput("label");

  const octokit = getOctokit(token);

  const pullRequest = context.payload.pull_request;
  const issuesLabel = context.payload.issue;

  try {
    if (pullRequest) {
    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      labels: [label],
    });
  }
    else if(issuesLabel){
      await octokit.rest.issue.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issuesLabel.number,
        labels: [label],
      });
    }
    else{
      throw new Error("This action only works for Pull requests and issues");
    }
  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

// do not execute run() if action has been run by jest
if (!process.env.JEST_WORKER_ID) {
  run();
}

export { run };
