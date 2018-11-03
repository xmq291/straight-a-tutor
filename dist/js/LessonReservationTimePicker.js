define([
    "Base",
    "moment",
], function(Base, moment) {

    Base.addEls({
        lessonDayDropdown: "[name=LessonDay]",
    });

    var init = function () {
        populateEmptyInstantBookSelects();
        bindEvents();
    },

    populateEmptyInstantBookSelects = function() {
        // Populates empty lessonDay inputs on SEO pages
        if ($("[name=LessonDay] option").length == 0) {
            var date = moment().format("YYYY-MM-DD");
            var x = 0;
            while (x < 7) {
                var today = (moment(date).add(x, "days").format("YYYY-MM-DD"));
                var formattedDate = (moment(today).format("ddd, MMM DD"));
                Base.$els.lessonDayDropdown.append($("<option>", {
                    value: today,
                    text: formattedDate,
                }));
                x++;
            }
        }
    },

    bindEvents = function() {
        // Disable unavailable times when changing dates (run once on page load by triggering)
        Base.$els.lessonDayDropdown.on("change", function() {
            var $this = $(this),
                selectedDayMoment = moment($this.val());

            disableUnavailableTimes(selectedDayMoment, $this);
        }).trigger("change");
    },

    // selectedDay must be a moment
    disableUnavailableTimes = function(selectedDay, $lessonDropDown) {
        if (!moment.isMoment(selectedDay)) {
            return;
        }

        // Get the current date and time every time this runs, in case the page has been loaded for a long time
        var today = moment(),
            todayString = today.format("YYYY-MM-DD"),
            fourHoursFromNow = today.clone().add(1, "hours");

        var $lessonTimes = $lessonDropDown.closest("form").find("[name=LessonTime] option");

        // We only need to filter times for the current day
        if (selectedDay.isSame(today, "day")) {
            $lessonTimes.each(function(i, el) {
                var lessonTime = moment(todayString + " " + el.value);

                el.disabled = (lessonTime.isBefore(fourHoursFromNow, "minute"));
            });

            var $validLessonTime = $lessonTimes.not(":disabled");

            // If we already have a valid selection, do not change it
            if ($validLessonTime.filter(":selected").length) {
                return;
            }

            // Try to find the first available time today
            var firstAvailableTime = $validLessonTime.first();

            if (firstAvailableTime.length > 0) {
                // There are available times today, select the first available for the user
                firstAvailableTime.prop({ "selected": true, });
            }
            else {
                // There are not available times today, switch the day to tomorrow and re-enable all times
                $lessonDropDown.find("option:eq(1)").prop({ "selected": true, });
                $lessonTimes.prop({ "disabled": false, });
            }
        }
        else {
            // Re-enable all times since the selected day is not today
            $lessonTimes.prop({ "disabled": false, });
        }
    };

    return {
        init: init,
    }
});
