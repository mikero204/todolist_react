import { useReducer } from "react";
import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";
import { todoContext } from "./context/todoContext";
import { todoReducer, initState } from "./reducer/todoReducer";
import "./index.scss";
export default () => {
  const [state, dispatch] = useReducer(todoReducer, initState);
  return (
    <todoContext.Provider
      value={{ todolist: state!.todolist, dispatch: dispatch }}
    >
      <div className="container">
        <TodoInput />
        <TodoItem />
      </div>
    </todoContext.Provider>
  );
};
