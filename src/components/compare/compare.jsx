import React, { useEffect, useState } from "react";
import axios from "axios";

import arrows from "../../media/icons/arrows.png";

const Compare = props => {
  const [items, setItems] = useState();

  const fetchComparison = async () => {
    if (props.items !== undefined) {
      const base = props.items[0].code;
      const symbols = props.items.slice(1);

      let lastMonthRates = [];
      let currentRates = [];

      for (var i in symbols) {
        const symbol = symbols[i].code;

        const date = new Date();

        const today =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();

        const lastMonth =
          date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

        await axios
          .get(
            `https://api.exchangeratesapi.io/${lastMonth}?base=${base}&symbols=${symbol}`
          )
          .then(response => {
            lastMonthRates.push(response.data.rates);

            return axios.get(
              `https://api.exchangeratesapi.io/${today}?base=${base}&symbols=${symbol}`
            );
          })
          .then(response => {
            currentRates.push(response.data.rates);
          });
      }
      return [lastMonthRates, currentRates];
    }
  };

  const fetchData = rates => {
    const lastMonthData = rates[0];
    const currentMonthData = rates[1];

    const base = props.items[0].code;
    const symbols = props.items.slice(1);

    let dataList = [];

    for (var i in lastMonthData) {
      const symbol = symbols[i].code;
      const lastMonthRate = parseFloat(lastMonthData[i][symbol].toFixed(4));
      const currentMonthRate = parseFloat(
        currentMonthData[i][symbol].toFixed(4)
      );

      let status;
      let modClass;

      if (lastMonthRate > currentMonthRate) {
        status = -1;
        modClass = "mod-negative";
      } else if (lastMonthRate < currentMonthRate) {
        status = 1;
        modClass = "mod-negative";
        modClass = "mod-positive";
      } else {
        status = 1;
        modClass = "mod-neutral";
      }

      var avg = (lastMonthRate + currentMonthRate) / 2;
      var diff = lastMonthRate - currentMonthRate;

      const percentage = parseFloat(Math.abs(diff / avg) * 100).toFixed(2);

      const data = {
        base: base,
        symbol: symbol,
        percentage: percentage * status + "%",
        modClass: modClass
      };

      dataList.push(data);
    }

    setItems(dataList);
  };

  useEffect(() => {
    fetchComparison().then(rates => {
      if (rates !== undefined) {
        fetchData(rates);
      }
    });
  }, [props]);

  return (
    <div className="compare">
      <h3>Quick Compare</h3>
      <div className="compare-content">
        {items !== undefined &&
          items.map((item, index) => (
            <div className="compare-content-item" key={index}>
              <h4>{item.base}</h4>
              <img src={arrows} />
              <h4>{item.symbol}</h4>
              <div className={`percentage-container ${item.modClass}`}>
                <h4 className="percentage">{item.percentage}</h4>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Compare;
