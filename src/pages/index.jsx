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
  const [time, setTime] = useState("...");

  const [newItems, setNewItems] = useState();

  const passCurrencies = currencies => {
    setCurrencies(currencies);
  };

  const passItems = items => {
    setItems(items);
  };

  const passNewItems = newItems => {
    setNewItems(newItems);
  };

  const fetchTime = () => {
    const date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let clock;

    if (minute < 10) {
      minute = "0" + minute.toString();
    }

    if (hour > 12) {
      hour = hour - 12;
      clock = "PM";
    } else {
      clock = "AM";
    }

    setTime(hour + ":" + minute + clock);
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
          passItems={passItems}
          passCurrencies={passCurrencies}
          newItems={newItems}
        />
      </div>
    </Layout>
  );
};

export default Converter;
