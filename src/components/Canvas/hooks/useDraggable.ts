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
      // .resizable({
      //   edges: { left: true, right: true, bottom: true, top: true },
      //   modifiers: [
      //     // keep the edges inside the parent
      //     interact.modifiers.restrictEdges({
      //       outer: "parent",
      //     }),
      //     interact.modifiers.aspectRatio({
      //       ratio: 1,
      //       modifiers: [interact.modifiers.restrictSize({ max: "parent" })],
      //     }),
      //     // minimum size
      //     interact.modifiers.restrictSize({
      //       min: { width: 100, height: 100 },
      //     }),
      //   ],
      //   inertia: true,
      // })
      .draggable({
        modifiers: [],
        inertia: false,
      })
      // .on("resizemove", (event) => {
      //   const width = event.rect.width.toString();
      //   const height = event.rect.height.toString();
      //   const x = event.deltaRect.left;
      //   const y = event.deltaRect.top;
      //   console.log(event.deltaRect);
      //   dispatch({
      //     type: RESIZE_CANVAS_OBJ,
      //     payload: { id: ele.id, width, height, x, y },
      //   });
      // })
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
