import { useState, useReducer } from "react";
import CanvasObj from "./CanvasObj";
import { CanvasContext } from "./context/CanvasContext";
import { CanvasReducer, canvasStateType } from "./context/CanvasReducer";
import uuid from "react-uuid";
function Canvas() {
  const obj = {
    id: uuid(),
    name: uuid(),
    x: 50,
    y: 50,
    width: "217",
    height: "217",
    zindex: 1,
    rotate: 0,
    img: "https://video-public.canva.com/VAFQ9X_oK8g/v/b887464761.gif",
    active: false,
    color: "red",
    lock: false,
    mouse_event_active: false,
  };
  const obj1 = {
    id: uuid(),
    name: uuid(),
    x: 250,
    y: 250,
    width: "200",
    height: "200",
    zindex: 1,
    rotate: 0,
    img: "https://video-public.canva.com/VAFQ9X_oK8g/v/b887464761.gif",
    active: false,
    color: "red",
    lock: false,
    mouse_event_active: false,
  };
  const initState: canvasStateType = {
    canvasObj_list: [obj1, obj],
  };

  const [state, dispatch] = useReducer(CanvasReducer, initState);

  return (
    <CanvasContext.Provider
      value={{ state: state.canvasObj_list, dispatch: dispatch }}
    >
      <div
        style={{
          position: "relative",
          width: "1000px",
          height: "1000px",
          touchAction: "none",
        }}
      >
        {state.canvasObj_list.map((ele) => {
          return <CanvasObj key={ele.id} ele={ele} />;
        })}
      </div>
    </CanvasContext.Provider>
  );
}

export default Canvas;
