import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

describe('Gilded Rose', function () {

    it('should foo', function() {
        const gildedRose = new GildedRose([ new Item('foo', 20, 40) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].name).to.equal('foo');
    });

    it('SellIn is decremented every day', function() {
        const gildedRose = new GildedRose([ new Item('foo', 20, 40) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].sellIn).to.equal(19);
    });

    it('Quality is decremented every day', function() {
        const gildedRose = new GildedRose([ new Item('foo', 20, 40) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(39);
    });

    it('Quality is never lowered below 0', function() {
        const gildedRose = new GildedRose([ new Item('foo', 20, 1) ]);
        gildedRose.updateQuality();
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(0);
    });

    it('Quality of Aged Brie increases', function() {
        const gildedRose = new GildedRose([ new Item('Aged Brie', 20, 40) ]);
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(41);
    });

    it('Quality is never raised above 50', function() {
        const gildedRose = new GildedRose([ new Item('Aged Brie', 20, 49) ]);
        gildedRose.updateQuality();
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(50);
    });

    it('Quality degredation is doubled after the sell-by date', function() {
        const gildedRose = new GildedRose([ new Item('foo', 1, 40) ]);
        gildedRose.updateQuality();
        gildedRose.updateQuality();
        const items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(35);
    });

    it('Quality of Sulfuras does not change', function() {
        let gildedRose = new GildedRose([ new Item('Sulfuras, Hand of Ragnaros', 20, 80) ]);
        gildedRose.updateQuality();
        let items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(80);


        gildedRose = new GildedRose([ new Item('Sulfuras, Hand of Ragnaros', 20, -10) ]);
        gildedRose.updateQuality();
        items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(-10);
    });

    it('Quality of backstage passes changes correctly', function() {
        const gildedRose = new GildedRose([ new Item('Backstage passes to a TAFKAL80ETC concert', 12, 10) ]);

        gildedRose.updateQuality();
        let items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(12);

        items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(14);

        gildedRose.updateQuality();
        gildedRose.updateQuality();
        gildedRose.updateQuality();
        items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(22);

        items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(25);

        gildedRose.updateQuality();
        gildedRose.updateQuality();
        gildedRose.updateQuality();
        items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(37);

        items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(0);
    });

});
