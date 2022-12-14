import { useDraggable, DraggableObj } from "../hooks/useDraggable";
import { useCustomDrag } from "../hooks/useCustomDrag";
import stlyles from "./index.module.scss";
import { useState } from "react";

type prop = {
  ele: DraggableObj;
  changeActive: Function;
};
function CanvasObj(props: prop) {
  const draggable = useDraggable(props.ele);
  const customdraggable = useCustomDrag();
  const [showborder, setBorder] = useState(false);
  const activeObj = (e: any) => {
    e.preventDefault();
    props.changeActive(props.ele.id);
    draggable.enable();
  };
  const showBorder = () => {
    setBorder(true);
  };
  const hideBorder = () => {
    setBorder(false);
  };
  return (
    <div
      ref={draggable.ref}
      style={Object.assign(
        draggable.style,
        showborder ? { border: "1px solid black" } : ""
      )}
      onClick={activeObj}
      onTouchEnd={activeObj}
      onMouseMove={showBorder}
      onMouseOut={hideBorder}
    >
      {props.ele.active ? <ObjOutlineBox style={draggable.style} /> : null}

      <img className={stlyles.img_drag} src={draggable.img} />
      <div ref={customdraggable.ref} className={stlyles.rotationhandle}>
        旋轉
      </div>
    </div>
  );
}

export default CanvasObj;

function ObjOutlineBox(props: any) {
  const clac_pos = (type: any, param: any) => {
    let stlye: any = {};
    param.width = param.width.replace("px", "");
    param.height = param.height.replace("px", "");

    switch (type) {
      case "top_l":
        stlye.position = "absolute";
        stlye.top = `-10px`;
        stlye.left = `-10px`;
        break;
      case "top_r":
        stlye.position = "absolute";
        stlye.top = "-10px";
        stlye.left = param.width - 10 + "px";
        break;
      case "bottom_l":
        stlye.position = "absolute";
        stlye.top = param.height - 10 + "px";
        stlye.left = "-10" + "px";
        break;
      case "bottom_r":
        stlye.position = "absolute";
        stlye.top = param.height - 10 + "px";
        stlye.left = param.width - 10 + "px";
        stlye.zIndex = 99999;
        break;
    }
    return stlye;
  };
  const style = props.style;
  delete style.border;
  style.border = "2px solid #8b3dff";
  return (
    <div
      style={{
        position: "absolute",
        width: props.style.width,
        height: props.style.height,
      }}
    >
      <div
        className={stlyles.corner}
        style={clac_pos("top_l", props.style)}
      ></div>
      <div
        className={stlyles.corner}
        style={clac_pos("top_r", props.style)}
      ></div>
      <div
        className={stlyles.corner}
        style={clac_pos("bottom_l", props.style)}
      ></div>
      <div
        className={stlyles.corner}
        style={clac_pos("bottom_r", props.style)}
      ></div>
    </div>
  );
}
