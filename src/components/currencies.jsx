import React, { useState } from "react";
import DragSortableList from "react-drag-sortable";

import draggable from "../media/icons/list.svg";
import flag from "../media/flags/gbp.svg";

const Currencies = () => {
  const [value, setValue] = useState(1);

  var list = [
    {
      content: (
        <div className="currency">
          <div className="currency-content">
            <img alt="flag" className="flag" src={flag} />
            <div className="currency-content-title">
              <h3>GBP</h3>
              <p>British Pound</p>
            </div>
            <input
              type="number"
              step="0.01"
              defaultValue="1.0000"
              placeholder="1.0000"
              onChange={e => setValue(e.target.value)}
            />
            <hr />
            <img alt="list" className="draggable-icon" src={draggable} />
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="currency">
          <div className="currency-content">
            <img alt="flag" className="flag" src={flag} />
            <div className="currency-content-title">
              <h3>GBP</h3>
              <p>British Pound</p>
            </div>
            <input
              type="number"
              step="0.01"
              defaultValue="1.0000"
              placeholder="1.0000"
              onChange={e => setValue(e.target.value)}
            />
            <hr />
            <img alt="list" className="draggable-icon" src={draggable} />
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="currency">
          <div className="currency-content">
            <img alt="flag" className="flag" src={flag} />
            <div className="currency-content-title">
              <h3>GBP</h3>
              <p>British Pound</p>
            </div>
            <input
              type="number"
              step="0.01"
              defaultValue="1.0000"
              placeholder="1.0000"
              onChange={e => setValue(e.target.value)}
            />
            <hr />
            <img alt="list" className="draggable-icon" src={draggable} />
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="currency">
          <div className="currency-content">
            <img alt="flag" className="flag" src={flag} />
            <div className="currency-content-title">
              <h3>GBP</h3>
              <p>British Pound</p>
            </div>
            <input
              type="number"
              step="0.01"
              defaultValue="1.0000"
              placeholder="1.0000"
              onChange={e => setValue(e.target.value)}
            />
            <hr />
            <img alt="list" className="draggable-icon" src={draggable} />
          </div>
        </div>
      )
    }
  ];

  var onSort = function(sortedList, dropEvent) {
    console.log("sortedList", sortedList, dropEvent);
  };

  return (
    <div className="currencies-container">
      <DragSortableList
        items={list}
        moveTransitionDuration={0.3}
        onSort={onSort}
        type="vertical"
      />
    </div>
  );
};

export default Currencies;
