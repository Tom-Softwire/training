"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var gilded_rose_1 = require("../app/gilded-rose");
describe('Gilded Rose', function () {
    it('should foo', function () {
        var gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('foo', 20, 40)]);
        var items = gildedRose.updateQuality();
        chai_1.expect(items[0].name).to.equal('foo');
    });
    it('SellIn is decremented every day', function () {
        var gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('foo', 20, 40)]);
        var items = gildedRose.updateQuality();
        chai_1.expect(items[0].sellIn).to.equal(19);
    });
    it('Quality is decremented every day', function () {
        var gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('foo', 20, 40)]);
        var items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(39);
    });
    it('Quality is never lowered below 0', function () {
        var gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('foo', 20, 1)]);
        gildedRose.updateQuality();
        var items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(0);
    });
    it('Quality of Aged Brie increases', function () {
        var gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('Aged Brie', 20, 40)]);
        var items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(41);
    });
    it('Quality is never raised above 50', function () {
        var gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('Aged Brie', 20, 49)]);
        gildedRose.updateQuality();
        var items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(50);
    });
    it('Quality degredation is doubled after the sell-by date', function () {
        var gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('foo', 1, 40)]);
        gildedRose.updateQuality();
        gildedRose.updateQuality();
        var items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(35);
    });
    it('Quality of Sulfuras does not change', function () {
        var gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('Sulfuras, Hand of Ragnaros', 20, 80)]);
        gildedRose.updateQuality();
        var items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(80);
        gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('Sulfuras, Hand of Ragnaros', 20, -10)]);
        gildedRose.updateQuality();
        items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(-10);
    });
    it('Quality of backstage passes changes correctly', function () {
        var gildedRose = new gilded_rose_1.GildedRose([new gilded_rose_1.Item('Backstage passes to a TAFKAL80ETC concert', 12, 10)]);
        gildedRose.updateQuality();
        var items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(12);
        items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(14);
        gildedRose.updateQuality();
        gildedRose.updateQuality();
        gildedRose.updateQuality();
        items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(22);
        items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(25);
        gildedRose.updateQuality();
        gildedRose.updateQuality();
        gildedRose.updateQuality();
        items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(37);
        items = gildedRose.updateQuality();
        chai_1.expect(items[0].quality).to.equal(0);
    });
});
