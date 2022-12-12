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
      return { todolist: [...newState.todolist] };
    case UPDATE_TODO:
      for (let i = 0; i < newState.todolist.length; i++) {
        if (newState.todolist[i].id === action.payload.id) {
          newState.todolist[i].id = action.payload.id
            ? action.payload.id
            : newState.todolist[i].id;
          newState.todolist[i].title = action.payload.title
            ? action.payload.title
            : newState.todolist[i].title;
          newState.todolist[i].status = action.payload.status
            ? action.payload.status
            : newState.todolist[i].status;
          newState.todolist[i].editable =
            action.payload.editable !== undefined
              ? action.payload.editable
              : newState.todolist[i].editable;
        }
      }
      return newState;
    case "UpdateT":
      newState.todolist.forEach((ele) => {
        if (ele.id === action.payload.id) {
          ele.title = action.payload.title;
          ele.editable = action.payload.editable;
        }
      });
      return newState;
    case DELETE_TODO:
      return newState;

    default:
      return newState;
  }
};
export const initState: todoState = {
  todolist: [],
};
