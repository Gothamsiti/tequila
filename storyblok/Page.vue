<template lang="pug">
#page(v-editable="blok")
    StoryblokComponent(v-for="blok,i in blok.body" :key="blok._uid" :blok="blok" :index="i")
</template>

<script setup>
defineProps({ blok: Object })
console.log('********')
console.log('********')
console.log('********')
console.log('********')
console.log('********')
console.log('********')
</script>
<style lang="scss">
#page{
    position: relative;
    z-index: 1;
}
</style>