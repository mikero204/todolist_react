import { useState, useEffect, useContext, useRef } from "react";
import interact from "interactjs";
import { useCanvasContext } from "../hooks/useCanvasContext";
import {
  ADD_CANVAS_OBJ,
  UPDATE_CANVAS_OBJ,
  DELETE_CANVAS_OBJ,
} from "../Constants";
export const useDraggable = (ele: any) => {
  // const [state, dispatch] = useCanvasContext();
  const interactiveRef = useRef(null);
  const [res_prop, setRes_Prop] = useState({ ...ele });
  const [isEnabled, setIsEnabled] = useState(true);
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
      .on("resizemove", (event) => {
        const width = event.rect.width.toString();
        const height = event.rect.height.toString();
        const target = event.target;
        const angle = target.dataset?.angle;
        target.style.width = width + "px";
        target.style.height = height + "px";
        setRes_Prop({
          x: target.style.x,
          y: target.style.y,
          width,
          height,
          rotate: angle,
        });
      })
      .on("dragmove", (event) => {
        const target = event.target;
        ele.x += event.dx;
        ele.y += event.dy;
        let width = target.style.width.replace("px", "");
        let height = target.style.height.replace("px", "");
        const angle = target.dataset?.angle;
        target.style.x = ele.x;
        target.style.y = ele.y;
        setRes_Prop({ width, height, x: ele.x, y: ele.y, rotate: angle });
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

  // useEffect(() => {
  //   if (interactiveRef.current && ele.active) {
  //     interact(interactiveRef.current as unknown as HTMLElement)
  //       .resizable({
  //         edges: { left: true, right: true, bottom: true, top: true },
  //         modifiers: [
  //           // keep the edges inside the parent
  //           interact.modifiers.restrictEdges({
  //             outer: "parent",
  //           }),
  //           interact.modifiers.aspectRatio({
  //             ratio: 1,
  //             modifiers: [interact.modifiers.restrictSize({ max: "parent" })],
  //           }),
  //           // minimum size
  //           interact.modifiers.restrictSize({
  //             min: { width: 100, height: 100 },
  //           }),
  //         ],
  //         inertia: true,
  //       })
  //       .draggable({
  //         modifiers: [],
  //         inertia: false,
  //       })
  //       .on("resizemove", (event) => {
  //         const width = event.rect.width.toString();
  //         const height = event.rect.height.toString();

  //         const findele = state.find((ele: any) => {
  //           if (ele.id === event.target.dataset.id) {
  //             return ele;
  //           }
  //         });

  //         dispatch({
  //           type: UPDATE_CANVAS_OBJ,
  //           payload: {
  //             ...findele,
  //             width: width,
  //             height: height,
  //           },
  //         });
  //       })
  //       .on("dragmove", (event) => {
  //         ele.x += event.dx;
  //         ele.y += event.dy;

  //         const findele = state.find((ele: any) => {
  //           if (ele.id === event.target.dataset.id) {
  //             return ele;
  //           }
  //         });

  //         dispatch({
  //           type: UPDATE_CANVAS_OBJ,
  //           payload: {
  //             ...findele,
  //             x: ele.x,
  //             y: ele.y,
  //           },
  //         });
  //       });
  //   } else if (interactiveRef.current && !ele.active) {
  //     interact(interactiveRef.current as unknown as HTMLElement).unset();
  //   }
  // });

  return {
    ref: interactiveRef,
    enable: () => setIsEnabled(true),
    disable: () => setIsEnabled(false),
    res_prop,
  };
};
