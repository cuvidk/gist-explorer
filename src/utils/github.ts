import { request } from "@octokit/request";

export let githubRequest = request;

if (process.env.REACT_APP_GITHUB_TOKEN) {
  githubRequest = request.defaults({
    headers: {
      authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
    },
  });
}
