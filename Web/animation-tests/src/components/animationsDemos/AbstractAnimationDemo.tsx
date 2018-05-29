import * as React from "react";

export interface IAnimationDemoProps {
    autoplay: boolean
}

type timestamp = number;

export interface IAnimationTickInstanceDetails {
    sinceLastTick: timestamp,
    totalPlayTime: timestamp
}

export default abstract class AnimationDemo extends React.Component<IAnimationDemoProps, {}> {
    public static displayName: string;

    private totalPlayTime: number;
    private lastTickTime: number;
    private isPlaying: boolean;

    public componentDidMount() {
        if (this.props.autoplay) {
            this.play();
        }
    }

    public componentWillUnmount() {
        this.stop();
    }

    public play() {
        this.totalPlayTime = 0;
        this.isPlaying = true;
        this.doRecursiveTickWhilePlaying();
    }

    public stop() {
        this.isPlaying = false;
        this.reset();
    }

    protected abstract reset(): void;
    protected abstract animationTick(details: IAnimationTickInstanceDetails): void;

    private async doRecursiveTickWhilePlaying() {
        if (this.isPlaying) {
            this.performTick();
            await this.tickDelay();
            this.doRecursiveTickWhilePlaying();
        }
    }

    private tickDelay(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 15);
        });
    }

    private performTick(): void {
        const animationTickInstanceDetails = this.recalculateTickInstanceDetailsForNow();
        this.animationTick(animationTickInstanceDetails);
    }

    private recalculateTickInstanceDetailsForNow(): IAnimationTickInstanceDetails {
        const now = Date.now();
        const lastTickTime = this.lastTickTime || now;
        const sinceLastTick = now - lastTickTime;
        const totalPlayTime = this.totalPlayTime += sinceLastTick;

        this.totalPlayTime = totalPlayTime;
        this.lastTickTime = now;

        return { sinceLastTick, totalPlayTime };
    }
}