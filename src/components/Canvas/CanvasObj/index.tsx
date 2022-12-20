import { useDraggable } from "../hooks/useDraggable";
import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { CHANGE_ACTIVE } from "../Constants";
import { useCustomDrag } from "../hooks/useCustomDrag";

function CanvasObj({ ele }: any) {
  // console.log(ele);
  const draggable = useDraggable(ele);
  const [state, dispatch] = useCanvasContext();
  const [showborder, setBorder] = useState(false);

  useEffect(() => {
    // window.addEventListener("mousemove", (e: any) => {
    //   console.log(e.clientX, e.clientY);
    // });
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
        className={styles.box}
        ref={draggable.ref}
        style={style}
        onClick={activeObj}
        onTouchEnd={activeObj}
        onMouseMove={() => setBorder(true)}
        onMouseOut={() => setBorder(false)}
        data-id={id}
      >
        <img className={styles.img_drag} src={ele.img} />
        {ele.active ? (
          <>
            <ObjOutlineBox
              style={{
                position: "absolute",
                // transform: `translate(${x}px, ${y}px)  rotate(${rotate}deg) `,
                width: width,
                height: height,
              }}
              id={id}
              ele={ele}
              className={styles.box}
            />
          </>
        ) : null}
      </div>
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
      style={{
        touchAction: "none",
        // position: "absolute",
        // transform: `translate(${x}px, ${y}px)  rotate(${rotate}deg) `,
        // width: width + "px",
        // height: height + "px",
      }}
      className={styles.rotationhandle}
    >
      旋轉
    </div>
  );
}

function ObjOutlineBox(props: any) {
  const styles = props.style;
  const ele = props.ele;
  const id = props.id;
  const clac_pos = (type: any, param: any) => {
    let style: any = {};
    switch (type) {
      case "top_l":
        style.position = "absolute";
        style.top = `-10px`;
        style.left = `-14px`;
        break;
      case "top_r":
        style.position = "absolute";
        style.top = "-10px";
        style.left = param.width - 7 + "px";
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
        width: styles.width + "px",
        height: styles.height + "px",
        transform: styles.transform,
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

function CornerPoint({ id, name, style }: any) {
  const [state, dispatch] = useCanvasContext();
  const ref = useRef(null);
  //clear listener
  useEffect(() => {
    return () => {
      console.log("clear corner event");
      window.removeEventListener("mousemove", check_move);
      window.removeEventListener("mouseup", check_up);
    };
  }, []);
  const check_move = (e: any) => {
    const rf: any = ref.current;
    const rect = rf.getBoundingClientRect();
    let control = {
      x: rect.x,
      y: rect.y,
    };
    let cav = state.find((ele: any) => {
      return ele.id === id;
    });
    const proportion = cav.width / cav.height;
    let centerPosition = {
      x: cav.x + cav.width / 2,
      y: cav.y + cav.height / 2,
    };
    const currentPosition = {
      x: e.clientX,
      y: e.clientY,
    };
    const symmetricPoint = {
      x: centerPosition.x - (control.x - centerPosition.x),
      y: centerPosition.y - (control.y - centerPosition.y),
    };

    let newCenterPoint = getCenterPoint(currentPosition, symmetricPoint);
    let newControlPoint = calculateRotatedPointCoordinate(
      currentPosition,
      newCenterPoint,
      -cav.rotate
    );
    console.log(newControlPoint);
    let newSymmetricPoint = calculateRotatedPointCoordinate(
      symmetricPoint,
      newCenterPoint,
      -cav.rotate
    );
    let newWidth = Math.abs(newControlPoint.x - newSymmetricPoint.x);
    let newHeight = Math.abs(newSymmetricPoint.y - newControlPoint.y);
    // if (newWidth / newHeight > proportion) {
    //   newControlPoint.x += ["tl", "bl"].includes(name)
    //     ? Math.abs(newWidth - newHeight * proportion)
    //     : -Math.abs(newWidth - newHeight * proportion);
    //   newWidth = newHeight * proportion;
    // } else {
    //   newControlPoint.y += ["tl", "tr"].includes(name)
    //     ? Math.abs(newHeight - newWidth / proportion)
    //     : -Math.abs(newHeight - newWidth / proportion);
    //   newHeight = newWidth / proportion;
    // }
    const rotatedControlPoint = calculateRotatedPointCoordinate(
      currentPosition,
      newCenterPoint,
      cav.rotate
    );
    console.log(rotatedControlPoint);
    newCenterPoint = getCenterPoint(rotatedControlPoint, symmetricPoint);
    newControlPoint = calculateRotatedPointCoordinate(
      rotatedControlPoint,
      newCenterPoint,
      -cav.rotate
    );
    newSymmetricPoint = calculateRotatedPointCoordinate(
      symmetricPoint,
      newCenterPoint,
      -cav.rotate
    );

    newWidth = ["tl", "bl"].includes(name)
      ? newSymmetricPoint.x - newControlPoint.x
      : newControlPoint.x - newSymmetricPoint.x;
    newHeight = ["tl", "tr"].includes(name)
      ? newSymmetricPoint.y - newControlPoint.y
      : newControlPoint.y - newSymmetricPoint.y;
    if (newWidth > 0 && newHeight > 0) {
      dispatch({
        type: "CORNER_RESIZE",
        payload: {
          id,
          width: newWidth,
          height: newHeight,
          x: Math.min(newControlPoint.x, newSymmetricPoint.x),
          y: Math.min(newSymmetricPoint.y, newControlPoint.y),
        },
      });
    }
  };
  const check_up = (e: any) => {
    window.removeEventListener("mousemove", check_move);
    window.removeEventListener("mouseup", check_up);
  };

  const test = (e: any) => {
    e.preventDefault();
    window.addEventListener("mousemove", check_move);
    window.addEventListener("mouseup", check_up);
  };
  return (
    <div
      // onTouchStart={test}
      ref={ref}
      onMouseDown={test}
      className={styles.corner}
      style={style}
    ></div>
  );
}

function getCenterPoint(p1: any, p2: any) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
}
function calculateRotatedPointCoordinate(point: any, center: any, rotate: any) {
  return {
    x:
      (point.x - center.x) * Math.cos(angleToRadian(rotate)) -
      (point.y - center.y) * Math.sin(angleToRadian(rotate)) +
      center.x,

    y:
      (point.x - center.x) * Math.sin(angleToRadian(rotate)) +
      (point.y - center.y) * Math.cos(angleToRadian(rotate)) +
      center.y,
  };
}

function angleToRadian(angle: any) {
  return angle * (Math.PI / 180);
}
