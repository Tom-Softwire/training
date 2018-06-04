import AbstractVisualiser from "../components/AbstractVisualiser";

import ShapesVisualiser from "../components/ShapesVisualiser";
import VisualiserBars from "../components/VisualiserBars";

export interface IVisualiserType {
    component: typeof AbstractVisualiser,
    name: string,
}

const visualisers: IVisualiserType[] = [
    {
        component: VisualiserBars,
        name: 'Bars',
    },
    {
        component: ShapesVisualiser,
        name: 'Shapes',
    },
];

export default visualisers;