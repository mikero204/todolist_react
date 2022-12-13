import React, { useState } from "react";
import CanvasObj from "./CanvasObj";
import { DraggableObj } from "./hooks/useDraggable";

function Canvas() {
  const resetActive = (e: any) => {
    console.log(e);
  };
  const obj: DraggableObj = {
    id: "string1",
    name: "string1",
    x: 50,
    y: 50,
    width: 200,
    height: 200,
    zindex: 1,
    rotate: 0,
    img: "string1",
    active: false,
    color: "red",
    lock: false,
  };
  // const obj1: DraggableObj = {
  //   id: "string2",
  //   name: "string2",
  //   x: 50,
  //   y: 50,
  //   width: 200,
  //   height: 200,
  //   zindex: 1,
  //   rotate: 0,
  //   img: "string2",
  //   active: false,
  //   color: "red",
  //   lock: false,
  //   resetActive: resetActive,
  // };
  const [data, setData] = useState([{ ...obj }]);

  return (
    <div>
      {data.map((ele, index) => {
        return <CanvasObj key={index} ele={ele} />;
      })}
    </div>
  );
}

export default Canvas;
