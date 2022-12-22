import RotateButton from "../RotateButton";
import { useEffect, useState } from "react";
import CornerPoint from "../CornerPoint";
function CavasObjOutLineBox(props: any) {
  const styles = props.style;
  const ele = props.ele;
  const id = props.id;
  const clac_pos = (type: any, param: any) => {
    let style: any = {};
    switch (type) {
      case "top_l":
        style.position = "absolute";
        style.top = `-6px`;
        style.left = `-8px`;
        style.cursor = `nwse-resize`;
        break;
      case "top_r":
        style.position = "absolute";
        style.top = "-6px";
        style.left = param.width - 10 + "px";
        style.cursor = `nesw-resize`;
        break;
      case "bottom_l":
        style.position = "absolute";
        style.top = param.height - 10 + "px";
        style.left = "-8" + "px";
        style.cursor = `nesw-resize`;
        break;
      case "bottom_r":
        style.position = "absolute";
        style.top = param.height - 10 + "px";
        style.left = param.width - 10 + "px";
        style.cursor = `nwse-resize`;
        break;
    }

    return style;
  };

  return (
    <div
      style={{
        position: "absolute",
        width: styles.width + "px",
        height: styles.height + "px",
        transform: styles.transform,
        cursor: "pointer",
        userSelect: "none",
        border: "2px solid #8b3dff",
      }}
    >
      <CornerPoint
        id={id}
        name="tl"
        style={clac_pos("top_l", styles)}
      ></CornerPoint>
      <CornerPoint
        id={id}
        name="tr"
        style={clac_pos("top_r", styles)}
      ></CornerPoint>
      <CornerPoint
        id={id}
        name="bl"
        style={clac_pos("bottom_l", styles)}
      ></CornerPoint>
      <CornerPoint
        id={id}
        name="br"
        style={clac_pos("bottom_r", styles)}
      ></CornerPoint>
      <RotateButton ele={ele} />
    </div>
  );
}

export default CavasObjOutLineBox;
