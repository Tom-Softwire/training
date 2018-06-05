import {boolToString, stringToBool} from "../../../util/StringUtils";
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

    // TODO Is there a way to refactor this without the unnecessary boilerplate of Redux?
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
        try {
            return stringToBool(localStorage.getItem(
                `tracks[${id}].isStarred`) || 'false');
        } catch (e) {
            return false;
        }
    }

    private setPersistedValueOfStarredStatus(id: number, isStarred: boolean): void {
        localStorage.setItem(
            `tracks[${id}].isStarred`,
            boolToString(isStarred));
    }
}

export default PersistentlyStarrableTrackStore;