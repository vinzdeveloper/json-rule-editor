import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const devToolEnhancer = process.env.NODE_ENV !== 'production' ? composeWithDevTools : compose;

const enhancer = devToolEnhancer(applyMiddleware(thunk));

 export default () => {
    const store = createStore(reducers, enhancer);
    if (module.hot) {
        module.hot.accept('./reducers', () => {
            store.replaceReducer(reducers);
        });
    }
    return store;
}