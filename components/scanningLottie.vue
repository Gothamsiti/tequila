<template lang="pug">
.scanningLottie(:class="[{visible:visible}]")
    img(src="/images/scan.svg")

    p.bold.white(v-html="$__('scanBottle')")

</template>

<script setup>
const props = defineProps(['visible'])
</script>

<style lang ="scss">
.scanningLottie{
    position: fixed;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
    z-index: 100;
    > img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    > p{
        position: absolute;
        left: 50%;
        bottom: 3rem;
        transform: translateX(-50%);
        text-align: center;
    }
    &.visible{
        opacity: 1;
    }
}
</style>