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
      // .resizable({
      //   edges: { left: true, right: true, bottom: true, top: true },
      //   modifiers: [],
      //   square: true,
      //   invert: "reposition",
      // })
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
          }),
        ],
        inertia: true,
        // autoScroll: true,
      })
      .styleCursor(false)
      .on(
        "dragmove",
        (event) => {
          dispatch({
            type: MOVE_CANVAS_OBJ,
            payload: { id: ele.id, x: event.dx, y: event.dy },
          });
        },
        false
      );
  };
  const disable = () => {
    if (interactiveRef.current) {
      interact(interactiveRef.current as unknown as HTMLElement).unset();
    }
  };
  useEffect(() => {
    if (isEnabled) {
      enable();
    } else {
      disable();
    }
    return disable;
  }, [isEnabled]);

  // useEffect(() => {
  //   if (!ele.active) {
  //     disable();
  //   } else {
  //     disable();
  //     enable();
  //   }
  // }, [ele.active]);

  return {
    ref: interactiveRef,
    enable: () => setIsEnabled(true),
    disable: () => setIsEnabled(false),
  };
};
