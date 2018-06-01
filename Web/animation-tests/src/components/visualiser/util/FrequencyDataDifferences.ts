import {INormalisedFrequencyData} from "../VisualisedAudioElement";

class FrequencyDataDifferences {

    public static goingFrom(dataThen: INormalisedFrequencyData) {
        return {to: (dataNow: INormalisedFrequencyData) => new FrequencyDataDifferences(dataNow, dataThen)}
    }

    public static goingTo(dataNow: INormalisedFrequencyData) {
        return {from: (dataThen: INormalisedFrequencyData) => new FrequencyDataDifferences(dataNow, dataThen)}
    }

    private readonly negativeCap: number = -5;

    private readonly absoluteChangeInDataPoints: number[];
    private readonly negativelyCappedAbsoluteChangeInDataPoints: number[];

    private constructor(dataNow: INormalisedFrequencyData, dataPast: INormalisedFrequencyData) {
        const absoluteChangeInDataPoints = this.calculateAbsoluteChangeInDataPoints(dataNow, dataPast);

        this.absoluteChangeInDataPoints = absoluteChangeInDataPoints;
        this.negativelyCappedAbsoluteChangeInDataPoints = this.negativelyCapData(absoluteChangeInDataPoints);
    }

    public getAbsoluteChanges(): number[] {
        return this.absoluteChangeInDataPoints;
    }

    public getAbsoluteChangeInDataPoint(pointNum: number): number {
        const absoluteChange = this.absoluteChangeInDataPoints[pointNum];
        if (absoluteChange === undefined) {
            throw new Error(`There is no data point at position ${pointNum}`);
        }
        return absoluteChange;
    }

    public getNegativelyCappedAbsoluteChangeInDataPoint(pointNum: number): number {
        const absoluteChange = this.negativelyCappedAbsoluteChangeInDataPoints[pointNum];
        if (absoluteChange === undefined) {
            throw new Error(`There is no data point at position ${pointNum}`);
        }
        return absoluteChange;
    }

    private calculateAbsoluteChangeInDataPoints(dataNow: INormalisedFrequencyData, dataPast: INormalisedFrequencyData): number[] {
        const diff: number[] = [];

        dataNow.forEach((dataPointNow, index) => {
            const dataPointPast = dataPast[index];
            if (dataPointPast === undefined) {
                diff[index] = 0;
            }
            diff[index] = (dataPointNow - dataPointPast);
        });

        return diff;
    }

    private negativelyCapData(data: number[]) {
        return data.map((dataPoint) =>
            dataPoint > this.negativeCap ?
                dataPoint :
                this.negativeCap
        );
    }

}

export default FrequencyDataDifferences;