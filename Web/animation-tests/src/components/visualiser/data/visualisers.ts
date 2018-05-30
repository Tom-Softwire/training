import AbstractVisualiser from "../components/AbstractVisualiser";

import BlueVisualiserBars from "../components/BlueVisualiserBars";
import VisualiserBars from "../components/VisualiserBars";

export interface IVisualiserType {
    component: typeof AbstractVisualiser,
    name: string
}

const visualisers: IVisualiserType[] = [
    {
        component: VisualiserBars,
        name: 'Default Bars',
    },
    {
        component: BlueVisualiserBars,
        name: 'Blue Bars',
    }
];

export default visualisers;