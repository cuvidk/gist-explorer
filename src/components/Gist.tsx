import React, { useState } from "react";
import { Card, Label, Accordion, Icon } from "semantic-ui-react";
import { GistFile } from "../types/gist";

type GistComponentProps = {
  gistFile: GistFile;
};

// TODO: narrow the type of the param
// TODO: improve looks
export const Gist = ({ gistFile }: GistComponentProps) => {
  const [isCodeVisible, setCodeVisibility] = useState(false);

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
      <Card.Content>
        <Accordion>
          <Accordion.Title
            active={isCodeVisible}
            onClick={() => setCodeVisibility(!isCodeVisible)}
          >
            <Icon name="dropdown" />
            View
          </Accordion.Title>
          <Accordion.Content active={isCodeVisible}>
            {gistFile.content}
          </Accordion.Content>
        </Accordion>
      </Card.Content>
    </Card>
  );
};
