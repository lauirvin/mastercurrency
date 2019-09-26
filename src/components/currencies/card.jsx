import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

import draggable from "../../media/icons/list.svg";
import flag from "../../media/flags/gbp.svg";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move"
};
const Card = ({ id, code, name, text, index, moveCard }) => {
  const [value, setValue] = useState(1);
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "card",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: "card", id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  console.log(name);
  return (
    <div ref={ref} className="currency">
      <div className="currency-content">
        <img alt="flag" className="flag" src={flag} />
        <div className="currency-content-title">
          <h3>{code}</h3>
          <p>{name}</p>
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
        <img alt="list" className="draggable-icon" src={draggable} />
      </div>
    </div>
  );
};
export default Card;
