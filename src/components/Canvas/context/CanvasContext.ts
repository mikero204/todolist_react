import { createContext } from "react";

export const initState: initContext = {
  state: [],
  dispatch: () => {},
};

type initContext = {
  state: any;
  dispatch: React.Dispatch<any>;
};
export type canvasObj = {
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
  lock: boolean;
  color?: string;
  resizing?: boolean;
  tl?: any;
  tr?: any;
  bl?: any;
  br?: any;
};

export const CanvasContext = createContext<initContext>(initState);
