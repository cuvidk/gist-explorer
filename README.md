# Gist-Explorer

This is a front-end project that uses semnatic-ui framework to render a simple Gist Explorer. It consumes a bunch of Gist endpoints from Github API.

## Getting started

Clone the repo and install the required deps using `yarn`.

## Running the project

Just run `yarn start` in the command-line.

You can provide a Github Personal Access Token to the app, by setting `REACT_APP_GITHUB_TOKEN` environment variable through a `.env` file / any other method you prefer. This will allow for more requests / sec.

## Project structure

The project contains only 2 components:

- Gist component:
  - responsible for rendering one Gist File at a time
  - fetches through github-api the file content only if the user clicks / expands the actual file
- GistList component:
  - aggregates a bunch of Gist components and properly renders them
  - fetches through github-api a list of gists associated with a specific username
  - fetches through github-api a list of public gists if no username is provided
  - provides a "View More" button that will load more Gists associated to the user if clicke. This was implemented for performance reasons - some users have associated thousands of gists.

## Optimizations + Enhancements

- fetching the gists associated with a user is handled every 2 seconds, only if the username in the input field changes. This is achieved through the lodash's `throttle` function. It's convenient for the user not to have to press the enter key each time he / she wants to initiate a search. However, automatically searching for the gists of a specific user on each key press would cause some performance issues. To solve that, a throttling mechanism was implemented as an optimization method.
- the content of the gist files is not fetched when the Gists are rendered. The fetching only happens when the user expands the Gist View by clicking on the "View" accordion. This is a performance improvement feature.
- for any user, only the first 10 gist files are fetched. If more are required, the user can press the "View more" button at the bottom of the page to load the next batch of gist files. I cannot afford to fetch all the gists at once since there are users with thousands of gists, as such this feature was implemented as an optimization.
- in case no username is provided, a list of public gists is rendered instead. This enchancement was implemented to achieve a better looking UI.

## Styling

The app contains minimal CSS usage. Semantic-UI provided good-enough defaults that didn't need much style tweaking. I think that using UI framework reflects a real world scenario better.
