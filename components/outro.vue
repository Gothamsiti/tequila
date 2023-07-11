<template lang="pug">
#outro(:class="[{visible: visible}]")
    .content
        img(src="images/flower.svg")
        div.text.bold.white(v-html="richText(blok.completedText)")
        .actions
            .btn.green( @click="restart()" )
                <svg width="24.8305692px" height="30px" viewBox="0 0 24.8305692 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="tequila_ar-start-copy" transform="translate(-95.333333, -449.308362)" fill="#EFE5D6" fill-rule="nonzero">
                            <g id="Group-2" transform="translate(73.000000, 435.000000)">
                                <path d="M35.6562181,24.9918916 C36.1570308,25.4933279 36.1570308,26.3056556 35.6562181,26.8070919 C35.4166735,27.0496374 35.0895099,27.1854411 34.748618,27.1838457 C34.407726,27.1854411 34.0805624,27.0496374 33.8410178,26.8070919 L28.7036587,21.6697327 C28.202846,21.1682964 28.202846,20.3559688 28.7036587,19.8545325 L33.8410178,14.7171733 C34.1611962,14.3735642 34.6433972,14.2321224 35.0984531,14.3483357 C35.553509,14.464549 35.9088424,14.8198824 36.0250557,15.2749383 C36.141269,15.7299942 35.9998272,16.2121952 35.6562181,16.5323736 L32.7103333,19.4773621 L34.748618,19.4777928 C41.6053903,19.4777928 47.1639026,25.0363051 47.1639026,31.8930774 C47.1639026,38.7498498 41.6053903,44.3083621 34.748618,44.3083621 C27.8957566,44.2989293 22.3427661,38.7459388 22.3333333,31.8930774 C22.3333333,31.1837562 22.9083519,30.6087377 23.6176731,30.6087377 C24.3269944,30.6087377 24.9020129,31.1837562 24.9020129,31.8930774 C24.9020129,37.3312072 29.3104882,41.7396825 34.748618,41.7396825 C40.1867478,41.7396825 44.595223,37.3312072 44.595223,31.8930774 C44.595223,26.4549476 40.1867478,22.0464724 34.748618,22.0464724 L32.7113333,22.0463621 L35.6562181,24.9918916 Z" id="Path-2"></path>
                            </g>
                        </g>
                    </g>
                </svg>

            a.btn.pink( href="https://www.gothamsiti.it")
                span(v-html="blok.completedCtaLabel")
            
    .actions

    mainLogo(:color="'white'")
</template>

<script setup>
const { richText } = richTextModule();
const props = defineProps(['blok','visible'])
const emit = defineEmits(['restart']);
const restart = () => {
    emit('restart')
}


</script>
<style lang="scss">
#outro{
    z-index: 2;
    opacity: 0;
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
    pointer-events: none;
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
        > .actions{
            display: flex;
            gap: 2rem;
        }
    }
    &.visible{
        opacity: 1;
        pointer-events: all;
    }
}

</style>