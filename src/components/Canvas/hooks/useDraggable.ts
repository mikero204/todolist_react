import { useState, useEffect, useContext, useRef } from "react";
import interact from "interactjs";
import { useCanvasContext } from "../hooks/useCanvasContext";
import {
  ADD_CANVAS_OBJ,
  UPDATE_CANVAS_OBJ,
  DELETE_CANVAS_OBJ,
} from "../Constants";
export const useDraggable = (ele: any) => {
  const [state, dispatch] = useCanvasContext();
  const interactiveRef = useRef(null);

  const enable = () => {
    interact(interactiveRef.current as unknown as HTMLElement)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: "parent",
          }),
          interact.modifiers.aspectRatio({
            ratio: 1,
            modifiers: [interact.modifiers.restrictSize({ max: "parent" })],
          }),
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 100, height: 100 },
          }),
        ],
        inertia: true,
      })
      .draggable({
        modifiers: [],
        inertia: false,
      })
      .on("touchstart", (event) => {
        event.preventDefault();
      })
      .on("mousedown", (event) => {
        event.preventDefault();
      })
      .on("mousemove", (event) => {
        // setBorder(true);
      })
      .on("mouseleave", (event) => {
        // setBorder(false);
      })
      .on("resizemove", (event) => {
        const width = event.rect.width.toString();
        const height = event.rect.height.toString();
        ele.width = width;
        ele.height = height;
        dispatch({
          type: UPDATE_CANVAS_OBJ,
          payload: {
            ...ele,
            width: width,
            height: height,
          },
        });
      })
      .on("dragmove", (event) => {
        ele.x += event.dx;
        ele.y += event.dy;
        dispatch({
          type: UPDATE_CANVAS_OBJ,
          payload: {
            id: ele.id,
            x: ele.x,
            y: ele.y,
            width: ele.width,
            height: ele.height,
          },
        });
      });
  };

  const disable = () => {
    interact(interactiveRef.current as unknown as HTMLElement).unset();
  };

  useEffect(() => {
    if (ele.active) {
      enable();
    } else {
      disable();
    }
    return disable;
  }, [ele.active]);

  return {
    ref: interactiveRef,
  };
};
