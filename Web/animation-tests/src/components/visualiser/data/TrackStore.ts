import {ITrackType} from "./tracksRepository";

class TrackStore<TrackType extends ITrackType> {
    private tracksAsArray: TrackType[];
    private tracksById: {[id: number]: TrackType};

    public constructor() {
        this.tracksAsArray = [];
        this.tracksById = {};
    }

    public hasTrackById(id: number): boolean {
        return this.tracksById.hasOwnProperty(id);
    }

    public getTrackById(id: number): TrackType {
        this.throwIfTrackWithIdDoesNotExist(id);
        return this.tracksById[id];
    }

    public getAllAsArray(): TrackType[] {
        return this.tracksAsArray;
    }

    protected tryRegisterTracks(tracks: TrackType[]): void {
        try {
            this.registerTracks(tracks);
        } catch (e) {
            throw new Error(`Could not register tracks: ${e.message}`);
        }
    }

    protected throwIfTrackWithIdAlreadyExists(id: number): void {
        if (this.tracksById.hasOwnProperty(id)) {
            throw new Error(`Track with id ${id} already exists.`);
        }
    }

    protected throwIfTrackWithIdDoesNotExist(id: number): void {
        if (!this.tracksById.hasOwnProperty(id)) {
            throw new Error(`Track with id ${id} does not exist.`);
        }
    }

    protected clone(): TrackStore<TrackType> {
        const cloneOfStore = new TrackStore<TrackType>();

        cloneOfStore.tryRegisterTracks(this.tracksAsArray);

        return cloneOfStore;
    }

    private registerTracks(tracks: TrackType[]): void {
        tracks.forEach(track => {
            this.throwIfTrackWithIdAlreadyExists(track.id);
            this.tracksById[track.id] = track;
            this.tracksAsArray.push(track);
        })
    }
}

export default TrackStore;