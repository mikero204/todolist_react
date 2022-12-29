import {
  useState,
  useRef,
  useReducer,
  useEffect,
  MouseEventHandler,
} from "react";
import { useWindowSize } from "./hooks/useWindowSize";
import CanvasObj from "./CanvasObj";
import { CanvasContext } from "./context/CanvasContext";
import { CanvasReducer, canvasStateType } from "./context/CanvasReducer";
import { CANVAS_PARAMS, RESET } from "./Constants";
import uuid from "react-uuid";
import {
  FullGestureState,
  useGesture,
  WebKitGestureEvent,
} from "@use-gesture/react";
import _ from "lodash";
function Canvas() {
  const ref = useRef(null);
  const bind = useGesture(
    {
      onPinch: (state) => pinch_scale(state),
      onWheel: (state) => wheel_scale(state),
      onDrag: (state) => drag(state),
    },
    { target: ref }
  );

  const pinch_scale = (state: any) => {
    const { x, y } = (state.target as any).getBoundingClientRect();
    console.log(state);
    if (state.direction[0] === 1 && state.direction[1] === 1) {
      dispatch({
        type: "CANVAS_SCALE_POINT",
        payload: {
          action: "ADD",
          pointX: Math.floor(state.event.x - x),
          pointY: Math.floor(state.event.y - y),
        },
      });
    } else if (state.direction[0] === -1 && state.direction[1] === -1) {
      //scale smaller
      dispatch({
        type: "CANVAS_SCALE_POINT",
        payload: {
          action: "REDUCE",
          pointX: Math.floor(state.event.x - x),
          pointY: Math.floor(state.event.y - y),
        },
      });
    }
  };
  const drag = (
    state: Omit<FullGestureState<"drag">, "event"> & {
      event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;
    }
  ) => {
    if (state.touches < 2 && state.type === "pointermove") {
      let direction = state.direction;
      dispatch({ type: "CANVAS_TRANSFORM", payload: { direction } });
    }
  };
  const wheel_scale = (
    state: Omit<FullGestureState<"wheel">, "event"> & {
      event: WheelEvent;
    }
  ) => {
    if (!state.active) return;
    if (!state.ctrlKey) return;
    let scaleStatus = state.movement[1] > 0 ? true : false;
    const { x, y } = (state.target as any).getBoundingClientRect();

    if (scaleStatus) {
      //scale smaller
      dispatch({
        type: "CANVAS_SCALE",
        payload: {
          action: "REDUCE",
          pointX: Math.floor(state.event.x - x),
          pointY: Math.floor(state.event.y - y),
        },
      });
    } else {
      //scale larger
      dispatch({
        type: "CANVAS_SCALE",
        payload: {
          action: "ADD",
          pointX: Math.floor(state.event.x - x),
          pointY: Math.floor(state.event.y - y),
        },
      });
    }
  };
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
      header_width: 0,
      header_height: 0,
      main_width: 0,
      main_height: 0,
      main_footer_width: 0,
      main_footer_height: 0,
      paper_padding: 0,
      rate: 0,
      paper_width: 0,
      paper_height: 0,
      scale: 0,
      transform_x: 0,
      transform_y: 0,
      screen_width: 0,
      screen_height: 0,
    },
  };
  const [state, dispatch] = useReducer(CanvasReducer, initState);

  useEffect(() => {
    const appwidth = size.width;
    const appheight = size.height;
    const header_height = 48;
    const header_width = appwidth;
    const main_width = appwidth;
    const main_height = appheight;
    const main_footer_width = appwidth;
    const main_footer_height = 80;
    const paper_padding = `20px 20px ${main_footer_height + 20}px 20px`;
    const rate = 1.333333;
    const paper_width = appwidth - 40;
    const paper_height = paper_width / rate;
    const scale = 1;
    const transform_x = 0;
    const transform_y = appheight / 2 + header_height - paper_height;
    const screen_width = paper_width;
    const screen_height = paper_height;
    dispatch({
      type: CANVAS_PARAMS,
      payload: {
        appwidth,
        appheight,
        header_width,
        header_height,
        main_width,
        main_height,
        main_footer_width,
        main_footer_height,
        paper_padding,
        rate,
        paper_width,
        paper_height,
        scale,
        transform_x,
        transform_y,
        screen_width,
        screen_height,
      },
    });
  }, [size]);

  const {
    appwidth,
    appheight,
    header_width,
    header_height,
    main_width,
    main_height,
    main_footer_width,
    main_footer_height,
    paper_padding,
    rate,
    paper_width,
    paper_height,
    scale,
    transform_x,
    transform_y,
  } = state.canvas_params;

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
      <div>
        <header
          style={{
            width: header_width + "px",
            height: header_height + "px",
            backgroundColor: "#e0d9fc",
            position: "fixed",
            zIndex: 99999,
          }}
        >
          header
        </header>
        <main
          ref={ref}
          style={{
            width: main_width + "px",
            height: main_height + "px",
            backgroundColor: "#ebecf0",
            position: "relative",
            touchAction: "none",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: paper_padding,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                width: paper_width + "px",
                height: paper_height + "px",
                transform: `translate(${transform_x}px, ${transform_y}px)`,
              }}
            >
              <h1>test</h1>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: main_footer_width + "px",
              height: main_footer_height + "px",
            }}
          >
            footer
          </div>
        </main>
      </div>

      {/* <div>
        <div
          style={{
            width: state.canvas_params.header_width + "px",
            height: state.canvas_params.header_height + "px",
            touchAction: "none",
          }}
        >
          Header
        </div>
        <div
          style={{
            width: state.canvas_params.appwidth + "px",
            height:
              Number(state.canvas_params.appheight) -
              Number(state.canvas_params.header_height) +
              "px",
            display: "flex",
          }}
        >
          <div
            style={{
              width: state.canvas_params.tool_view_width + "px",
              height: state.canvas_params.tool_view_height + "px",
              touchAction: "none",
            }}
          >
            left
          </div>
          <div>
            <div
              style={{
                width: state.canvas_params.canvas_width + "px",
                height: state.canvas_params.canvas_topheight + "px",
                touchAction: "none",
              }}
            >
              right
            </div>
            <div
              style={{
                width: state.canvas_params.canvas_width + "px",
                height: state.canvas_params.canvas_centerheight + "px",
              }}
            >
              <div
                {...bind()}
                ref={ref}
                style={{
                  width: state.canvas_params.canvas_width + "px",
                  height: state.canvas_params.canvas_canva + "px",
                  position: "relative",
                  padding: "12px",
                  backgroundColor: "rgba(43,59,74,0.1)",
                  overflow: "scroll",
                  touchAction: "pan-x,pan-y",
                }}
              >
                <div
                  style={{
                    width: state.canvas_params.canvas_paper_width + "px",
                    height: state.canvas_params.canvas_paper_height + "px",
                    backgroundColor: "white",
                    position: "relative",
                    margin: "15px auto",
                  }}
                >
                  <div
                    style={{
                      width: 800 + "px",
                      height: 600 + "px",
                      transform: ` scale(${
                        state.canvas_params.canvas_scale / 100
                      })`,
                      transformOrigin: "0 0",
                      position: "absolute",
                      touchAction: "pan-x pan-y",
                    }}
                  >
                    <div
                      style={{
                        width: 800 + "px",
                        height: 600 + "px",
                      }}
                    >
                      <h1>測試</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: state.canvas_params.canvas_bottomheight + "px",
                  width: 100 + "%",
                }}
              >
                canvas page select
              </div>
            </div>
            <div
              style={{
                width: state.canvas_params.canvas_width + "px",
                height: state.canvas_params.canvas_bottomheight + "px",
              }}
            >
              {state.canvas_params.canvas_scale}
              Footer
            </div>
          </div>
        </div>
      </div> */}

      {/* <div
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
            // let scale =
            //   Number(state.canvas_params.Canvas_scale) + event.deltaY * -0.01;
            // console.log(state.canvas_params.Canvas_scale);
            // // Restrict scale
            // scale = Math.min(Math.max(0.9, scale), 1.1);
            // dispatch({
            //   type: "CANVAS_SCALE",
            //   payload: {
            //     Canvas_scale: scale,
            //   },
            // });
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
      </div> */}
    </CanvasContext.Provider>
  );
}

export default Canvas;
