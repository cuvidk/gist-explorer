import React, { useEffect, useReducer, useRef, useState } from "react";
import { Card, Container, Header, Form, Message } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import _ from "lodash";

import { GistFile } from "../types/gist";
import { Gist } from "./Gist";
import { githubRequest } from "../utils/github";
import "../style/gistList.css";
import { isProd } from "../utils/utils";

const EP_PUBLIC_GISTS = "/gists/public";

interface ActionGistList {
  type: string;
}

interface ActionFetchFirst extends ActionGistList {
  payload: {
    path: string;
  };
}

interface ActionFetchDone extends ActionGistList {
  payload: {
    gistFiles: GistFile[];
    nextPath: string;
    error?: string;
  };
}

interface GistListState {
  loading: boolean;
  path: string;
  nextPath: string;
  gistFiles: GistFile[];
  error: string;
}

const initialState: GistListState = {
  loading: false,
  path: EP_PUBLIC_GISTS,
  nextPath: EP_PUBLIC_GISTS,
  gistFiles: [] as GistFile[],
  error: "",
};

const reducer = (state: GistListState, action: ActionGistList) => {
  console.log(action);
  switch (action.type) {
    case "FETCH_FIRST":
      return {
        loading: true,
        path: (action as ActionFetchFirst).payload.path,
        nextPath: EP_PUBLIC_GISTS,
        gistFiles: [] as GistFile[],
        error: "",
      };
    case "FETCH_NEXT":
      return {
        ...state,
        path: state.nextPath,
      };
    case "FETCH_STARTED":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_DONE":
      return {
        ...state,
        gistFiles: (action as ActionFetchDone).payload.gistFiles,
        nextPath: (action as ActionFetchDone).payload.nextPath,
        error: (action as ActionFetchDone).payload.error ?? "",
        loading: false,
      };
    default:
      return { ...state };
  }
};

export const GistList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const delayedOnChange = useRef(
    _.throttle((event) => {
      const path = event.target.value
        ? `/users/${event.target.value}/gists`
        : EP_PUBLIC_GISTS;

      const action: ActionFetchFirst = {
        type: "FETCH_FIRST",
        payload: { path },
      };
      dispatch(action);
    }, 2000)
  ).current;

  useEffect(() => {
    fetchGists();
  }, [state.path]);

  const onClick = () => {
    if (state.loading) {
      return;
    }
    dispatch({ type: "FETCH_NEXT" });
  };

  async function fetchGists() {
    try {
      dispatch({ type: "FETCH_STARTED" });
      const resp = await githubRequest(`GET ${state.path}`, {
        per_page: 10,
      });

      const files = (
        await Promise.all(
          resp.data.map((gist: any): Promise<GistFile[]> => {
            return mapGistToGistFiles(gist);
          })
        )
      ).flat() as GistFile[];

      let nextPath = state.path;
      if (resp.headers.link) {
        const next = resp.headers.link
          .split(",")
          .find((chunk) => chunk.includes("next"));
        nextPath =
          next?.split(";")[0].replace(">", "").replace("<", "").trim() ??
          state.path;
      }

      const action: ActionFetchDone = {
        type: "FETCH_DONE",
        payload: {
          gistFiles: [...state.gistFiles, ...files],
          nextPath,
          error: "",
        },
      };
      dispatch(action);
    } catch (err) {
      // TODO: use a logger instead
      console.log(err);
      const action: ActionFetchDone = {
        type: "FETCH_DONE",
        payload: {
          gistFiles: [],
          nextPath: "",
          error: `An error occured: ${isProd ? "see logs" : err}`,
        },
      };
      dispatch(action);
    }
  }

  // TODO: improve type of arg
  async function mapGistToGistFiles(gist: any): Promise<GistFile[]> {
    const gistId: string = gist.id;
    const forks = await fetchForks(gistId);
    return Object.values(gist.files).map((file: any): GistFile => {
      return {
        filename: file.filename as string,
        language: (file.language as string) ?? "unknown",
        owner: gist.owner.login as string,
        forks: forks,
        rawUrl: file.raw_url as string,
      };
    });
  }

  async function fetchForks(gistId: string): Promise<string[]> {
    try {
      const resp = await githubRequest(`GET /gists/${gistId}/forks`, {
        per_page: 3,
      });

      return resp.data.map((fork: any): string => fork.owner.login) as string[];
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  const items = state.gistFiles.map((gistFile) => {
    return <Gist key={uuid()} gistFile={gistFile} />;
  });

  return (
    <Container>
      <Header className="header" content="Gist Explorer" />
      <Form error={!!state.error}>
        <Form.Input
          className="usernameBar"
          placeholder="Search by username..."
          icon="search"
          onChange={delayedOnChange}
        />
        <Message error header="Oups!" content={state.error} />
        <Card.Group>{items}</Card.Group>
        <Form.Button
          className="loadMoreBtn"
          onClick={onClick}
          fluid
          loading={state.loading}
          content="View More"
        />
      </Form>
    </Container>
  );
};
