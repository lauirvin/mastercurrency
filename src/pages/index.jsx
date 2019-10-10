import React, { useState, useEffect } from "react";

import Layout from "../components/layout";
import SEO from "../components/SEO";

import Currencies from "../components/currencies/currencies";
import Controls from "../components/currencies/controls";
import MiniChart from "../components/minichart/minichart";
import Compare from "../components/compare/compare";

const Converter = () => {
  const [currencies, setCurrencies] = useState();
  const [items, setItems] = useState();
  const [options, setOptions] = useState();
  const [time, setTime] = useState("...");

  const [newItems, setNewItems] = useState();

  const passCurrencies = currencies => {
    setCurrencies(currencies);
  };

  const passItems = items => {
    setItems(items);
  };

  const passOptions = options => {
    setOptions(options);
  };

  const passNewItems = newItems => {
    setNewItems(newItems);
  };

  const fetchTime = () => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    let clock;
    let newHour;

    if (hour > 12) {
      newHour = hour - 12;
      clock = "PM";
    } else {
      clock = "AM";
    }

    setTime(newHour + ":" + minute + clock);
  };

  useEffect(() => {
    fetchTime();
  }, []);

  return (
    <Layout>
      <SEO title="Converter" />
      <h2>Converter</h2>
      <div className="subtitle-row">
        <h4>Last updated: {time}</h4>
        <Controls
          items={items}
          options={options}
          currencies={currencies}
          passNewItems={passNewItems}
        />
      </div>
      <div className="components-container">
        <div className="left">
          <MiniChart items={items} />
          <Compare items={items} />
        </div>
        <Currencies
          passOptions={passOptions}
          passItems={passItems}
          passCurrencies={passCurrencies}
          newItems={newItems}
        />
      </div>
    </Layout>
  );
};

export default Converter;
