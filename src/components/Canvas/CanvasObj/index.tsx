import { useDraggable } from "../hooks/useDraggable";
import stlyles from "./index.module.scss";
import { useEffect, useState } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { CHANGE_ACTIVE } from "../Constants";
import { useCustomDrag } from "../hooks/useCustomDrag";

function CanvasObj({ ele }: any) {
  // console.log(ele);
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
  } = ele;
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
    <>
      <div
        ref={draggable.ref}
        style={style}
        onClick={activeObj}
        onTouchEnd={activeObj}
        onMouseMove={() => setBorder(true)}
        onMouseOut={() => setBorder(false)}
        // data-angle={rotate}
        data-id={id}
      >
        <img className={stlyles.img_drag} src={ele.img} />
      </div>
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
          <RotateButton ele={ele} />
        </>
      ) : null}
    </>
  );
}

export default CanvasObj;

function RotateButton(ele: any) {
  const rotatedrag = useCustomDrag(ele);
  useEffect(() => {
    return () => {
      rotatedrag.disable();
    };
  }, []);
  return (
    <div
      ref={rotatedrag.ref}
      style={{ touchAction: "none" }}
      className={stlyles.rotationhandle}
    >
      旋轉
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
        transform: style.transform,
      }}
    >
      <CornerPoint type="top_l" style={clac_pos("top_l", style)}></CornerPoint>
      <CornerPoint type="top_r" style={clac_pos("top_r", style)}></CornerPoint>
      <CornerPoint
        type="bottom_l"
        style={clac_pos("bottom_l", style)}
      ></CornerPoint>
      <CornerPoint
        type="bottom_r"
        style={clac_pos("bottom_r", style)}
      ></CornerPoint>
    </div>
  );
}

function CornerPoint({ type, style }: any) {
  useEffect(() => {
    return () => {
      console.log("clear corner event");
      window.removeEventListener("mousemove", check_move);
      window.removeEventListener("mouseup", check_up);
    };
  }, []);
  const check_move = (e: any) => {
    pos.mouse_X = e.x;
    pos.mouse_Y = e.y;
  };
  const check_up = (e: any) => {
    console.log(pos);
    window.removeEventListener("mousemove", check_move);
    window.removeEventListener("mouseup", check_up);
  };

  let pos: any = {};
  const test = (e: any) => {
    pos.cor_x = e.pageX;
    pos.cor_y = e.pageY;
    pos.type = type;
    window.addEventListener("mousemove", check_move);
    window.addEventListener("mouseup", check_up);
  };
  return (
    <div
      // onTouchStart={test}
      // onTouchMove={test}
      // onTouchEnd={test}
      onMouseDown={test}
      className={stlyles.corner}
      style={style}
    ></div>
  );
}
