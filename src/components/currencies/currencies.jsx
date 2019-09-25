import React, { useEffect, useState } from "react";
import DragSortableList from "react-drag-sortable";

import Currency from "./currency";
import currencyData from "../../data/countries.json";

const Currencies = () => {
  const [currencyList, updateCurrencyList] = useState([]);

  const fetchCurrencies = async () => {
    let list = [];
    currencyData.forEach(country => {
      const currency = {
        content: (
          <Currency code={country.code} name={country.name} modClass="" />
        ),
        classes: ""
      };
      list.push(currency);
    });
    list[0]["classes"] = ["mod-selected"];
    await updateCurrencyList(list);
  };

  const onSort = sortedList => {
    updateCurrencyList(sortedList);

    currencyList.forEach(e => {
      if (e.rank === 0) {
        for (var i in currencyList) {
          let currency = currencyList[i];
          if (currency === e) {
            currency["classes"] = ["mod-selected"];
            updateCurrencyList(currencyList);
          } else {
            if (currency["classes"][0] === "mod-selected") {
              currency["classes"] = "";
            }
          }
        }
      } else {
        updateCurrencyList(sortedList);
      }
    });
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <div className="currencies-container">
      <DragSortableList
        items={currencyList}
        moveTransitionDuration={0.3}
        onSort={onSort}
        type="vertical"
      />
    </div>
  );
};

export default Currencies;
