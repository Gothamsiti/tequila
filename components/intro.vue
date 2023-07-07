<template lang="pug">
#intro(:class="[{vanish: vanish}]")
    .text(v-html="richText(blok.introText)")
    #startButton( @click="startAr" )
        span(v-html="blok.ctaLabel")

</template>

<script setup>
const { richText } = richTextModule();
const props = defineProps(['blok'])
const vanish = ref(false)
const emit = defineEmits(['start']);
const startAr = ()=> {
    emit('start')
    vanish.value = true
}

</script>
<style lang="scss">
#intro{
    z-index: 998;
    opacity: 1;
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
    &.vanish {
        animation: vanish 1s ease-in-out;
        z-index: 0;
        opacity: 0;
    }
}
#startButton {
    color: $white;
    padding: 5px 20px;
    background:$blueAgave;
    border-radius: 50px;

}

</style>