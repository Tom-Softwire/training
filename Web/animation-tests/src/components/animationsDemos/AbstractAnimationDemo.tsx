import * as React from "react";

export interface IAnimationDemoProps {
    playOnMount: boolean
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

    public play() {
        this.totalPlayTime = 0;
        this.isPlaying = true;
        this.doRecursiveTickWhilePlaying();
    }

    public stop() {
        this.reset();
        this.isPlaying = false;
    }

    protected abstract reset(): void;
    protected abstract animationTick(details: IAnimationTickInstanceDetails): void;

    private doRecursiveTickWhilePlaying() {
        if (this.isPlaying) {
            this.performTick().then(() => this.doRecursiveTickWhilePlaying());
        }
    }

    private performTick(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const animationTickInstanceDetails = this.recalculateTickInstanceDetailsForNow();
            this.animationTick(animationTickInstanceDetails);
            setTimeout(() => {
                resolve(true);
            }, 20);
        });
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