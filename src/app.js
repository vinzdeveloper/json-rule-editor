
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import MainContainer from './containers/app/main-container';
import configureStore from './store';
import { Provider } from 'react-redux';


const store = configureStore();

const component = (Root) =>
        render(<AppContainer>
            <Provider store={store}>
                <Root />
            </Provider>
        </AppContainer>, document.getElementById('root'));


component(MainContainer);

if (module.hot) {
    module.hot.accept('./containers/app/main-container.js', () => {
    component(MainContainer);
    });
}




