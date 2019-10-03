import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import Select from "react-select";

import Currency from "./currency";
import currencyData from "../../data/countries.json";

const Currencies = () => {
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

    for (var i in holdItems) {
      // Find out which item have been deleted
      if (doneItems.includes(holdItems[i]) === false) {
        // Create an object (value and label) for the deleted item

        holdItems[i].modClass = "";
        const deletedItem = {
          id: `${holdItems[i].id}`,
          value: `${holdItems[i].code}`,
          label: `${holdItems[i].code} - ${holdItems[i].name}`
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

  const mainCurrency = items => {
    items[0].modClass = "mod-selected";

    const unselectedItems = items.slice(1);
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
    let list = [currencies[32], currencies[26], currencies[29]]; // Default list of items

    const currentLocation = await axios
      .get("https://ipapi.co/json/")
      .then(response => {
        const data = response.data;

        for (var i in currencies) {
          if (currencies[i].code === data.currency) {
            list.unshift(currencies[i]);
            return list;
          }
        }
      })
      .catch(error => {
        return {
          currency: "GBP"
        };
      });

    return currentLocation;
  };

  const fetchOptions = (currencies, items) => {
    let currencyList = [...currencies];

    let list = [];

    for (var i in currencyList) {
      var match = false;
      for (var j in items) {
        if (currencyList[i].code === items[j].code) {
          match = true;
          break;
        }
      }
      if (match) {
        currencyList.splice(i, 1);
      }
    }

    for (var i in currencyList) {
      const country = currencyList[i];
      const options = {
        id: `${i}`,
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
          onChange={addCurrency}
          options={options}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items !== undefined &&
                items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
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
  );
};

export default Currencies;
