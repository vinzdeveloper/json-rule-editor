
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import configureStore from './store';
import { Provider } from 'react-redux';
import ApplicationContainer from './containers/app/app-container';


const store = configureStore();

const component = (Root) =>
        render(<AppContainer>
            <Provider store={store}>
                <Root />
            </Provider>
        </AppContainer>, document.getElementById('root'));


component(ApplicationContainer);

if (module.hot) {
    module.hot.accept('./containers/app/app-container.js', () => {
    component(ApplicationContainer);
    });
}




