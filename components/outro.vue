<template lang="pug">
#outro(:class="[{appear: appear}]")
    .text(v-html="richText(blok.outroText)")
   
</template>

<script setup>
const { richText } = richTextModule();
const props = defineProps(['blok','appear'])


</script>
<style lang="scss">
#outro{
    

    z-index: 0;
    opacity: 0;
    background-color: $white;
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: mw(4);
    box-sizing: border-box;
    gap: mw(2);
    &.appear {
        z-index: 998;
        opacity: 1;
        animation: appear 2s ease-out;
    }
}

</style>