
requirejs.config({
    baseUrl: "/scripts",
    paths: {
        jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min",
        jqueryUI: "//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min",
        mustache: "libraries/mustache",
        moment: "libraries/moment-2.15.1",
        momentTimezone: "libraries/moment-timezone-0.5.6",
        pikaday: "libraries/pikaday-1.4.0",
        pikadayJquery: "libraries/pikaday.jquery-1.4.0",
        require: "requireModules",
        vue: "//cdnjs.cloudflare.com/ajax/libs/vue/1.0.28/vue.min",
        vueCdnAssets: "https://static1.wyzantcdn.com/vue-assets",
    },
    bundles: {
        "/dist/bundles/js/require-core.js?v=EnuqX6TUSHsforOP2oOBpgnETKevh8ZjUCyLew3bWKg1": [
            "AjaxUtils",
            "APIAjaxUtils",
            "AppContextUtils",
            "AsyncUtils",
            "Base",
            "MustacheUtils",
            "Tracking",
            "Utils",
        ],
    },
    shim: {
        mustache: {
            exports: "Mustache"
        }
    },
});
