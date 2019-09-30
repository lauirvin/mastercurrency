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

    updateItems(newOrder);
    mainCurrency(newOrder);
  };

  const fetchCurrencies = () => {
    let list = [];
    currencyData.forEach((country, id) => {
      const currency = {
        id: `${id}`,
        code: `${country.code}`,
        name: `${country.name}`,
        flag: `${country.flag}`,
        modClass: ``
      };
      list.push(currency);
    });
    return list;
  };

  const fetchUserLocation = async currencies => {
    let list = [currencies[44], currencies[137], currencies[41]]; // Default list of items

    const currentLocation = await axios
      .get("https://ipapi.co/json/")
      .then(response => {
        const data = response.data;

        for (var i in currencies) {
          if (currencies[i].code === data.currency) {
            list.push(currencies[i]);
            return list;
          }
        }
      })
      .catch(error => {
        return {
          currency: "HKD"
        };
      });

    return currentLocation;
  };

  const fetchOptions = (currencies, items) => {
    let list = [];
    for (var id in currencies) {
      const country = currencies[id];
      const options = {
        id: `${id}`,
        value: `${country.code}`,
        label: `${country.code} - ${country.name}`
      };
      list.push(options);
    }

    for (var e in list) {
      for (var i in items) {
        if (list[e].value === items[i].code) {
          list.splice(e, 1);
        }
      }
    }

    return list;
  };

  const [currencies, updateCurrencyList] = useState(fetchCurrencies());
  const [holdItems, updateHoldItems] = useState();
  const [items, updateItems] = useState();
  const [options, updateOptions] = useState();

  useEffect(() => {
    fetchUserLocation(fetchCurrencies()).then(value => {
      if (value !== undefined) {
        updateItems(value);
        mainCurrency(value);
        updateOptions(fetchOptions(currencies, value));
      }
    });
  }, []);

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
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Currency
                          selectedCode={removeCurrency}
                          dragHandle={provided.dragHandleProps}
                          code={item.code}
                          name={item.name}
                          flag={item.flag}
                          modClass={item.modClass}
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
