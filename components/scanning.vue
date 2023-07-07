<template lang="pug">
#scanning(:class="[{invisible: !visible, scannable: visible && scannable  }]")
</template>

<script setup>
const props = defineProps(['visible', 'scannable'])
</script>

<style lang ="scss">
#scanning{
    z-index: 0;
    position: fixed;
    opacity: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50% , -50%);
    width: calc(100vw - #{mw(6)});
    height: calc(100vh - #{mw(6)});
    background-color: #b2b2b255;
    &.scannable{
        z-index: 997;
        opacity: 1;
        animation: appear  2s ease-out;
        &.invisible{
            z-index: 0;
            opacity: 0;
            animation: vanish 1s ease-in-out;
        }
    }
    
}
</style>