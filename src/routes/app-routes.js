import React from 'react';
import {HashRouter, Switch, Route } from 'react-router-dom';
import HomeContainer from '../containers/home/home-container';

const AppRoutes = () => {

    return (<div className="main-container">
        <HashRouter>
            <Switch>
                <Route path="/" exact component={HomeContainer} />
            </Switch>   
        </HashRouter>
    </div>);

};

export default AppRoutes;