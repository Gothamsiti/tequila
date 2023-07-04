<template lang="pug">
main#main(:class="{debug:debug}")
    canvas(ref="mainThree")
    
    #stats

    #controls
        button.play(v-html="'PLAY'")
        button.pause(v-html="'PAUSE'")
        button.stop(v-html="'STOP'")
</template>
<script setup>
import ThreeClass from '../class/ThreeClass';
const mainThree = ref();
const debug = ref(false)
onMounted(() => {
    const threeClass = new ThreeClass(false, mainThree.value);
    debug.value = threeClass.debug

})

</script>
<style lang="scss">
#main{
    position: relative;
    width: 100vw;
    height: 100vh;
    &.debug{
        > #stats, > #controls{
            opacity: 1;
            pointer-events: all;
        }
    }
    canvas {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
    }
    > #stats{
        opacity: 0;
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
    }
    > #controls{
        opacity: 0;
        pointer-events: none;
        position: absolute;
        bottom: 10px;
        right: 10px;
        display: flex;
        gap: 10px;
    }
}

</style>
