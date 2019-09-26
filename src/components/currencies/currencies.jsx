import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import Select from "react-select";

import Currency from "./currency";
import currencyData from "../../data/countries.json";

const Currencies = () => {
  const fetchCurrencies = () => {
    let list = [];
    currencyData.forEach((country, id) => {
      const currency = {
        id: `${id}`,
        code: `${country.code}`,
        name: `${country.name}`
      };
      list.push(currency);
    });
    return list;
  };

  const fetchOptions = () => {
    let list = [];
    currencyData.forEach((country, id) => {
      const options = {
        id: `${id}`,
        value: `${country.code}`,
        label: `${country.code} - ${country.name}`
      };
      list.push(options);
    });
    return list;
  };

  const [items, updateItems] = useState();
  const [currencies, updateCurrencyList] = useState(fetchCurrencies());
  const [options, updateOptions] = useState(fetchOptions());

  const addCurrency = currency => {
    const currencyToAdd = currency.id;

    for (var i in options) {
      if (currencyToAdd === options[i].id) {
        options.splice(i, 1);

        for (var i in currencies) {
          if (currencies[i].id === currencyToAdd) {
            const newItems = [...items];

            newItems.push(currencies[i]);

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
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      let list = [];
      await axios
        .get("https://ipapi.co/json/")
        .then(response => {
          let data = response.data;
          for (var i in currencies) {
            if (currencies[i].code === data.currency) {
              list.push(currencies[i]);
              updateItems(list);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
      return list;
    };
    fetchUserLocation();
  }, []);

  return (
    <div className="currencies-container">
      <Select value={"Add Currency"} onChange={addCurrency} options={options} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {/* {console.log(items)} */}
              {items !== undefined &&
                items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Currency
                          dragHandle={provided.dragHandleProps}
                          code={item.code}
                          name={item.name}
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

// const onSort = sortedList => {
//   updateCurrencyList(sortedList);

//   currencyList.forEach(e => {
//     if (e.rank === 0) {
//       for (var i in currencyList) {
//         let currency = currencyList[i];
//         if (currency === e) {
//           currency["classes"] = ["mod-selected"];
//           updateCurrencyList(currencyList);
//         } else {
//           if (currency["classes"][0] === "mod-selected") {
//             currency["classes"] = "";
//           }
//         }
//       }
//     } else {
//       updateCurrencyList(sortedList);
//     }
//   });
// };
