import * as React from 'react';
import AnimatableEntity from "./AbstractAnimatableEntity";
import {IXYCoordinate} from "./types";

interface IAnimatableCircleProps {
    initialRadius: number;
    initialCenterPos: IXYCoordinate
}

interface IAnimatableCircleState {
    radius: number;
    centerPos: IXYCoordinate
}

class AnimatableCircle extends AnimatableEntity<IAnimatableCircleProps, IAnimatableCircleState> {

    constructor(props: IAnimatableCircleProps) {
        super(props);

        this.state = {
            centerPos: props.initialCenterPos,
            radius: props.initialRadius
        };
    }

    public moveBy(delta: IXYCoordinate) {
        this.setState((prevState: IAnimatableCircleState) => ({
            centerPos: {
                x: prevState.centerPos.x + delta.x,
                y: prevState.centerPos.y + delta.y
            }
        }));
    }

    public moveTo(targetPos: IXYCoordinate) {
        this.setState((prevState: IAnimatableCircleState) => ({
            centerPos: Object.assign(prevState.centerPos, targetPos)
        }));
    }

    public render() {
        return <circle r={this.state.radius} cx={this.state.centerPos.x} cy={this.state.centerPos.y} />
    }
}

export default AnimatableCircle;