import * as THREE from 'three'

export default class Bottle {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings
        this.bottle = null;
        this.bottleScale =1.5;
        this.init()
    }

    async init(){
        this.bottle = await this.parent.loadModel('./models/bottiglia.glb')
        
        const trasparentMaterial = new THREE.MeshPhongMaterial( {color: 0xffAAAA , colorWrite: false} );
        this.bottle.scene.children[0].material =  trasparentMaterial;
        
        this.bottle.scene.scale.set(this.bottleScale, this.bottleScale, this.bottleScale) 
        const box = new THREE.Box3().setFromObject( this.bottle.scene  ); 
        const size = box.getSize(new THREE.Vector3());
        this.bottle.scene.position.y = this.settings.position.y + size.y /2 
        this.group.add(this.bottle.scene)
    }

}