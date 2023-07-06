// import { storyblokInit, apiPlugin } from "@storyblok/js";
export default defineNuxtPlugin(async nuxtApp => {
    // const runtimeConfig = useRuntimeConfig();
    // const storyblokApi = useStoryblokApi();
    // var labels = {};
    // const sbConfigs = { 
    //   starts_with:'system/labels',
    //   version: runtimeConfig.public.storyblokVersion 
    // };
    // const labelsStories = await storyblokApi.getAll('cdn/stories',sbConfigs);
    // for(var story of labelsStories){
    //     if(story.content && story.content.items){
    //         for(var label of story.content.items){
    //           labels[label.key] = label.text;
    //         }
    //     }
    // }
    nuxtApp.provide('__', (...args) => {
        var s = args[0];
        s = labels[s] ? labels[s] : s;
        for(var i = 1; i < args.length ; i++){
            s = s.replace("%s",args[i]);
        }
        return s;
    });
})