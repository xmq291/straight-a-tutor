// Expanding menus
//
//     Bind with $(el).wyzantExpander([object options]);
//
//    Plugin reads attribute "data-expandTarget" for a CSS selector to apply expanded class to,
//    if the attribute is null, default to itself.
//
//     settings:
//        - inverseExpanders: send a jquery object of other objects to close when this menu opens
//        - groupedExpanders: send a jquery object of other objects to open when this menu opens
//        - callback: executes on object open/close
//        - expandClass: class to toggle to open/close objects
//        - includeSelf: also apply the expandClass to the calling object

(function($){
    initExpander = function(o){
        var settings = {
            inverseExpanders: $(),
            groupedExpanders: $(),
            callback: function(){},
            expandClass: "expanded",
            includeSelf: true
        },
        checkFunction = function(context, func){
            if(typeof func === "function"){
                var _temp = func.apply(context);
                if(_temp instanceof jQuery){
                    func = _temp;
                }
            }
            return func;
        };
    
        return this.each(function(){
            var _settings = $.extend({}, settings, o);
            
            // if inverseExpanders or groupedExpanders is a function run it in the context of the current element
            _settings.inverseExpanders = checkFunction(this, _settings.inverseExpanders);
            _settings.groupedExpanders = checkFunction(this, _settings.groupedExpanders);
            
            $(this).on("click", function(e){
                e.preventDefault();
                
                var target = this.getAttribute("data-expandTarget"),
                    expandie,
                    open;
                    
                target = target === null?this:target;
                expandie = $(target).toggleClass(_settings.expandClass);
                open = expandie.hasClass(_settings.expandClass);
                
                if(_settings.includeSelf === true && target !== this){
                    $(this).toggleClass(_settings.expandClass);
                }
                
                // close any inverseExpanders by firing click event on any open; click insures any grouped objects also close
                if(_settings.inverseExpanders instanceof jQuery && open === true){
                    _settings.inverseExpanders.not(this).each(function(){
                        var $inverseEl = $(this);
                        
                        if($inverseEl.hasClass(_settings.expandClass) === true){
                            $inverseEl.click();
                        }
                    });
                }
                
                // open/close any groupedExpanders
                if(_settings.groupedExpanders instanceof jQuery){
                    if(open === true){
                        _settings.groupedExpanders.addClass(_settings.expandClass);
                    } else {
                        _settings.groupedExpanders.removeClass(_settings.expandClass);
                    }
                }
                
                if(typeof _settings.callback === "function"){
                    _settings.callback.call(this);
                }
            });
        });
    }
    
    $.fn.wyzantExpander = function(options){
        if(typeof options !== "object"){
            options = {};
        }
        return initExpander.call(this, options);
    };
})(jQuery);