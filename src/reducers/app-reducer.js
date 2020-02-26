
const initialState = {
    name: 'loading',
}

const AppReducer = (state=initialState, payload) => {
  const type = payload.type;
  switch(type) {
    case 'TEST':
      return state;
    default:
      return state;
  }
}

export default AppReducer;