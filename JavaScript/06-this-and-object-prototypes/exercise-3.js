class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
        this.hunger = 0;

        this.foodForSpecies = {
            zebra: "grass",
            chinchilla: "fruits and seeds",
            lion: "large prey",
            ferret: "small prey"
        };
    }

    feed() {
        this.hunger = 0;
        console.log(`${this.name}, the ${this.type} ${this.species}, was fed ${this.getFoodName()}!`);
    }

    getFoodName() {
        return this.foodForSpecies[this.species] || "";
    }
}

class Herbivore extends Animal {
    constructor() {
        super(...arguments);
        this.type = "herbivore";
        this.costOfFood = 200;
    }
}

class Carnivore extends Animal {
    constructor() {
        super(...arguments);
        this.type = "carnivore";
        this.costOfFood = 500;
    }
}

class Zoo {
    constructor() {
        this.cash = 4000;
        this.animals = [];
    }

    addAnimal(animal) {
        this.animals.push(animal);
    }

    spend(amount) {
        if (this.cash < amount) {
            throw "Not enough money!";
        }
        this.cash -= amount;
        console.log(`Remaining funds: ${this.cash}`);
    }

    feedAllAnimals() {
        this.animals.forEach((animal) => {
            try {
                this.spend(animal.costOfFood);
            } catch (e) {
                console.log("Cannot feed animal: not enough cash!");
                return;
            }
            animal.feed();
        });
    }
}

class AnimalCreator {
    static createAnimal(name, speciesName, animalType) {
        return new animalType(name, speciesName);
    }

    static createChinchilla(name) {
        return this.createAnimal(name, "chinchilla", Herbivore);
    }

    static createFerret(name) {
        return this.createAnimal(name, "ferret", Carnivore);
    }

    static createLion(name) {
        return this.createAnimal(name, "lion", Carnivore);
    }

    static createZebra(name) {
        return this.createAnimal(name, "zebra", Herbivore);
    }
}

const zoo = new Zoo();
zoo.addAnimal(AnimalCreator.createZebra('Bob'));
zoo.addAnimal(AnimalCreator.createLion('Dave'));

zoo.feedAllAnimals();
