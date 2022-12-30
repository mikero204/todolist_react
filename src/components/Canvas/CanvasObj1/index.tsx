import { useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { useCanvasContext } from "../hooks/useCanvasContext";

export default function CanvasObj1(props: any) {
  const [state, dispatch] = useCanvasContext();
  const { element } = props;
  const { id, width, height, x, y, rotate } = element;
  const bind = useDrag((state: any) => {
    state.event.stopPropagation();
    if (state.type === "pointerup") {
      dispatch({ type: "LOCKER_CANVAS", payload: false });
    } else {
      dispatch({ type: "LOCKER_CANVAS", payload: true });
    }
    let x = state.delta[0];
    let y = state.delta[1];

    dispatch({ type: "MOVE_CANVAS_OBJ", payload: { id, x, y } });
  });
  let style: any = {
    position: "absolute",
    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
    width: width + "px",
    height: height + "px",
    touchAction: "none",
  };
  return (
    <>
      <div style={style}>
        <div></div>
      </div>
      <div {...bind()} style={style}>
        <CornerPoint id={id} name="tl" />
        <CornerPoint id={id} name="tr" />
        <CornerPoint id={id} name="bl" />
        <CornerPoint id={id} name="br" />
      </div>
    </>
  );
}

function CornerPoint(props: any) {
  const { name, id } = props;
  const [state, dispatch] = useCanvasContext();
  const bind = useDrag((state: any) => {
    state.event.stopPropagation();
    if (state.type === "pointerup") {
      dispatch({ type: "LOCKER_CANVAS", payload: false });
    } else {
      dispatch({ type: "LOCKER_CANVAS", payload: true });
    }

    calc_resize(name, id);
    // dispatch({ type: "CORNER_RESIZE", payload: false });
  });

  let style: any;
  if (name === "tl") {
    style = {
      left: -10,
      top: -10,
      position: "absolute",
      width: 20 + "px",
      height: 20 + "px",
      border: "1px solid black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      touchAction: "none",
    };
  } else if (name === "tr") {
    style = {
      right: -10,
      top: -10,
      position: "absolute",
      width: 20 + "px",
      height: 20 + "px",
      border: "1px solid black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      touchAction: "none",
    };
  } else if (name === "bl") {
    style = {
      left: -10,
      bottom: -10,
      position: "absolute",
      width: 20 + "px",
      height: 20 + "px",
      border: "1px solid black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      touchAction: "none",
    };
  } else if (name === "br") {
    style = {
      right: -10,
      bottom: -10,
      position: "absolute",
      width: 20 + "px",
      height: 20 + "px",
      border: "1px solid black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      touchAction: "none",
    };
  }

  return (
    <div {...bind()} style={style}>
      <span
        style={{
          width: "50%",
          height: "50%",
          border: "1px solid black",
          borderRadius: "50%",
        }}
      ></span>
    </div>
  );
}

function calc_resize(name: string, id: string) {}
