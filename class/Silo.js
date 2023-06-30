import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import gsap from 'gsap' 
export default class Silo {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings;

        this.init()
    }
    async init(){
        const model = await this.parent.loadModel('./models/silo.glb')
        this.siloGroup = new THREE.Group()
        this.silo = {};

        this.silo.sx = model.scene.children[0].children[0]
        this.silo.dx = model.scene.children[1].children[0]

        this.silo.sx.material.transparent = true;
        this.silo.sx.material.transparent = true;
        
        this.siloGroup.add(this.silo.sx)
        this.siloGroup.add(this.silo.dx)
        this.siloGroup.position.y = this.settings.position.y;

        this.group.add(this.siloGroup);
        if(this.parent.deug){
            const gui = new GUI();
            for(var i in this.silo){

                const gui_group = gui.addFolder(i);
                const influences = this.silo[i].morphTargetInfluences;
                const dictionary = this.silo[i].morphTargetDictionary;
                for ( const [ key, value ] of Object.entries( dictionary ) ) {
                    gui_group.add( influences, value, 0, 1, 0.01 ).name( key ).listen( influences );
                }
            }
        }

        this.addToTimeline();
    }
    addToTimeline(){
        const toAnimate = this.silo.sx.morphTargetInfluences;
        const dictionary = this.silo.sx.morphTargetDictionary;

        const obj = {};
        for ( const [ key, value ] of Object.entries( dictionary ) ) {
            obj[key] = toAnimate[value];
        }
        obj.opacity = 1;

        const box = new THREE.Box3().setFromObject( this.siloGroup  ); 
        const size = box.getSize(new THREE.Vector3());

        const tl = gsap.timeline();
        tl.to(
            this.siloGroup.position,{
                y: size.y / 2,
                duration: 1,
            }
        )
        tl.to(obj,
            {
                alambicco: 1,
                duration: 2,
                onUpdate : () => {
                    const index = dictionary.alambicco;
                    this.silo.sx.morphTargetInfluences[index] = obj.alambicco;
                    this.silo.dx.morphTargetInfluences[index] = obj.alambicco;
                }
            })

        tl.to(obj,
            {
                alambicco: 0,
                botte: 1,
                duration: 2,
                onUpdate : () => {
                    const index_alambicco = dictionary.alambicco;
                    this.silo.sx.morphTargetInfluences[index_alambicco] = obj.alambicco;
                    this.silo.dx.morphTargetInfluences[index_alambicco] = obj.alambicco;

                    const index_botte = dictionary.botte;
                    this.silo.sx.morphTargetInfluences[index_botte] = obj.botte;
                    this.silo.dx.morphTargetInfluences[index_botte] = obj.botte;
                }
            })

        tl.to(obj,
            {
                botte: 0,
                botte_aperta: 1,
                duration: 2,
                onUpdate : () => {
                    const index_botte = dictionary.botte;
                    this.silo.sx.morphTargetInfluences[index_botte] = obj.botte;
                    this.silo.dx.morphTargetInfluences[index_botte] = obj.botte;

                    const index_botte_aperta = dictionary.botte_aperta;
                    this.silo.sx.morphTargetInfluences[index_botte_aperta] = obj.botte_aperta;
                    this.silo.dx.morphTargetInfluences[index_botte_aperta] = obj.botte_aperta;
                }
            })

        tl.to(obj,{
            opacity: 0,
            onUpdate : () => {
                this.silo.sx.material.opacity = obj.opacity;
                this.silo.dx.material.opacity = obj.opacity;
            },
            onComplete: () => {
                for(var i in this.silo.sx.morphTargetInfluences){
                    this.silo.sx.morphTargetInfluences[i] = 0;
                    this.silo.dx.morphTargetInfluences[i] = 0;
                    this.silo.sx.material.opacity = 1;
                    this.silo.dx.material.opacity = 1;
                    this.siloGroup.position.y = this.settings.position.y;
                }
            }
        })
            
        tl.addLabel('silo')
        tl.name = 'silo'
        this.siloGroup.gsapAnimation = tl
    }
}