<template lang="pug">
#intro(:class="[{vanish: vanish}]")
    .text(v-html="'Intro di tequila'")
    #startButton( @click="startAr" )
        span(v-html="'Inizia'")

</template>

<script setup>
const vanish = ref(false)

const startAr = ()=> {
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
    gap: mw(2);
    &.vanish {
        animation: vanish 2s ease-in-out;
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