import gsap from 'gsap' 
export default class AnimationsClass {
    constructor(parent){
        this.masterTimeline = gsap.timeline({ repeat:-1 })
        this.parent = parent;
        this.animations = {};
        this.init();
    }
    init(){
        this.parent.scene.traverse(child => {
            if(child.gsapAnimation){
                if(!this.animations[child.gsapAnimation.name]){
                    this.animations[child.gsapAnimation.name] = [child.gsapAnimation]
                }else{
                    this.animations[child.gsapAnimation.name].push(child.gsapAnimation)
                }
            }
        })

        for(var i in this.animations){
            for(var k in this.animations[i]){
                if(i == 'agave'){
                    this.masterTimeline.add(this.animations[i][k], 0)
                }
                if(i == 'tower'){
                    this.masterTimeline.add(this.animations[i][k], 3)
                }
            }
        }
    }
}