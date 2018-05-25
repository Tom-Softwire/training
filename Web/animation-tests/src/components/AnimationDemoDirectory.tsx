import AnimationDemo from "./animationsDemos/AbstractAnimationDemo";
import TestAnimation from "./animationsDemos/TestAnimation";

interface IAnimationDemosByName {[urlKey: string]: typeof AnimationDemo}

const animationDemosByName: IAnimationDemosByName = {
    testAnimation: TestAnimation
};

abstract class AnimationDemoDirectory {
    public static getAllByUrlKey(): IAnimationDemosByName {
        return animationDemosByName;
    }
    public static doesExistByUrlKey(urlKey: string): boolean {
        return animationDemosByName.hasOwnProperty(urlKey);
    }
    public static getByUrlKey(urlKey: string): typeof AnimationDemo {
        return animationDemosByName[urlKey] || null;
    }
}

export default AnimationDemoDirectory;