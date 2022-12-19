// @ts-nocheck
import { useState, useEffect, useContext, useRef } from "react";
import interact from "interactjs";
import { useCanvasContext } from "../hooks/useCanvasContext";
import {
  ADD_CANVAS_OBJ,
  UPDATE_CANVAS_OBJ,
  DELETE_CANVAS_OBJ,
  CHANGE_ACTIVE,
  RESIZE_CANVAS_OBJ,
  MOVE_CANVAS_OBJ,
  ROTATE_CANVAS_OBJ,
} from "../Constants";
export const useDraggable = (ele: any) => {
  const [state, dispatch] = useCanvasContext();
  const interactiveRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const enable = () => {
    interact(interactiveRef.current as unknown as HTMLElement)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
          // keep the edges inside the parent
          // interact.modifiers.restrictEdges({
          //   outer: "parent",
          // }),
          // interact.modifiers.aspectRatio({
          //   ratio: 1,
          //   modifiers: [interact.modifiers.restrictSize({ max: "parent" })],
          // }),
          // // minimum size
          // interact.modifiers.restrictSize({
          //   min: { width: 100, height: 100 },
          // }),
        ],
        inertia: true,
      })
      .draggable({
        modifiers: [],
        inertia: false,
      })
      .on("resizemove", (event) => {
        var target = event.target;
        let width = Number(target.style.width.replace("px", ""));
        let height = Number(target.style.height.replace("px", ""));
        // window.addEventListener("mousedown", (e) => {
        //   console.log(e.clientX, e.clientY);
        // });
        width++;
        height++;
        const rotatedA = rotate(
          200,
          200,
          200 + width / 2,
          200 + height / 2,
          angleToRadian(-45)
        ); // calculate A'
        // console.log(rotatedA);
        const rotatedB = rotate(
          rotatedA[0],
          rotatedA[1],
          200 + width / 2,
          200 + height / 2,
          angleToRadian(45)
        );
        console.log(rotatedB);

        target.style.width = width + "px";
        target.style.height = height + "px";
        target.style.transform =
          "translate(" +
          rotatedB[0] +
          "px," +
          rotatedB[1] +
          "px)  rotate(45deg)";

        // dispatch({
        //   type: RESIZE_CANVAS_OBJ,
        //   payload: { id: ele.id, width, height },
        // });
      })
      .on("dragmove", (event) => {
        dispatch({
          type: MOVE_CANVAS_OBJ,
          payload: { id: ele.id, x: event.dx, y: event.dy },
        });
      });
  };
  const disable = () => {
    interact(interactiveRef.current as unknown as HTMLElement).unset();
  };
  useEffect(() => {
    if (isEnabled) {
      enable();
    } else {
      disable();
    }
    return disable;
  }, [isEnabled]);

  useEffect(() => {
    if (!ele.active) {
      disable();
    } else {
      enable();
    }
  }, [ele.active]);

  return {
    ref: interactiveRef,
    enable: () => setIsEnabled(true),
    disable: () => setIsEnabled(false),
  };
};

function rotate(x: any, y: any, cx: any, cy: any, angle?: any) {
  return [
    (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle) + cx,
    (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle) + cy,
  ];
}

function angleToRadian(angle) {
  return (angle * Math.PI) / 180;
}
