import * as React from 'react';
import {RefObject} from "react";
import {INormalisedFrequencyData} from "../VisualisedAudioElement";

export type IAbstractVisualiserProps = React.CanvasHTMLAttributes<HTMLCanvasElement> & {
    data: INormalisedFrequencyData
}

abstract class AbstractVisualiser extends React.Component<IAbstractVisualiserProps, {}> {
    private canvas: RefObject<HTMLCanvasElement>;

    protected constructor(props: IAbstractVisualiserProps) {
        super(props);

        this.canvas = React.createRef<HTMLCanvasElement>();

        this.state = {
            data: new Uint8Array(0)
        };
    }

    public componentDidMount() {
        this.tryDraw();
    }

    public shouldComponentUpdate({data}: IAbstractVisualiserProps): boolean {
        requestAnimationFrame(() => this.tryDraw());
        return false; // do not induce another render - all visual changes are done through tryDraw()
    }

    public render() {
        const {data, ...nonDataProps} = this.props;
        return (
            <canvas ref={this.canvas} className="visualiser" {...nonDataProps} />
        );
    }

    protected abstract tryDraw(): void;
    
    protected getCanvasRef(): RefObject<HTMLCanvasElement> {
        return this.canvas;
    }

    protected getCanvasContext2D(): CanvasRenderingContext2D {
        const canvasContext: CanvasRenderingContext2D | null
            = this.getCanvasElement().getContext('2d');
        if (!canvasContext) {
            throw new Error('Could not establish 2D canvas context');
        }

        return canvasContext;
    }

    protected getCanvasContextWebGL(): WebGLRenderingContext {
        const canvasContext: WebGLRenderingContext | null
            = this.getCanvasElement().getContext('webgl');
        if (!canvasContext) {
            throw new Error('Could not establish WebGL canvas context');
        }

        return canvasContext;
    }

    private getCanvasElement(): HTMLCanvasElement {
        const canvasElement: HTMLCanvasElement | null
            = this.canvas.current;
        if (!canvasElement) {
            throw new Error('Could not establish current canvas element');
        }

        return canvasElement;
    }

}

export default AbstractVisualiser;