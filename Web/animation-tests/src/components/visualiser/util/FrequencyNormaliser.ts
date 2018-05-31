import {INormalisedFrequencyData, IRawFrequencyData} from "../VisualisedAudioElement";

enum Mode {
    EqualWidthBins
}

export const FrequencyNormaliserMode = Mode;

class FrequencyNormaliser {
    private rawData: IRawFrequencyData | null;
    private mode: Mode | null;
    private targetNumberOfBins: number | null;

    constructor() {
        this.rawData = null;
        this.mode = null;
        this.targetNumberOfBins = null;
    }

    public setRawData(data: IRawFrequencyData): void {
        this.rawData = data;
    }

    public setMode(mode: Mode): void {
        this.mode = mode;
    }

    public setTargetNumberOfBins(target: number): void {
        this.targetNumberOfBins = target;
    }

    public generateNormalisedData(): INormalisedFrequencyData {
        switch (this.mode) {
            case Mode.EqualWidthBins:
                return this.generateNormalisedDataEqualWidthBins();
            default:
                throw new Error('No mode set.');
        }
    }

    private generateNormalisedDataEqualWidthBins(): INormalisedFrequencyData {
        const rawData = this.getRawData();
        const targetNumberOfBins = this.getTargetNumberOfBins();

        const numberOfRawDataBins = rawData.length;

        if (numberOfRawDataBins === targetNumberOfBins) { // shortcut (raw data comes in equal width bins)
            return rawData;
        }

        if (numberOfRawDataBins < targetNumberOfBins) {
            throw new Error('Not enough data points. Try increasing AnalyserNode.fftSize');
        }

        return this.generateEqualWidthBins();
    }

    private getRawData(): IRawFrequencyData {
        if (this.rawData === null) {
            throw new ReferenceError('Raw data not provided.');
        }

        return this.rawData;
    }

    private getTargetNumberOfBins(): number {
        if (this.targetNumberOfBins === null) {
            throw new ReferenceError('Target number of bins not set.');
        }

        return this.targetNumberOfBins;
    }

    private generateEqualWidthBins(): INormalisedFrequencyData {
        const rawData = this.getRawData();
        const targetNumberOfBins = this.getTargetNumberOfBins();

        const reductionFactor = rawData.length / targetNumberOfBins;

        const averagesOverRawData = new Uint8Array(targetNumberOfBins);
        rawData.forEach(((rawDataPoint, indexOfRawDataPoint) => {
            const targetIndex = Math.floor(indexOfRawDataPoint / reductionFactor);
            // FIXME This is not a genuine average, since it assumes that there are reductionFactor items to average
            averagesOverRawData[targetIndex] += rawDataPoint / reductionFactor;
        }));

        return averagesOverRawData;
    }
}

export default FrequencyNormaliser;