import React, { useEffect, useState } from "react";
import { Card, Container, Header, Form } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import _ from "lodash";

import { GistFile } from "../types/gist";
import { Gist } from "./Gist";
import { githubRequest } from "../utils/github";

export const GistList = () => {
  const [username, setUsername] = useState<string>();
  const [gistFiles, setGistFiles] = useState<GistFile[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchGists();
  }, [username]);

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
      };
    });
  }

  async function fetchForks(gistId: string): Promise<string[]> {
    const resp = await githubRequest(`GET /gists/${gistId}/forks`, {
      per_page: 3,
    });
    if (200 !== resp.status) {
      console.log(resp);
      return [];
    }

    return resp.data.map((fork: any): string => fork.owner.login) as string[];
  }

  async function fetchGists() {
    let path: string = "/gists/public";
    if (username) {
      path = `/users/${username}/gists`;
    }

    const resp = await githubRequest(`GET ${path}`, { per_page: 10 });
    if (200 !== resp.status) {
      console.log(resp);
      setError(`failed to fetch data: ${resp.status}`);
      return;
    }

    const files = (
      await Promise.all(
        resp.data.map((gist: any): Promise<GistFile[]> => {
          return mapGistToGistFiles(gist);
        })
      )
    ).flat() as GistFile[];

    setGistFiles(files);
  }

  const items = gistFiles?.map((gistFile) => {
    return <Gist key={uuid()} gistFile={gistFile} />;
  });

  const throttledChange = _.throttle((event) => {
    setUsername(event.target.value);
  }, 2000);

  return (
    <Container>
      <Header content="Gist Explorer" />
      <Form>
        <Form.Input
          placeholder="Search by username..."
          icon="search"
          onChange={throttledChange}
        />
      </Form>
      <Card.Group>{items}</Card.Group>
    </Container>
  );
};
