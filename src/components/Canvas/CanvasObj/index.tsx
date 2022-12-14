import { useDraggable } from "../hooks/useDraggable";
import stlyles from "./index.module.scss";
import { useEffect, useState } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";
import {
  ADD_CANVAS_OBJ,
  UPDATE_CANVAS_OBJ,
  DELETE_CANVAS_OBJ,
  CHANGE_ACTIVE,
} from "../Constants";
import { useCustomDrag } from "../hooks/useCustomDrag";

function CanvasObj({ ele }: any) {
  const draggable = useDraggable(ele);
  const [state, dispatch] = useCanvasContext();
  const [showborder, setBorder] = useState(false);
  useEffect(() => {
    return () => {
      draggable.disable();
    };
  }, []);
  const activeObj = (e: any) => {
    e.preventDefault();
    dispatch({ type: CHANGE_ACTIVE, payload: ele });
  };
  const showBorder = () => {
    setBorder(true);
  };
  const hideBorder = () => {
    setBorder(false);
  };
  const {
    id,
    name,
    x,
    y,
    width,
    height,
    zindex,
    rotate,
    img,
    active,
    lock,
    color,
  } = draggable.res_prop;
  let style: any = {
    position: "absolute",
    transform: `translate(${x}px, ${y}px) rotate(${rotate}rad)`,
    width: width + "px",
    height: height + "px",
  };
  if (showborder && !active) {
    style.border = "2px solid #8b3dff";
  }
  if (ele.active) {
    style.border = "2px solid #8b3dff";
  }
  return (
    <div
      ref={draggable.ref}
      style={style}
      onClick={activeObj}
      onTouchEnd={activeObj}
      onMouseMove={showBorder}
      onMouseOut={hideBorder}
      data-x={x}
      data-y={y}
      data-angle={rotate}
      data-id={id}
    >
      {ele.active ? (
        <>
          <ObjOutlineBox
            style={{
              position: "absolute",
              transform: `translate(${x}px, ${y}px)`,
              width: width,
              height: height,
              zindex,
            }}
          />
          <RotateButton />
        </>
      ) : null}

      <img className={stlyles.img_drag} src={ele.img} />
    </div>
  );
}

export default CanvasObj;

function RotateButton() {
  const rotatedrag = useCustomDrag();
  useEffect(() => {
    return () => {
      rotatedrag.disable();
    };
  });
  return (
    <div ref={rotatedrag.ref} className={stlyles.rotationhandle}>
      ??????
    </div>
  );
}

function ObjOutlineBox(props: any) {
  const style = props.style;

  const clac_pos = (type: any, param: any) => {
    let style: any = {};
    switch (type) {
      case "top_l":
        style.position = "absolute";
        style.top = `-10px`;
        style.left = `-10px`;
        break;
      case "top_r":
        style.position = "absolute";
        style.top = "-10px";
        style.left = param.width - 10 + "px";
        break;
      case "bottom_l":
        style.position = "absolute";
        style.top = param.height - 10 + "px";
        style.left = "-10" + "px";
        break;
      case "bottom_r":
        style.position = "absolute";
        style.top = param.height - 10 + "px";
        style.left = param.width - 10 + "px";
        break;
    }
    return style;
  };

  return (
    <div
      style={{
        position: "absolute",
        width: style.width,
        height: style.height,
      }}
    >
      <div className={stlyles.corner} style={clac_pos("top_l", style)}></div>
      <div className={stlyles.corner} style={clac_pos("top_r", style)}></div>
      <div className={stlyles.corner} style={clac_pos("bottom_l", style)}></div>
      <div className={stlyles.corner} style={clac_pos("bottom_r", style)}></div>
    </div>
  );
}
