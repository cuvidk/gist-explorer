import React from "react";
import "semantic-ui-css/semantic.min.css";

import { Layout } from "./components/Layout";
import { GistList } from "./components/GistList";

function App() {
  return (
    <Layout>
      <GistList />
    </Layout>
  );
}

export default App;
