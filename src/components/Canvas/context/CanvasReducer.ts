import {
  ADD_CANVAS_OBJ,
  UPDATE_CANVAS_OBJ,
  DELETE_CANVAS_OBJ,
  CHANGE_ACTIVE,
  RESIZE_CANVAS_OBJ,
  MOVE_CANVAS_OBJ,
  ROTATE_CANVAS_OBJ,
} from "../Constants";
import type { canvasObj } from "./CanvasContext";
export type canvasStateType = {
  canvasObj_list: canvasObj[];
};

type canvasActionType = {
  type: string;
  payload: any;
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
      // console.log(obj);
      // console.log(newState);
      newState.canvasObj_list.forEach((element) => {
        if (element.id === obj.id) {
          element.x = obj.x;
          element.y = obj.y;
          element.width = obj.width;
          element.height = obj.height;
          if (obj.rotate) {
            element.rotate = obj.rotate;
          }
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
    case RESIZE_CANVAS_OBJ: {
      let obj = action.payload;
      const { id, width, height, x, y } = obj;
      newState.canvasObj_list.forEach((ele) => {
        if (ele.id === id) {
          ele.width = width;
          ele.height = height;
          ele.x += x;
          ele.y += y;
        }
      });
      return newState;
    }
    case MOVE_CANVAS_OBJ: {
      let obj = action.payload;
      const { id, x, y } = obj;
      newState.canvasObj_list.forEach((ele) => {
        if (ele.id === id) {
          ele.x += x;
          ele.y += y;
        }
      });
      return newState;
    }
    case ROTATE_CANVAS_OBJ: {
      let obj = action.payload;
      const { id, rotate } = obj;
      // console.log(rotate);
      newState.canvasObj_list.forEach((ele) => {
        if (ele.id === id) {
          ele.rotate = rotate;
        }
      });
      return newState;
    }
    case "CORNER_LEFTTOP_RESIZE": {
      let obj = action.payload;
      const { id, x, y } = obj;
      newState.canvasObj_list.forEach((ele) => {
        if (ele.id === id) {
          ele.x = ele.x - 0.5;
          ele.y = ele.y - 0.5;
          ele.width = (Number(ele.width) + 0.5).toString();
          ele.height = (Number(ele.height) + 0.5).toString();
        }
      });
      return newState;
    }
    case "CORNER_CLICK": {
      let obj = action.payload;
      const { id } = obj;
      // console.log(rotate);
      newState.canvasObj_list.forEach((ele) => {
        if (ele.id === id) {
          ele.resizing = true;
        }
      });
      return newState;
    }
    default:
      return newState;
  }
};
