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
  useEffect(() => {
    if (interactiveRef.current && ele.active) {
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

        .on("resizemove", (event) => {
          const width = event.rect.width.toString();
          const height = event.rect.height.toString();

          const findele = state.find((ele: any) => {
            if (ele.id === event.target.dataset.id) {
              return ele;
            }
          });

          dispatch({
            type: UPDATE_CANVAS_OBJ,
            payload: {
              ...findele,
              width: width,
              height: height,
            },
          });
        })
        .on("dragmove", (event) => {
          ele.x += event.dx;
          ele.y += event.dy;

          const findele = state.find((ele: any) => {
            if (ele.id === event.target.dataset.id) {
              return ele;
            }
          });

          dispatch({
            type: UPDATE_CANVAS_OBJ,
            payload: {
              ...findele,
              x: ele.x,
              y: ele.y,
            },
          });
        });
    }

    return () => {
      interact(interactiveRef.current as unknown as HTMLElement).unset();
    };
  }, [ele.active]);

  return {
    ref: interactiveRef,
  };
};
