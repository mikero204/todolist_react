import TodoList from "./components/TodoList/Index";
import { useReducer } from "react";
import { combineReducers } from "./utils";
function App() {
  const [combinReducer, combinState] = combineReducers({
    app: [appReducer, appinitState],
    ta: [taReducer, tainitState],
  });
  const [state, dispatch] = useReducer(combinReducer, combinState);
  console.log(dispatch);
  const test = (v: string) => {
    console.log(v);
  };
  return (
    <div className="App">
      <TodoList onChange={test} />
    </div>
  );
}

export default App;

const appReducer = (state: any, action: any) => {
  switch (action.type) {
    case "ACTION_A":
      return { ...state, name: "Puli" };
    default:
      return state;
  }
};

const taReducer = (state: any, action: any) => {
  switch (action.type) {
    case "ACTION_A":
      return { ...state, name: "Puli" };
    default:
      return state;
  }
};

const appinitState = {
  name: "appinitState",
};

const tainitState = {
  name: "tainitState",
};
