import React, { useState } from "react";

import Layout from "../components/layout";
import SEO from "../components/SEO";

import Currencies from "../components/currencies/currencies";
import MiniChart from "../components/minichart/minichart";

const Converter = () => {
  const [items, setItems] = useState();

  const passItems = items => {
    setItems(items);
  };

  return (
    <Layout>
      <SEO title="Converter" />
      <h2>Converter</h2>
      <div className="components-container">
        <MiniChart items={items} />
        <Currencies passItems={passItems} />
      </div>
    </Layout>
  );
};

export default Converter;
