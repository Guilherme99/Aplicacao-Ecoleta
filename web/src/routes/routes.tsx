import React from 'react';

import {Route, BrowserRouter, Switch} from 'react-router-dom';
import Home from './../pages/Home';
import CreatePoint from './../pages/CreatePoint';
const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/CreatePoint" component={CreatePoint}/>
                {/* <Route path="/" exact component={}/> */}
            </Switch>
    
        </BrowserRouter>
    )
}

export default Routes;

