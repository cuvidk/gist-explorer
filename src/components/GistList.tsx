import React, { useEffect, useState } from "react";
import { Card } from "semantic-ui-react";

import { GistFile } from "../types/gist";
import { Gist } from "./Gist";
import { githubRequest } from "../utils/github";

export const GistList = () => {
  const [username, setUsername] = useState<string>();
  const [gistFiles, setGistFiles] = useState<GistFile[]>();
  const [error, setError] = useState<string>();

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
    const resp = await githubRequest(`get /gists/${gistId}/forks`, {
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

    const resp = await githubRequest(`get ${path}`, { per_page: 10 });
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

  useEffect(() => {
    fetchGists();
  });

  return (
    <Card.Group>
      {gistFiles
        ? gistFiles.map((gistFile) => {
            return (
              <Gist
                key={gistFile.owner + gistFile.filename}
                gistFile={gistFile}
              />
            );
          })
        : ""}
    </Card.Group>
  );
};
