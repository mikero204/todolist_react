import { useState, useRef, useReducer, useEffect } from "react";
import { useWindowSize } from "./hooks/useWindowSize";
import CanvasObj from "./CanvasObj";
import { CanvasContext } from "./context/CanvasContext";
import { CanvasReducer, canvasStateType } from "./context/CanvasReducer";
import { CANVAS_PARAMS, RESET } from "./Constants";
import uuid from "react-uuid";
function Canvas() {
  const size = useWindowSize();
  const obj1 = {
    id: uuid(),
    name: uuid(),
    x: 0,
    y: 0,
    width: "50",
    height: "50",
    zindex: 1,
    rotate: 0,
    img: "https://video-public.canva.com/VAFQ9X_oK8g/v/b887464761.gif",
    active: false,
    color: "red",
    lock: false,
    mouse_event_active: false,
    tl: {},
    tr: {},
    bl: {},
    br: {},
  };

  const initState: canvasStateType = {
    canvasObj_list: [obj1],
    canvas_params: {
      appwidth: 0,
      appheight: 0,
      padding: 0,
      topheight: 0,
      centerheight: 0,
      bottomheight: 0,
      innerCanvasWidth: 0,
      innerCanvasHeight: 0,
      Canvas_transformY: 0,
      Canvas_scale: 0,
      Canvas_obj_size: 0,
    },
  };
  const [state, dispatch] = useReducer(CanvasReducer, initState);
  useEffect(() => {
    const appwidth = size.width;
    const appheight = size.height;
    const padding = 16;
    const topheight = size.height * 0.06;
    const centerheight = size.height * 0.88;
    const bottomheight = size.height * 0.06;
    let Canvas_obj_size;
    let innerCanvasWidth;
    let innerCanvasHeight;
    if (size.width < 600) {
      innerCanvasWidth = Math.min(size.width - padding * 2, 400);
      innerCanvasHeight = Math.min(
        innerCanvasWidth - innerCanvasWidth / 4,
        300
      );
      Canvas_obj_size = 1;
    } else {
      innerCanvasWidth = Math.min(size.width - padding * 2, 600);
      innerCanvasHeight = Math.min(
        innerCanvasWidth - innerCanvasWidth / 4,
        450
      );
      Canvas_obj_size = 2;
    }

    const Canvas_transformY =
      centerheight / 2 - innerCanvasHeight / 2 - padding - 30;
    const Canvas_scale = 1;

    dispatch({
      type: CANVAS_PARAMS,
      payload: {
        appwidth,
        appheight,
        padding,
        topheight,
        centerheight,
        bottomheight,
        innerCanvasWidth,
        innerCanvasHeight,
        Canvas_transformY,
        Canvas_scale,
        Canvas_obj_size,
      },
    });
  }, [size]);

  //1.得到使用者螢幕寬度
  //2.改變畫板寬度及高度
  const scale = `scale(1)`;
  return (
    <CanvasContext.Provider
      value={{
        state: {
          canvasObj_list: state.canvasObj_list,
          canvas_params: state.canvas_params,
        },
        dispatch: dispatch,
      }}
    >
      <div
        style={{
          width: state.canvas_params.appwidth + "px",
          height: state.canvas_params.topheight + "px",
        }}
      >
        Header
      </div>
      <div
        style={{
          width: state.canvas_params.appwidth + "px",
          height: state.canvas_params.centerheight + "px",
          touchAction: "none",
          padding: state.canvas_params.padding + "px",
          backgroundColor: "rgba(43,59,74,0.1)",
        }}
      >
        <div
          onWheel={(event) => {
            let scale =
              Number(state.canvas_params.Canvas_scale) + event.deltaY * -0.01;
            // Restrict scale
            scale = Math.min(Math.max(0.9, scale), 1.1);
            console.log(scale);
            dispatch({
              type: "CANVAS_SCALE",
              payload: {
                Canvas_scale: scale,
              },
            });
          }}
          style={{
            width: state.canvas_params.innerCanvasWidth + "px",
            height: state.canvas_params.innerCanvasHeight + "px",
            transform: `translate(0px,${state.canvas_params.Canvas_transformY}px) ${scale}`,
            border: "1px solid black",
            margin: "0 auto",
            backgroundColor: "white",
          }}
          id="canvas_container"
        >
          {state.canvasObj_list.map((ele) => {
            return <CanvasObj key={ele.id} ele={ele} />;
          })}
        </div>
      </div>
      <div
        style={{
          width: state.canvas_params.appwidth + "px",
          height: state.canvas_params.bottomheight + "px",
        }}
      >
        Footer
      </div>
    </CanvasContext.Provider>
  );
}

export default Canvas;
