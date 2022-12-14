import React, { useState } from "react";
import CanvasObj from "./CanvasObj";
import { DraggableObj } from "./hooks/useDraggable";

function Canvas() {
  const obj: DraggableObj = {
    id: "string1",
    name: "string1",
    x: 50,
    y: 50,
    width: 200,
    height: 200,
    zindex: 1,
    rotate: 0,
    img: "https://video-public.canva.com/VAFQ9X_oK8g/v/b887464761.gif",
    active: false,
    color: "red",
    lock: false,
    mouse_event_active: false,
  };
  const obj2: DraggableObj = {
    id: "string2",
    name: "string2",
    x: 150,
    y: 350,
    width: 200,
    height: 200,
    zindex: 1,
    rotate: 0,
    img: "https://video-public.canva.com/VAFQ9X_oK8g/v/b887464761.gif",
    active: false,
    color: "red",
    lock: false,
    mouse_event_active: false,
  };
  const [data, setData] = useState([{ ...obj }]);
  const changeActive = (id: any) => {
    const newdata = JSON.parse(JSON.stringify(data));
    newdata.forEach((ele: any) => {
      if (ele.id === id) {
        ele.active = true;
      } else {
        ele.active = false;
      }
      setData(newdata);
    });
  };
  return (
    <div
      style={{
        position: "relative",
        width: "1000px",
        height: "1000px",
        touchAction: "none",
      }}
    >
      {data.map((ele, index) => {
        return <CanvasObj key={index} changeActive={changeActive} ele={ele} />;
      })}
    </div>
  );
}

export default Canvas;
