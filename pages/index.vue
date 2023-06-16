<template lang="pug">
main#main
    canvas(ref="mainThree")
    #stats
</template>
<script setup>
import ThreeClass from '../class/ThreeClass';
const mainThree = ref();
onMounted(() => {
    const threeClass = new ThreeClass(mainThree.value);

})
</script>
<style lang="scss">
#main{
    position: relative;
    width: 100vw;
    height: 100vh;

    canvas {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
    }
    > #stats{
        position: absolute;
        left: 0;
        top: 0;
    }
}

</style>
