import gsap from 'gsap' 
export default class AnimationsClass {
    constructor(parent){
        this.masterTimeline = gsap.timeline({ repeat:-1 })
        this.parent = parent;
        this.animations = {};
        this.init();
        this.animationTurns =[]
    }
    init(){
        this.animationTurns = [
            {name : 'agave', index: 0, goAfter : null },
            {name : 'oven', index: 1, goAfter: 'agave' }
        ]
        this.parent.scene.traverse(child => {
            if(child.gsapAnimation){
                if(!this.animations[child.gsapAnimation.name]){
                    this.animations[child.gsapAnimation.name] = [child.gsapAnimation]
                }else{
                    this.animations[child.gsapAnimation.name].push(child.gsapAnimation)
                }
            }
        })

        

        this.animationTurns.map((turn)=> {
            for(let i in this.animations[turn.name]){
                // console.log('animations', turn.name,this.animations[turn.name][0].labels  , turn.goAfter,turn.goAfter ?  this.animations[turn.goAfter][0].labels : 0)
                this.masterTimeline.add(this.animations[turn.name][i], turn.goAfter ? this.animations[turn.goAfter][i].labels[turn.goAfter] : 0 )
            }
        })
        
        // for(var i in this.animations){
        //     for(var k in this.animations[i]){
        //         if(i == 'agave'){  
        //             console.log('agave', 'k',k)
                    
        //             this.masterTimeline.add(this.animations[i][k],0)
        //         }
        //         if(i == 'oven'){
        //             console.log('oven', 'k',k)
        //             this.masterTimeline.add(this.animations[i][k], 2.46 )
        //         }
        //     }
        // }
    }
}