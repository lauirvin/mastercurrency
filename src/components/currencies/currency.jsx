import React, { useState, useEffect } from "react";

import draggable from "../../media/icons/list.svg";

const Currency = props => {
  const [value, setValue] = useState(1);

  const removeCurrency = () => {
    props.selectedCode(props.code);
  };

  return (
    <div className={`currency ${props.modClass}`}>
      <div className="currency-content">
        <img alt="flag" className="flag" src={`${props.flag}`} />
        <div className="currency-content-title">
          <h3>{props.code}</h3>
          <p>{props.name}</p>
        </div>
        <input
          type="number"
          step="0.01"
          defaultValue="1.0000"
          placeholder="1.0000"
          onChange={e => setValue(e.target.value)}
        />
        <div className="currency-content-conversion">
          <h3>9.8329</h3>
          <p>1 HKD = 0.1017 GBP</p>
        </div>
        <hr />
        <div className="draggable-handle">
          <img
            {...props.dragHandle}
            alt="list"
            className="draggable-handle-icon"
            src={draggable}
          />
          <button className="delete" onClick={removeCurrency}></button>
        </div>
      </div>
    </div>
  );
};
export default Currency;
