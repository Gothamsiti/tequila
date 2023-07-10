export default defineNuxtPlugin(nuxtApp => {
    if(process.client){
        let vh = window.innerHeight * 0.01;
        var windowWidth =
            window.innerWidth > document.body.clientWidth
            ? document.body.clientWidth
            : window.innerWidth;
        let vw = windowWidth * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        document.documentElement.style.setProperty("--vw", `${vw}px`);
        if (navigator.userAgent.indexOf("Version/") == -1 || navigator.userAgent.indexOf("CriOS/8") == -1 || !navigator.userAgent.match(/iPhone/i)) {
            window.addEventListener("resize", () => {
                let vh = window.innerHeight * 0.01;
                var windowWidth =
                window.innerWidth > document.body.clientWidth
                    ? document.body.clientWidth
                    : window.innerWidth;
                let vw = windowWidth * 0.01;
                document.documentElement.style.setProperty("--vh", `${vh}px`);
                document.documentElement.style.setProperty("--vw", `${vw}px`);
            });
        }
        window.addEventListener("orientationchange", () => {
            let vh = window.innerHeight * 0.01;
            var windowWidth = 
            window.innerWidth > document.body.clientWidth
            ? document.body.clientWidth
            : window.innerWidth;
            let vw = windowWidth * 0.01;
            document.documentElement.style.setProperty("--vh", `${vw}px`);
            document.documentElement.style.setProperty("--vw", `${vh}px`);
        })
    }
});