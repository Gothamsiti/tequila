<template lang="pug">
#loading(:class="[{ready:ready}]")
    loadingLottie
    mainLogo(:color="'blue'")

</template>
<script setup>
const props = defineProps(['ready'])
</script>

<style lang="scss">
#loading {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 100;
    overflow: hidden;
    background: $grey;
    opacity: 1;
    transition: opacity $dt $de;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 6rem 4rem;
    box-sizing: border-box;
    &.ready{
        opacity: 0;
        pointer-events: none;

    }
}

</style>

