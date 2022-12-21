import { useState, useRef, useReducer } from "react";
import { useWindowSize } from "./hooks/useWindowSize";
import CanvasObj from "./CanvasObj";
import { CanvasContext } from "./context/CanvasContext";
import { CanvasReducer, canvasStateType } from "./context/CanvasReducer";
import uuid from "react-uuid";
function Canvas() {
  const windowSize = useWindowSize();
  console.log(windowSize);
  const obj1 = {
    id: uuid(),
    name: uuid(),
    x: 200,
    y: 200,
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
    canvasObj_list: [obj1],
  };
  const [state, dispatch] = useReducer(CanvasReducer, initState);

  //1.得到使用者螢幕寬度
  return (
    <CanvasContext.Provider
      value={{ state: state.canvasObj_list, dispatch: dispatch }}
    >
      <div
        style={{
          width: "500px",
          height: "500px",
          touchAction: "none",
        }}
      >
        <div>
          {state.canvasObj_list.map((ele) => {
            return <CanvasObj key={ele.id} ele={ele} />;
          })}
        </div>
      </div>
    </CanvasContext.Provider>
  );
}

export default Canvas;
