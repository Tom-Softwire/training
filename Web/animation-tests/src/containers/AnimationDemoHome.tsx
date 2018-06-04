import * as React from 'react';
import {ReactElement} from "react";
import {Link} from "react-router-dom";

import animationDemos from "../components/AnimationDemoDirectory";
import Header from "../components/Header";

class AnimationDemoHome extends React.Component<{}, {}> {
    public render() {
        const animationLinks: Array<ReactElement<Link>> = [];

        const animationDemosToShowByUrlKey = animationDemos.getAllByUrlKey();

        for (const animationName in animationDemosToShowByUrlKey) {
            if (animationDemosToShowByUrlKey.hasOwnProperty(animationName)) {
                const animation = animationDemosToShowByUrlKey[animationName];
                animationLinks.push(<Link to={`/animation/${animationName}`} key={animationName}>{animation.displayName}</Link>);
            }
        }

        return (
            <>
                <Header pageName="Animation Demos" />
                <main>
                    <p>
                        {animationLinks}
                    </p>
                </main>
            </>
        );
    }
}

export default AnimationDemoHome;