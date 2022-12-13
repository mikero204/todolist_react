export const combineReducers = (reducers: any) => {
  const reducerKeys: any = Object.keys(reducers);
  const reducerValues: any = Object.values(reducers);
  let globalState: any;
  reducerKeys.forEach((key: any, index: any) => {
    globalState = { ...globalState, [key]: reducerValues[index][1] };
  });
  let finalReducers: any = {};
  reducerValues.forEach((value: any, index: any) => {
    finalReducers = { ...finalReducers, [reducerKeys[index]]: value[0] };
  });
  return [
    (state: any, action: any) => {
      let hasStateChanged = false;
      const newState: any = {};
      let nextStateForCurrentKey = {};
      for (let i = 0; i < reducerKeys.length; i++) {
        const currentKey = reducerKeys[i];
        const currentReducer = finalReducers[currentKey];
        const prevStateForCurrentKey = state[currentKey];
        nextStateForCurrentKey = currentReducer(prevStateForCurrentKey, action);
        hasStateChanged =
          hasStateChanged || nextStateForCurrentKey !== prevStateForCurrentKey;
        newState[currentKey] = nextStateForCurrentKey;
      }
      return hasStateChanged ? newState : state;
    },
    globalState,
  ];
};
