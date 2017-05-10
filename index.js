/*
 * Utils
 */
const log = x => (console.log(x), x)
const ext = (a, b) => Object.assign({}, a, b)

/*
 * Framework
 */

const step = lastApp => action =>
  action && app(ext(lastApp, {action})) || lastApp

const app = ({state, action, effects, reducer}) => {

  /* this is what redux does */
  const newState = reducer({state, action})
  const dispatch = step({state: newState, effects, reducer})

  /* this is what sagas and thunks attempt at fixing */
  effects.map( e => e({state: newState, dispatch}) )
}

/*
 * Reducers
 */

const reducer = ({state, action}) => {
  if (action.type == "ADD") {
    return ext(state, {
      counter: state.counter + action.payload
    })
  }
  return state
}

/*
 * Effects
 */

const render = () => {

  let next
  document.addEventListener('click', () => next({
    type: "ADD",
    payload: 1
  }))

  return ({state, dispatch}) => {
    next = dispatch
    document.body.innerText = state.counter
  }
}

const stateLogger = ({state}) => console.log(state)

const incrementLater = ({state, dispatch}) => {
  if(state.counter % 2 == 0) {
    setTimeout( _ => {
      dispatch({ type: "ADD", payload: 1 })
    }, 1300)
  }
}


/*
 * Initial State
 */

const initialState = {
  counter: 0
}

const initialAction = {
  type: "ADD",
  payload: 0
}

/*
 * Bootstrap
 */

app({
  state: initialState,
  action: initialAction,
  reducer,
  effects: [ render(), stateLogger, alertMeLater ],
})
