import { useContext, useState } from "react";
import { todoContext } from "./context/todoContext";
import { UPDATE_TODO, DELETE_TODO } from "./reducer/constants";
export default function TodoItem() {
  let { todolist, dispatch } = useContext(todoContext);
  return (
    <div>
      <ul>
        {todolist.map((ele) => {
          if (ele.editable) {
            return <Todosub key={ele.id} id={ele.id} title={ele.title} />;
          } else {
            return (
              <li key={ele.id}>
                <span
                  onDoubleClick={() => {
                    dispatch({
                      type: UPDATE_TODO,
                      payload: { id: ele.id, editable: true },
                    });
                  }}
                >
                  {ele.title}
                </span>
                <button
                  onClick={() => {
                    console.log(123);
                    dispatch({ type: DELETE_TODO, payload: { id: ele.id } });
                  }}
                >
                  x
                </button>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}

function Todosub({ title, id }: any) {
  let { dispatch } = useContext(todoContext);
  const [title1, setTitle1] = useState(title);
  return (
    <li>
      <input
        type="text"
        defaultValue={title1}
        onChange={(e) => {
          setTitle1(e.target.value);
        }}
      />
      <button
        onClick={() => {
          dispatch({
            type: UPDATE_TODO,
            payload: { id, title: title1, editable: false },
          });
        }}
      >
        更新
      </button>
    </li>
  );
}
