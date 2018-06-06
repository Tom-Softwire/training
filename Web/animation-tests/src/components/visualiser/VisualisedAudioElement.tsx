import * as React from 'react';
import {RefObject} from "react";

import './VisualisedAudioElement.css';

import {TrackStatus} from "../musicBrowser/util/TrackStatus";
import {ITrackType} from "./data/tracksRepository";
import {IVisualiserType} from "./data/visualisers";
import FrequencyAnalyser from "./util/FrequencyAnalyser";
import FrequencyNormaliser, {FrequencyNormaliserMode} from "./util/FrequencyNormaliser";

export type IRawFrequencyData = Uint8Array;
export type INormalisedFrequencyData = Uint8Array;

interface IVisualisedAudioElementProps {
    trackStatusUpdateCallback?: (status: TrackStatus) => void,
    shouldPlay?: boolean,
    track?: ITrackType,
    visualiser: IVisualiserType,
}
interface IVisualisedAudioElementState {
    normalisedFrequencyData: INormalisedFrequencyData
}

class VisualisedAudioElement extends React.Component<IVisualisedAudioElementProps, IVisualisedAudioElementState> {
    private audioContext: AudioContext;
    private readonly audioElement: RefObject<HTMLAudioElement>;

    private frequencyAnalyser: FrequencyAnalyser;

    constructor(props: IVisualisedAudioElementProps) {
        super(props);

        this.setUpAudioContext();
        this.audioElement = React.createRef<HTMLAudioElement>();

        this.state = {
            normalisedFrequencyData: new Uint8Array(0)
        };

        this.playingCallback = this.playingCallback.bind(this);
        this.pausedCallback = this.pausedCallback.bind(this);
    }

    public componentDidMount() {
        try {
            this.setUp();
        } catch (e) {
            return;
        }
    }

    public shouldComponentUpdate(nextProps: IVisualisedAudioElementProps) {
        // NOTE This approach isn't great, since it assumes certain behaviours about the workings of <audio>, and the logic here is misplaced.
        // TODO Wrap the audio element to make behaviour predictable or check <audio> spec in detail.
        // TODO This also doesn't work well when shouldPlay is false.
        if (this.isTrackDistinctFromCurrentTrack(nextProps.track)) {
            this.dispatchTrackStatus(TrackStatus.Loading);
        }
        return true; // re-render
    }

    public componentWillUnmount() {
        this.frequencyAnalyser.stop();
    }

    public render() {
        return (
            <div className="visualised-audio-element">
                {this.renderVisualiser()}
                {this.renderAudioElement()}
            </div>
        );
    }

    public renderVisualiser() {
        const VisualiserComponent = this.props.visualiser.component;

        return (
            <VisualiserComponent data={this.state.normalisedFrequencyData} width={250} height={154} />
        );
    }

    public renderAudioElement() {
        return (
                <audio ref={this.audioElement}
                       controls={true}
                       src={this.props.track ? this.props.track.filename : ''}
                       autoPlay={this.props.shouldPlay || false}
                       onPlay={this.playingCallback}
                       onPause={this.pausedCallback}>
                    No support!
                </audio>
        );
    }

    private isTrackDistinctFromCurrentTrack(nextTrack?: ITrackType): boolean {
        return (nextTrack !== undefined && (!this.props.track || (nextTrack.id !== this.props.track.id)));
    }

    private setUpAudioContext(): void {
        this.audioContext = this.createAudioContext();
    }

    private createAudioContext(): AudioContext {
        const AudioContext = ((window as any).webkitAudioContext || (window as any).AudioContext);
        if (!AudioContext) {
            throw new Error('Audio Context not supported.');
        }
        return new AudioContext();
    }

    private setUp() {
        this.frequencyAnalyser = this.setUpFrequencyAnalyser();
        this.frequencyAnalyser.start();
        this.getAudioElement().load();
        this.dispatchTrackStatus(TrackStatus.Loading);
    }

    private setUpFrequencyAnalyser(): FrequencyAnalyser {
        const frequencyAnalyser = new FrequencyAnalyser(this.audioContext);

        frequencyAnalyser.setAudioSource(this.getAudioElement());
        frequencyAnalyser.setFrequencyDataChangedCallback(this.frequencyDataChanged.bind(this));

        return frequencyAnalyser;
    }

    private getAudioElement(): HTMLAudioElement {
        const audioElementInstance = this.audioElement.current;
        if (!audioElementInstance) {
            throw new Error('Could not get current audio element');
        }

        return audioElementInstance;
    }

    private frequencyDataChanged(data: IRawFrequencyData): void {
        this.setState({
            normalisedFrequencyData: this.normaliseRawFrequencyData(data)
        });
    }

    private normaliseRawFrequencyData(rawFrequencyData: IRawFrequencyData): INormalisedFrequencyData {
        const normaliser = new FrequencyNormaliser();

        normaliser.setRawData(rawFrequencyData);
        normaliser.setMode(FrequencyNormaliserMode.EqualWidthBins);
        normaliser.setTargetNumberOfBins(this.props.visualiser.component.minNumberOfFrequencyDataBins);

        return normaliser.generateNormalisedData();
    }

    private playingCallback() {
        this.dispatchTrackStatus(TrackStatus.Playing);
    }

    private pausedCallback() {
        this.dispatchTrackStatus(TrackStatus.Paused);
    }

    private dispatchTrackStatus(status: TrackStatus): void {
        if (this.props.trackStatusUpdateCallback) {
            this.props.trackStatusUpdateCallback(status);
        }
    }
}

export default VisualisedAudioElement;