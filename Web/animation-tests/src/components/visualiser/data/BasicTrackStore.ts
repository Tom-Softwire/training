import {ITrackType} from "./tracksRepository";
import TrackStore from "./TrackStore";

class BasicTrackStore extends TrackStore<ITrackType> {
    public constructor(tracks: ITrackType[]) {
        super();

        this.tryRegisterTracks(tracks);
    }
}

export default BasicTrackStore;