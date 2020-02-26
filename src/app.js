
import React from 'react';
import { render } from 'react-dom';
import AppContainer from './containers/app/app-container';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';

const devToolEnhancer = process.env.NODE_ENV !== 'production' ? composeWithDevTools : compose;

const enhancer = devToolEnhancer(applyMiddleware(thunk));

const store = createStore(reducers, enhancer);

const component = <Provider store={store}>
    <AppContainer />
</Provider>


render(component,  document.getElementById('root'));
