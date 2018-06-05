import * as React from 'react';
import {RefObject} from "react";

import './VisualisedAudioElement.css';

import {ITrackType} from "./data/tracksRepository";
import {IVisualiserType} from "./data/visualisers";
import FrequencyAnalyser from "./util/FrequencyAnalyser";
import FrequencyNormaliser, {FrequencyNormaliserMode} from "./util/FrequencyNormaliser";

export type IRawFrequencyData = Uint8Array;
export type INormalisedFrequencyData = Uint8Array;

interface IVisualisedAudioElementProps {
    shouldPlay: boolean,
    track: ITrackType | null,
    visualiser: IVisualiserType,
}
interface IVisualisedAudioElementState {
    normalisedFrequencyData: INormalisedFrequencyData
}

// TODO move some of this logic into the visualiser, so that the audio element potion can be easily decoupled.
// This class should simply connect the resulting two modules.
// Visualiser should have a public interface to 'connect' to a source of IRawFrequencyData (what's currently referred to as a 'frequency analyser'?).
// Visualiser sets up its own frequency normaliser.

class VisualisedAudioElement extends React.PureComponent<IVisualisedAudioElementProps, IVisualisedAudioElementState> {
    private readonly audioContext: AudioContext;
    private readonly audioElement: RefObject<HTMLAudioElement>;

    private frequencyAnalyser: FrequencyAnalyser;

    constructor(props: IVisualisedAudioElementProps) {
        super(props);

        this.audioContext = this.createAudioContext();
        this.audioElement = React.createRef<HTMLAudioElement>();

        this.state = {
            normalisedFrequencyData: new Uint8Array(0)
        }
    }

    public componentDidMount() {
        try {
            this.setUp();
        } catch (e) {
            return;
        }
    }

    public componentWillUnmount() {
        this.frequencyAnalyser.stop();
    }

    public render() {
        const VisualiserComponent = this.props.visualiser.component;

        return (
            <div className="visualised-audio-element">
                <VisualiserComponent data={this.state.normalisedFrequencyData} width={250} height={154} />
                <audio ref={this.audioElement}
                       controls={true}
                       src={this.props.track ? this.props.track.filename : ''}
                       autoPlay={this.props.shouldPlay}>
                    No support!
                </audio>
            </div>
        );
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
    }

    private setUpFrequencyAnalyser(): FrequencyAnalyser {
        const frequencyProcessor = new FrequencyAnalyser(this.audioContext);

        frequencyProcessor.setAudioSource(this.getAudioElement());
        frequencyProcessor.setFrequencyDataChangedCallback(this.frequencyDataChanged.bind(this));

        return frequencyProcessor;
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
}

export default VisualisedAudioElement;