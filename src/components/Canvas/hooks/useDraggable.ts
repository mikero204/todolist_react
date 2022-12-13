import React from "react";
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
  color: string;
  lock: boolean;
};

export const useDraggable = (position: DraggableObj) => {
  const [elementPosition, setElementPosition] = React.useState<DraggableObj>({
    ...position,
  });

  const [isEnabled, setIsEnabled] = React.useState<boolean>(true);

  const interactiveRef = React.useRef(null);

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
  } = elementPosition;

  const enable = () => {
    interact(interactiveRef.current as unknown as HTMLElement)
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
      .on("touchend", (event) => {
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
          active: true,
          color,
          lock,
        });
      })
      .on("mouseup", (event) => {
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
          active: true,
          color,
          lock,
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
          active: true,
          color,
          lock,
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
      transform: `translate3D(${elementPosition.x}px, ${elementPosition.y}px, 0)`,
      width: `${elementPosition.width}px`,
      height: `${elementPosition.height}px`,
      position: "absolute" as React.CSSProperties["position"],
      touchAction: "none",
      border: elementPosition.active ? "1px solid red" : "",
    },
    position: elementPosition,
    isEnabled,
    enable: () => setIsEnabled(true),
    disable: () => setIsEnabled(false),
  };
};
