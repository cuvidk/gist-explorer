import React, { useEffect, useRef, useState } from "react";
import { Card, Container, Header, Form, Message } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import _ from "lodash";

import { GistFile } from "../types/gist";
import { Gist } from "./Gist";
import { githubRequest } from "../utils/github";
import "../style/gistList.css";

export const GistList = () => {
  const EP_PUBLIC_GISTS = "/gists/public";

  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState(EP_PUBLIC_GISTS);
  const [path, setPath] = useState(EP_PUBLIC_GISTS);
  const [gistFiles, setGistFiles] = useState<GistFile[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchGists();
  }, [path]);

  const delayedOnChange = useRef(
    _.throttle((event) => {
      const p = event.target.value
        ? `/users/${event.target.value}/gists`
        : EP_PUBLIC_GISTS;
      setPath(p);
      setNextPath(EP_PUBLIC_GISTS);
      setGistFiles([]);
      setError("");
    }, 2000)
  ).current;

  const onClick = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setPath(nextPath);
  };

  async function fetchGists() {
    try {
      setLoading(true);
      const resp = await githubRequest(`GET ${path}`, { per_page: 10 });

      if (resp.headers.link) {
        const next = resp.headers.link
          .split(",")
          .find((chunk) => chunk.includes("next"));

        setNextPath(
          next?.split(";")[0].replace(">", "").replace("<", "").trim() ?? path
        );
      }

      const files = (
        await Promise.all(
          resp.data.map((gist: any): Promise<GistFile[]> => {
            return mapGistToGistFiles(gist);
          })
        )
      ).flat() as GistFile[];

      setGistFiles([...gistFiles, ...files]);
    } catch (err) {
      // TODO: use a logger instead
      console.log(err);
      setError(
        `An error occured: ${
          process.env.NODE_ENV === "production" ? "see logs" : err
        }`
      );
    } finally {
      setLoading(false);
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

  const items = gistFiles.map((gistFile) => {
    return <Gist key={uuid()} gistFile={gistFile} />;
  });

  return (
    <Container>
      <Header content="Gist Explorer" />
      <Form error={!!error}>
        <Form.Input
          placeholder="Search by username..."
          icon="search"
          onChange={delayedOnChange}
        />
        <Message error header="Oups!" content={error} />
        <Card.Group>{items}</Card.Group>
        <Form.Button
          className="loadMoreBtn"
          onClick={onClick}
          fluid
          loading={loading}
          content="View More"
        />
      </Form>
    </Container>
  );
};
