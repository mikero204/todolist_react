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
        square: true,
        invert: "reposition",
      })
      .draggable({
        modifiers: [],
        inertia: false,
      })
      .on("resizemove", (event) => {})
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
function getTranslateXY(element) {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    translateX: matrix.m41,
    translateY: matrix.m42,
  };
}
