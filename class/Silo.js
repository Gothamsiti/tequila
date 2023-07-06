import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import gsap from 'gsap' 
export default class Silo {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings;

        this.siloGroup = null;
        this.baseGroup = null;
        this.ladder = null
        this.oblo = null;
        this.objMorphs = {}
        this.perno = {};
        this.inited = false;
        this.init()
    }
    async init(){
        const model = await this.parent.loadModel('./models/silo_texture.glb');

        this.siloGroup = new THREE.Group();
        this.siloGroup.position.y = this.settings.position.y;
        this.siloGroup.rotation.y = this.settings.rotation.y;

        const silo = model.scene.children.find(c => c.name == "movement-totale");

        this.perno.dx = silo.getObjectByName('perno-dx')
        this.perno.sx = silo.getObjectByName('perno-sx')
        this.perno.dx.traverse(child => {
            if(child.material) child.material.transparent = true;
        })
        this.perno.sx.traverse(child => {
            if(child.material) child.material.transparent = true;
        })

        const base = silo.getObjectByName('silo_base');
        const gambe = silo.getObjectByName('gambe');
        this.baseGroup = new THREE.Group();
        this.baseGroup.add(base);
        this.baseGroup.add(gambe);

        this.siloGroup.add(this.perno.sx)
        this.siloGroup.add(this.perno.dx)
        this.siloGroup.add(this.baseGroup)

        this.ladder = model.scene.children.find(c => c.name == "ladder");
        this.siloGroup.add(this.ladder)

        this.oblo = silo.getObjectByName('oblo')
        this.siloGroup.add(this.oblo);

        this.siloGroup.rotation.y = THREE.MathUtils.degToRad(0);

        this.group.add(this.siloGroup);
        if(this.parent.debug){
            const gui = new GUI();
            for(var i in this.perno){
                const gui_group = gui.addFolder(i);
                this.perno[i].traverse(child => {
                    if(child.morphTargetDictionary){
                        const influences = child.morphTargetInfluences;
                        const dictionary = child.morphTargetDictionary;
                        for ( const [ key, value ] of Object.entries( dictionary ) ) {
                            if(!this.objMorphs[key]) this.objMorphs[key] = influences[value]
                            gui_group.add( influences, value, 0, 1, 0.01 ).name( key ).listen( influences );
                        }
                    }
                })
            }
        }
        this.inited = true;
        this.parent.ready.silo = true;
    }
    addToTimeline(context){
        var morphs = context.initMorph(context);
        const tl = gsap.timeline({
            onUpdate : () => {
                const currentLabel = tl.currentLabel();
                if(currentLabel == 'group_in'){
                    context.siloGroup.position.y = group_in.positionY;
                    context.siloGroup.rotation.y = THREE.MathUtils.degToRad(group_in.rotationY);
                }

                if(currentLabel == 'morph'){
                    context.perno.dx.traverse(child => {
                        if(child.morphTargetDictionary){
                            if(child.morphTargetDictionary['alambicco-dx'] !== undefined) child.morphTargetInfluences[morphs.dx['alambicco-dx'].index] = morphs.dx['alambicco-dx'].value;
                            if(child.morphTargetDictionary['anelli-alambicco'] !== undefined) child.morphTargetInfluences[morphs.dx['anelli-alambicco'].index] = morphs.dx['anelli-alambicco'].value;
                            if(child.morphTargetDictionary['anelli-botti'] !== undefined) child.morphTargetInfluences[morphs.dx['anelli-botti'].index] = morphs.dx['anelli-botti'].value;
                            if(child.morphTargetDictionary['botte-dx'] !== undefined) child.morphTargetInfluences[morphs.dx['botte-dx'].index] = morphs.dx['botte-dx'].value;
                        }
                    })
                    context.perno.sx.traverse(child => {
                        if(child.morphTargetDictionary){
                            if(child.morphTargetDictionary['alambicco-sx'] !== undefined) child.morphTargetInfluences[morphs.sx['alambicco-sx'].index] = morphs.sx['alambicco-sx'].value;
                            if(child.morphTargetDictionary['anelli-alambicco'] !== undefined) child.morphTargetInfluences[morphs.sx['anelli-alambicco'].index] = morphs.sx['anelli-alambicco'].value;
                            if(child.morphTargetDictionary['anelli-botti'] !== undefined) child.morphTargetInfluences[morphs.sx['anelli-botti'].index] = morphs.sx['anelli-botti'].value;
                            if(child.morphTargetDictionary['botte-sx'] !== undefined) child.morphTargetInfluences[morphs.sx['botte-sx'].index] = morphs.sx['botte-sx'].value;
                        }
                    })
                }

                if(currentLabel == 'fade_out'){
                    context.perno.dx.traverse(child => {
                        if(child.material) child.material.opacity = opacity.value;
                    })
                    context.perno.sx.traverse(child => {
                        if(child.material) child.material.opacity = opacity.value;
                    })
                }
            },
            onComplete : () => {
                context.resetTimeline(context)
            }
        });

        tl.addLabel('group_in'); //ENTRA IL GRUPPO
        const group_in = {positionY: context.siloGroup.position.y, rotationY: 0}
        tl.to(group_in,{ positionY: 0, rotationY: 0, duration: 2})

        tl.addLabel('ladder_in'); //ENTRA LA SCALA
        tl.to(context.ladder.rotation,{ z: THREE.MathUtils.degToRad(20), duration: 2, ease: 'bounce.out' }, '<+=1')
        tl.to(context.ladder.position,{ y: 0, duration: .5, ease: 'bounce.out' }, '<')


        tl.addLabel('morph')
        tl.to([ //DA SILO AD ALAMBICCO
                morphs.dx['anelli-alambicco'],
                morphs.sx['anelli-alambicco'],
                morphs.dx['alambicco-dx'],
                morphs.sx['alambicco-sx'],
            ],{
                value: 1,
                duration: 1
        },'+=3')

        //ENTRA OBLO
        tl.to(context.oblo.rotation,{ z: THREE.MathUtils.degToRad(90) },'<')
        tl.to(context.oblo.position,{ z: 1 },'<')

        //CADE LA SCALA
        tl.to(context.ladder.rotation,{ z: THREE.MathUtils.degToRad(-90), duration: 1 }, '<')
        tl.to(context.ladder.position,{ y: -.1, duration: 1 }, '<')


        tl.to([ // DA ALAMBICCO A BOTTE
            morphs.dx['anelli-alambicco'],
            morphs.sx['anelli-alambicco'],
            morphs.dx['alambicco-dx'],
            morphs.sx['alambicco-sx'],
        ],{
            value: 0,
            duration: 1
        }, '+=3')
        tl.to([
            morphs.dx['anelli-botti'],
            morphs.sx['anelli-botti'],
            morphs.dx['botte-dx'],
            morphs.sx['botte-sx'],
        ],{
            value: 1,
            duration: 1
        },'<')

        //ESCE OBLO
        tl.to(context.oblo.rotation,{ z: 0 },'<')
        tl.to(context.oblo.position,{ z: 0 },'<')
        
        tl.addLabel('base_move'); // LA BASE ESCE 
        tl.to(context.baseGroup.position,{y:-1, duration: 1},'<')

        // IL BARILE SI APRE
        tl.to(context.perno.dx.rotation,{ y: THREE.MathUtils.degToRad(45)},'+=3')
        tl.to(context.perno.sx.rotation,{ y: THREE.MathUtils.degToRad(-45)},'<')

        tl.addLabel('fade_out');
        const opacity = {value: 1}
        tl.to(opacity, { value: 0 },'+=3')

        return tl
    }
    initMorph(context){
        var morphs = {};
        for(var i in context.perno){
            if(!morphs[i]) morphs[i] = {}
            context.perno[i].traverse(child => {
                if(child.morphTargetDictionary){
                    let keys = Object.keys(child.morphTargetDictionary);
                    for(var k in keys){
                        if(!morphs[i][keys[k]]){
                            morphs[i][keys[k]] = {
                                index: child.morphTargetDictionary[keys[k]],
                                value: child.morphTargetInfluences[k]
                            }
                        }
                    }
                }
            })
        }

        return morphs;
    }
    resetTimeline(context){
        //RESET ALLA SITUAZIONE INIZIALE

        var morphs = context.initMorph(context);
        context.perno.dx.traverse(child => {
            if(child.material) child.material.opacity = 1;
            if(child.morphTargetDictionary){
                if(child.morphTargetDictionary['alambicco-dx'] !== undefined) child.morphTargetInfluences[morphs.dx['alambicco-dx'].index] = 0;
                if(child.morphTargetDictionary['anelli-alambicco'] !== undefined) child.morphTargetInfluences[morphs.dx['anelli-alambicco'].index] = 0;
                if(child.morphTargetDictionary['anelli-botti'] !== undefined) child.morphTargetInfluences[morphs.dx['anelli-botti'].index] = 0;
                if(child.morphTargetDictionary['botte-dx'] !== undefined) child.morphTargetInfluences[morphs.dx['botte-dx'].index] = 0;
            }
        })
        context.perno.sx.traverse(child => {
            if(child.material) child.material.opacity = 1;
            if(child.morphTargetDictionary){
                if(child.morphTargetDictionary['alambicco-sx'] !== undefined) child.morphTargetInfluences[morphs.sx['alambicco-sx'].index] = 0;
                if(child.morphTargetDictionary['anelli-alambicco'] !== undefined) child.morphTargetInfluences[morphs.sx['anelli-alambicco'].index] = 0;
                if(child.morphTargetDictionary['anelli-botti'] !== undefined) child.morphTargetInfluences[morphs.sx['anelli-botti'].index] = 0;
                if(child.morphTargetDictionary['botte-sx'] !== undefined) child.morphTargetInfluences[morphs.sx['botte-sx'].index] = 0;
            }
        })
        context.perno.sx.rotation.y = 0;
        context.perno.dx.rotation.y = 0;
        context.siloGroup.position.y = context.settings.position.y;
    }
}