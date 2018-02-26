export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

class ItemQualityUpdateRule {
    startAt: number;
    updateFunction: (number) => number;

    constructor(startAt: number, updateFunction: (number) => number) {
        this.startAt = startAt;
        this.updateFunction = updateFunction;
    }

    static withDeltaFunction(startAt: number, deltaValue: number): ItemQualityUpdateRule {
        return new ItemQualityUpdateRule(startAt, currentQuality => currentQuality + deltaValue);
    }

    static withConstantFunction(startAt: number, value: number): ItemQualityUpdateRule {
        return new ItemQualityUpdateRule(startAt, currentQuality => value);
    }

    applyTo(item: Item): void {
        item.quality = this.updateFunction(item.quality);
    }
}

class ItemQualityUpdateRules {
    defaultDelta: number;
    rules: Array<ItemQualityUpdateRule>;

    constructor(defaultDelta: number, rules: Array<ItemQualityUpdateRule>) {
        this.defaultDelta = defaultDelta;
        this.rules = rules;
    }

    getRelevantQualityUpdateRule(item: Item): ItemQualityUpdateRule {
        return this.rules.reduce((currentRule, rule) =>
            ((rule.startAt >= item.sellIn) && (!currentRule.startAt || currentRule.startAt > rule.startAt)) ? rule : currentRule
        , ItemQualityUpdateRule.withDeltaFunction(undefined, this.defaultDelta));
    }

    static qualityUpdateRules = {
        'Aged Brie': new ItemQualityUpdateRules(1,
            [
                ItemQualityUpdateRule.withDeltaFunction(0, 2)
            ]),
        'Backstage passes to a TAFKAL80ETC concert': new ItemQualityUpdateRules(1,
            [
                ItemQualityUpdateRule.withDeltaFunction(10, 2),
                ItemQualityUpdateRule.withDeltaFunction(5, 3),
                ItemQualityUpdateRule.withConstantFunction(0, 0)
            ])
    };

    static defaultRules = new ItemQualityUpdateRules(-1,
        [
            ItemQualityUpdateRule.withDeltaFunction(0, -2)
        ]);

    static forItem(item: Item): ItemQualityUpdateRules {
        const isConjured = item.name.substr(0, 9).toLowerCase() === 'conjured';
        const baseItemName = isConjured ? item.name.substr(9) : item.name;
        return this.qualityUpdateRules[baseItemName] ? this.qualityUpdateRules[baseItemName] : this.defaultRules;
    }

    static updateQualityOf(item: Item): void {
        ItemQualityUpdateRules.forItem(item).getRelevantQualityUpdateRule(item).applyTo(item);
    }
}

export class GildedRose {
    items: Array<Item>;

    constructor(items: Array<Item> = []) {
        this.items = items;
    }

    updateQuality(): Array<Item> {
        this.items.forEach(GildedRose.updateItemQuality);
        return this.items;
    }

    static shouldUpdateItem(item: Item): boolean {
        return item.name !== 'Sulfuras, Hand of Ragnaros';
    }

    static applyQualityLimits(item: Item): void {
        if(item.quality < 0) item.quality = 0;
        if(item.quality > 50) item.quality = 50;
    }

    static updateItemQuality(item: Item): void {
        if (!GildedRose.shouldUpdateItem(item)) return;
        ItemQualityUpdateRules.updateQualityOf(item);
        GildedRose.applyQualityLimits(item);
        item.sellIn--;
    }
}
