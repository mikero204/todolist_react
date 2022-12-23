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
  appwidth: Number;
  appheight: Number;
  padding: Number;
  topheight: Number;
  centerheight: Number;
  bottomheight: Number;
  innerCanvasWidth: Number;
  innerCanvasHeight: Number;
  Canvas_transformY: Number;
  Canvas_scale: Number;
  Canvas_obj_size: Number;
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

      newState.canvasObj_list.forEach((ele) => {
        ele.width = (Number(ele.width) * obj.Canvas_obj_size).toString();
        ele.height = (Number(ele.height) * obj.Canvas_obj_size).toString();
      });
      newState.canvas_params = { ...obj };
      return newState;
    }
    case "CANVAS_SCALE": {
      // let obj = action.payload;
      // let oldstate = state.canvas_params;
      // newState.canvas_params = { ...oldstate, ...obj };
      // return newState;
      let obj = action.payload;
      console.log(obj);
      let oldstate = state.canvas_params;
      const scale = obj.Canvas_scale;
      const width = (newState.canvas_params.innerCanvasWidth as any) * scale;
      const height = (newState.canvas_params.innerCanvasHeight as any) * scale;
      newState.canvas_params = {
        ...oldstate,
        ...obj,
        // innerCanvasWidth: Math.max(400, Math.min(width, 780)),
        // innerCanvasHeight: Math.max(300, Math.min(height, 580)),
        innerCanvasWidth: width,
        innerCanvasHeight: height,
      };

      const innerwidth = newState.canvas_params.innerCanvasWidth;
      const innerheight = newState.canvas_params.innerCanvasHeight;
      // if (
      //   innerwidth < 780 &&
      //   innerheight < 580 &&
      //   innerwidth > 400 &&
      //   innerheight > 300
      // ) {
      //   let w = Number(oldstate.innerCanvasWidth) - width;
      //   let h = Number(oldstate.innerCanvasHeight) - height;
      //   console.log(w);
      //   console.log(h);
      //   newState.canvasObj_list.forEach((ele) => {
      //     ele.width = (Number(ele.width) * scale).toString();
      //     ele.height = (Number(ele.height) * scale).toString();
      //     ele.x = ele.x * scale;
      //     ele.y = ele.y * scale;
      //   });
      // }
      let w = Number(oldstate.innerCanvasWidth) - width;
      let h = Number(oldstate.innerCanvasHeight) - height;
      // console.log(w);
      // console.log(h);
      newState.canvasObj_list.forEach((ele) => {
        ele.width = (Number(ele.width) * scale).toString();
        ele.height = (Number(ele.height) * scale).toString();
        // ele.x = ele.x * scale;
        // ele.y = ele.y * scale;
      });
      return newState;
    }
    default:
      return newState;
  }
};
