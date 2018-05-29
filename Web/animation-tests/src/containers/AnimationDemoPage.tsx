import * as React from 'react';
import {RouteComponentProps} from "react-router";
import AnimationDemoNotFound from "./AnimationNotFound";

import animationDemos from "../components/AnimationDemoDirectory";
import AnimationDemo from "../components/animationsDemos/AbstractAnimationDemo";

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
                {<p>{AnimationDemoType.displayName}</p>}
                <AnimationDemoType autoplay={true} />
            </>
        );
    }
}

export default AnimationDemoPage;