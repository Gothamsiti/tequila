<template lang="pug">
#splash(:class="{hidden: hidden}")
    .main-image
    h1 {{  "Tequila" }}  
</template>

<script setup>
const hidden = ref(false)
setTimeout(()=> {
    hidden.value = true
}, 3000)

</script>

<style lang="scss">
#splash {
    width: 100%;
    height: 100%;
    position: fixed;;
    z-index: 999;
    background-color: #2196f3;
    display: flex;
    justify-content: center;
    align-items: center;
    top:0;
    flex-direction: column;
    &.hidden {
        animation: splash 1s ease-in-out;
            opacity: 0;
            z-index: 0;
        }
    > .main-image {
        mix-blend-mode: multiply;
        width: 512px;
        height: 512px;
        background: url('/images/icons/icon-512x512.png');
        opacity: 1;
        
    }
}
</style>