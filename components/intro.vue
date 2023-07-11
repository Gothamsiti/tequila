<template lang="pug">
#intro(:class="[{hide:hide}]")
    .content
        img(src="/images/flower.svg")
        div.text.bold.white(v-html="richText(blok.introText)")
        .btn.pink( @click="startAr" )
            span(v-html="blok.introCtaLabel")
    
    mainLogo(:color="'white'")

</template>
<script setup>
const props = defineProps(['blok', 'hide'])
const { richText } = richTextModule();
const vanish = ref(false);
const emit = defineEmits(['start']);
const startAr = ()=> {
    emit('start')
    vanish.value = true
}

</script>
<style lang="scss">
#intro{
    z-index: 2;
    opacity: 1;
    position: fixed;
    width: 100%;
    height: 100%;
    padding: 6rem 4rem;
    box-sizing: border-box;
    background: $blue;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    transition: opacity $dt $de;
    > .content{
        display: flex;
        flex-direction: column;
        align-items: center;
        > img{
            margin-bottom: 4rem;
        }
        > .text{
            text-align: center;
        }
    }
    &.hide{
        opacity: 0;
        pointer-events: none;
    }
}

</style>