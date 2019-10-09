import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import Select from "react-select";

import Currency from "./currency";
import currencyData from "../../data/countries.json";

const Currencies = props => {
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

  const doneEditing = () => {
    document.getElementById("edit").style.display = "block";
    document.getElementById("done").style.display = "none";
    document.getElementById("cancel").style.display = "none";
    document.getElementsByClassName("options")[0].style.display = "block";
    document.getElementsByClassName("draggable-handle")[0].style.visibility =
      "visible";

    const doneItems = [];

    doneItems.unshift(items[0]);
    const itemsToFinish = items.slice(1);
    for (var i in itemsToFinish) {
      itemsToFinish[i].modClass = "";
      doneItems.push(itemsToFinish[i]);
    }

    updateItems(doneItems);

    for (var j in holdItems) {
      // Find out which item have been deleted
      if (doneItems.includes(holdItems[j]) === false) {
        // Create an object (value and label) for the deleted item

        holdItems[j].modClass = "";
        const deletedItem = {
          id: `${holdItems[j].id}`,
          value: `${holdItems[j].code}`,
          label: `${holdItems[j].code} - ${holdItems[j].name}`
        };
        // Add the object to the options list
        options.push(deletedItem);
        // Sort the options list to ID order
        const sortedOptions = options.sort((a, b) => {
          return a.id - b.id;
        });

        // Update options
        updateOptions(sortedOptions);
      }
    }
  };

  const cancelEdit = () => {
    document.getElementById("edit").style.display = "block";
    document.getElementById("done").style.display = "none";
    document.getElementById("cancel").style.display = "none";
    document.getElementsByClassName("options")[0].style.display = "block";
    document.getElementsByClassName("draggable-handle")[0].style.visibility =
      "visible";

    const cancelItems = [];

    cancelItems.unshift(holdItems[0]);
    const itemsToCancel = holdItems.slice(1);
    for (var i in itemsToCancel) {
      itemsToCancel[i].modClass = "";
      cancelItems.push(itemsToCancel[i]);
    }

    updateItems(cancelItems);
  };

  const passItems = items => {
    props.passItems(items);
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

  const editCurrency = () => {
    document.getElementById("edit").style.display = "none";
    document.getElementById("done").style.display = "block";
    document.getElementById("cancel").style.display = "block";
    document.getElementsByClassName("options")[0].style.display = "none";
    document.getElementsByClassName("draggable-handle")[0].style.visibility =
      "hidden";

    const editItems = [];

    editItems.push(items[0]);

    const itemsToEdit = items.slice(1);
    for (var i in itemsToEdit) {
      itemsToEdit[i].modClass = "mod-edit";
      editItems.push(itemsToEdit[i]);
    }

    updateHoldItems(items);
    updateItems(editItems);
  };

  const addCurrency = currency => {
    const currencyToAdd = currency.id;

    for (var i in options) {
      if (currencyToAdd === options[i].id) {
        options.splice(i, 1);

        for (var j in currencies) {
          if (currencies[j].id === currencyToAdd) {
            const newItems = [...items];

            newItems.push(currencies[j]);
            updateItems(newItems);
          }
        }
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

    return sortedList;
  };

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

    return currentLocation;
  };

  const fetchOptions = (currencies, items) => {
    let currencyList = [...currencies];

    let list = [];
    let subtract = currencyList.filter(a => !items.some(b => a === b));

    for (var id in subtract) {
      const country = subtract[id];
      const options = {
        id: `${country.id}`,
        value: `${country.code}`,
        label: `${country.code} - ${country.name}`
      };
      list.push(options);
    }

    return list;
  };

  const [currencies, updateCurrencyList] = useState();
  const [holdItems, updateHoldItems] = useState();
  const [items, updateItems] = useState();
  const [options, updateOptions] = useState();
  const [currentInput, updateInputChange] = useState(1);

  useEffect(() => {
    fetchCurrencies().then(list => {
      updateCurrencyList(list);

      fetchUserLocation(list).then(value => {
        updateItems(value);
        mainCurrency(value);
        passItems(value);
        updateOptions(fetchOptions(list, value));
      });
    });
  }, []);

  const handleInputChange = value => {
    updateInputChange(value);
  };

  return (
    <div className="currencies">
      <div className="currencies-controls">
        <button id="edit" onClick={editCurrency}>
          <span>Edit</span>
        </button>
        <button onClick={doneEditing} id="done">
          <span>Done</span>
        </button>
        <button onClick={cancelEdit} id="cancel">
          <span>Cancel</span>
        </button>
        <Select
          className="options"
          classNamePrefix="options"
          placeholder="Add currency"
          value={"Add Currency"}
          inputProps={{ readOnly: true }}
          isSearchable={false}
          onChange={addCurrency}
          options={options}
        />
      </div>

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
