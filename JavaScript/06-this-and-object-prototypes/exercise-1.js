const animal = {
    foodForSpecies: {
        zebra: "grass",
        chinchilla: "fruits and seeds",
        lion: "large prey",
        ferret: "small prey"
    },
    init: function (name, species) {
        this.name = name;
        this.species = species;
        this.hunger = 0;
    },
    feed: function () {
        this.hunger = 0;
        console.log(`${this.name}, the ${this.type} ${this.species}, was fed ${this.getFoodName()}!`);
    },
    getFoodName: function() {
        return this.foodForSpecies[this.species] || "";
    }
};

const herbivore = Object.create(animal);
herbivore.type = "herbivore";
herbivore.costOfFood = 200;

const carnivore = Object.create(animal);
carnivore.type = "carnivore";
carnivore.costOfFood = 500;

const zoo = {
    cash: 4000,
    animals: [],
    spend: function (amount) {
        if (this.cash < amount) {
            throw "Not enough money!";
        }
        this.cash -= amount;
        console.log(`Remaining funds: ${this.cash}`);
    },
    addAnimal: function (animal) {
        this.animals[this.animals.length] = animal;
    },
    feedAllAnimals: function () {
        for (var i = 0; i < this.animals.length; i++) {
            var animal = this.animals[i];
            try {
                this.spend(animal.costOfFood);
            } catch (e) {
                console.log("Cannot feed animal: not enough cash!");
                return;
            }
            this.animals[i].feed();
        }
    }
};

const animalCreator = {
    createAnimal: function(name, speciesName, animalType) {
        const animal = Object.create(animalType);
        animal.init(name, speciesName);
        return animal;
    },
    createChinchilla: function (name) {
        return this.createAnimal(name, "chinchilla", herbivore);
    },
    createFerret: function (name) {
        return this.createAnimal(name, "ferret", carnivore);
    },
    createLion: function (name) {
        return this.createAnimal(name, "lion", carnivore);
    },
    createZebra: function (name) {
        return this.createAnimal(name, "zebra", herbivore);
    }
};

const theZoo = Object.create(zoo);
theZoo.addAnimal(animalCreator.createZebra('Bob'));
theZoo.addAnimal(animalCreator.createLion('Dave'));

theZoo.feedAllAnimals();
