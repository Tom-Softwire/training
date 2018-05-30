import {INormalisedFrequencyData} from "../VisualisedAudioElement";
import AbstractVisualiser from "./AbstractVisualiser";

class VisualiserBars extends AbstractVisualiser {

    // TODO move this to abstract class - determine the 2d/webgl option through a readonly class property
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
            canvasContext.fillStyle = 'lightgrey';
            canvasContext.fillRect(barOffsetUnit * index, canvasHeight - value, barWidth, value);
        });
    }
}

export default VisualiserBars;