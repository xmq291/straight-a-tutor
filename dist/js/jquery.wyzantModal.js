// WyzAnt Responsive Modals
//
//     Bind with $(el).wyzantModal([object options]);
//
//     settings:
//        - modalClass:
//        - modalContainerClass:
//        - blackoutClass:
//        - closeBtnClass:
//        - loadingClass:
//        - width:
//        - height:
//        - maxWidth:
//        - x:
//        - y:
//        - content: a string of text/html content to display OR a jquery collection to append into the modal
//        - path: url to load into the modal, accepts a JPG, GIF, PNG, or html content
//        - margin:

(function($) {
    // PUBLIC METHODS
    var methods = {
        init: function(o) {
            if (typeof o === "undefined") {
                o = {};
            }

            return this.each(function() {
                var _settings = $.extend({}, settings, o),
                    marshallModalRequest = function(e) {
                        e.preventDefault();
                        // Add the data-disabled attribute to an a.wyzantModal to prevent it from showing the modal
                        if ($(this).attr('data-disabled')) {
                            return false;
                        }
                        displayModal.call(this, _settings);
                    };

                this._settings = _settings;

                // only bind click events once
                if (this.wyzantModalBound !== true) {
                    this.wyzantModalBound = true;

                    $(this).on("click showWyzantModal", marshallModalRequest);

                    $(this).on("closeWyzantModal", destroyModal);
                }
            });
        },

        showWyzantModal: function(o) {
            if (typeof o === "undefined") {
                o = {};
            }

            var _settings = $.extend({}, settings, o);

            if (this instanceof jQuery) {
                this.trigger("showWyzantModal");
            } else if (this.length === 0) {
                displayModal.call(document.createElement("a"), _settings);
            } else {
                displayModal.call(this, _settings);
            }

            return this;
        },

        closeWyzantModal: function() {
            if (this.length === 0) {
                destroyModal();
            } else {
                this.trigger("closeWyzantModal");
            }
        }
    };


    // PRIVATES
    var settings = {
        modalClass: "wyzModal",
        modalContainerClass: "wyzModal-container",
        blackoutClass: "wyzModal-blackout",
        closeClass: "wyzModal-closeContainer",
        closeBtnClass: "wyzModal-close",
        loadingClass: "wyzModal-loading",
        width: "auto",
        height: "auto",
        maxWidth: "62.5em",
        x: "auto",
        y: "auto",
        content: "",
        path: "",
        margin: 30
    },

    // set up - called only once on load
    initModals = function() {
        // add modal and close to modal container permanently
        modalContainerEl.appendChild(closeEl);
        modalContainerEl.appendChild(modalEl);

        // bind close events only once
        $(blackoutEl).add(modalContainerEl).on("click", function(e) {
            // close the modal if the background is clicked
            if (e.target === e.currentTarget) {
                destroyModal(e);
            }
        });
    },

    // function for displaying the modal
    displayModal = function(_settings) {
        var el = this,

            showModalBackground = function() {
                var $blackoutEl = $(blackoutEl).prop({className: _settings.blackoutClass});

                setTimeout(function() {
                    $blackoutEl.css({opacity: 1});
                },50);

                document.body.appendChild(blackoutEl);
            },

            // create a new close button and bind close event
            // the 'closeEl' container helps position the close button relative to the modal width while
            //     allowing it to live outside of it
            setupCloseBtn = function() {
                var $closeBtnEl = $('<a class="' + _settings.closeBtnClass + '"><i class="wc-times"></i></a>').on("click", destroyModal);

                $(closeEl).prop({className: _settings.closeClass});

                closeEl.appendChild($closeBtnEl[0]);
            },

            applyModalClasses = function() {
                // set modal classes before loading content to ensure proper dimensions can be calculated
                modalEl.className = _settings.modalClass;
                modalContainerEl.className = _settings.modalContainerClass;
            },

            loadModalContent = function() {
                var $content,
                    $parent,
                    content,
                    styles,
                    path,
                    img,
                    usedSettingsContent = false;

                if (_settings.content !== null && typeof _settings.content === "string" && _settings.content !== "") {
                    // modal content is explicitly set in the options passed in
                    content = document.createElement("div");

                    // setting the display to inline-block allows us to get the correct width from of the contents, reset after addModalContent
                    content.style.display = "inline-block";
                    content.innerHTML = _settings.content;

                    usedSettingsContent = true;

                } else if ((utils.getStandardPath(el.pathname) === utils.getStandardPath(window.location.pathname) && el.hash !== "") || _settings.content instanceof jQuery) {
                    // user specified a jquery collection or modal content is referenced by an anchor link to the content
                    if (_settings.content instanceof jQuery) {
                        $content = _settings.content;
                    } else {
                        $content = $(el.hash);
                    }

                    if ($content.length !== 0) {
                        content = $content[0];

                        // cache the parent and sibling so we can put the content back where it was
                        $parent = $content.parent();
                        if ($parent.length > 0) {
                            parentEl = $content.parent()[0];
                            siblingEl = content.nextSibling;
                        }

                        styles = utils.getElStyles(content);

                        // make sure the content isn't hidden
                        if (styles !== null && styles.display === "none") {
                            content.style.display = "block";
                            content.setAttribute("data-wasHidden", "true");
                        }
                    }

                } else if ((_settings.path !== null && _settings.path !== "") || (el.href !== undefined && el.href !== "")) {
                    // model content is an external link, ajax it in

                    // set a temporary loading element as the content to display
                    content = $('<div class="' + _settings.loadingClass + '"><i class="wyz-loader wyz-loader-large wyz-loader-multi"><div class="cube cube-1"></div><div class="cube cube-2"></div><div class="cube cube-4"></div><div class="cube cube-3"></div></i></div>')[0];

                    path = _settings.path || el.href;

                    if (/.jpg$|.gif$|.png$/i.test(path) === true) {
                        // we are just trying to display an image
                        img = new Image();
                        img.onload = function() {
                            removeModalContent(content);
                            addModalContent(img);

                            // reset the Y position for the new content
                            utils.setModalYPosition();
                        };
                        img.src = path;
                    } else {
                        // ajax in the data
                        $.ajax({url: path,
                            dataType: "html",
                            error: function() {
                                removeModalContent(content);
                            },
                            success: function(data) {
                                removeModalContent(content);

                                // add data string to a dom element, setting the element to inline-block allows us to get the
                                //     correct width from of the contents
                                var ajaxContent = document.createElement("div");
                                ajaxContent.innerHTML = data;
                                ajaxContent.style.display = "inline-block";

                                addModalContent(ajaxContent);

                                ajaxContent.style.display = "block";

                                // reset the Y position for the new content
                                utils.setModalYPosition();
                            }
                        });

                    }
                }

                addModalContent(content);

                if (usedSettingsContent === true) {
                    content.style.display = "block";
                }
            },

            showModal = function() {
                document.body.appendChild(modalContainerEl);

                $(window).trigger("wyzantModalShown", [modalEl]);
                $(el).trigger("wyzantModalShown", [modalEl]);
            },

            fadeInModalContents = function() {
                // set opacity to 1 on delay to enable css transitions, if already set to 1, does nothing
                setTimeout(function() {
                    modalContainerEl.style.opacity = 1;
                },50);
            },

            addModalContent = function(content) {
                contentEl = content;

                setModalDimensionsForContent(content);

                modalEl.appendChild(content);
            },

            removeModalContent = function(content) {
                if (content.parentNode !== null) {
                    content.parentNode.removeChild(content);
                }
            },

            setModalDimensionsForContent = function(content) {
                // temporarily append the content to the body so we can get dimensions from it independently
                document.body.appendChild(content);

                var contentWidth = utils.getContentWidth(content, _settings.width, _settings.margin, _settings.maxWidth);

                $(modalEl).css({
                    "max-width": contentWidth,
                    height: utils.getSettingsHeight(_settings.height)
                });

                $(closeEl).css({
                    "max-width": contentWidth
                });

                document.body.removeChild(content);
            };

        // if another modal is already open, move it's content back to it's original spot
        if (contentEl !== null) {
            restoreModalContent();
        }

        // clearout any existing modal content
        modalEl.innerHTML = "";

        showModalBackground();
        setupCloseBtn();
        applyModalClasses();
        loadModalContent();
        showModal();
        fadeInModalContents();
        bindWindowEvents();
        utils.setModalYPosition();
    },

    destroyModal = function(e) {
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        var body = document.body;

        unbindWindowEvents();

        restoreModalContent();

        blackoutEl.style.opacity = "";

        if (body.contains(blackoutEl)) {
            body.removeChild(blackoutEl);
        }
        if (body.contains(modalContainerEl)) {
            body.removeChild(modalContainerEl);
        }

        modalEl.innerHTML = "";
        closeEl.innerHTML = "";

        modalContainerEl.style.opacity = "";

        $(window).trigger("wyzantModalClosed");
    },

    restoreModalContent = function() {
        if (parentEl !== null) {
            parentEl.insertBefore(contentEl, siblingEl);
            parentEl = null;
            siblingEl = null;

            if (contentEl.getAttribute("data-wasHidden") === "true") {
                contentEl.style.display = "none";
            }
        }

        contentEl = null;
    },

    bindWindowEvents = function() {
        $(window).on("resize orientationchange repaintModal", utils.repaintModal);
    },

    unbindWindowEvents = function() {
        $(window).off("resize orientationchange repaintModal", utils.repaintModal);
    },

    utils = {
        getContentWidth: function(content, settingsWidth, settingsMargin, settingsMaxWidth) {
            // determine what width the modal needs to be set to to display the content properly
            // - maxes out at Foundation's row width by default
            // - includes the modal's padding because the box-sizing is set to border-box
            var width = settingsWidth,
                winWidth = this.getWindowWidth(),
                modalIsVisible = true;

            // temporarily add the modal to the DOM
            if (modalContainerEl.parentNode === null) {
                modalIsVisible = false;
                document.body.appendChild(modalContainerEl);
            }

            if (width === "auto" || isNaN(parseInt(width))) {
                width = $(content).outerWidth(true) + this.getElPaddingStyle(modalEl);
            }

            if (width + settingsMargin > winWidth) {
                width = settingsMaxWidth;
            }

            if (modalIsVisible === false) {
                document.body.removeChild(modalContainerEl);
            }

            return width;
        },

        getSettingsHeight: function(settingsHeight) {
            var height = settingsHeight;

            // sanitize user input
            if (isNaN(parseInt(height))) {
                height = "auto";
            }

            return height;
        },

        getWindowWidth: function() {
            return window.innerWidth || document.documentElement.clientWidth;
        },

        getWindowHeight: function() {
            return window.innerHeight || document.documentElement.clientHeight;
        },

        getWindowScrollY: function() {
            return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        },

        getElStyles: function(el) {
            // old IE version use currentStyle, modern browsers use window.getComputedStyle
            var style = el.currentStyle;

            if (!style && typeof window.getComputedStyle === "function") {
                style = window.getComputedStyle(el);
            } else if (!style) {
                return null;
            }
            return style;
        },

        getElPaddingStyle: function(el) {
            var style = this.getElStyles(el),
                paddingLeft,
                paddingRight;

            if (style === null) {
                return 0;
            }

            paddingLeft = style["paddingLeft"];
            paddingRight = style["paddingRight"];

            return parseInt((paddingLeft !== ""?paddingLeft:0),10) + parseInt((paddingRight !== ""?paddingRight:0),10);
        },

        setModalYPosition: function() {
            var windowHeight = this.getWindowHeight(),
                modalHeight = modalContainerEl.clientHeight,
                containerStyles = {
                    position: "fixed",
                    top: (windowHeight - modalHeight)/2
                },
                $modalContainerEl = $(modalContainerEl);

            // if modelContainer height is larger than windowHeight, we need to position it absolute
            if (modalHeight > windowHeight) {
                containerStyles.position = "absolute";
                containerStyles.top = this.getWindowScrollY();

            // android 2.x has a bug with clicking items that are position fixed
            } else if (/Android 2/i.test(window.navigator.userAgent) === true) {
                containerStyles.position = "absolute";
                containerStyles.top = this.getWindowScrollY() + (windowHeight - modalHeight)/2;
            }

            $modalContainerEl.css(containerStyles);
        },

        repaintModal: function(e) {
            var windowHeight = window.outerHeight || document.documentElement.clientHeight,
                windowWidth = window.outerWidth || document.documentElement.clientWidth;

            // ios triggers resize incorrectly on user scroll, so prevent the event if the window hasn't changed
            // window.outerHeight is undefined in IE9 and lower, so ignore those results
            if (e.type === "resize" && windowHeight !== undefined && windowHeight === data.windowHeight && windowWidth === data.windowWidth) {
                return;
            }

            // android has a fixed position related repaint bug on orientation change
            if (e.type === "orientationchange" && /Android 4.[0123]/i.test(window.navigator.userAgent) === true) {
                setTimeout(function() {
                    utils.repaintModal({type: ""});
                },200);
                return;
            }

            data.windowWidth = windowWidth;
            data.windowHeight = windowHeight;

            utils.setModalYPosition();
        },

        getStandardPath: function(pathname) {
            // IE9 returns an href pathname without a beginning slash, but does include it on window.location.pathname
            if (typeof pathname !== "undefined" && pathname.indexOf("/") !== 0) {
                pathname = "/" + pathname;
            }

            return pathname;
        }
    },

    data = {
        windowHeight: window.outerHeight,
        windowWidth: window.outerWidth
    },

    modalEl = document.createElement("div"),
    modalContainerEl = document.createElement("div"),
    blackoutEl = document.createElement("div"),
    closeEl = document.createElement("div"),
    parentEl = null,
    siblingEl = null,
    contentEl = null;

    initModals();

    $.fn.wyzantModal = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        }
    };
})(jQuery);
