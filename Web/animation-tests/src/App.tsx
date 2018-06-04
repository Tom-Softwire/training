import * as React from 'react';
import {Route, Switch} from "react-router";

import './App.css';

import AnimationDemoHome from "./containers/AnimationDemoHome";
import AnimationDemoPage from "./containers/AnimationDemoPage";
import Home from "./containers/Home";
import MusicBrowser from "./containers/MusicBrowser";
import NotFound from "./containers/NotFound";
import VisualiserDemo from "./containers/VisualiserDemo";

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <Switch>
                    <Route exact={true} path="/" component={Home} />

                    <Route exact={true} path="/animation/" component={AnimationDemoHome} />
                    <Route path="/animation/:animationName" component={AnimationDemoPage} />

                    <Route exact={true} path="/music-browser/" component={MusicBrowser} />

                    <Route exact={true} path="/visualiser/" component={VisualiserDemo} />

                    <Route path="*" component={NotFound} />
                </Switch>
            </div>
        );
    }
}

export default App;
