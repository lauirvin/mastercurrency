import React from "react";

import Layout from "../components/layout";
import SEO from "../components/SEO";
import Currencies from "../components/currencies/currencies";

const Converter = () => (
  <Layout>
    <SEO title="Converter" />
    <h2>Converter</h2>
    <div className="components-container">
      <Currencies />
    </div>
  </Layout>
);

export default Converter;
