import React, { useState, useEffect } from "react";
import interact from "interactjs";

export type DraggableObj = {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zindex: number;
  rotate: number;
  img: string;
  active: boolean;
  mouse_event_active: boolean;
  color: string;
  lock: boolean;
};

export const useDraggable = (position: DraggableObj) => {
  const [elementPosition, setElementPosition] = React.useState<DraggableObj>({
    ...position,
  });
  const [border, setBorder] = useState(false);
  const [isEnabled, setIsEnabled] = React.useState<boolean>(false);

  const interactiveRef = React.useRef(null);
  useEffect(() => {
    if (position.active) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [position.active]);

  let {
    id,
    name,
    x,
    y,
    width,
    height,
    zindex,
    rotate,
    img,
    active,
    color,
    lock,
    mouse_event_active,
  } = elementPosition;

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
        setBorder(true);
      })
      .on("mouseleave", (event) => {
        setBorder(false);
      })
      .on("resizemove", (event) => {
        var target = event.target;

        // update the element's style
        target.style.width = event.rect.width + "px";
        target.style.height = event.rect.height + "px";
        width = target.style.width;
        height = target.style.height;
        setElementPosition({
          id,
          name,
          x,
          y,
          width: event.rect.width,
          height: event.rect.height,
          zindex,
          rotate,
          img,
          active,
          color,
          lock,
          mouse_event_active,
        });
      })
      .on("dragmove", (event) => {
        x += event.dx;
        y += event.dy;
        setElementPosition({
          id,
          name,
          x,
          y,
          width,
          height,
          zindex,
          rotate,
          img,
          active,
          color,
          lock,
          mouse_event_active,
        });
      });
  };

  const disable = () => {
    interact(interactiveRef.current as unknown as HTMLElement).unset();
  };

  React.useEffect(() => {
    if (isEnabled) {
      enable();
    } else {
      disable();
    }
    return disable;
  }, [isEnabled]);

  return {
    ref: interactiveRef,
    style: {
      transform: `translate3D(${elementPosition.x}px, ${elementPosition.y}px, 0) rotate(${elementPosition.rotate}deg)`,
      width: `${elementPosition.width}px`,
      height: `${elementPosition.height}px`,
      position: "absolute" as React.CSSProperties["position"],
      touchAction: "none",
      border: border ? "2px solid #8b3dff" : "",
    },
    img: elementPosition.img,
    position: elementPosition,
    isEnabled,
    enable: () => setIsEnabled(true),
    disable: () => setIsEnabled(false),
  };
};
