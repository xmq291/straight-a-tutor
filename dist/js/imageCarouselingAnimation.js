require([
    "Base"
], function(Base) {

    // add elements to cache, accessible as Base.$els[propertyName]
    Base.addEls({
        homeHeroHeader: ".home-hero-header",
        screenContainer: ".screen-container",
    });

    var totalItemsToLoopThrough = 3, // We happen to want to loop through 3 hero images AND 3 desktop screens
        transitionDuration = 5000,

    // Both the hero image animation and Online Platform Animation use the same duration,
    // so they can both be handled within this function.
    initImageCarouseling = function() {
        var nextIndex = 2;

        setInterval(function() {
            Base.$els.screenContainer.removeClass("active");
            Base.$els.homeHeroHeader.css({ backgroundImage: "url(" + getHeroBackgroundPath(nextIndex) + ")",});

            // Update the next index for both animations
            nextIndex = (nextIndex + 1 <= totalItemsToLoopThrough) ? nextIndex + 1 : 1;

            // Start pre-loading image for hero
            var nextImg = new Image();
            nextImg.src = getHeroBackgroundPath(nextIndex);

            // Begin screen animation for Online Platform Module
            $(".screen-" + nextIndex).addClass("active");
        }, transitionDuration);
    },

    getHeroBackgroundPath = function(photoId) {
        return "/images/home/home-hero" + photoId + ".jpg";
    };

    $(function() {
        initImageCarouseling();
    });

});
