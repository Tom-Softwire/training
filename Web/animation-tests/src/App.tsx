import * as React from 'react';
import {Route, Switch} from "react-router";

import './App.css';

import Header from "./components/Header";
import AnimationDemoHome from "./containers/AnimationDemoHome";
import AnimationDemoPage from "./containers/AnimationDemoPage";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <Header />
                <Switch>
                    <Route exact={true} path="/" component={Home} />
                    <Route exact={true} path="/animation/" component={AnimationDemoHome} />
                    <Route path="/animation/:animationName" component={AnimationDemoPage} />

                    <Route path="*" component={NotFound} />
                </Switch>
            </div>
        );
    }
}

export default App;
