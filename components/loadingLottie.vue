<template lang='pug'>
.loadingLottie(ref="$el")

</template>

<script setup>
import lottie from 'lottie-web';
const $el = ref();

onMounted(() => {
    lottie.loadAnimation({
    container: $el.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '/images/loading-animation.json' // the path to the animation json
    });
})
</script>
<style lang="scss">
.loadingLottie{
    margin-top: 8rem;
    width: 100%;
}
</style>