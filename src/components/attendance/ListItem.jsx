import React from "react";
import { useLongPress } from "use-long-press";
const ListItem = ({ value, onItemClicked, onLongPress }) => {
  let onLongPressProp = null;
  if (onLongPress) {
    onLongPressProp = useLongPress(
      (event) => {
        console.log("long pressed", event);
        onLongPress(event);
      },
      {
        threshold: 500,
        captureEvent: true,
      }
    );
  }

  return (
    <li
      {...onLongPressProp}
      className="cursor-pointer bg-white mb-4 text-center mx-4 h-12 font-semibold rounded"
      onClick={onItemClicked}
      itemID={value}
      id={value}
    >
      {value}
    </li>
  );
};

export default ListItem;
