import {IRawFrequencyData} from "../VisualisedAudioElement";

type FrequencyDataCallback = (data: IRawFrequencyData) => void;

class FrequencyAnalyser {
    private readonly audioContext: AudioContext;

    private analyserNode: AnalyserNode;

    private frequencyDataChangedCallback: FrequencyDataCallback;

    private isActive: boolean;
    private currentRawFrequencyData: IRawFrequencyData;

    constructor(audioContext: AudioContext) {
        this.audioContext = audioContext;
        this.analyserNode = this.createAnalyserNodeFromContext(audioContext);
        this.isActive = false;
    }

    public start(): void {
        this.isActive = true;
        this.recursivelyRefreshDataWhileActive();
    }

    public stop(): void {
        this.isActive = false;
    }

    public setFrequencyDataChangedCallback(frequencyDataChangedCallback: FrequencyDataCallback): void {
        this.frequencyDataChangedCallback = frequencyDataChangedCallback;
    }

    public setAudioSource(element: HTMLAudioElement): void {
        this.setCurrentAnalyserNode(this.createAnalyserNodeFromContext(this.audioContext));

        const currentAudioSource: MediaElementAudioSourceNode = this.audioContext.createMediaElementSource(element);

        currentAudioSource.connect(this.analyserNode);
        currentAudioSource.connect(this.audioContext.destination); // output to system out directly

    }

    private createAnalyserNodeFromContext(audioContext: AudioContext): AnalyserNode {
        const analyser = audioContext.createAnalyser();

        analyser.maxDecibels = -20;
        analyser.minDecibels = -90;
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        return analyser;
    }

    private setCurrentAnalyserNode(analyserNode: AnalyserNode): void {
        this.analyserNode = analyserNode;

        const binCount = analyserNode.frequencyBinCount;
        this.currentRawFrequencyData = new Uint8Array(binCount);
    }

    private recursivelyRefreshDataWhileActive() {
        if (this.isActive) {
            // attempt to sync data updates with screen refresh cycle
            requestAnimationFrame(() => this.recursivelyRefreshDataWhileActive());
            this.refreshFrequencyData();
        }
    }

    private refreshFrequencyData(): void {
        this.analyserNode.getByteFrequencyData(this.currentRawFrequencyData);
        this.frequencyDataChangedCallback(this.currentRawFrequencyData);
    }

}

export default FrequencyAnalyser;