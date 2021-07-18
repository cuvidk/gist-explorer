import React from "react";
import Gist from "./components/Gist";
import "semantic-ui-css/semantic.min.css";

import { Layout } from "./components/Layout";

function App() {
  return (
    <Layout>
      <Gist />
    </Layout>
  );
}

export default App;
