import {createStore,compose, applyMiddleware} from 'redux'
import reducer from '../reducer'
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension'

// export default ()=>createStore(reducer,composeWithDevTools())

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
	applyMiddleware(thunk)
));

export default store;