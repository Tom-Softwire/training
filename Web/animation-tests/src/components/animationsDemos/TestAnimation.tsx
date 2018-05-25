import * as React from 'react';
import {RefObject} from "react";
import AnimationDemo, {IAnimationDemoProps, IAnimationTickInstanceDetails} from "./AbstractAnimationDemo";

import './TestAnimation.css';

import AnimatableCircle from "./components/Circle";

class TestAnimation extends AnimationDemo {
    public static displayName = 'Test Animation';

    private testCircle: RefObject<AnimatableCircle>;

    constructor(props: IAnimationDemoProps) {
        super(props);

        this.testCircle = React.createRef<AnimatableCircle>();
    }

    public componentDidMount() {
        if (this.props.playOnMount) {
            this.play();
        }
    }

    public render() {
        return (
            <div className="test-animation">
                <svg>
                    <AnimatableCircle ref={this.testCircle} initialCenterPos={{x: 20, y: 20}} initialRadius={10} />
                </svg>
            </div>
        );
    }

    protected animationTick(tickDetails: IAnimationTickInstanceDetails): void {
        if (this.testCircle.current) {
            const circle = this.testCircle.current;

            const theta = tickDetails.totalPlayTime / 200;

            circle.moveTo({
                x: 50 + 10 * Math.cos(theta),
                y: 50 + 10 * Math.sin(theta)
            });
        }
    }

    protected reset(): void {
        return;
    }
}

export default TestAnimation;