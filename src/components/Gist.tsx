import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Label,
  Accordion,
  Icon,
  Loader,
  Message,
} from "semantic-ui-react";
// import hljs from "highlight.js";
import { GistFile } from "../types/gist";
import "../style/gist.css";

type GistComponentProps = {
  gistFile: GistFile;
};

// TODO: narrow the type of the param
// TODO: improve looks
export const Gist = ({ gistFile }: GistComponentProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setError("");
    setCode("");
    setLoading(!loading);

    if (!!code) {
      return;
    }

    try {
      const resp = await axios({
        method: "GET",
        url: gistFile.rawUrl,
        // add support for authenticated req
      });

      if (typeof resp.data === "string") {
        setCode(resp.data);
      } else {
        // for whatever reason, if the raw file is a json,
        // it's parsed to an object by the axios request lib
        setCode(JSON.stringify(resp.data));
      }
    } catch (err) {
      // TODO: logger instead
      console.log(err);
      setError(
        `Failed to fetch file: ${
          process.env.NODE_ENV === "production" ? "see logs" : err
        } `
      );
    } finally {
      setLoading(false);
    }
  };

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
        <Card.Description>
          <Accordion>
            <Accordion.Title active={!!code} onClick={handleOnClick}>
              <Icon name="dropdown" />
              View
            </Accordion.Title>
            <Accordion.Content className="codeContainer" active={!!code}>
              <Loader active={loading} inline="centered" />
              <Message hidden={!error} content={error} negative />
              <pre>
                {/* <code
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlightAuto(code).value,
                  }}
                ></code> */}
                <code>{code}</code>
              </pre>
            </Accordion.Content>
          </Accordion>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};
