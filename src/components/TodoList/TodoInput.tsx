import { useContext, useState } from "react";
import { todoContext } from "./context/todoContext";
import { ADD_TODO } from "./reducer/constants";
export default function TodoInput() {
  let { dispatch } = useContext(todoContext);
  let [title, setTitle] = useState("");
  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <button
        onClick={() => {
          dispatch({ type: ADD_TODO, payload: { title: title } });
        }}
      >
        send
      </button>
    </div>
  );
}
