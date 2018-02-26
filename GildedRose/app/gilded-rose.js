"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Item = /** @class */ (function () {
    function Item(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
    return Item;
}());
exports.Item = Item;
var ItemQualityUpdateRule = /** @class */ (function () {
    function ItemQualityUpdateRule(startAt, updateFunction) {
        this.startAt = startAt;
        this.updateFunction = updateFunction;
    }
    ItemQualityUpdateRule.withDeltaFunction = function (startAt, deltaValue) {
        return new ItemQualityUpdateRule(startAt, function (currentQuality) { return currentQuality + deltaValue; });
    };
    ItemQualityUpdateRule.withConstantFunction = function (startAt, value) {
        return new ItemQualityUpdateRule(startAt, function (currentQuality) { return value; });
    };
    ItemQualityUpdateRule.prototype.applyTo = function (item) {
        item.quality = this.updateFunction(item.quality);
    };
    return ItemQualityUpdateRule;
}());
var ItemQualityUpdateRules = /** @class */ (function () {
    function ItemQualityUpdateRules(defaultDelta, rules) {
        this.defaultDelta = defaultDelta;
        this.rules = rules;
    }
    ItemQualityUpdateRules.prototype.getRelevantQualityUpdateRule = function (item) {
        return this.rules.reduce(function (currentRule, rule) {
            return ((rule.startAt >= item.sellIn) && (!currentRule.startAt || currentRule.startAt > rule.startAt)) ? rule : currentRule;
        }, ItemQualityUpdateRule.withDeltaFunction(undefined, this.defaultDelta));
    };
    ItemQualityUpdateRules.forItem = function (item) {
        var isConjured = item.name.substr(0, 9).toLowerCase() === 'conjured';
        var baseItemName = isConjured ? item.name.substr(9) : item.name;
        return this.qualityUpdateRules[baseItemName] ? this.qualityUpdateRules[baseItemName] : this.defaultRules;
    };
    ItemQualityUpdateRules.updateQualityOf = function (item) {
        ItemQualityUpdateRules.forItem(item).getRelevantQualityUpdateRule(item).applyTo(item);
    };
    ItemQualityUpdateRules.qualityUpdateRules = {
        'Aged Brie': new ItemQualityUpdateRules(1, [
            ItemQualityUpdateRule.withDeltaFunction(0, 2)
        ]),
        'Backstage passes to a TAFKAL80ETC concert': new ItemQualityUpdateRules(1, [
            ItemQualityUpdateRule.withDeltaFunction(10, 2),
            ItemQualityUpdateRule.withDeltaFunction(5, 3),
            ItemQualityUpdateRule.withConstantFunction(0, 0)
        ])
    };
    ItemQualityUpdateRules.defaultRules = new ItemQualityUpdateRules(-1, [
        ItemQualityUpdateRule.withDeltaFunction(0, -2)
    ]);
    return ItemQualityUpdateRules;
}());
var GildedRose = /** @class */ (function () {
    function GildedRose(items) {
        if (items === void 0) { items = []; }
        this.items = items;
    }
    GildedRose.prototype.updateQuality = function () {
        this.items.forEach(GildedRose.updateItemQuality);
        return this.items;
    };
    GildedRose.shouldUpdateItem = function (item) {
        return item.name !== 'Sulfuras, Hand of Ragnaros';
    };
    GildedRose.applyQualityLimits = function (item) {
        if (item.quality < 0)
            item.quality = 0;
        if (item.quality > 50)
            item.quality = 50;
    };
    GildedRose.updateItemQuality = function (item) {
        if (!GildedRose.shouldUpdateItem(item))
            return;
        ItemQualityUpdateRules.updateQualityOf(item);
        GildedRose.applyQualityLimits(item);
        item.sellIn--;
    };
    return GildedRose;
}());
exports.GildedRose = GildedRose;
