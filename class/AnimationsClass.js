export default class AnimationsClass {
    constructor(parent){
        this.parent = parent;
        this.animations = {};
        this.init();
    }
    init(){
        this.parent.scene.traverse(child => {
            if(child.gsapAnimation){
                console.log('hello there', child.gsapAnimation.labels)
            }
        })
    }
}