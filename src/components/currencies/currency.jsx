import React, { useState, useEffect } from "react";
import axios from "axios";

import draggable from "../../media/icons/list.svg";

const Currency = props => {
  const [currencyRate, setRate] = useState();
  const [conversion, setConversion] = useState();

  const removeCurrency = () => {
    props.selectedCode(props.code);
  };

  const handleInputChange = e => {
    props.enteredInput(e.target.value);
  };

  const currencyConversion = async () => {
    if (props.base !== props.code) {
      await axios
        .get(
          `https://api.exchangeratesapi.io/latest?base=${props.base}&symbols=${props.code}`
        )
        .then(response => {
          const data = response.data;

          setRate(data.rates[props.code].toFixed(4));
          setConversion((props.input * currencyRate).toFixed(4).toString());
        });
    }
  };

  useEffect(() => {
    currencyConversion();
  });

  return (
    <div className="currency-content">
      <img alt="flag" className="flag" src={`${props.flag}`} />
      <div className="currency-content-title">
        <h3>{props.code}</h3>
        <p>{props.name}</p>
      </div>
      <input
        inputMode="decimal"
        type="number"
        step="0.01"
        defaultValue="1.0000"
        placeholder="0"
        onChange={handleInputChange}
        onBlur={handleInputChange}
      />
      <div className="currency-content-conversion">
        <h3>{props.symbol + " " + conversion}</h3>
        <p>
          1 {props.code} = {currencyRate} {props.base}
        </p>
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
  );
};
export default Currency;
