import * as React from 'react';
import {RouteComponentProps} from "react-router";
import AnimationDemoNotFound from "./AnimationNotFound";

import animationDemos from "../components/AnimationDemoDirectory";
import AnimationDemo from "../components/animationsDemos/AbstractAnimationDemo";
import Header from "../components/Header";

interface IAnimationDemoPageRouteParams {
    animationName: string;
}

type IAnimationDemoPageProps = RouteComponentProps<IAnimationDemoPageRouteParams>

class AnimationDemoPage extends React.Component<IAnimationDemoPageProps, {}> {
    private animationName: string;

    constructor(props: IAnimationDemoPageProps) {
        super(props);

        this.animationName = this.props.match.params.animationName;
    }

    public render() {
        if (!animationDemos.doesExistByUrlKey(this.animationName)) {
            return <AnimationDemoNotFound animationDemoName={this.animationName}/>
        }

        const AnimationDemoType: typeof AnimationDemo = animationDemos.getByUrlKey(this.animationName);

        return (
            <>
                <Header pageName={AnimationDemoType.displayName} />
                <main>
                    <AnimationDemoType autoplay={true} />
                </main>
            </>
        );
    }
}

export default AnimationDemoPage;