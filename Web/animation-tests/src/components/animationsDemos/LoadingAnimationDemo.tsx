import * as React from 'react';
import {RefObject} from "react";
import AnimationDemo, {IAnimationDemoProps, IAnimationTickInstanceDetails} from "./AbstractAnimationDemo";

import './LoadingAnimationDemo.css';

import AnimatableCircle from "./components/Circle";
import {CSSColor, IXYCoordinate} from "./components/types";

class LoadingAnimationDemo extends AnimationDemo {
    public static displayName = 'Loading Animation - JS/React vs CSS';

    private slowCircle: RefObject<AnimatableCircle>;
    private fastCircle: RefObject<AnimatableCircle>;

    constructor(props: IAnimationDemoProps) {
        super(props);

        this.slowCircle = React.createRef<AnimatableCircle>();
        this.fastCircle = React.createRef<AnimatableCircle>();
    }

    public render() {
        // TODO Abstract the render function away from the animation demo class? (SRP)
        return (
            <div className="loading-animation">
                <svg>
                    <AnimatableCircle ref={this.slowCircle} initialRadius={10} />
                    <AnimatableCircle ref={this.fastCircle} initialRadius={10} />
                </svg>
                <svg>
                    <circle className='slow-circle' cx={60} cy={50} r={10} />
                    <circle className='fast-circle' cx={60} cy={50} r={10} />
                </svg>
            </div>
        );
    }

    protected animationTick(tickDetails: IAnimationTickInstanceDetails): void {
        this.tickSlowCircle(tickDetails);
        this.tickFastCircle(tickDetails);
    }

    protected reset(): void {
        return;
    }

    private tickSlowCircle(tickDetails: IAnimationTickInstanceDetails): void {
        // TODO Abstract these .current checks away from the animation demo class (SRP)
        if (!this.slowCircle.current) {
            return;
        }

        this.updateCircleUsingTheta(
            this.slowCircle.current,
            tickDetails.totalPlayTime / 200);
    }

    private tickFastCircle(tickDetails: IAnimationTickInstanceDetails): void {
        // TODO Abstract these .current checks away from the animation demo class (SRP)
        if (!this.fastCircle.current) {
            return;
        }

        this.updateCircleUsingTheta(
            this.fastCircle.current,
            tickDetails.totalPlayTime / 125);
    }

    private updateCircleUsingTheta(circle: AnimatableCircle, theta: number): void {
        circle.moveTo(this.thetaToCenterPos(theta));
        circle.setFill(this.thetaToCSSColor(theta));
    }

    private thetaToCenterPos(theta: number): IXYCoordinate {
        return {
            x: 50 + 10 * Math.cos(theta),
            y: 50 + 10 * Math.sin(theta)
        };
    }

    private thetaToCSSColor(theta: number): CSSColor {
        const intensity = this.thetaToIntensity(theta);
        return `rgb(${intensity}, ${intensity}, ${intensity})`;
    }

    private thetaToIntensity(theta: number): number {
        return Math.round(127 + 32 * Math.cos(theta));
    }
}

export default LoadingAnimationDemo;