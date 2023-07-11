<template lang="pug">
main#ar(v-if="story && story.content")
    loading(:ready="ready")
    intro(:hide="started" :blok="story.content" @start="handleStart()")
    scanningLottie(:visible="started && scanning")
    outro(:visible="animationCompleted" :blok="story.content" @restart="handleReStart()")
    canvas#camerafeed
    #stats
    
</template>
<script setup>
import ArClass from '~/class/ArClass';
import * as THREE from 'three';
const config = useRuntimeConfig()
useHead({
    meta: [
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" }
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

const ready = ref(false);
const started = ref(false);
const scanning = ref(false);
const animationCompleted = ref(false);

var clock = null;

const story = await useAsyncStoryblok('/interfaccia-ar', { version: config.public.storyblokVersion });
var arClass = null;
const handleStart = () => {
    started.value = true;
    scanning.value = true;
    arClass.threeClass.canStart = true;
}
const handleReStart = () => {
    started.value = true;
    scanning.value = true;
    arClass.animationCompleted = false;
    arClass.threeClass.animationsClass.restartTimeline();
}

onMounted(() => {
    arClass = new ArClass();
    window.THREE = THREE;
    clock = new THREE.Clock();
    const onxrloaded = () => {
        arClass.init();
    }
    animate();
    window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded);
})

const animate = () => {
    ready.value = arClass.ready;
    animationCompleted.value = arClass?.threeClass?.animationsClass?.animationCompleted;

    if(started.value){
        if(arClass.targetFound){
            scanning.value = false;
            clock.start();
        }

        if(!arClass.targetFound && clock.getElapsedTime() > 2 && !animationCompleted.value){
            scanning.value = true;
        }
    }


    requestAnimationFrame(() => {
        animate();
    })
}
</script>