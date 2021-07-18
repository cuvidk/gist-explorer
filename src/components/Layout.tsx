import React from "react";
import { Container, Header, Form } from "semantic-ui-react";

export const Layout = (props: any) => {
  return (
    <Container>
      <Header content="Gist Explorer" />
      <Form>
        <Form.Input placeholder="Search by username..." icon="search" />
      </Form>
      {props.children}
    </Container>
  );
};
