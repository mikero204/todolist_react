import { useState, useRef, useReducer, useEffect } from "react";
import { useWindowSize } from "./hooks/useWindowSize";
import CanvasObj from "./CanvasObj";
import { CanvasContext } from "./context/CanvasContext";
import { CanvasReducer, canvasStateType } from "./context/CanvasReducer";
import uuid from "react-uuid";
function Canvas() {
  const size = useWindowSize();
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

  const topheight = size.height * 0.15;
  const centerheight = size.height * 0.7;
  const bottomheight = size.height * 0.15;
  console.log(size);
  //1.得到使用者螢幕寬度
  //2.改變畫板寬度及高度

  return (
    <CanvasContext.Provider
      value={{ state: state.canvasObj_list, dispatch: dispatch }}
    >
      <div
        style={{
          width: size.width + "px",
          height: topheight + "px",
        }}
      >
        Header
      </div>
      <div
        style={{
          width: size.width + "px",
          height: centerheight + "px",
          touchAction: "none",
          padding: "16px",
        }}
      >
        <div
          style={{
            width: 100 + "%",
            height: 300 + "px",
            border: "1px solid black",
            margin: "0 auto",
          }}
        >
          {state.canvasObj_list.map((ele) => {
            return <CanvasObj key={ele.id} ele={ele} />;
          })}
        </div>
      </div>
      <div
        style={{
          width: size.width + "px",
          height: bottomheight + "px",
        }}
      >
        Footer
      </div>
    </CanvasContext.Provider>
  );
}

export default Canvas;
