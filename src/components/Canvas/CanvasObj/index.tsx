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

    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
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
        className={stlyles.box}
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
      {/* {ele.active ? (
        <>
          <ObjOutlineBox
            style={{
              position: "absolute",
              transform: `translate(${x}px, ${y}px) `,
              width: width,
              height: height,
              zindex,
            }}
            id={id}
          />
          <RotateButton ele={ele} />
        </>
      ) : null} */}
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
  const id = props.id;
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
      <CornerPoint
        id={id}
        type="top_l"
        style={clac_pos("top_l", style)}
      ></CornerPoint>
      <CornerPoint
        id={id}
        type="top_r"
        style={clac_pos("top_r", style)}
      ></CornerPoint>
      <CornerPoint
        id={id}
        type="bottom_l"
        style={clac_pos("bottom_l", style)}
      ></CornerPoint>
      <CornerPoint
        id={id}
        type="bottom_r"
        style={clac_pos("bottom_r", style)}
      ></CornerPoint>
    </div>
  );
}

function CornerPoint({ id, type, style }: any) {
  const [state, dispatch] = useCanvasContext();
  //clear listener
  useEffect(() => {
    return () => {
      console.log("clear corner event");
      window.removeEventListener("mousemove", check_move);
      window.removeEventListener("mouseup", check_up);
    };
  }, []);
  let pos: any = {};
  const check_move = (e: any) => {
    dispatch({
      type: "CORNER_LEFTTOP_RESIZE",
      payload: { id, x: e.clientX, y: e.clientY },
    });
  };
  const check_up = (e: any) => {
    window.removeEventListener("mousemove", check_move);
    window.removeEventListener("mouseup", check_up);
  };

  const test = (e: any) => {
    dispatch({ type: "CORNER_CLICK", payload: { id } });
    pos.cor_x = e.pageX;
    pos.cor_y = e.pageY;
    pos.type = type;
    window.addEventListener("mousemove", check_move);
    window.addEventListener("mouseup", check_up);
  };
  return (
    <div
      // onTouchStart={test}
      // onMouseDown={test}
      className={stlyles.corner}
      style={style}
    ></div>
  );
}
