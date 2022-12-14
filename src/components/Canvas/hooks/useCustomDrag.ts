import React, { useState, useEffect } from "react";
import interact from "interactjs";

export const useCustomDrag = () => {
  const interactiveRef = React.useRef(null);
  const [isEnabled, setIsEnabled] = useState(true);

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
        const x = element.dataset.x;
        const y = element.dataset.y;
        element.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
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
  var element = event.target.parentElement;
  var startAngle = parseFloat(element.dataset.angle) || 0;
  var center = {
    x: parseFloat(element.dataset.centerX) || 0,
    y: parseFloat(element.dataset.centerY) || 0,
  };
  var angle = Math.atan2(center.y - event.clientY, center.x - event.clientX);

  return angle - startAngle;
}
