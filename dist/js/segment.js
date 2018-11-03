
window.analytics = window.analytics || [], window.analytics.methods = ["identify", "group", "track", "page", "pageview", "alias", "ready", "on", "once", "off", "trackLink", "trackForm", "trackClick", "trackSubmit"], window.analytics.factory = function(t) { return function() { var a = Array.prototype.slice.call(arguments); return a.unshift(t), window.analytics.push(a), window.analytics } }; for (var i = 0; i < window.analytics.methods.length; i++) { var key = window.analytics.methods[i]; window.analytics[key] = window.analytics.factory(key) } window.analytics.load = function(t) { if (!document.getElementById("analytics-js")) { var a = document.createElement("script"); a.type = "text/javascript", a.id = "analytics-js", a.async = !0, a.src = ("https:" === document.location.protocol ? "https://" : "http://") + "cdn.segment.io/analytics.js/v1/" + t + "/analytics.min.js"; var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(a, n) } }, window.analytics.SNIPPET_VERSION = "2.0.9",
window.analytics.load("qurb33huvv");


    var bucketId = parseInt("73fa0a13-ae42-40db-88d3-79c9840db382".replace(/\D/g, "").slice(-2));
    window.analytics.page({ anonymousUserBucketId: bucketId }, { anonymousId: "73fa0a13-ae42-40db-88d3-79c9840db382" });
    if (typeof(Storage) !== "undefined" && !localStorage.ampLinkedToVistor) {
        var ampCookie = (document.cookie.match(/^(?:.*;)?\s*segment_amp_id\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
        if (ampCookie != null) {
          window.analytics.track("amp to visitor", { ampId: ampCookie });
          localStorage.ampLinkedToVistor = true;
        }
    }

var dataLayer = window.dataLayer || [];

