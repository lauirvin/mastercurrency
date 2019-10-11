import React, { useState, useEffect } from "react";
import Select from "react-select";

const Controls = props => {
  const currencies = props.currencies;
  const items = props.items;

  const [holdItems, updateHoldItems] = useState();
  const [options, updateOptions] = useState();

  const passNewItems = newItems => {
    props.passNewItems(newItems);
  };

  const fetchOptions = (currencies, items) => {
    let list = [];
    let subtract = currencies.filter(a => !items.some(b => a === b));

    for (var id in subtract) {
      const country = subtract[id];
      const options = {
        id: `${country.id}`,
        value: `${country.code}`,
        label: `${country.code} - ${country.name}`
      };
      list.push(options);
    }

    updateOptions(list);
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
            passNewItems(newItems);
          }
        }
      }
    }
  };

  const editCurrency = () => {
    document.getElementById("edit").style.display = "none";
    document.getElementById("done").style.display = "block";
    document.getElementById("cancel").style.display = "block";
    document.getElementsByClassName("options")[0].style.display = "none";
    document.getElementsByClassName("draggable-handle")[1].style.visibility =
      "hidden";
    document.getElementsByClassName("draggable-handle")[0].style.visibility =
      "hidden";

    const editItems = [];

    editItems.push(items[0], items[1]);

    const itemsToEdit = items.slice(2);
    for (var i in itemsToEdit) {
      itemsToEdit[i].modClass = "mod-edit";
      editItems.push(itemsToEdit[i]);
    }

    updateHoldItems(items);
    passNewItems(editItems);
  };

  const doneEditing = () => {
    document.getElementById("edit").style.display = "block";
    document.getElementById("done").style.display = "none";
    document.getElementById("cancel").style.display = "none";
    document.getElementsByClassName("options")[0].style.display = "block";
    document.getElementsByClassName("draggable-handle")[1].style.visibility =
      "visible";
    document.getElementsByClassName("draggable-handle")[0].style.visibility =
      "visible";

    const doneItems = [];

    doneItems.unshift(items[0], items[1]);
    const itemsToFinish = items.slice(2);
    for (var i in itemsToFinish) {
      itemsToFinish[i].modClass = "";
      doneItems.push(itemsToFinish[i]);
    }

    passNewItems(doneItems);

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
    document.getElementsByClassName("draggable-handle")[1].style.visibility =
      "visible";
    document.getElementsByClassName("draggable-handle")[0].style.visibility =
      "visible";

    const cancelItems = [];

    cancelItems.unshift(holdItems[0], holdItems[1]);
    const itemsToCancel = holdItems.slice(2);
    for (var i in itemsToCancel) {
      itemsToCancel[i].modClass = "";
      cancelItems.push(itemsToCancel[i]);
    }

    passNewItems(cancelItems);
  };

  useEffect(() => {
    if (props.currencies !== undefined && props.items !== undefined) {
      fetchOptions(props.currencies, props.items);
    }
  }, [props]);

  return (
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
  );
};
export default Controls;
