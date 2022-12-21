import { useCanvasContext } from "../../hooks/useCanvasContext";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useEffect } from "react";
import styles from "../index.module.scss";
function CornerPoint({ id, name, style }: any) {
  const [state, dispatch] = useCanvasContext();
  const size = useWindowSize();
  //clear listener
  useEffect(() => {
    return () => {
      touchcheck_end();
      mousecheck_up();
    };
  }, []);
  const mouse_resize = (e: any) => {
    window.addEventListener("mousemove", mousecheck_move);
    window.addEventListener("mouseup", mousecheck_up);
  };
  const mousecheck_move = (e: any) => {
    let cav = state.find((ele: any) => {
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
    const topheight = size.height * 0.15;
    const currentPosition = {
      x: e.clientX - 16,
      y: e.clientY - topheight - 16,
    };
    console.log(e);
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

  const mousecheck_up = (e?: any) => {
    window.removeEventListener("mousemove", mousecheck_move);
    window.removeEventListener("mouseup", mousecheck_up);
  };

  const touch_resize = (e: any) => {
    window.addEventListener("touchmove", touchcheck_move);
    window.addEventListener("touchend", touchcheck_end);
  };
  const touchcheck_move = (e: any) => {
    let cav = state.find((ele: any) => {
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
    const currentPosition = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY,
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
      onTouchStart={touch_resize}
      onMouseDown={mouse_resize}
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
export default CornerPoint;
