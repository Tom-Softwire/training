import FrequencyDataDifferences from "../util/FrequencyDataDifferences";
import {INormalisedFrequencyData} from "../VisualisedAudioElement";
import AbstractVisualiser, {IAbstractVisualiserProps} from "./AbstractVisualiser";

type ITestVisualiserProps = IAbstractVisualiserProps;

class ShapesVisualiser extends AbstractVisualiser {
    public static get minNumberOfFrequencyDataBins(): number {
        return 12;
    }

    private lastDrawTime: number; // milliseconds
    private lastDrawData: INormalisedFrequencyData;

    private baseRotation: number; // rads
    private readonly baseRotationSpeed: number; // rads per second

    constructor(props: ITestVisualiserProps) {
        super(props);

        this.lastDrawTime = Date.now();
        this.lastDrawData = new Uint8Array(0);

        this.baseRotation = Math.PI / 4;
        this.baseRotationSpeed = Math.PI / 8;
    }

    // TODO move this to abstract class - determine the 2d/webgl option through a readonly class property
    protected tryDraw() {
        try {
            this.drawDataToCanvas(this.props.data, this.getCanvasContext2D());
        } catch (e) {
            return;
        }
    }

    // TODO This function is horrible
    private drawDataToCanvas(data: INormalisedFrequencyData, canvasContext: CanvasRenderingContext2D): void {
        // canvas properties
        const canvasWidth = canvasContext.canvas.width;
        const canvasHeight = canvasContext.canvas.height;

        // draw background
        canvasContext.clearRect(0, 0, canvasWidth,  canvasHeight);

        // timings
        const lastDrawTime = this.lastDrawTime;
        const now = this.lastDrawTime = Date.now();
        const timeSinceLastDrawInSeconds = (now - lastDrawTime) / 1000;

        // useful values
        const changeInDataSinceLastDraw = FrequencyDataDifferences.goingFrom(this.lastDrawData).to(data);

        // determine size
        const size = data[0]/2 + changeInDataSinceLastDraw.getAbsoluteChangeInDataPoint(0);

        // determine rotation
        const rotationSpeed = this.baseRotationSpeed + (Math.PI/16) * changeInDataSinceLastDraw.getNegativelyCappedAbsoluteChangeInDataPoint(0);
        const rotation = this.baseRotation + timeSinceLastDrawInSeconds * rotationSpeed;

        // draw pattern
        canvasContext.translate(canvasWidth / 2, canvasHeight / 2);
        canvasContext.rotate(this.baseRotation);

        const pointsAroundCircle = 15;
        const crossingFactor = 3; // crossingFactor+1 should be coprime with pointsAroundCircle
        const angleOfStroke = 2*Math.PI / (pointsAroundCircle / (1+crossingFactor));

        canvasContext.beginPath();
        canvasContext.strokeStyle = 'teal';
        canvasContext.fillStyle = 'darkgray';
        canvasContext.lineWidth = 2;
        canvasContext.lineJoin = 'round';

        let currentAngle = 0;
        canvasContext.moveTo(size, 0);
        for (let i = 0; i < pointsAroundCircle - 1; i ++) {
            canvasContext.lineTo(
                size * Math.cos(currentAngle + angleOfStroke),
                size * Math.sin(currentAngle + angleOfStroke));
            currentAngle += angleOfStroke;
        }

        canvasContext.closePath();
        canvasContext.fill();
        canvasContext.stroke();

        canvasContext.rotate(-this.baseRotation);
        canvasContext.translate(-canvasWidth / 2, -canvasHeight / 2);

        // store data for comparison within next draw
        this.baseRotation = rotation;
        this.lastDrawData = data;
    }
}

export default ShapesVisualiser;
