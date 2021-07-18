import React, { useEffect, useState } from "react";
import { request } from "@octokit/request";
import { OctokitResponse } from "@octokit/types";
import { Card } from "semantic-ui-react";

import { GistFile } from "../types/gist";
import { Gist } from "./Gist";

export const GistList = () => {
  const [username, setUsername] = useState<string>();
  const [gistFiles, setGistFiles] = useState<GistFile[]>();
  const [error, setError] = useState<string>();

  async function mapGistsToGistFiles(
    res: OctokitResponse<any, number>
  ): Promise<GistFile[]> {
    const files: GistFile[] = [
      {
        filename: "yada/tada/foo/bar.js",
        language: "javascript",
        owner: "cuvidk",
        forks: ["awe", "www", "wqeqw"],
      },
      {
        filename: "yada/tada/foo/bar.js",
        language: "javascript",
        owner: "cuvidk",
        forks: ["awe", "www", "wqeqw"],
      },
    ];
    return files;
  }

  async function fetchGists() {
    let path: string = "/gists/public";
    if (username) {
      path = `/users/${username}/gists`;
    }

    const resp = await request(`GET ${path}`);
    if (200 !== resp.status) {
      console.log(resp);
      setError(`Failed to fetch data: ${resp.status}`);
      return;
    }

    const gistFiles = await mapGistsToGistFiles(resp);
    setGistFiles(gistFiles);
  }

  useEffect(() => {
    fetchGists();
  });

  return (
    <Card.Group>
      {gistFiles
        ? gistFiles.map((gistFile) => {
            return <Gist gistFile={gistFile} />;
          })
        : ""}
    </Card.Group>
  );
};
