import { useReducer } from "react";
import { combineReducers } from "./utils";
import Canvas from "./components/Canvas";
import "./index.scss";
function App() {
  // const [combinReducer, combinState] = combineReducers({
  //   app: [appReducer, appinitState],
  //   ta: [taReducer, tainitState],
  // });
  // const [state, dispatch] = useReducer(combinReducer, combinState);

  return (
    <div className="App">
      <Canvas />
    </div>
  );
}

export default App;

// const appReducer = (state: any, action: any) => {
//   switch (action.type) {
//     case "ACTION_A":
//       return { ...state, name: "Puli" };
//     default:
//       return state;
//   }
// };

// const taReducer = (state: any, action: any) => {
//   switch (action.type) {
//     case "ACTION_A":
//       return { ...state, name: "Puli" };
//     default:
//       return state;
//   }
// };

// const appinitState = {
//   name: "appinitState",
// };

// const tainitState = {
//   name: "tainitState",
// };
