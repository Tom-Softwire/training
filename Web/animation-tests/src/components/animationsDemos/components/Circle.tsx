import * as React from 'react';
import AbstractAnimatableEntity from "./AbstractAnimatableEntity";
import {CSSColor, IXYCoordinate} from "./types";

interface IAnimatableCircleProps {
    initialCenterPos?: IXYCoordinate;
    initialFill?: CSSColor;
    initialRadius?: number;
}

interface IAnimatableCircleState {
    centerPos: IXYCoordinate;
    fill: CSSColor;
    radius: number;
}

class AnimatableCircle extends AbstractAnimatableEntity<IAnimatableCircleProps, IAnimatableCircleState> {

    constructor(props: IAnimatableCircleProps) {
        super(props);

        this.state = {
            centerPos: Object.assign({x: 0, y: 0}, props.initialCenterPos),
            fill: props.initialFill || 'blue',
            radius: props.initialRadius || 0,
        };
    }

    public moveBy(delta: IXYCoordinate): void {
        this.setState((prevState: IAnimatableCircleState) => ({
            centerPos: {
                x: prevState.centerPos.x + delta.x,
                y: prevState.centerPos.y + delta.y
            }
        }));
    }

    public moveTo(targetPos: IXYCoordinate): void {
        this.setState((prevState: IAnimatableCircleState) => ({
            centerPos: Object.assign(prevState.centerPos, targetPos)
        }));
    }

    public setFill(fill: CSSColor): void {
        this.setState({fill});
    }

    public render() {
        return <circle r={this.state.radius}
                       cx={this.state.centerPos.x}
                       cy={this.state.centerPos.y}
                       fill={this.state.fill}
                       style={{fill: this.state.fill}}/>
    }
}

export default AnimatableCircle;