import { useCanvasContext } from "../../hooks/useCanvasContext";
import { useEffect, useRef, useState } from "react";
import styles from "../index.module.scss";

function CornerPoint({ id, name, style }: any) {
  const [state, dispatch] = useCanvasContext();
  const ref = useRef(null);

  //clear listener
  useEffect(() => {
    return () => {
      touchcheck_end();
      mousecheck_up();
    };
  }, []);

  const mouse_resize = (e: any) => {
    let cav = state.canvasObj_list.find((ele: any) => {
      return ele.id === id;
    });
    const scale = state.canvas_params.Canvas_scale;
    console.log(
      "width" + Number(cav.width * scale),
      "height" + Number(cav.height * scale)
    );
    window.addEventListener("mousemove", mousecheck_move);
    window.addEventListener("mouseup", mousecheck_up);
  };
  const mousecheck_move = (e: any) => {
    let cav = state.canvasObj_list.find((ele: any) => {
      return ele.id === id;
    });
    // const scale = state.canvas_params.Canvas_scale;
    const scale = 1;
    // console.log(Number(cav.width * scale));

    let control_pos;
    if (name === "tl") {
      control_pos = {
        x: Number(cav.x),
        y: Number(cav.y),
      };
    } else if (name === "tr") {
      control_pos = {
        x: Number(cav.x) + Number(cav.width) * scale,
        y: Number(cav.y),
      };
    } else if (name === "bl") {
      control_pos = {
        x: Number(cav.x),
        y: Number(cav.y) + Number(cav.height) * scale,
      };
    } else if (name === "br") {
      control_pos = {
        x: Number(cav.x) + Number(cav.width) * scale,
        y: Number(cav.y) + Number(cav.height) * scale,
      };
    }
    console.log(control_pos);
    const proportion = (cav.width * scale) / (cav.height * scale);
    let centerPosition = {
      x: cav.x + (cav.width * scale) / 2,
      y: cav.y + (cav.height * scale) / 2,
    };
    console.log("center: " + centerPosition.x + "y" + centerPosition.y);
    let control = calculateRotatedPointCoordinate(
      control_pos,
      centerPosition,
      cav.rotate
    );
    console.log("control: " + control.x + "y" + control.y);

    let cdom = document.querySelector("#canvas_container");

    const { x, y }: any = cdom?.getBoundingClientRect();

    const currentPosition = {
      x: e.clientX - x,
      y: e.clientY - y,
    };
    console.log(
      "currentPosition: x" + currentPosition.x + "y " + currentPosition.y
    );
    console.log("getBoundingClientRect: x" + x + "y " + y);

    const symmetricPoint = {
      x: centerPosition.x - (control.x - centerPosition.x),
      y: centerPosition.y - (control.y - centerPosition.y),
    };
    console.log(
      "symmetricPoint: x" + symmetricPoint.x + "y " + symmetricPoint.y
    );

    let newCenterPoint = getCenterPoint(currentPosition, symmetricPoint);
    console.log(
      "newCenterPoint: x" + newCenterPoint.x + "y " + newCenterPoint.y
    );
    let newControlPoint = calculateRotatedPointCoordinate(
      currentPosition,
      newCenterPoint,
      -cav.rotate
    );
    console.log(
      "newControlPoint: x" + newControlPoint.x + "y " + newControlPoint.y
    );

    let newSymmetricPoint = calculateRotatedPointCoordinate(
      symmetricPoint,
      newCenterPoint,
      -cav.rotate
    );
    console.log(
      "newSymmetricPoint: x" + newSymmetricPoint.x + "y " + newSymmetricPoint.y
    );

    let newWidth = Math.abs(newControlPoint.x - newSymmetricPoint.x);
    let newHeight = Math.abs(newSymmetricPoint.y - newControlPoint.y);
    console.log("newWidth " + newWidth + "newHeight " + newHeight);
    // return;
    if (newWidth / newHeight > proportion) {
      newControlPoint.x += ["tl", "bl"].includes(name)
        ? Math.abs(newWidth - newHeight * proportion)
        : -Math.abs(newWidth - newHeight * proportion);
      newWidth = newHeight * proportion;
    } else {
      newControlPoint.y += ["tl", "tr"].includes(name)
        ? Math.abs(newHeight - newWidth / proportion)
        : -Math.abs(newHeight - newWidth / proportion);
      newHeight = newWidth / proportion;
    }
    const rotatedControlPoint = calculateRotatedPointCoordinate(
      newControlPoint,
      newCenterPoint,
      cav.rotate
    );

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
          x: Math.max(0, Math.min(newControlPoint.x, newSymmetricPoint.x)),
          y: Math.max(0, Math.min(newSymmetricPoint.y, newControlPoint.y)),
        },
      });
    }
  };

  const mousecheck_up = (e?: any) => {
    window.removeEventListener("mousemove", mousecheck_move);
    window.removeEventListener("mouseup", mousecheck_up);
  };

  const touch_resize = (e: any) => {
    e.stopPropagation();
    window.addEventListener("touchmove", touchcheck_move);
    window.addEventListener("touchend", touchcheck_end);
  };
  const touchcheck_move = (e: any) => {
    let cav = state.canvasObj_list.find((ele: any) => {
      return ele.id === id;
    });
    let control_pos;
    if (name === "tl") {
      control_pos = {
        x: Number(cav.x),
        y: Number(cav.y),
      };
    } else if (name === "tr") {
      control_pos = {
        x: Number(cav.x) + Number(cav.width),
        y: Number(cav.y),
      };
    } else if (name === "bl") {
      control_pos = {
        x: Number(cav.x),
        y: Number(cav.y) + Number(cav.height),
      };
    } else if (name === "br") {
      control_pos = {
        x: Number(cav.x) + Number(cav.width),
        y: Number(cav.y) + Number(cav.height),
      };
    }

    const proportion = cav.width / cav.height;
    let centerPosition = {
      x: cav.x + cav.width / 2,
      y: cav.y + cav.height / 2,
    };

    let control = calculateRotatedPointCoordinate(
      control_pos,
      centerPosition,
      cav.rotate
    );
    let cdom = document.querySelector("#canvas_container");

    const { x, y }: any = cdom?.getBoundingClientRect();

    const currentPosition = {
      x: e.touches[0].clientX - x,
      y: e.touches[0].clientY - y,
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
    let newSymmetricPoint = calculateRotatedPointCoordinate(
      symmetricPoint,
      newCenterPoint,
      -cav.rotate
    );
    let newWidth = Math.abs(newControlPoint.x - newSymmetricPoint.x);
    let newHeight = Math.abs(newSymmetricPoint.y - newControlPoint.y);
    if (newWidth / newHeight > proportion) {
      newControlPoint.x += ["tl", "bl"].includes(name)
        ? Math.abs(newWidth - newHeight * proportion)
        : -Math.abs(newWidth - newHeight * proportion);
      newWidth = newHeight * proportion;
    } else {
      newControlPoint.y += ["tl", "tr"].includes(name)
        ? Math.abs(newHeight - newWidth / proportion)
        : -Math.abs(newHeight - newWidth / proportion);
      newHeight = newWidth / proportion;
    }

    const rotatedControlPoint = calculateRotatedPointCoordinate(
      newControlPoint,
      newCenterPoint,
      cav.rotate
    );

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
  const touchcheck_end = (e?: any) => {
    window.removeEventListener("touchmove", touchcheck_move);
    window.removeEventListener("touchend", touchcheck_end);
  };

  return (
    <div
      ref={ref}
      id={id + name}
      onTouchStart={touch_resize}
      onMouseDown={mouse_resize}
      className={styles.corner}
      style={{ ...style, backgroundColor: "rgb(139, 61, 255)", transform: "" }}
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
export default CornerPoint;
