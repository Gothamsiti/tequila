import * as THREE from 'three'

export default class Silo {
    constructor(parent, group, settings){
        this.parent = parent;
        this.group = group;
        this.settings = settings;
        this.silo = null

        this.init()
    }
    async init(){
        this.bottle = await this.parent.loadModel('./models/silo.glb')

    }
}