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
import { useGesture } from "@use-gesture/react";

function Canvas() {
  const [custom, setCustom] = useState({ width: 100, height: 100 });
  const bind = useGesture({
    onPinch: (state) => doSomethingWith(state),
    onWheel: (state) => doSomethingWith(state),
  });

  const doSomethingWith = (state: any) => {
    console.log(state);
    // let last = state.lastOffset[0];
    // let now = state.offset[0];
    // if (last - now < 0) {
    //   dispatch({
    //     type: "CANVAS_SCALE",
    //     payload: {
    //       action: "add",
    //     },
    //   });
    // } else {
    //   dispatch({
    //     type: "CANVAS_SCALE",
    //     payload: {
    //       action: "reduce",
    //     },
    //   });
    // }
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
      tool_view_width: 0,
      tool_view_height: 0,
      canvas_width: 0,
      canvas_topheight: 0,
      canvas_centerheight: 0,
      canvas_bottomheight: 0,
      canvas_scale: 0,
      canvas_paper_width: 0,
      canvas_paper_height: 0,
      canvas_canva: 0,
      canvas_canva_bottom: 0,
    },
  };
  const ref = useRef(null);
  const [state, dispatch] = useReducer(CanvasReducer, initState);
  // useEffect(() => {
  //   if (ref.current) {
  //     (ref.current as any).addEventListener("wheel", handleWheel, {
  //       passive: false,
  //     });
  //     return () => {
  //       (ref.current as any).removeEventListener("wheel", handleWheel, {
  //         passive: false,
  //       });
  //     };
  //   }
  // }, []);
  useEffect(() => {
    if (ref.current) {
      (ref.current as any).addEventListener(
        "touchstart",
        (e: any) => {
          if (e.touches.length > 1) {
            console.log(1);
            e.preventDefault();
          }
        },
        {
          passive: false,
        }
      );
    }
  }, []);
  const handleWheel = (event: MouseEvent | any) => {
    event.preventDefault();
    if (event.ctrlKey) {
      // (ref.current as any).scrollTop =
      //   (event.clientY * state.canvas_params.canvas_scale) / 100;
      // (ref.current as any).scrollLeft =
      //   (event.clientX * state.canvas_params.canvas_scale) / 100;

      if (event.deltaY > 0) {
        dispatch({
          type: "CANVAS_SCALE",
          payload: {
            action: "reduce",
          },
        });
      } else {
        dispatch({
          type: "CANVAS_SCALE",
          payload: {
            action: "add",
          },
        });
      }
    }
  };
  useEffect(() => {
    const appwidth = size.width;
    const appheight = size.height;
    const header_height = size.height * 0.06;
    const header_width = appwidth;
    const tool_view_height = appheight - header_height;
    const tool_view_width = 72;
    const canvas_topheight = tool_view_height * 0.06;
    const canvas_centerheight = tool_view_height * 0.88;
    const canvas_center_canva_height = tool_view_height * 0.88 * 0.8;
    const canvas_bottomheight = tool_view_height * 0.06;
    const canvas_width = appwidth - tool_view_width;
    const canvas_canva = canvas_centerheight * 0.8;
    const canvas_canva_bottom = canvas_centerheight * 0.2;
    let canvas_scale = 100;
    let canvas_paper_height = Math.min(
      canvas_width * 0.5,
      canvas_center_canva_height * 0.9
    );
    let canvas_paper_width = canvas_paper_height * 1.333333;
    canvas_scale = (canvas_paper_height / 600) * 100;

    dispatch({
      type: CANVAS_PARAMS,
      payload: {
        appwidth,
        appheight,
        header_width,
        header_height,
        tool_view_width,
        tool_view_height,
        canvas_width,
        canvas_topheight,
        canvas_centerheight,
        canvas_bottomheight,
        canvas_scale,
        canvas_paper_width,
        canvas_paper_height,
        canvas_canva,
        canvas_canva_bottom,
      },
    });
  }, [size]);

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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          {...bind()}
          style={{
            width: 300 + "px",
            height: 200 + "px",
            overflow: "scroll",
            touchAction: "pan-x pan-y pinch-zoom",
            backgroundColor: "GrayText",
          }}
        >
          <div
            ref={ref}
            style={{
              width: custom.width + 100 + "px",
              height: custom.height + 100 + "px",
              backgroundColor: "grey",
              display: "flex",
              flexWrap: "nowrap",
              whiteSpace: "nowrap",
              margin: "auto",
            }}
          >
            <div
              style={{
                width: custom.width + "px",
                height: custom.height + "px",
                backgroundColor: "white",
                padding: "15px",
                margin: "auto",
                flexShrink: "0",
              }}
            >
              <h1>test</h1>
            </div>
          </div>
        </div>
        <button
          onClick={(e: any) => {
            setCustom({
              height: custom.height + 100,
              width: custom.width + 100,
            });
          }}
        >
          +
        </button>
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
