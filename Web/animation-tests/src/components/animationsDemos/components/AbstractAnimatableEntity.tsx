import * as React from "react";
import {CSSColor, IXYCoordinate} from "./types";

abstract class AbstractAnimatableEntity<P = {}, S = {}> extends React.Component<P, S> {
    public abstract moveBy(delta: IXYCoordinate): void;
    public abstract moveTo(target: IXYCoordinate): void;
    public abstract setFill(color: CSSColor): void;
}

export default AbstractAnimatableEntity;