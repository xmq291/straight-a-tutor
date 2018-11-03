require(["jquery","Base","AjaxUtils","libraries/jquery.wyzantModal","libraries/jquery.mask.min","wyzantjs/wyzant.gaEvent",],function(n,t,i){t.addEls({ribbonBanner:".ribbon-banner",dismissRibbonBannerButton:".dismiss-ribbon-button",mobileSearchLink:"#mobileNavSearch",mobileNavLink:".nav-mobile-link",homeBanner:"#homeBanner",accordionTrigger:".ui-mobile-menu-title",mainNavTrigger:".ui-menu-item.ui-has-subnav",submitOnEnterInputs:".submit-on-enter",navBell:".feature-dropdown-container .nav-bell"});var f=function(){require(["libraries/jquery.wyzantExpander",],function(){e();s()});o();l();a();v();h();c();y();p()},e=function(){n(".wyzantExpander").wyzantExpander();n(".wyzantModal").wyzantModal()},o=function(){t.$els.dismissRibbonBannerButton.on("click",function(i){i.preventDefault();t.$els.ribbonBanner.addClass("hide");n(window).trigger("ribbonBannerClosed")})},s=function(){t.$els.mobileSearchLink.on("click",function(i){if(t.$els.homeBanner.length>0)return n("html, body").animate({scrollTop:t.$els.homeBanner.offset().top},300),i.stopImmediatePropagation(),!1}).wyzantExpander({inverseExpanders:t.$els.mobileNavLink});t.$els.mobileNavLink.wyzantExpander({inverseExpanders:t.$els.mobileSearchLink.add(t.$els.mobileNavLink)});t.$els.accordionTrigger.wyzantExpander({inverseExpanders:t.$els.accordionTrigger,groupedExpanders:function(){return n(this).siblings(".ui-mobile-menu-submenu")}}).on("click",".ui-mobile-menu-submenu",function(n){n.stopPropagation()});t.$els.mainNavTrigger.wyzantExpander({inverseExpanders:t.$els.mainNavTrigger,groupedExpanders:function(){return n(this).siblings(".ui-menu-submenu, .feature-dropdown")},callback:function(){n(window).on("click",function(){t.$els.mainNavTrigger.removeClass("expanded")})}}).on("click",".ui-menu-submenu, .feature-dropdown",function(n){n.stopPropagation()}).on("click",function(n){n.stopPropagation()})},h=function(){t.$els.navBell.on("click",function(){var r=n(this);r.hasClass("nav-bell-new")&&(setTimeout(function(){t.$els.navBell.removeClass("nav-bell-new")},1e3),i.getJSON({action:"/tutor/profileNotification/dismissNotification",method:"POST",data:{notificationTypeID:30}}))})},c=function(){var t=n("input[name^=Zip], input[name^=zip], input[name*=ZipCode], input[name=z]");t.each(function(){var t=n(this),i=t.closest("form");i.on("submit",function(){var n=t.val();n.match("[0-9]+")&&n.length===5&&localStorage&&localStorage.setItem("lastZip",n)})})},l=function(){t.addEls({smsAppLinkForms:"form.sms-app-link-form",smsAjaxAppLinkForms:"div.sms-app-link-form",smsPhoneNumbers:".sms-phone-number",smsShowModal:".sms-show-modal"});t.$els.smsPhoneNumbers.mask("(000) 000-0000");t.$els.smsAjaxAppLinkForms.on("click","a.btn",function(t){t.preventDefault();var i=n(this).parents(".sms-app-link-form"),u={};i.find("input:not([type='radio']), input[type='radio']:checked").each(function(n,t){u[t.name]=t.value});r(i,"/app/smsdownload",u,!0)});t.$els.smsAppLinkForms.on("submit",function(t){t.preventDefault();var i=n(this);r(i,i[0].action,i.serialize(),!1)})},r=function(t,r,u,f){if(f||!n.validator||t.valid()){var e=t.parents(".sms-form-wrapper"),l=e.find(".sms-phone-number").val(),a=e.find(".sms-modal"),s=e.find(".sms-success-message"),o=e.find(".sms-error-message"),h=t.find(".btn"),c=function(){s.addClass("hide");o.removeClass("hide");h.removeClass("btn-disabled")};h.addClass("btn-disabled");s.addClass("hide");o.addClass("hide");l&&l.length?i.postJSON({action:r,data:u},function(i){i.ErrorMessages&&i.ErrorMessages.phoneNumber?(o.text(i.ErrorMessages.phoneNumber[0]),c()):(t.removeClass().addClass("hide"),o.addClass("hide"),s.removeClass("hide"),h.removeClass("btn-disabled"),a[0]&&n.fn.wyzantModal("showWyzantModal",{content:a}))},function(){c()}):c()}},a=function(){n("a.socialShareLink").on("click",function(n){n.preventDefault();var t=340,i=670,r=typeof window.screenX!="undefined"?window.screenX:window.screenLeft,u=typeof window.screenY!="undefined"?window.screenY:window.screenTop,f=typeof window.outerWidth!="undefined"?window.outerWidth:document.body.clientWidth,e=typeof window.outerHeight!="undefined"?window.outerHeight:document.body.clientHeight-22,o=parseInt(r+(f-i)/2,10),s=parseInt(u+(e-t)/2.5,10),h="width="+i+",height="+t+",left="+o+",top="+s;window.open(this.href,"_blank",h)})},v=function(){t.$els.submitOnEnterInputs.on("keyup",function(t){t.keyCode===13&&(t.preventDefault(),n(this).parents("form").submit())})},y=function(){n("a.doSubjectSearch").on("click",function(n){u(this);n.preventDefault()});n(".SubjectTB, .ZipTB").not(".formSubmit").on("keyup",function(n){if(n.keyCode===13)return u(this),n.preventDefault(),!1})},p=function(){var t=window.location.hash;/^#ref=/.test(t)&&n.ajax({url:"/services/setreferrer",data:{ref:t.replace("#ref=","")}})},u=function(t){var i=n(t).parents(".subjectSearch"),f=i.find(".SubjectTB").val(),e=i.find(".ZipTB").val(),r=i.find("[name='sort']"),u=i.find(".doSubjectSearch").attr("href")+"?z="+encodeURIComponent(e)+"&d=20&kw="+encodeURIComponent(f);r.length!==0&&(u+="&sort="+encodeURIComponent(r.val()));window.location=u};n(function(){f()})});window.wyzant=window.wyzant||{};window.wyzant.tooltips=function(){var n={top:"ui-tooltip-top",right:"ui-tooltip-right",bottom:"ui-tooltip-bottom",left:"ui-tooltip-left"},t=function(t){var e=t[0],u=t.find(".ui-tooltip")[0],f=$(u),a=f.find(".ui-tooltip-arrow"),v=300,s=15,y=window.innerWidth-s*2,h=y<v,c=h?y:v,p=e.getBoundingClientRect(),l=h?-(p.left-s)+"px":c>e.offsetWidth?(c/2-e.offsetWidth/2)*-1+"px":0,w=h?p.left-s+e.offsetWidth/2+"px":"",o;if(u.style.width=c+"px",u.style.left=l,u.style.right="",u.style.bottom="",u.style.top="",a.length&&(a[0].style.left=w),r(u),!i(u)){if(o=u.getBoundingClientRect(),o.left<0){u.style.left="";f.attr("data-position","left");return}if(o.right>window.innerWidth){u.style.left="";f.attr("data-position","right");return}if(o.bottom>window.innerHeight){u.style.top="";u.style.right="";u.style.bottom=e.offsetHeight+"px";u.style.left=l;f.attr("data-position","");f.addClass(n.top);return}if(o.top<0){u.style.top="";u.style.right="";u.style.bottom="";u.style.left=l;f.attr("data-position","");f.addClass(n.bottom);return}}},i=function(n){typeof jQuery=="function"&&n instanceof jQuery&&(n=n[0]);var t=n.getBoundingClientRect();return t.top>=0&&t.left>=0&&t.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&t.right<=(window.innerWidth||document.documentElement.clientWidth)},r=function(t){var r=$(t),i;for(i in n){if(!n.hasOwnProperty(i))return;r.removeClass(n[i])}};return{openTooltip:t}}();$(function(){$(document).on("click mouseenter",".ui-tooltip-trigger",function(){window.wyzant.tooltips.openTooltip($(this))})})