import { createContext } from "react";
import type { todoItem } from "./../reducer/todoReducer";
export const initState: initContext = {
  todolist: [],
  dispatch: () => {},
};

type initContext = {
  todolist: todoItem[];
  dispatch: React.Dispatch<any>;
};

export const todoContext = createContext<initContext>(initState);
