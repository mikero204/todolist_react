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

        // const cx = 0 + width / 2;
        // const cy = 50 + height / 2;
        const rotatedA = rotate(50, 50, 50 + 200, 50 + 200, 0); // calculate A'
        console.log(rotatedA);
        // width += 1;
        // height += 1;
        // let newCenter = [rotatedA[0] / 2, rotatedA[1]  / 2];
        const newTopLeft = rotate(
          rotatedA[0],
          rotatedA[1],
          250,
          250,
          45 * (Math.PI / 180)
        );
        console.log(newTopLeft);
        // console.log(newTopLeft);
        // target.style.transform =
        //   "translate(" +
        //   newTopLeft[0] +
        //   "px," +
        //   newTopLeft[1] +
        //   "px) rotate(45deg)";
        // target.style.width = width + "px";
        // target.style.height = height + "px";

        // target.style.width = event.rect.width + "px";
        // target.style.height = event.rect.height + "px";
        // target.style.transform = "translate(" + x + "px," + y + "px)";

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
