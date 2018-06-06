export interface ITrackType {
    filename: string,
    id: number,
    name: string
}

export type IStarrableTrackType = ITrackType & {isStarred: boolean};

const allTracks: ITrackType[] = [
    {
        filename: '/tracks/Playdate.wav',
        id: 0,
        name: 'Playdate.wav',
    },
    {
        filename: '/tracks/Work It.wav',
        id: 1,
        name: 'Work It.wav',
    }
];

export default allTracks;