import { ADD_TODO, DELETE_TODO, UPDATE_TODO } from "./constants";
import uuid from "react-uuid";
type todoState = {
  todolist: todoItem[];
};

export interface todoItem {
  id: string;
  title: string;
  status: boolean;
  editable: boolean;
}

type todoAction = {
  type: string;
  payload: todoItem;
};

export const todoReducer = (
  state: todoState,
  action: todoAction
): todoState => {
  let newState: todoState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case ADD_TODO:
      let todo: todoItem = {
        id: uuid(),
        title: action.payload.title,
        status: true,
        editable: false,
      };
      newState.todolist.push(todo);
      return { ...newState, todolist: [...newState.todolist] };
    case UPDATE_TODO:
      const update_ele = newState.todolist.find(
        (ele) => ele.id === action.payload.id
      );
      if (update_ele) {
        update_ele.status =
          action.payload.status === undefined
            ? update_ele.status
            : action.payload.status;
        update_ele.title =
          action.payload.title === undefined
            ? update_ele.title
            : action.payload.title;
        update_ele.editable =
          action.payload.editable === undefined
            ? update_ele.editable
            : action.payload.editable;
      }
      return { ...newState, todolist: [...newState.todolist] };
    case DELETE_TODO:
      const idx = newState.todolist.findIndex(
        (ele) => ele.id === action.payload.id
      );
      newState.todolist.splice(idx, 1);
      return newState;
    default:
      return newState;
  }
};
export const initState: todoState = {
  todolist: [],
};
