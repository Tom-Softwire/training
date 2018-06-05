import {ITrackType} from "./tracksRepository";
import TrackStore from "./TrackStore";

export type IStarrableTrackType = ITrackType & {isStarred: boolean};

class PersistentlyStarrableTrackStore extends TrackStore<IStarrableTrackType> {
    public constructor(tracks: ITrackType[]) {
        super();

        this.tryRegisterTracks(tracks);
    }

    public isTrackWithIdStarred(id: number): boolean {
        return this.getTrackById(id).isStarred;
    }

    // TODO Replace this function with proper use of Redux.
    public withStarToggledForTrackWithId(id: number): PersistentlyStarrableTrackStore {
        const clone = this.clone();
        clone.setPersistedValueOfStarredStatus(id, !this.isTrackWithIdStarred(id));
        clone.getTrackById(id).isStarred = clone.getPersistedValueOfStarredStatus(id);
        return clone;
    }

    protected tryRegisterTracks(tracks: ITrackType[]): void {
        super.tryRegisterTracks(tracks.map(track =>
            Object.assign({}, track, {isStarred: this.getPersistedValueOfStarredStatus(track.id)})
        ));
    }

    protected clone(): PersistentlyStarrableTrackStore {
        return new PersistentlyStarrableTrackStore(this.getAllAsArray());
    }

    private getPersistedValueOfStarredStatus(id: number): boolean {
        return JSON.parse(localStorage.getItem(`tracks[${id}].isStarred`) || 'false');
    }

    private setPersistedValueOfStarredStatus(id: number, isStarred: boolean): void {
        localStorage.setItem(`tracks[${id}].isStarred`, '' + isStarred);
    }
}

export default PersistentlyStarrableTrackStore;