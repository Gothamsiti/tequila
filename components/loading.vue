<template lang="pug">
#loading
    h2(v-html="$__('loading')")
    #backgroundGradient

</template>

<script setup>

</script>

<style lang="scss">
#loading {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 999;
    overflow: hidden;
    &.ready{
        animation: vanish 1s ease-in-out;
        z-index: 0;
        opacity: 0;
    }
    > h2 {
        position: absolute;
        z-index: 1;
        color: $white;
        top: 50%;
        mix-blend-mode:screen;
        left: 50%;
        transform: translate(-50%, -50%);
    }


}




#backgroundGradient {
    position:absolute;
    background:$blueAgave;
    /* background: linear-gradient(45deg, #669999, #2E5050); */
    background-size: vw(300) 100%;
    animation: gradient 10s ease-in-out infinite;
    z-index: 0;
    width:100vw;
    height: 100vh;
}

    /* @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    } */

</style>

