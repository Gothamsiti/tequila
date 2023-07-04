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
            {name: 'ovenBase', offsetStart: -3, inited: false},
            {name: 'oven', offsetStart: -11, inited: false},
            {name: 'silo', offsetStart: -1, inited: false}
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

        this.masterTl = gsap.timeline({paused: true, repeat: -1});

        for(var o in this.regia){
            for(var c in this.coreografie){
                if(this.regia[o].name != this.coreografie[c].name) continue;
                this.addToTimeline(this.coreografie[c], this.regia[o], o)
            }
        }
        if(this.parent.debug){
            const controls = document.getElementById('controls');
            if(controls){
                const playBtn = controls.getElementsByClassName('play')[0];
                if(playBtn){
                    playBtn.addEventListener('click',() => {
                        this.masterTl.play();
                    })
                }
                const pauseBtn = controls.getElementsByClassName('pause')[0];
                if(pauseBtn){
                    pauseBtn.addEventListener('click',() => {
                        this.masterTl.pause();

                    })
                }
                const stop = controls.getElementsByClassName('stop')[0];
                if(stop){
                    stop.addEventListener('click',() => {
                        this.masterTl.seek(0,false);
                        this.masterTl.pause();
                    })
                }
            }


        }
    }
    addToTimeline(coreografia, turno, index){
        if(coreografia.context.inited === false){
            setTimeout(() => {
                this.addToTimeline(coreografia, turno, index)
            }, 100);
            return;
        }
        if(!this.regia[index].inited){
            var position = 0;
            if(turno.offsetStart !== undefined){
                position = turno.offsetStart >= 0 ? '>+'+turno.offsetStart : '>'+turno.offsetStart
            }
            this.masterTl.add(coreografia.tween(coreografia.context), position)
            this.masterTl.addLabel(coreografia.name)
            turno.inited = true;
        }else{
            const labelStart = this.masterTl.labels[coreografia.name];
            if(labelStart){
                this.masterTl.add(coreografia.tween(coreografia.context),coreografia.name+'-='+labelStart)
            }
        }
    }
}