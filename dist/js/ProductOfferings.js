define([
    "Base",
    "AjaxUtils",
    "require/Shared/LessonReservationTimePicker",
], function(Base, AjaxUtils, LessonReservationTimePicker) {

    var productOfferingContainer = "[data-wyz-product-offerings-version]",
        mouseEnterInterval = null;

    init = function() {
        // Moved here so that POW rendered w/mustache can be initiated
        // Elements must exist on page before we try to cache them
        Base.addEls({
            productOfferings: ".product-offerings-list li",
            productOfferingForms: ".product-offering-form",
            subject: "input[name=kw]",
        });

        bindEvents();
        LessonReservationTimePicker.init();
    },

    bindEvents = function() {
        // Set first item in POW to active
        Base.$els.productOfferings.eq(0).addClass("active");
        changeSearchType(Base.$els.productOfferings[0]);
        Base.$els.subject.on("change blur", function() {
            // keep all subject inputs in sync
            Base.$els.subject.val($(this).val());
        });

        Base.$els.productOfferings.on("mouseenter", function() {
            var _this = this;
            clearTimeout(mouseEnterInterval);
            mouseEnterInterval = setTimeout(function() {
                changeSearchType(_this);
            }, 300);
        });

        Base.$els.productOfferings.on("mouseleave", function() {
            clearTimeout(mouseEnterInterval);
        });

        Base.$els.productOfferings.on("click", function() {
            changeSearchType(this);
        });

        Base.$els.productOfferingForms.on("submit", function(e) {
            e.preventDefault();
            var $form = $(this);

            if (!$form.valid()) {
                return false;
            }

            var formValues = getFormValues($form),
                searchType = $form.attr("data-wyz-search-type"),
                offeringsData = {
                    type: searchType,
                    subject: formValues.kw,
                    zipCode: formValues.z,
                },
                $offerings = $form.closest(productOfferingContainer).find("li");

            $offerings.each(function(index, offering) {
                offeringsData[getProductOfferingType(offering)] = index;
            });

            var location = $form[0].action + "?" + $form.serialize();

            if (window.analytics && window.analytics.track) {
                analytics.track("Student Submitted Product Offering", offeringsData, null, function() {
                    window.location = location;
                });
                // catch for bug in adblocker allowing analytics on page, but blocking track event
                setTimeout(function() {
                    window.location = location;
                }, 500);
            }
            else {
                window.location = location;
            }
        });
    },

    changeSearchType = function(productOfferingItem) {
        var type = getProductOfferingType(productOfferingItem),
            $productOfferingItem = $(productOfferingItem),
            $productOfferingContainer = $productOfferingItem.closest(productOfferingContainer);

        $.each($productOfferingItem.siblings().andSelf(), function(index, ele) {
            var currentOffering = getProductOfferingType(ele);
            var $currentOfferingMobileText = $productOfferingContainer.find(".mobile-text ." + currentOffering);

            if (type == currentOffering) {
                $currentOfferingMobileText.removeClass("hide");
            }
            else {
                $currentOfferingMobileText.addClass("hide");
            }

            changeSearch(this, type);
        });
    },

    changeSearch = function(ele, type) {
        var currentOffering = getProductOfferingType(ele),
            $this = $(ele),
            $productContainer = $this.closest(productOfferingContainer),
            $searchForm = $productContainer.find("[data-wyz-search-type=" + currentOffering + "]");

            if (currentOffering !== type) {
                $searchForm.addClass("hide");
            $productContainer.removeClass(currentOffering);
            $this.removeClass("active");
            }
            else {
            $productContainer.addClass(currentOffering);
                $searchForm.removeClass("hide");
            $this.addClass("active");
            $searchForm.find(Base.$els.subject).focus();
            }
    },

    getFormValues = function($form) {
        var values = {};
        $.each($form.serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        return values;
    },

    getProductOfferingType = function(ele) {
        return ele.getAttribute("data-wyz-product-offering");
    };

    return {
        init: init,
    }
});
