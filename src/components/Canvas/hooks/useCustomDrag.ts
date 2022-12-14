import React, { useState, useEffect } from "react";
import interact from "interactjs";

export const useCustomDrag = () => {
  const interactiveRef = React.useRef(null);

  const enable = () => {
    interact(interactiveRef.current as unknown as HTMLElement).draggable({
      onstart: function (event) {
        var box = event.target.parentElement;
        var rect = box.getBoundingClientRect();
        box.setAttribute("data-center-x", rect.left + rect.width / 2);
        box.setAttribute("data-center-y", rect.top + rect.height / 2);
        box.setAttribute("data-angle", getDragAngle(event));
      },
      onmove: function (event) {
        var box = event.target.parentElement;

        var pos = {
          x: parseFloat(box.getAttribute("data-x")) || 0,
          y: parseFloat(box.getAttribute("data-y")) || 0,
        };

        var angle = getDragAngle(event);

        // update transform style on dragmove
        box.style.transform =
          "translate(" +
          pos.x +
          "px, " +
          pos.y +
          "px) rotate(" +
          angle +
          "rad" +
          ")";
      },
      onend: function (event) {
        var box = event.target.parentElement;

        // save the angle on dragend
        box.setAttribute("data-angle", getDragAngle(event));
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
  var box = event.target.parentElement;
  var startAngle = parseFloat(box.getAttribute("data-angle")) || 0;
  var center = {
    x: parseFloat(box.getAttribute("data-center-x")) || 0,
    y: parseFloat(box.getAttribute("data-center-y")) || 0,
  };
  var angle = Math.atan2(center.y - event.clientY, center.x - event.clientX);

  return angle - startAngle;
}
