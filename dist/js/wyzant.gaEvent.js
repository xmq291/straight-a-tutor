window.wyzant = window.wyzant || {};

window.wyzant.gaEvent = (function() {
    var bindEvents = function() {
        var $document = $(document),
            $window = $(window);

        // Send GA click events when they're clicked
        // <a href="#" data-wyz-tracking-click data-wyz-tracking-label="Tracking Label" data-wyz-tracking-cat="Tracking Category" data-wyz-tracking-action="action" data-wyz-tracking-value="value">Link</a>
        $document.on("click", "[data-wyz-tracking-click]", function() {
            recordFromAttrs(this);
        });

        // Send GA events on page load for elements we want
        // <span data-wyz-tracking-load data-wyz-tracking-label="Tracking Label" data-wyz-tracking-cat="Tracking Category" data-wyz-tracking-action="action" data-wyz-tracking-value="{{e.g. value from server}}"></span>
        $window.on("load", function() {
            $("[data-wyz-tracking-load]").each(function() {
                recordFromAttrs(this);
            });
        });

        // Send GA events on ajax search results update
        // <span data-wyz-tracking-tutorsearchresultsupdated data-wyz-tracking-label="Tracking Label" data-wyz-tracking-cat="Tracking Category" data-wyz-tracking-action="action" data-wyz-tracking-value="{{e.g. value from server}}"></span>
        $window.on("tutorSearchResultsUpdated", function() {
            $("[data-wyz-tracking-tutorsearchresultsupdated]").each(function() {
                recordFromAttrs(this);
            });
        });

        // When an input is changed, send old and new values to GA
        // <a href="#" data-wyz-tracking-blur data-wyz-tracking-cat="Tracking Category" data-wyz-tracking-action="Tracking Action">Link</a>
        $document.on("focus", "[data-wyz-tracking-blur]", function() {
            this.oldValue = this.value;
        });

        $document.on("blur", "[data-wyz-tracking-blur]", function() {
            if (typeof this.oldValue === "undefined") {
                this.oldValue = this.value;
            }
            if (this.oldValue !== this.value) {
                if (!this.oldValue) {
                    this.oldValue = "<Empty>";
                }
                record(this.getAttribute("data-wyz-tracking-cat"), this.getAttribute("data-wyz-tracking-action"), this.oldValue + "_" + this.value);
            }
            this.oldValue = this.value;
        });

        // When a selectbox is changed, send old and new values to GA
        // <select data-wyz-tracking-change-select data-wyz-tracking-cat="Tracking Category" data-wyz-tracking-action="Tracking Action"></select>
        $document.on("focus", "[data-wyz-tracking-change-select]", function() {
            this.oldValue = $(this).find("option:selected").text();
        });

        $document.on("change", "[data-wyz-tracking-change-select]", function() {
            var newValue = $(this).find("option:selected").text();

            if (typeof this.oldValue === "undefined") {
                this.oldValue = newValue;
            }
            if (this.oldValue !== newValue) {
                record(this.getAttribute("data-wyz-tracking-cat"), this.getAttribute("data-wyz-tracking-action"), this.oldValue + "_" + newValue);
            }
            this.oldValue = newValue;
        });

        // When a checkbox is changed, send the old and new values to GA
        // <input data-wyz-tracking-change-checkbox data-wyz-tracking-cat="Tracking Category" data-wyz-tracking-action="Tracking Action">
        $document.on("focus", "[data-wyz-tracking-change-checkbox]", function() {
            this.oldValue = this.checked;
        });

        $document.on("change", "[data-wyz-tracking-change-checkbox]", function() {
            if (typeof this.oldValue === "undefined") {
                this.oldValue = this.checked;
            }
            if (this.oldValue !== this.checked) {
                record(this.getAttribute("data-wyz-tracking-cat"), this.getAttribute("data-wyz-tracking-action"), this.oldValue + "_" + this.checked);
            }
            this.oldValue = this.checked;
        });

        // When a jquery UI slider is changed, send the old and new values to GA
        $document.on("slidestart", "[data-wyz-tracking-change-slider]", function() {
            this.oldRange = $(this).slider("values").join("-");
        });

        $document.on("slidechange", "[data-wyz-tracking-change-slider]", function() {
            var newRange = $(this).slider("values").join("-");
            if (typeof this.oldRange === "undefined") {
                this.oldRange = newRange;
            }
            if (this.oldRange !== newRange) {
                record(this.getAttribute("data-wyz-tracking-cat"), this.getAttribute("data-wyz-tracking-action"), this.oldRange + "_" + newRange);
            }
            this.oldRange = newRange;
        });

        // When two text inputs are side-by-side for a range on mobile (like Hourly rate and Age), send them together as a GA event when either is changed
        // <input data-wyz-tracking-change-inputpair="[selector for partner]" data-wyz-tracking-cat="Tracking Category" data-wyz-tracking-action="Tracking Action">
        $document.on("focus", "[data-wyz-tracking-change-inputpair]", function() {
            var oldPartnerValue = parseInt($($(this).attr("data-wyz-tracking-change-inputpair")).val(), 10),
                oldValue = parseInt($(this).val(), 10);

            if (oldValue < oldPartnerValue) {
                this.oldRange = oldValue + "-" + oldPartnerValue;
            }
            else {
                this.oldRange = oldPartnerValue + "-" + oldValue;
            }
        });

        $document.on("change", "[data-wyz-tracking-change-inputpair]", function() {
            var newPartnerValue = parseInt($($(this).attr("data-wyz-tracking-change-inputpair")).val(), 10),
                newValue = parseInt($(this).val(), 10),
                newRange = "";

            if (newValue < newPartnerValue) {
                newRange = newValue + "-" + newPartnerValue;
            }
            else {
                newRange = newPartnerValue + "-" + newValue;
            }

            if (typeof this.oldRange === "undefined") {
                this.oldRange = newRange;
            }
            if (this.oldRange !== newRange) {
                record(this.getAttribute("data-wyz-tracking-cat"), this.getAttribute("data-wyz-tracking-action"), this.oldRange + "_" + newRange);
            }
            this.oldRange = newRange;
        });

        // When a checkbox group is changed, send the old and new values to GA
        // A checkbox group is more than one input type=checkbox with the same name
        $document.on("focus touchstart", "[data-wyz-tracking-change-checkgroup]", function() {
            var oldAnswers = "";

            $("input[name=" + this.name + "]:visible:checked").each(function() {
                oldAnswers += $(this).data("answer") + ", ";
            });

            oldAnswers = (oldAnswers.substr(0, oldAnswers.length - 2));

            $("input[name=" + this.name + "]:visible").each(function() {
                this.oldAnswers = oldAnswers;
            });
        });

        $document.on("change", "[data-wyz-tracking-change-checkgroup]", function() {
            var newAnswers = "",
                oldAnswers = $("input[name=" + this.name + "]:visible:first")[0].oldAnswers;

            $("input[name="+this.name+"]:visible:checked").each(function() {
                newAnswers += $(this).data("answer") + ", ";
            });

            newAnswers = (newAnswers.substr(0, newAnswers.length - 2));

            if (newAnswers !== oldAnswers) {
                if (!oldAnswers) {
                    oldAnswers = "<Empty>";
                }
                record(this.getAttribute("data-wyz-tracking-cat"), this.getAttribute("data-wyz-tracking-action"), oldAnswers + "_" + newAnswers);
            }
        });

        // When a radio group is changed, send the old and new values to GA
        // A radio group is more than one input type=radio with the same name
        $document.on("focus touchstart", "[data-wyz-tracking-change-radiogroup]", function() {
            var oldAnswers = "";

            $("input[name=" + this.name + "]:visible:checked").each(function() {
                oldAnswers += $(this).data("answer") + ", ";
            });

            oldAnswers = (oldAnswers.substr(0, oldAnswers.length - 2));

            $("input[name=" + this.name + "]:visible").each(function() {
                this.oldAnswers = oldAnswers;
            });
        });

        $document.on("change", "[data-wyz-tracking-change-radiogroup]", function() {
            var newAnswers = "",
                oldAnswers = $("input[name=" + this.name + "]:visible:first")[0].oldAnswers;

            $("input[name=" + this.name + "]:visible:checked").each(function() {
                newAnswers += $(this).data("answer") + ", ";
            });

            newAnswers = (newAnswers.substr(0, newAnswers.length - 2));

            if (newAnswers !== oldAnswers) {
                if (!oldAnswers) {
                    oldAnswers = "<Empty>";
                }
                record(this.getAttribute("data-wyz-tracking-cat"), this.getAttribute("data-wyz-tracking-action"), oldAnswers + "_" + newAnswers);
            }
        });
    }

    var _send = function(payload) {
        // verify that ga.js is loaded.
        // alternate methods of checking, such as if(ga){} or ga(function(){works_like_document_ready}) can throw "function is undefined" errors if ga.js isn't on the page (yet).
        if (window.ga) {
            // The "value" in GA event calls don't work for non-numbers
            if (isNaN(payload.eventValue)) {
                payload.eventValue = null;
            }

            ga("send", payload);
            return true;
        }
        return false;
    }

    // send information about an interaction to Google Analytics
    var record = function(category, action, label, value) {
        _send({
            hitType: "event",
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            eventValue: value,
        });
    }

    // send an event on page load
    var recordView = function(category, action, label, value) {
        var doSend = function() {
            _send({
                hitType: "event",
                eventCategory: category,
                eventAction: action,
                eventLabel: label,
                eventValue: value,
                nonInteraction: 1,
            });
        };

        // This can get triggered before tag manager adds ga.js, timeout is to be sure it still gets sent.
        if (doSend() === false) {
            setTimeout(doSend, 1000);
        }
    }

    var getTrackingAttrs = function(el) {
        return {
            "category": el.getAttribute("data-wyz-tracking-cat"),
            "label": el.getAttribute("data-wyz-tracking-label"),
            "action": el.getAttribute("data-wyz-tracking-action") || "Click",
            "value": el.getAttribute("data-wyz-tracking-value"),
        }
    }

    var recordFromAttrs = function(el) {
        var trackingParams = getTrackingAttrs(el);
        record(trackingParams.category, trackingParams.action, trackingParams.label, trackingParams.value);
    }

    bindEvents();

    return {
        record: record, // send information about an interaction to Google Analytics
        recordView: recordView, // send an event on page load.
    }

}());
