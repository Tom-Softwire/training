import {INormalisedFrequencyData} from "../VisualisedAudioElement";
import AbstractVisualiser from "./AbstractVisualiser";

// NOTE this is a placeholder visualiser to demonstrate multi-visualiser options. Refer to VisualiserBars
class BlueVisualiserBars extends AbstractVisualiser {
    protected tryDraw() {
        try {
            this.draw(this.props.data, this.getCanvasContext2D());
        } catch(e) {
            return;
        }
    }

    private draw(data: INormalisedFrequencyData, canvasContext: CanvasRenderingContext2D): void {
        const canvasWidth = canvasContext.canvas.width;
        const canvasHeight = canvasContext.canvas.height;

        canvasContext.clearRect(0, 0, canvasWidth,  canvasHeight);

        const numDataPoints = data.length;
        const unitWidth = canvasWidth / (numDataPoints + (numDataPoints - 1) * 0.125);
        const barWidth = unitWidth;
        const barOffsetUnit = unitWidth * 1.125;

        data.forEach((value, index) => {
            canvasContext.fillStyle = 'blue';
            canvasContext.fillRect(barOffsetUnit * index, canvasHeight - value, barWidth, value);
        });
    }
}

export default BlueVisualiserBars;