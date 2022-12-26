import {
  ADD_CANVAS_OBJ,
  UPDATE_CANVAS_OBJ,
  DELETE_CANVAS_OBJ,
  CHANGE_ACTIVE,
  RESIZE_CANVAS_OBJ,
  RESET,
  MOVE_CANVAS_OBJ,
  ROTATE_CANVAS_OBJ,
  DELETE_OBJ,
  COPY_OBJ,
  CORNER_RESIZE,
  CANVAS_PARAMS,
} from "../Constants";
import uuid from "react-uuid";
import type { canvasObj } from "./CanvasContext";
export type canvasStateType = {
  canvasObj_list: canvasObj[];
  canvas_params: canvas_paramsType;
};
type canvas_paramsType = {
  appwidth: number;
  appheight: number;
  header_width: number;
  header_height: number;
  tool_view_width: number;
  tool_view_height: number;
  canvas_width: number;
  canvas_topheight: number;
  canvas_centerheight: number;
  canvas_bottomheight: number;
  canvas_scale: number;
  canvas_paper_width: number;
  canvas_paper_height: number;
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
    case RESET:
      newState.canvasObj_list = [];
      newState.canvasObj_list.push(action.payload);
      return newState;
    case ADD_CANVAS_OBJ:
      return newState;
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
    case UPDATE_CANVAS_OBJ: {
      let obj = action.payload;
      let findobj = state.canvasObj_list.find((element) => {
        return element.id === obj.id;
      }) as any;
      findobj[obj.name] = obj;
      // console.log(findobj);
      return state;
    }
    case MOVE_CANVAS_OBJ: {
      let obj = action.payload;
      const { id, x, y } = obj;
      newState.canvasObj_list.forEach((ele) => {
        if (ele.id === id) {
          ele.active = true;
          ele.x += x;
          ele.y += y;
        } else {
          ele.active = false;
        }
      });
      return newState;
    }
    case ROTATE_CANVAS_OBJ: {
      let obj = action.payload;
      const { id, rotate } = obj;
      newState.canvasObj_list.forEach((ele) => {
        if (ele.id === id) {
          ele.rotate = (rotate * 180) / Math.PI;
        }
      });
      return newState;
    }
    case CORNER_RESIZE: {
      let obj = action.payload;
      const { id, x, y, width, height } = obj;
      newState.canvasObj_list.forEach((ele) => {
        if (ele.id === id) {
          ele.x = x;
          ele.y = y;
          ele.width = width.toString();
          ele.height = height.toString();
        }
      });
      return newState;
    }
    case COPY_OBJ: {
      let obj = action.payload;
      const { id } = obj;
      const findobj = newState.canvasObj_list.find((ele) => {
        return ele.id === id;
      });

      let newobj = {
        ...findobj,
        id: uuid(),
        x: findobj!.x + 30,
        y: findobj!.y + 30,
        // active: false,
      } as canvasObj;
      findobj!.active = false;
      newState.canvasObj_list.push(newobj);
      return newState;
    }
    case DELETE_OBJ: {
      let obj = action.payload;
      const { id } = obj;
      const findobjIndex = newState.canvasObj_list.findIndex((ele) => {
        return ele.id === id;
      });

      newState.canvasObj_list.splice(findobjIndex, 1);
      return newState;
    }
    case CANVAS_PARAMS: {
      let obj = action.payload;
      newState.canvas_params = { ...obj };
      return newState;
    }
    case "CANVAS_SCALE": {
      let obj = action.payload;
      switch (obj.action) {
        case "add": {
          let check = newState.canvas_params.canvas_scale < 500 ? true : false;
          if (check) {
            newState.canvas_params.canvas_scale = Math.min(
              Math.floor(newState.canvas_params.canvas_scale * 1.2),
              500
            );
          } else {
            newState.canvas_params.canvas_scale = 500;
          }
          newState.canvas_params.canvas_paper_width =
            (800 * newState.canvas_params.canvas_scale) / 100;
          newState.canvas_params.canvas_paper_height =
            (600 * newState.canvas_params.canvas_scale) / 100;
          break;
        }

        case "reduce": {
          let check = newState.canvas_params.canvas_scale > 10 ? true : false;
          if (check) {
            newState.canvas_params.canvas_scale = Math.max(
              Math.floor(newState.canvas_params.canvas_scale * 0.8),
              10
            );
          } else {
            newState.canvas_params.canvas_scale = 10;
          }

          newState.canvas_params.canvas_paper_width =
            (800 * newState.canvas_params.canvas_scale) / 100;
          newState.canvas_params.canvas_paper_height =
            (600 * newState.canvas_params.canvas_scale) / 100;
          break;
        }
      }

      return newState;
    }
    default:
      return newState;
  }
};
