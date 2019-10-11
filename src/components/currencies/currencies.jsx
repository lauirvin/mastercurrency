import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import Select from "react-select";

import Currency from "./currency";
import currencyData from "../../data/countries.json";

const Currencies = props => {
  const passItems = items => {
    props.passItems(items);
  };

  const passCurrencies = currencies => {
    props.passCurrencies(currencies);
  };

  const removeCurrency = code => {
    let list = [];

    for (var i in items) {
      if (items[i].code === code) {
        items.splice(i, 1);
      }
    }

    updateItems(list.concat(items));
    return list.concat(items);
  };

  const mainCurrency = items => {
    items[0].modClass = "mod-selected";
    items[1].modClass = "mod-chart";

    const unselectedItems = items.slice(2);
    for (var i in unselectedItems) {
      if (unselectedItems[i].modClass.length > 0) {
        unselectedItems[i].modClass = "";
      }
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const newOrder = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    updateInputChange(1);
    updateItems(newOrder);
    mainCurrency(newOrder);
    passItems(newOrder);
  };

  const [currencies, updateCurrencyList] = useState();
  const [items, updateItems] = useState();
  const [currentInput, updateInputChange] = useState(1);

  const fetchUserLocation = async currencies => {
    let list = [currencies[31], currencies[9], currencies[8]]; // Default list of items

    const currentLocation = await axios
      .get("https://ipapi.co/json/")
      .then(response => {
        const data = response.data;

        let userCurrency;
        for (var i in currencies) {
          if (currencies[i].code === data.currency) {
            userCurrency = currencies[i];
          }
        }

        let match = false;
        for (var j in list) {
          if (list[j] === userCurrency) {
            match = true;
            break;
          }
        }
        if (!match) {
          list.unshift(userCurrency);
        }

        return list;
      })
      .catch(error => {
        console.log("Unable to detect location");
        return list;
      });

    mainCurrency(currentLocation);
    updateItems(currentLocation);
    passItems(currentLocation);
    passCurrencies(currencies);
  };

  const fetchCurrencies = async () => {
    const currencyList = await axios
      .get("https://api.exchangeratesapi.io/latest")
      .then(response => {
        const rates = Object.keys(response.data.rates);
        rates.push(response.data.base);
        rates.sort();

        let list = [];
        for (var i in currencyData) {
          for (var j in rates) {
            if (currencyData[i].code === rates[j]) {
              const currency = {
                id: `${j}`,
                code: `${currencyData[i].code}`,
                name: `${currencyData[i].name}`,
                flag: `${currencyData[i].flag}`,
                symbol: `${currencyData[i].symbol}`,
                modClass: ``
              };
              list.push(currency);
            }
          }
        }
        return list;
      });
    const sortedList = currencyList.sort((a, b) => {
      return a.id - b.id;
    });

    fetchUserLocation(sortedList);
    updateCurrencyList(sortedList);
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    updateItems(props.newItems);
    passItems(props.newItems);
  }, [props.newItems]);

  const handleInputChange = value => {
    updateInputChange(value);
  };

  return (
    <div className="currencies">
      <div className="dd-wrapper">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items !== undefined &&
                  items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`currency ${item.modClass}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Currency
                            selectedCode={removeCurrency}
                            enteredInput={handleInputChange}
                            dragHandle={provided.dragHandleProps}
                            input={currentInput}
                            code={item.code}
                            name={item.name}
                            flag={item.flag}
                            symbol={item.symbol}
                            base={items[0].code}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Currencies;
