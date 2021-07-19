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

## Styling

The app contains minimal CSS usage. Semantic-UI provided good-enough defaults that didn't need much style tweaking. I think that using UI framework reflects a real world scenario better.
