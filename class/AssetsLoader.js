import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as THREE from 'three';

export default class AssetsLoader {
    constructor(){
        this.textures = {
            agave: null,
            blue: null,
            pink: null,
            red: null,
            violet: null,
            wall: null
        };
        this.loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/draco/' );
        dracoLoader.preload();
        
        this.loader.setDRACOLoader( dracoLoader );
    }

    async loadTextures(){
        const textureLoader = new THREE.TextureLoader();
        let promiseArr = [];
        const keys = Object.keys(this.textures);
        for(var i in keys){ promiseArr.push(textureLoader.loadAsync('./textures/jpg/tequila-texture-'+keys[i]+'.jpg')); }
        
        await Promise.all(promiseArr).then(res => {
            for(var o in res){ 
                res[o].flipY = false;
                res[o].encoding = THREE.sRGBEncoding;
                this.textures[keys[o]] = res[o]; 
                
            }
        }).catch(err => {
            console.log('error loading textures',err);
        })
    }

    async loadModel(src) {
        return await new Promise(async (resolve, reject) => {
            // const loader = new GLTFLoader();
            const model = await this.loader.loadAsync(src);
            if(!model) reject('error loading model', src);

            try{
                model.scene.traverse(node => {
                    if(node.material){
                        node.material.color.setHex(0xffffff);
                        node.material.color.convertLinearToSRGB();

                        if(node.material.name != 'base'){
                            node.material.map = this.textures[node.material.name];
                        }else{
                            node.material.map = this.textures['wall'];
                        }
                    }
                })
                return resolve(model);
            }catch(e){
                console.log('error loading model',src, e);
                return reject(null);
            }
            



        })
    }



}