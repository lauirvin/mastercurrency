import React, { useState, useEffect } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  chart: {
    type: "spline"
  },
  title: {
    text: ""
  },
  series: [],
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      day: "%e%b%y",
      month: "%b '%y"
    }
  }
};

const MiniChart = props => {
  const [updateChart, setChartUpdate] = useState(false);

  const fetchCurrencies = () => {
    let data = [];
    if (props.items !== undefined) {
      const base = props.items[0].code;
      const symbol = props.items[1].code;

      options.title.text = base + " " + "to" + " " + symbol + " " + "overview";

      var date = new Date();

      var today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

      var lastMonth =
        date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

      axios
        .get(
          `https://api.exchangeratesapi.io/history?start_at=${lastMonth}&end_at=${today}&base=${base}&symbols=${symbol}`
        )
        .then(response => {
          const rates = response.data.rates;
          const dates = Object.keys(rates);

          dates.sort((a, b) => {
            a = a
              .split("/")
              .reverse()
              .join("");
            b = b
              .split("/")
              .reverse()
              .join("");
            return a > b ? 1 : a < b ? -1 : 0;
          });

          for (var i in rates) {
            const rate = parseFloat(rates[i][symbol].toFixed(4));
            data.push([rate]);
          }

          data.reverse();

          for (var j in dates) {
            const date = dates[j];
            const timestamp = Date.parse(date);

            data[j].unshift(timestamp);
          }
          options.series = [{ color: "#ffc35a", name: symbol, data: data }];
          setChartUpdate(true);
        });
    }
  };

  fetchCurrencies();

  return (
    <div className="minichart">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={updateChart}
      />
    </div>
  );
};

export default MiniChart;
