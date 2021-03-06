import React, { useState, useEffect } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  chart: {
    type: "spline",
    height: "50%"
  },
  title: {
    text: "Generating chart..."
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

  useEffect(() => {
    const fetchCurrencies = () => {
      let data = [];
      if (props.items !== undefined) {
        if (props.items[1] === undefined) {
          options.title.text = "Add currency to generate chart!";
          options.series = [{ data: [1, 2, 3] }];
        } else {
          const base = props.items[0].code;
          const symbol = props.items[1].code;

          options.title.text =
            base + " " + "to" + " " + symbol + " " + "overview";

          var date = new Date();

          var today =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();

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

              for (var i in dates) {
                const timestamp = Date.parse(dates[i]);
                const rate = parseFloat(rates[dates[i]][symbol].toFixed(4));

                data.push([rate]);

                data[i].unshift(timestamp);
              }

              options.series = [{ color: "#ffc35a", name: symbol, data: data }];

              setChartUpdate(true);
            });
        }
      }
    };

    fetchCurrencies();
    setChartUpdate(false);
  }, [props]);

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
