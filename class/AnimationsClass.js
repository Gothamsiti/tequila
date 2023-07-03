import gsap from 'gsap'
export default class AnimationsClass {
    constructor(parent) {
        this.masterTimeline = gsap.timeline({ repeat: -1 })
        this.parent = parent;
        this.animations = {};
        this.init();
        this.animationTurns = []
    }
    init() {
        this.animationTurns = [
            { name: 'agave', goAfter: null, timeFinished: 0, offsetStart: 0 },
            { name: 'oven', goAfter: 'agave', timeFinished: 0, offsetStart: -2 },
            { name: 'ovenBase', goAfter: 'agave', timeFinished: 0, offsetStart: -3 },
            { name: 'silo', goAfter: 'ovenBase', timeFinished: 0, offsetStart: -7 }
        ]
        this.parent.scene.traverse(child => {
            if (child.gsapAnimation) {
                if (!this.animations[child.gsapAnimation.name]) {
                    this.animations[child.gsapAnimation.name] = []
                }
                this.animations[child.gsapAnimation.name].push(child.gsapAnimation)
                const turn = this.animationTurns.find(item => item.name == child.gsapAnimation.name);
                if(turn) turn.duration = child.gsapAnimation.labels[child.gsapAnimation.name]
            }
        })


        this.animationTurns.map(item => item.timeFinished = this.calcTimeFinished(item.name))
        this.animationTurns.map((turn) => {
            for (let i in this.animations[turn.name]) {
                var time = 0;
                if(turn.goAfter){
                    const prev = this.animationTurns.find(item => item.name == turn.goAfter);
                    if(prev !== undefined) time = prev.timeFinished + turn.offsetStart;
                }
                this.masterTimeline.add(this.animations[turn.name][i], time)
            }
        })
    }
    calcTimeFinished(name, duration) {
        const turn = this.animationTurns.find((item) => item.name == name)
        if(turn){
            let turnDuration = turn.duration;

            if (!turn.goAfter) {
                return turnDuration
            }
            return turnDuration + this.calcTimeFinished(turn.goAfter, turn.duration)
        }
        return 0

    }
}