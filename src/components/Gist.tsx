import React from "react";
import { Card, Label } from "semantic-ui-react";
import { GistFile } from "../types/gist";

type GistComponentProps = {
  gistFile: GistFile;
};

// TODO: narrow the type of the param
// TODO: improve looks
export const Gist = (props: GistComponentProps) => {
  const gistFile: GistFile = props.gistFile;

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          {gistFile.owner}/{gistFile.filename}
        </Card.Header>
        <Label content={gistFile.language} />
      </Card.Content>
      <Card.Content extra>
        <Card.Description>
          Forks: {gistFile.forks.length ? gistFile.forks.join(", ") : "None"}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};
