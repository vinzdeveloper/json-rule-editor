
import React from 'react';
import { render } from 'react-dom';
import ApplicationContainer from './containers/app/app-container';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';

const devToolEnhancer = process.env.NODE_ENV !== 'production' ? composeWithDevTools : compose;

const enhancer = devToolEnhancer(applyMiddleware(thunk));

const configureStore = () => {
    const store = createStore(reducers, enhancer);
    if (module.hot) {
        module.hot.accept('./reducers', () => {
            console.log("inside reducers listener");
            store.replaceReducer(reducers);
        });
    }
    return store;
}

// const store = createStore(reducers, enhancer);
const store = configureStore();

const component =
        <Provider store={store}>
            <ApplicationContainer />
        </Provider>

if (module.hot) {
    module.hot.accept('./containers/app/app-container.js', () => {
        console.log("inside components listener");
        render(component,  document.getElementById('root'));
    });
   // module.hot.accept();
}

render(component,  document.getElementById('root'));


