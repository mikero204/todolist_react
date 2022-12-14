import { CanvasContext } from "../context/CanvasContext";
import { useContext } from "react";
export function useCanvasContext() {
  const { state, dispatch } = useContext(CanvasContext);
  return [state, dispatch];
}
