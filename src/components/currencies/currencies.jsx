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
        content: <Currency code={country.code} name={country.name} />,
        classes: ""
      };
      list.push(currency);
    });
    await updateCurrencyList(list);
  };

  var onSort = (sortedList, dropEvent) => {
    updateCurrencyList(sortedList);

    currencyList.forEach(e => {
      if (e.rank === 0) {
        let selectedCurrency = Object.assign(e);
        for (var i in currencyList) {
          if (currencyList[i] === selectedCurrency) {
            currencyList.splice(i, 1);
            selectedCurrency["classes"] = ["mod-selected"];
            currencyList.unshift(selectedCurrency);
            updateCurrencyList(currencyList);
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
