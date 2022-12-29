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
  main_width: number;
  main_height: number;
  main_footer_width: number;
  main_footer_height: number;
  paper_padding: number;
  rate: number;
  paper_width: number;
  paper_height: number;
  scale: number;
  transform_x: number;
  transform_y: number;
  screen_width: number;
  screen_height: number;
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
      let { pointX, pointY } = obj;
      switch (obj.action) {
        case "ADD": {
          let clac_width = Math.min(
            newState.canvas_params.paper_width * 1.1,
            1600
          );
          let clac_height = Math.min(
            newState.canvas_params.paper_height * 1.1,
            1200
          );
          newState.canvas_params.paper_width = clac_width;
          newState.canvas_params.paper_height = clac_height;
          newState.canvas_params.transform_x +=
            Math.floor(pointX / 1.1) - pointX;
          newState.canvas_params.transform_y +=
            Math.floor(pointY / 1.1) - pointY;
          break;
        }
        case "REDUCE": {
          let clac_width = Math.max(
            newState.canvas_params.screen_width,
            newState.canvas_params.paper_width / 1.1
          );
          let clac_height = Math.max(
            newState.canvas_params.screen_height,
            newState.canvas_params.paper_height / 1.1
          );
          newState.canvas_params.paper_width = clac_width;
          newState.canvas_params.paper_height = clac_height;
          if (clac_width !== newState.canvas_params.screen_width) {
            newState.canvas_params.transform_x -=
              Math.floor(pointX / 1.1) - pointX;
            newState.canvas_params.transform_y -=
              Math.floor(pointY / 1.1) - pointY;
          }

          break;
        }
      }
      return newState;
    }
    case "CANVAS_SCALE_POINT": {
      let obj = action.payload;
      let { pointX, pointY } = obj;
      switch (obj.action) {
        case "ADD": {
          let clac_width = Math.min(
            newState.canvas_params.paper_width * 1.01,
            1600
          );
          let clac_height = Math.min(
            newState.canvas_params.paper_height * 1.01,
            1200
          );
          newState.canvas_params.paper_width = clac_width;
          newState.canvas_params.paper_height = clac_height;
          newState.canvas_params.transform_x +=
            Math.floor(pointX / 1.01) - pointX;
          newState.canvas_params.transform_y +=
            Math.floor(pointY / 1.01) - pointY;
          break;
        }
        case "REDUCE": {
          let clac_width = Math.max(
            newState.canvas_params.screen_width,
            newState.canvas_params.paper_width / 1.01
          );
          let clac_height = Math.max(
            newState.canvas_params.screen_height,
            newState.canvas_params.paper_height / 1.01
          );
          newState.canvas_params.paper_width = clac_width;
          newState.canvas_params.paper_height = clac_height;
          if (clac_width !== newState.canvas_params.screen_width) {
            newState.canvas_params.transform_x -=
              Math.floor(pointX / 1.01) - pointX;
            newState.canvas_params.transform_y -=
              Math.floor(pointY / 1.01) - pointY;
          }

          break;
        }
      }
      return newState;
    }
    case "CANVAS_TRANSFORM": {
      let {
        appheight,
        header_height,
        transform_x,
        transform_y,
        paper_width,
        paper_height,
        screen_width,
      } = newState.canvas_params;
      let { x, y } = action.payload;

      if (x > 0) {
        //passive
        newState.canvas_params.transform_x = Math.min(transform_x + x, 0);
      } else if (x < 0) {
        //negative
        newState.canvas_params.transform_x = Math.max(
          transform_x + x,
          screen_width - paper_width
        );
      }
      if (y > 0) {
        //passive
        newState.canvas_params.transform_y = Math.min(
          transform_y + y,
          (appheight / 2 + header_height) / 2
        );
      } else if (y < 0) {
        //negative
        newState.canvas_params.transform_y = Math.max(
          transform_y + y,
          appheight / 2 + header_height - paper_height
        );
      }
      return newState;
    }
    default:
      return newState;
  }
};
