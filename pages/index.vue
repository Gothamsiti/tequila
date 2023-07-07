<template lang="pug">
main#ar
    loading(:class="[{ready : ready}]")
    intro(v-if="story && story.content && story.content.body  && story.content.body[0]" :blok="story.content.body[0]" @start="setScanningVisble")
    scanning(:visible="scanningVisible"  :scannable="scannable")
    canvas#camerafeed
    #stats
    
</template>
<script setup>
import ArClass from '~/class/ArClass';
import * as THREE from 'three';
const config = useRuntimeConfig()
useHead({
    meta: [
        { name: "apple-mobile-web-app-capable", content: "yes" }
    ],
    script: [
        {
            async: true,
            src: "https://apps.8thwall.com/xrweb?appKey=Y4I2yWsKJKoiGiw4Av3vRfChial4i6NwjzMDMM5ZI5v1iGPCJqcPkHxAEsfXBc4Yp88ZD"
        },
        {
            src: 'https://cdn.8thwall.com/web/xrextras/xrextras.js',
        },
        {
            src: "https://cdn.8thwall.com/web/landing-page/landing-page.js"
        },
        {
            src: 'https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'
        }
    ]
});
const scanningVisible = ref(false)
const scannable = ref(false)

const ready = ref(false)
const story = await useAsyncStoryblok('/home', { version: config.public.storyblokVersion });

onMounted(() => {
    const el = document.documentElement;
    // if (el.requestFullscreen) el.requestFullscreen();
    // if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    // if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    const arClass = ref(new ArClass());
    window.THREE = THREE;
    const onxrloaded = () => {
        arClass.value.init();
    }
    watch(()=>arClass.value.ready ,(v)=> {
        console.log(v)
        if(!Object.values(v).includes(false)){
            ready.value = true;
        }
    })
    watch(()=>arClass.value.scannable ,(v)=> {
        if(v){
            scannable.value = true
        }
    })
    watch(()=>arClass.value.found ,(v)=> {
        if(v){
            scannable.value= false;
        }
    })

    watch(()=>arClass.value.animationCompleted ,(v)=> {
        
    })
    
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded);
})


const setScanningVisble= ()=>{
 console.log('aooooh')
 scanningVisible.value= true;
 scannable.value= true;
}

// setTimeout(()=> {
//     ready.value = true;
// }, 2000)

</script>
<style lang="scss">
html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    position: relative;
    overflow: hidden;
}


#__nuxt {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    > #app{
        position: absolute;
        height: 100%;
        width: 100%;
        > main#ar {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
            background: rgb(26, 26, 26);
            > #stats{
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
            }

            canvas#camerafeed,
            >video {
                position: absolute;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
        }
    }
}


</style>