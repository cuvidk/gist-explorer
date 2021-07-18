import { request } from "@octokit/request";

export const githubRequest = request.defaults({
  headers: {
    authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
  },
});
