import * as React from 'react';
import {RefObject} from "react";

import MisconfiguredAnalyserError from "./util/MisconfiguredAnalyserError";
import './VisualisedAudioElement.css';

import {ITrackType} from "./data/tracks";
import {IVisualiserType} from "./data/visualisers";

interface IVisualisedAudioElementProps {
    track: ITrackType | null,
    visualiser: IVisualiserType
}
interface IVisualisedAudioElementState {
    normalisedFrequencyData: Uint8Array
}

export type INormalisedFrequencyData = Uint8Array;

// TODO Extract the frequency-parsing logic into a FrequencyParser class, or similar, to which the visualiser subscribes
class VisualisedAudioElement extends React.PureComponent<IVisualisedAudioElementProps, IVisualisedAudioElementState> {
    private audioContext: AudioContext;
    private audioElement: RefObject<HTMLAudioElement>;

    private currentAudioSource: MediaElementAudioSourceNode;
    private currentAnalyser: AnalyserNode;

    private currentRawFrequencyData: Uint8Array;

    private isPlaying = true; // this should be moved out of here

    constructor(props: IVisualisedAudioElementProps) {
        super(props);

        const AudioContext = ((window as any).AudioContext || (window as any).webkitAudioContext);
        this.audioContext = new AudioContext();
        this.audioElement = React.createRef<HTMLAudioElement>();

        this.state = {
            normalisedFrequencyData: new Uint8Array(0)
        }
    }

    public componentDidMount() {
        try {
            this.setup();
        } catch (e) {
            return;
        }
    }

    public componentWillUnmount() {
        this.isPlaying = false;
    }

    public render() {
        const VisualiserComponent = this.props.visualiser.component;

        return (
            <div>
                <VisualiserComponent data={this.state.normalisedFrequencyData} width={512} height={256} />
                <audio ref={this.audioElement} controls={true} src={this.props.track ? this.props.track.filename : ''}>
                    No support!
                </audio>
            </div>
        );
    }

    private setup() {
        this.connectAudioElementAsAudioSource();
        this.recursivelyRefreshDataWhilePlaying();
    }

    private connectAudioElementAsAudioSource() {
        const audioElementInstance = this.audioElement.current;
        if (!audioElementInstance) {
            throw new Error('Could not connect to audio element');
        }

        this.currentAudioSource = this.audioContext.createMediaElementSource(audioElementInstance);
        this.currentAnalyser = this.setupAnalyser(this.audioContext);

        this.currentAudioSource.connect(this.currentAnalyser);
        this.currentAudioSource.connect(this.audioContext.destination); // output to system out directly

        this.currentRawFrequencyData = new Uint8Array(this.currentAnalyser.frequencyBinCount); // placeholder for incoming data
    }

    private setupAnalyser(audioContext: AudioContext): AnalyserNode {
        const analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        return analyser;
    }

    private recursivelyRefreshDataWhilePlaying() {
        if (this.isPlaying) {
            // attempt to sync data updates with screen refresh cycle
            requestAnimationFrame(() => this.recursivelyRefreshDataWhilePlaying());
        }
        this.refreshFrequencyData();
    }

    private refreshFrequencyData() {
        const normalisedFrequencyData = this.getCurrentNormalisedFrequencyData();
        this.setState({normalisedFrequencyData});
    }

    private getCurrentNormalisedFrequencyData(): INormalisedFrequencyData {
        this.currentAnalyser.getByteFrequencyData(this.currentRawFrequencyData);
        return this.normaliseFrequencyData(this.currentRawFrequencyData);
    }

    private normaliseFrequencyData(rawFrequencyData: Uint8Array): INormalisedFrequencyData {
        const numberOfRawDataPoints = rawFrequencyData.length;
        const targetNumberOfDataPoints = 12; // TODO abstract away into, say, visualiser props

        if (numberOfRawDataPoints === targetNumberOfDataPoints) { // shortcut
            return rawFrequencyData;
        }

        if (numberOfRawDataPoints < targetNumberOfDataPoints) {
            throw new MisconfiguredAnalyserError('Not enough data points. Try increasing AnalyserNode.fftSize');
        }

        const reductionFactor = numberOfRawDataPoints / targetNumberOfDataPoints;

        const averagesOverRawData = new Uint8Array(targetNumberOfDataPoints);
        rawFrequencyData.forEach(((rawDataPoint, indexOfRawDataPoint) => {
            const targetIndex = Math.floor(indexOfRawDataPoint / reductionFactor);
            // FIXME This is not a genuine average, since it assumes that there are reductionFactor items to average
            averagesOverRawData[targetIndex] += rawDataPoint / reductionFactor;
        }));

        return averagesOverRawData;
    }
}

export default VisualisedAudioElement;