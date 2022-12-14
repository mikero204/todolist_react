import {
  ADD_CANVAS_OBJ,
  UPDATE_CANVAS_OBJ,
  DELETE_CANVAS_OBJ,
  CHANGE_ACTIVE,
} from "../Constants";
import uuid from "react-uuid";
import type { canvasObj } from "./CanvasContext";
export type canvasStateType = {
  canvasObj_list: canvasObj[];
};

type canvasActionType = {
  type: string;
  payload: canvasObj;
};

export const CanvasReducer = (
  state: canvasStateType,
  action: canvasActionType
): canvasStateType => {
  let newState: canvasStateType = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case ADD_CANVAS_OBJ:
      return newState;
    case UPDATE_CANVAS_OBJ: {
      let obj = action.payload;
      newState.canvasObj_list.forEach((element) => {
        if (element.id === obj.id) {
          element.x = obj.x;
          element.y = obj.y;
          element.width = obj.width;
          element.height = obj.height;
        }
      });
      return newState;
    }
    case DELETE_CANVAS_OBJ:
      return newState;
    case CHANGE_ACTIVE: {
      let obj = action.payload;
      newState.canvasObj_list.forEach((element) => {
        if (element.id !== obj.id) {
          element.active = false;
        } else {
          element.active = true;
        }
      });
      return newState;
    }
    default:
      return newState;
  }
};
