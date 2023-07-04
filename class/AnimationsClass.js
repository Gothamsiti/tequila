import gsap from 'gsap'
export default class AnimationsClass {
    constructor(parent){
        this.parent = parent;

        this.agaves = null;
        this.oven = null;
        this.ovenBase = null;
        this.silo = null;

        this.coreografie = [];
        this.masterTl = null;

        this.regia = [
            {name: 'agave', offsetStart: 0, inited: false},
            {name: 'ovenBase', offsetStart: -4, inited: false},
            // {name: 'oven', offsetStart: -2, inited: false},
            // {name: 'silo', offsetStart: -7, inited: false}
        ]

        this.init();
    }
    init(){
        this.agaves = this.parent.agaves;
        this.oven = this.parent.oven;
        this.ovenBase = this.parent.ovenBase;
        this.silo = this.parent.silo;

        for(var i in this.agaves){
            const obj = { name: 'agave', tween: this.agaves[i].addToTimeline, context: this.agaves[i] }
            this.coreografie.push(obj);
        }
        this.coreografie.push({name: 'oven', tween: this.oven.addToTimeline, context: this.oven});
        this.coreografie.push({name: 'ovenBase', tween: this.ovenBase.addToTimeline, context: this.ovenBase});
        this.coreografie.push({name: 'silo', tween: this.silo.addToTimeline, context: this.silo});

        this.masterTl = gsap.timeline({repeat: -1});

        for(var c in this.coreografie){
            this.addToTimeline(this.coreografie[c])
        }
    }
    addToTimeline(coreografia){
        for(var i in this.regia){
            if(coreografia.context.inited === false){
                setTimeout(() => {
                    this.addToTimeline(coreografia)
                }, 100);
                return;
            }

            if(this.regia[i].name != coreografia.name) continue;
            if(!this.regia[i].inited){
                var position = null;
                if(this.regia[i].offsetStart){
                    position = this.regia[i].offsetStart > 0 ? '>+'+this.regia[i].offsetStart : '>'+this.regia[i].offsetStart
                }

                console.log(position)
                this.masterTl.add(coreografia.tween(coreografia.context),position)
                this.masterTl.addLabel(coreografia.name)
                this.regia[i].inited = true;
            }else{
                const labelStart = this.masterTl.labels[coreografia.name];
                if(labelStart){
                    this.masterTl.add(coreografia.tween(coreografia.context),coreografia.name+'-='+labelStart)
                }
            }
        }
    }



    // constructor(parent) {
    //     this.masterTimeline = gsap.timeline({ repeat: -1 })
    //     this.parent = parent;
    //     this.animations = {};
    //     this.init();
    //     this.animationTurns = []
    // }
    // init() {
    //     this.animationTurns = [
    //         { name: 'agave', goAfter: null, timeFinished: 0, offsetStart: 0 },
    //         { name: 'oven', goAfter: 'agave', timeFinished: 0, offsetStart: -2 },
    //         { name: 'ovenBase', goAfter: 'agave', timeFinished: 0, offsetStart: -3 },
    //         { name: 'silo', goAfter: 'ovenBase', timeFinished: 0, offsetStart: -7 }
    //     ]
    //     this.parent.scene.traverse(child => {
    //         if (child.gsapAnimation) {
    //             if (!this.animations[child.gsapAnimation.name]) {
    //                 this.animations[child.gsapAnimation.name] = []
    //             }
    //             this.animations[child.gsapAnimation.name].push(child.gsapAnimation)
    //             const turn = this.animationTurns.find(item => item.name == child.gsapAnimation.name);
    //             if(turn) turn.duration = child.gsapAnimation.labels[child.gsapAnimation.name]
    //         }
    //     })


    //     this.animationTurns.map(item => item.timeFinished = this.calcTimeFinished(item.name))
    //     this.animationTurns.map((turn) => {
    //         for (let i in this.animations[turn.name]) {
    //             var time = 0;
    //             if(turn.goAfter){
    //                 const prev = this.animationTurns.find(item => item.name == turn.goAfter);
    //                 if(prev !== undefined) time = prev.timeFinished + turn.offsetStart;
    //             }
    //             this.masterTimeline.add(this.animations[turn.name][i], time)
    //         }
    //     })
    // }
    // calcTimeFinished(name, duration) {
    //     const turn = this.animationTurns.find((item) => item.name == name)
    //     if(turn){
    //         let turnDuration = turn.duration;

    //         if (!turn.goAfter) {
    //             return turnDuration
    //         }
    //         return turnDuration + this.calcTimeFinished(turn.goAfter, turn.duration)
    //     }
    //     return 0

    // }
}