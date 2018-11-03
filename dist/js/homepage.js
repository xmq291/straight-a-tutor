require([
    "Base",
    "require/shared/jquery.wyzACHookups",
    "require/Shared/ProductOfferings",
    "libraries/jquery.slick-1.6.0.min",
    "shared/imageCarouselingAnimation",
], function(Base, WyzACHookups, ProductOfferings) {

    Base.addEls({
        testimonialsCarousel: ".testimonials-wrapper",
    });

    var init = function() {
        initCarousels();
        bindEvents();
        ProductOfferings.init();
    },

    initCarousels = function() {
        Base.$els.testimonialsCarousel.slick({
            dots: true,
        });
    },

    bindEvents = function() {
        $(".wyzAC").each(function() {
            WyzACHookups.bindAutoCompleteToElement($(this));
        });
    };

    $(function() {
        init();
    });

});
