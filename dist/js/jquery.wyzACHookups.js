// modular autocomplete, should later be replaced to not rely on jquery ui
//
define(function() {
    var isAutocompleteAvailable = !!($ && $.ui && $.ui.autocomplete),
        _acDefaults = {
            minLength: 2,
            searchType: "UNDEFINED",
            selectEventHandler: null,
        },

        WyzACHookups = {
            bindAutoCompleteToElement: function(el) {
                // Check if we already have access to jQuery UI's autocomplete, to prevent including jQuery UI multiple times
                if (!isAutocompleteAvailable) {
                    var _this = this;

                    require(["libraries/jquery-ui.1.9.2.autocomplete.min",], function() {
                        isAutocompleteAvailable = true;
                        _this.bindAutoCompleteToElement(el);
                    });
                    return;
                }

                var thisOptions = {
                    minLength: el.attr("data-wyzac-minlength"),
                    searchType: el.attr("data-wyzac-searchtype"),
                    zipCode: el.attr("data-wyzac-zipcode") || "",
                    maxResults: el.attr("data-wyzac-maxresults") || 6,
                };

                var settings = $.extend({}, _acDefaults, thisOptions);
                if (thisOptions.searchType === "UNDEFINED") {
                    throw "SearchType is UNDEFINED";
                }

                el.keydown(function(event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        return false;
                    }
                });

                el.autocomplete({
                    minLength: settings.minLength,
                    source: function(request, response) {
                        $.ajax({
                            url: "/services/autocomplete",
                            data: {
                                q: request.term,
                                searchType: thisOptions.searchType,
                                zipCode: thisOptions.zipCode,
                            },
                            success: function(res) {
                                if (!el.hasClass("scrolling")) {
                                    res = res.slice(0, thisOptions.maxResults);
                                }
                                response(res);
                            },
                        });
                    },
                });

                el.bind("autocompleteopen", function() {
                    var $ac = $("ul.ui-autocomplete");
                    if (el.hasClass("scrolling")) {
                        $ac.addClass("scrolling");
                    }
                });
                var selectEventHandlerName = el.attr("data-wyzac-selecteventhandler");
                var selectEventHandler = window[selectEventHandlerName];
                if (selectEventHandlerName !== undefined && selectEventHandler !== undefined) {
                        el.bind("autocompleteselect", function(event, ui) {
                        selectEventHandler(ui.item.value);
                    });
                }
            },
        };

    // This little snippet fixes a bug in jquery ui where long results make the results ul too wide
    if (isAutocompleteAvailable) {
        jQuery.ui.autocomplete.prototype._resizeMenu = function() {
            var ul = this.menu.element;
            ul.outerWidth(this.element.outerWidth());
        }
    }

    return WyzACHookups;
});