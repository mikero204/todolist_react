import React, { useState, useEffect } from "react";
import interact from "interactjs";
import { ROTATE_CANVAS_OBJ } from "../Constants";
import { useCanvasContext } from "../hooks/useCanvasContext";
export const useCustomDrag = ({ ele }: any) => {
  const interactiveRef = React.useRef(null);
  const [state, dispatch] = useCanvasContext();
  const [isEnabled, setIsEnabled] = useState(true);

  const enable = () => {
    interact(interactiveRef.current as unknown as HTMLElement).draggable({
      onstart: function (event) {
        const element = event.target.parentElement;
        const rect = element.getBoundingClientRect();
        element.dataset.centerX = rect.left + rect.width / 2;
        element.dataset.centerY = rect.top + rect.height / 2;
        var startAngle;
        startAngle =
          parseFloat(element.dataset.angle) ||
          (parseFloat(ele.rotate) * Math.PI) / 180;

        var center = {
          x: parseFloat(element.dataset.centerX) || 0,
          y: parseFloat(element.dataset.centerY) || 0,
        };
        var angle = Math.atan2(
          center.y - event.clientY,
          center.x - event.clientX
        );
        element.dataset.angle = angle - startAngle;
      },
      onmove: function (event) {
        var angle = getDragAngle(event);
        dispatch({
          type: ROTATE_CANVAS_OBJ,
          payload: { id: ele.id, rotate: angle },
        });
      },
      onend: function (event) {
        var element = event.target.parentElement;
        // save the angle on dragend
        element.dataset.angle = getDragAngle(event);
      },
    });
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

  return {
    ref: interactiveRef,
    enable: enable,
    disable: disable,
  };
};
function getDragAngle(event: any) {
  var startAngle;
  var element = event.target.parentElement;
  startAngle = parseFloat(element.dataset.angle) || 0;
  var center = {
    x: parseFloat(element.dataset.centerX) || 0,
    y: parseFloat(element.dataset.centerY) || 0,
  };
  var angle = Math.atan2(center.y - event.clientY, center.x - event.clientX);
  return angle - startAngle;
}
