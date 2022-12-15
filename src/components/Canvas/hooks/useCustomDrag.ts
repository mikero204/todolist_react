import React, { useState, useEffect } from "react";
import interact from "interactjs";
import { useCanvasContext } from "../hooks/useCanvasContext";
import {
  ADD_CANVAS_OBJ,
  UPDATE_CANVAS_OBJ,
  DELETE_CANVAS_OBJ,
} from "../Constants";
export const useCustomDrag = () => {
  const [state, dispatch] = useCanvasContext();
  const interactiveRef = React.useRef(null);

  const enable = () => {
    interact(interactiveRef.current as unknown as HTMLElement).draggable({
      onstart: function (event) {
        const element = event.target.parentElement;

        const rect = element.getBoundingClientRect();

        // store the center as the element has css `transform-origin: center center`
        element.dataset.centerX = rect.left + rect.width / 2;
        element.dataset.centerY = rect.top + rect.height / 2;
        // get the angle of the element when the drag starts
        element.dataset.angle = getDragAngle(event);
      },
      onmove: function (event) {
        var element = event.target.parentElement;
        var angle = getDragAngle(event);

        const findele = state.find((ele: any) => {
          if (ele.id === element.dataset.id) {
            return ele;
          }
        });
        // console.log(angle);
        dispatch({
          type: UPDATE_CANVAS_OBJ,
          payload: {
            ...findele,
            rotate: angle,
          },
        });
      },
      onend: function (event) {
        var element = event.target.parentElement;

        // save the angle on dragend
        element.dataset.angle = getDragAngle(event);
      },
    });
  };

  React.useEffect(() => {
    enable();
  });

  return {
    ref: interactiveRef,
  };
};
function getDragAngle(event: any) {
  var element = event.target.parentElement;
  var startAngle = parseFloat(element.dataset.angle) || 0;
  var center = {
    x: parseFloat(element.dataset.centerX) || 0,
    y: parseFloat(element.dataset.centerY) || 0,
  };
  var angle = Math.atan2(center.y - event.clientY, center.x - event.clientX);

  return angle - startAngle;
}
