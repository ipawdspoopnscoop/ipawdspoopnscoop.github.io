var software_$ = jQuery.noConflict(true);

software_$(document).ready(function() {
    // Loop through all accordion unordered and ordered lists in order to prepare accordion effect.
    software_$('ul.list-accordion, ol.list-accordion').each(function() {
        // Store list in variable because we will reference it multiple times.
        var list = software_$(this);

        // Loop through all list items in order to prepare them.
        list.find('li').each(function() {
            // Store list item in variable because we will reference it multiple times.
            var li = software_$(this);

            // Store anchor in variable before we remove it, because we will need to add it back later.
            var anchor = li.find('a:first');

            // Remove anchor so we can add container div.
            anchor.remove();

            // Remove line break that might exist at the beginning of the list item content.
            li.find(':first').filter('br').remove();

            // Wrap a container div around the list item content. We have to do this here,
            // because the jQuery accordion plugin requires it, and TinyMCE does not allow someone to add a div easily.
            li.wrapInner('<div class="item_content" />');

            // Add class to anchor so that jQuery will know which anchor is the heading.
            // This is necessary in order to support links in the item content.
            anchor.addClass('item_heading');

            // Add the anchor back to the beginning of the list item content.
            li.prepend(anchor);
        });
        
        // Add jQuery accordion effect to list.
        list.accordion({
            // Expand list item where the anchor class has a special class,
            // in order to expand a list item by default when the page first loads.
            active: '.list-accordion-expanded',

            // allow list item to be collapsed
            collapsible: true,

            // Don't reserve extra height for the tallest list item.
            // The page contents below accordion will move.
            autoHeight: false,

            // Set the class for headings so jQuery knows which anchors are the headings.
            // We have to do this in order to support links in the item content.
            header: 'a.item_heading'
        });
    });
    
    // Create counter that will be used in order to give tab items unique ID's.
    var item_count = 0;

    // Loop through all tab unordered and ordered lists in order to prepare tabs.
    software_$('ul.list-tabs, ol.list-tabs').each(function() {
        // Store list in variable because we will reference it multiple times.
        var list = software_$(this);

        // Add a div around the list, because jQuery requires that for tabs.
        list.wrap('<div class="software_list_tabs_container" />');

        // Loop through all list items in order to prepare them.
        list.find('li').each(function() {
            // Store list item in variable because we will reference it multiple times.
            var li = software_$(this);

            // Store anchor in variable before we remove it, because we will need to add it back later.
            var anchor = li.find('a:first');

            // Remove anchor so we can isolate the rest of the content and move it into a div.
            anchor.remove();

            // Remove line break that might exist at the beginning of the list item content.
            li.find(':first').filter('br').remove();

            // Get item content without anchor. We will use this later.
            var item_content = li.html();

            // Remove all content from the list item.
            li.empty();

            // Increase the item count in order to have a unique ID for the item.
            item_count++;

            // Prepare item id which will be used in anchor's href and the id of the item's div.
            var item_id = 'list_tab_item_' + item_count;

            // Update href for anchor so that it will be connected to the item's div.
            anchor[0].href = '#' + item_id;

            // Add anchor back into list item content. It will be the only content in the list item.
            li.append(anchor);

            // Prepare content for item's div.
            item_content = '<div id="' + item_id + '" class="item_content">' + item_content + '</div>';

            // Add div for item below list.
            list.parent().append(item_content);
        });
        
        // Add jQuery tab effect to list.
        list.parent().tabs();
    });
    
    // prepare the toolbar button, if it exists
    var toolbar_button = document.getElementById('software_fullscreen_toggle');
    
    // if the toolbar button exists, then initialize toolbar features
    if (toolbar_button) {
        // if the toolbar's display is set to none, then set that the toolbar is disabled
        if (document.getElementById('software_toolbar').style.display == 'none') {
            var toolbar_enabled = false;
            
        // else the toolbar's display is not set to none, so set that the toolbar is enabled
        } else {
            var toolbar_enabled = true;
        }
        
        // initialize variable for storing if the toolbar was originally enabled or disabled so that we can determine if the value has changed later
        var original_toolbar_enabled = toolbar_enabled;
        
        // add onclick event to toolbar button
        software_$(toolbar_button).click(function() {
            // if the toolbar is enabled, disable the toolbar
            if (toolbar_button.className == "up_button") {
                software_$("#software_toolbar").slideUp("fast");
                toolbar_button.className = "down_button";
                toolbar_button.title = 'Deactivate Fullscreen Mode';
                toolbar_enabled = false;
                
            // else the toolbar is disabled, so enable the toolbar
            } else if (toolbar_button.className == "down_button") {
                software_$("#software_toolbar").slideDown("fast");
                toolbar_button.className = "up_button";
                toolbar_button.title = 'Activate Fullscreen Mode';
                toolbar_enabled = true;
            }
        });
        
        // set toolbar height to the current height of the toolbar's iframe
        var toolbar_height = document.getElementById('software_toolbar').style.height.substring(0, document.getElementById('software_toolbar').style.height.lastIndexOf('p'));
        
        // set the original toolbar height to the starting height
        var original_toolbar_height = toolbar_height;
        
        // if the toolbar is expanded, then add onload event that will update the size of the toolbar
        if (toolbar_enabled == true) {
            document.getElementById('software_toolbar').onload = function() {
                // initialize variable for storing the height of the content in the toolbar
                var toolbar_content_height = '';
                
                // if the browser is webkit (e.g. Safari, Chrome), then use offsetHeight
                if (software_$.browser.safari) {
                    toolbar_content_height = document.getElementById('software_toolbar').contentWindow.document.body.offsetHeight;
                    
                // else the browser is another browser, so use scrollHeight
                } else {
                    toolbar_content_height = document.getElementById('software_toolbar').contentWindow.document.body.scrollHeight;
                }
                
                // update the height of the toolbar iframe so that it fits all of its content
                document.getElementById('software_toolbar').style.height = toolbar_content_height + 'px';
                
                // remember the new height
                toolbar_height = toolbar_content_height;
            };
        }
        
        // when the user browses away from this page, check to see if various properties need to be saved
        window.onbeforeunload = function() {
            // if the toolbar button exists and if any of the toolbar properties have changed, then save changes
            if ((original_toolbar_enabled != toolbar_enabled) || (original_toolbar_height != toolbar_height)) {
                // send an AJAX POST in order to save the toolbar properties in the session
                // async is set to false so that the request is sent before the browser window goes to the next page
                software_$.ajax({
                    type: 'POST',
                    url: software_path + software_directory + '/save_toolbar_properties.php',
                    data: 'enabled=' + toolbar_enabled + '&height=' + toolbar_height + '&token=' + software_token,
                    async: false
                });
            }
        }
    }
    
    // if the preview theme css toolbar is on the page, then update it's height
    if (document.getElementById("software_preview_design_code_toolbar")) {
        document.getElementById('software_preview_design_code_toolbar').onload = function() {
            // initialize variable for storing the height of the content in the toolbar
            var toolbar_content_height = '';
            
            // if the browser is webkit (e.g. Safari, Chrome), then use offsetHeight
            if (software_$.browser.safari) {
                toolbar_content_height = document.getElementById('software_preview_design_code_toolbar').contentWindow.document.body.offsetHeight;
                
            // else the browser is another browser, so use scrollHeight
            } else {
                toolbar_content_height = document.getElementById('software_preview_design_code_toolbar').contentWindow.document.body.scrollHeight;
            }
            
            // update the height of the toolbar iframe so that it fits all of its content
            document.getElementById('software_preview_design_code_toolbar').style.height = toolbar_content_height + 'px';
        };
    }

    // the following is a workaround for a mobile Safari bug where content is not correctly displayed
    // when an iPhone's orientation is changed (e.g. from landscape to portrait).
    if (document.getElementById('viewport')) {
        var mobile_timer = false,viewport = document.getElementById('viewport');
        if(navigator.userAgent.match(/iPhone/i)) {
            viewport.setAttribute('content','width=device-width,minimum-scale=1.0,maximum-scale=1.0,initial-scale=1.0');
            window.addEventListener('gesturestart',function () {
                clearTimeout(mobile_timer);
                viewport.setAttribute('content','width=device-width,minimum-scale=1.0,maximum-scale=10.0');
            },false);
            window.addEventListener('touchend',function () {
                clearTimeout(mobile_timer);
                mobile_timer = setTimeout(function () {
                    viewport.setAttribute('content','width=device-width,minimum-scale=1.0,maximum-scale=1.0,initial-scale=1.0');
                },1000);
            },false);
        }
    }
});

function change_states(country_element_id, state_element_id, preserve_state_value) {
    var country_element = document.getElementById(country_element_id);
    var state_element = document.getElementById(state_element_id);
    var new_states = new Array();
    var state_container_id = state_element_id + "_container";
    var state_element_value = state_element.value;

    var y = 0;
    // for all states in states array
    for (x = 0; x < states.length; x++) {
        // if this state is in the country that was selected, store this state
        if (states[x][2] == country_element.value) {
            new_states[y] = x;
            y++;
        }
    }

    // if there is at least one state for selected country, prepare selection drop-down field for state
    if (new_states.length > 0) {
        document.getElementById(state_container_id).innerHTML = '<select name="' + state_element_id + '" id="' + state_element_id + '" class="software_select"></select>';

        var new_state_element = document.getElementById(state_element_id);

        // set blank first option for state selection drop-down field
        new_state_element.options[new_state_element.length] = new Option('', '');

        // loop through all states
        for (x = 0; x < new_states.length; x++) {
            new_state_element.options[new_state_element.length] = new Option(states[new_states[x]][0], states[new_states[x]][1]);
        }

        // Update label for state field to show that field is required.
        software_$('.state_label').html('State / Province*');

    // else there is not a state for selected country, so prepare text field for state
    } else {
        document.getElementById(state_container_id).innerHTML = '<input type="text" name="' + state_element_id + '" id="' + state_element_id + '" size="40" maxlength="50" class="software_input_text" />';

        // Update label for state field to show that field is optional.
        software_$('.state_label').html('State / Province');
    }
    
    if ((preserve_state_value == true) && (state_element_value != '')) {
        document.getElementById(state_element_id).value = state_element_value;
    }
}

function change_quick_add_product_id(product_id)
{
    var selection_type;
    var default_quantity;
    var recipient_required;
    
    if (product_id) {
        selection_type = quick_add_products[product_id][0];
        default_quantity = quick_add_products[product_id][1];
        recipient_required = quick_add_products[product_id][2];        
    }
    
    // hide all quick add rows until we figure out which rows to show

    if (document.getElementById('quick_add_ship_to_row')) {
        document.getElementById('quick_add_ship_to_row').style.display = 'none';        
    }
    
    if (document.getElementById('quick_add_add_name_row')) {
        document.getElementById('quick_add_add_name_row').style.display = 'none';        
    }
    
    if (document.getElementById('quick_add_quantity_row')) {
        document.getElementById('quick_add_quantity_row').style.display = 'none';        
    }
    
    if (document.getElementById('quick_add_amount_row')) {
        document.getElementById('quick_add_amount_row').style.display = 'none';        
    }

    // if a recipient is required to be selected, then show ship to and add name rows
    if (recipient_required == true) {
        document.getElementById('quick_add_ship_to_row').style.display = '';
        document.getElementById('quick_add_add_name_row').style.display = '';
    }
    
    // if product has a quantity selection type, then prefill default quantity and show quantity row
    if (selection_type == 'quantity') {
        document.getElementById('quick_add_quantity').value = default_quantity;
        document.getElementById('quick_add_quantity_row').style.display = '';
    }
    
    // if product has a donation selection type, then show amount row
    if (selection_type == 'donation') {
        document.getElementById('quick_add_amount_row').style.display = '';
    }
}

// Create function that will add hover event listeners to pop-up menu.
function software_initialize_popup_menu(name, first_level_popup_position, second_level_popup_position)
{
    // Update the CSS for all sub-menus so that the display is none and they are ready to be visible.
    // We have to do this because there might be incorrect or old CSS in the theme that sets visibility
    // to hidden, which causes the jQuery animations to not work.
    software_$('#software_menu_' + name + ' ul').css({
        'position': 'absolute',
        'display': 'none',
        'visibility': 'visible'
    });

    // Add event listeners to all li's for this menu.
    software_$('#software_menu_' + name + ' li').hover(
        // Add event listener for when a visitor hovers over this li.
        function () {
            // Add on class to this li.
            software_$(this).addClass('on');

            // Add on class to the anchor under this li.
            software_$(this).children('a').addClass('on');

            // Store ul in variable because we will use it in several places below.
            var ul = software_$(this).children('ul');

            // If this menu item has a sub-menu, then prepare to show and animate sub-menu.
            if (ul.length != 0) {
                // We are going to update the position of the sub-menu before the delay
                // in order to make sure the position is ready before the animation runs.

                // If this li is a top level item, then set position to first level position.
                if (software_$(this).hasClass('top_level') == true) {
                    var position = first_level_popup_position;

                // Otherwise this li is a sub level item, so set position to second level position
                } else {
                    var position = second_level_popup_position;
                }

                // Set the position of the ul differently based on the position setting for the menu.
                switch (position) {
                    case 'Top':
                        ul.css({
                            'left': '0',
                            'top': '-' + ul.outerHeight() + 'px'
                        });
                        break
                            
                    case 'Bottom':
                        ul.css({
                            'left': '0',
                            'top': software_$(this).outerHeight() + 'px'
                        });
                        break
                            
                    case 'Left':
                        ul.css({
                            'left': '-' + ul.outerWidth() + 'px',
                            'top': '0'
                        });
                        break;
                        
                    case 'Right':
                        ul.css({
                            'left': software_$(this).outerWidth() + 'px',
                            'top': '0'
                        });
                        break;
                }

                // Store this li in a variable so we can access it in the setTimeout function below.
                var li = this;

                // Show and animate menu after a certain period of time.
                // We add a delay in order to improve the UX and avoid flickering issues.
                setTimeout (function () {
                    // If the visitor is still hovered over this li, then continue to show and animate sub-menu.
                    // We add this check in order to make sure that the visitor has not hovered off of this li,
                    // since the event was triggered.
                    if (software_$(li).hasClass('on') == true) {
                        // Update z-index for this li.  This is the only place that the z-index for pop-up menus is set.
                        // We have to put the z-index on the li and not the ul that is actually popping up,
                        // because IE 7 requires it.  Otherwise, IE 7 shows the pop-up menu behind other things (e.g. ad region).
                        software_$(li).css({
                            'z-index': '4'
                        });

                        // Show and animate ul.
                        ul.slideDown(200);
                    }
                }, 100);
            }
        },
        
        // Add event listener for when a visitor hovers off this li.
        function () {
            // Remove on class from this li.
            software_$(this).removeClass('on');

            // Remove on class from the anchor under this li.
            software_$(this).children('a').removeClass('on');

            // Store ul in variable because we will use it in several places below.
            var ul = software_$(this).children('ul');

            // If this menu item has a sub-menu, then prepare to hide and animate sub-menu.
            if (ul.length != 0) {
                // Store this li in a variable so we can access it in the setTimeout function below.
                var li = this;

                // Hide and animate menu after a certain period of time.
                // We add a delay in order to improve the UX and avoid flickering issues.
                setTimeout (function () {
                    // If the visitor is still hovered off of this li, then continue to hide and animate sub-menu.
                    // We add this check in order to make sure that the visitor has not hovered back on this li,
                    // since the event was triggered.
                    if (software_$(li).hasClass('on') == false) {
                        // Remove z-index because pop-up will no longer appear.
                        software_$(li).css({
                            'z-index': '0'
                        });

                        ul.slideUp(200);
                    }
                }, 250);
            }
        }
    );
}

function software_update_accordion_menu(menu_item_id, parent_menu_item_id, menu_id) {
    
    // set open menu item id to the global open menu item id
    open_menu_item_id = eval("software_menu_"+menu_id+"_open_menu_item_id");
    
    // get display status of menu item
    var menu_item_display_status = document.getElementById("software_menu_item_" + menu_item_id).getElementsByTagName("ul")[0].style.display;
    
    // If the open menu item is not zero and it is not the parent menu item
    if ((open_menu_item_id != 0) && (open_menu_item_id != parent_menu_item_id)) {
        
        // Close the open menu item
        software_hide_accordion_menu(open_menu_item_id, parent_menu_item_id, menu_id);
    }
    
    // If the current menu item was not open
    if (menu_item_display_status != "block") {
        
        // then slide down the current menu item
        software_$(document.getElementById("software_menu_item_" + menu_item_id).getElementsByTagName("ul")[0]).slideDown("fast");
        
        // update open menu item id
        eval("software_menu_"+menu_id+"_open_menu_item_id = " + menu_item_id);

        // Store a jQuery object for this menu item's li, because we will reference it in a couple of places below.
        var menu_item_li = software_$('#software_menu_item_' + menu_item_id);

        // Add expanded class for the menu item's li.
        menu_item_li.addClass('expanded');

        // Add expanded class for the menu item's anchor.
        menu_item_li.children('a').addClass('expanded');
    }
}

function software_hide_accordion_menu(menu_item_id, stop_before_menu_item_id, menu_id) {
    
    // If this menu item id is equal to the stop before menu item id
    if (menu_item_id == stop_before_menu_item_id) {
        
        // set open menu item id to menu item id
        eval("software_menu_"+menu_id+"_open_menu_item_id = " + menu_item_id);
        
        // then return out of function
        return;
        
    // else if we have not reached the stop before menu item id
    } else {
        // slide up menu item
        software_$(document.getElementById("software_menu_item_" + menu_item_id).getElementsByTagName("ul")[0]).slideUp("fast");

        // Store a jQuery object for this menu item's li, because we will reference it in a couple of places below.
        var menu_item_li = software_$('#software_menu_item_' + menu_item_id);

        // Remove expanded class for the menu item's li.
        menu_item_li.removeClass('expanded');

        // Remove expanded class for the menu item's anchor.
        menu_item_li.children('a').removeClass('expanded');

        // if the direct parent to the li is the software menu ul
        if ((document.getElementById("software_menu_item_" + menu_item_id).parentNode.className) && 
            (document.getElementById("software_menu_item_" + menu_item_id).parentNode.className == "software_menu")) {
            
            // set open menu item id to 0
            eval("software_menu_"+menu_id+"_open_menu_item_id = 0");
            
            // return
            return;
            
        // else continue
        } else {
            
            // get menu item's parent menu item id
            parent_menu_item_id = document.getElementById("software_menu_item_" + menu_item_id).parentNode.parentNode.id;
            
            // remove software_menu_item from the id
            parent_menu_item_id = parent_menu_item_id.replace(/software_menu_item_/, "");
            
            // call this function again to close the parent menu item
            software_hide_accordion_menu(parent_menu_item_id, stop_before_menu_item_id, menu_id);
        }
    }
}

// this function initializes a dynamic ad region and starts the animation
function software_initialize_dynamic_ad_region(ad_region_name, transition_type, transition_duration, slideshow, slideshow_interval, slideshow_continuous)
{
    // when the document is ready, then continue
    software_$(document).ready(function () {
        var ad_elements = software_$('#software_ad_region_' + ad_region_name + ' .items > div');
        var ads_element = software_$('#software_ad_region_' + ad_region_name + ' .items');
        
        // get the items container element and apply the hidden overflow in order to remove scrollbars
        var items_container_element = software_$('#software_ad_region_' + ad_region_name + ' .items_container').css('overflow', 'hidden');
        
        // get the menu item link element that has this target, select the menu item and it's corresponding ad
        function trigger(data) {
            var menu_item_link_element = software_$('#software_ad_region_' + ad_region_name + ' .menu').find('a[href$="' + data.id + '"]').get(0);
            
            // if this is a slide transition then call the function that updates it's menu items
            if (transition_type == 'slide') {
                software_update_current_ad_menu_item(menu_item_link_element);
                
            // else this is a fade transition type, so fade the content
            } else {
                software_fade_ads(menu_item_link_element, ad_region_name, transition_duration);
            }
        }

        // Update the CSS for all captions.
        software_$('#software_ad_region_' + ad_region_name + ' .caption').css({
            'display': 'block',
            'position': 'absolute',
            'z-index': '0',
            'filter:alpha': '(opacity=0)',
            '-moz-opacity': '0',
            '-khtml-opacity': '0',
            'opacity': '0',
            'width': '100%'
        });
        
        // if the transition type is set to slide, prepare and initialize the slide effect
        if (transition_type == 'slide') {
            // float the ads so they are in a horizontal line
            ad_elements.css({
                'float' : 'left',
                'position' : 'relative' // IE fix to ensure overflow is hidden
            });
            
            // calculate a new width for the container (so it holds all ads)
            ads_element.css('width', ad_elements[0].offsetWidth * ad_elements.length);
            
            // add click event handler to menu items
            software_$('#software_ad_region_' + ad_region_name + ' .menu').find('a').click(function(){software_update_current_ad_menu_item(this)});
            
            // Update the previous button so that the ad region will slide to the previous ad when it is clicked.
            software_$('#software_ad_region_' + ad_region_name + ' .previous').click(function(){
                items_container_element.trigger('prev');
            });

            // Update the next button so that the ad region will slide to the next ad when it is clicked.
            software_$('#software_ad_region_' + ad_region_name + ' .next').click(function(){
                items_container_element.trigger('next');
            });

            // if there is a bookmark in the location, then select the corresponding menu item
            if (window.location.hash) {
                trigger({ id : window.location.hash.substr(1) });
                
            // else there is not a bookmark in the location, so select the first menu item
            } else {
                software_$('#software_ad_region_' + ad_region_name + ' ul.menu a:first').click();
            }

            // Get the selected ad id which is the default ad that is shown when the page loads,
            // so that we can show caption for ad, if one exists. This will normally be the first ad,
            // unless a hash was supplied in the address.
            var selected_ad_id = software_$('#software_ad_region_' + ad_region_name + ' .menu a.current')[0].href.substr(software_$('#software_ad_region_' + ad_region_name + ' .menu a.current')[0].href.lastIndexOf('#') + 1);

            // If a caption exists for the default ad then fade it in.
            // We fade captions in/out for both slide and fade ad regions.
            // We never slide captions because that might be difficult to do since captions
            // are on a different layer than the ads, so the sliding might be out of sync.
            if (document.getElementById(selected_ad_id + '_caption')) {
                software_$('#' + selected_ad_id + '_caption').animate({
                    opacity: 1
                }, transition_duration, function () {
                    software_$('#' + selected_ad_id + '_caption').css('z-index', '1');
                });
            }
            
            // prepare the offset which is based on the padding of an element
            var offset = parseInt(ads_element.css('paddingTop') || 0) * -1;

            // If the transition duration is 0, then default it to half of a second.
            // We did not used to have to do this, but when we updated jQuery to 1.7.2,
            // a default of 0 caused the slide to be instant.
            if (transition_duration == 0) {
                transition_duration = 500;
            }
            
            // prepare the scroll options for the scroll plugin
            var scrollOptions = {
                // set the element that has the overflow
                target: items_container_element,
                
                // set the container for the ads
                items: ad_elements,
                
                // set where the menu is located
                navigation: '.menu a',
                
                // set that the scrolling should only work horizontally
                axis: 'x',

                // Fade in caption for new ad and fade out caption for old ad.
                // We fade captions in/out for both slide and fade ad regions.
                // We never slide captions because that might be difficult to do since captions
                // are on a different layer than the ads, so the sliding might be out of sync.
                onBefore: function(event, selected_element) {
                    var selected_ad_id = selected_element.id;

                    // If caption exists for new ad then fade it in.
                    if (document.getElementById(selected_ad_id + '_caption')) {
                        software_$('#' + selected_ad_id + '_caption').animate({
                            opacity: 1
                        }, transition_duration, function () {
                            software_$('#' + selected_ad_id + '_caption').css('z-index', '1');
                        });
                    }

                    // Loop through all captions in order to fade any out that are visible.
                    // We don't have a way of knowing the previous ad that was visible
                    // because of the way that the slide plugin works, so we have to check all captions.
                    software_$('#software_ad_region_' + ad_region_name + ' .caption').each(function() {
                        // If this caption is visible then fade it out.
                        if (software_$(this).css('z-index') == 1) {
                            software_$(this).animate({
                                opacity: 0
                            }, transition_duration, function () {
                                software_$(this).css('z-index', '0');
                            });
                        }
                    });
                },
                
                // set callback
                onAfter: trigger,
                
                // set offset based on padding
                offset: offset,

                // set the speed of the scroll effect
                duration: transition_duration,
                
                // easing - can be used with the easing plugin: 
                // http://gsgd.co.uk/sandbox/jquery/easing/
                easing: 'swing',

                // The following property allows the ad region to slide fast when going from an ad far away from another ad
                // (e.g. going from the last ad to the first ad)
                constant: false
            };
            
            // initialize the serialScroll plugin that handles the scrolling effect and allows the slideshow effect to work
            software_$('#software_ad_region_' + ad_region_name).serialScroll(scrollOptions);
        
        // else prepare and initialize the fade effect
        } else {
            // place the ads menu above the ads in the stack
            software_$('#software_ad_region_' + ad_region_name + ' .menu').css({'z-index' : '2'});

            // Place the previous and next buttons above the ads.
            software_$('#software_ad_region_' + ad_region_name + ' .previous').css({'z-index' : '2'});
            software_$('#software_ad_region_' + ad_region_name + ' .next').css({'z-index' : '2'});
            
            // update the ads CSS to stack them on top of each other, put them at the bottom of the stack, and hide them all
            software_$('#software_ad_region_' + ad_region_name + ' .items_container .item').css({
                'position' : 'absolute',
                'top' : '0px',
                'left' : '0px',
                'z-index' : '0',
                'float' : 'none',
                'filter:alpha' : '(opacity=0)',
                '-moz-opacity' : '0',
                '-khtml-opacity' : '0',
                'opacity' : '0'
            });
            
            // add click event handler to menu items, then onclick prepare the menu items and call the fade ads function
            software_$('#software_ad_region_' + ad_region_name + ' .menu').find('a').click(function(mouse_event){
                // prevent the link from reloading the page
                mouse_event.preventDefault();
                
                // call the fade function
                software_fade_ads(this, ad_region_name, transition_duration);
            });

            // Update the previous button so that the ad region will fade to the previous ad when it is clicked.
            software_$('#software_ad_region_' + ad_region_name + ' .previous').click(function(){
                // If we are currently on the first ad, then trigger with the last ad.
                if (software_$('#software_ad_region_' + ad_region_name + ' ul.menu li:first-child a').attr('class') == 'current') {
                    trigger({id : software_$('#software_ad_region_' + ad_region_name + ' ul.menu li:last-child a').attr('href').substr(1)});

                // Otherwise we are not currently on the first ad, so trigger with the previous ad.
                } else {
                    trigger({id: software_$(software_$('#software_ad_region_' + ad_region_name + ' ul.menu a.current')[0].parentNode).prev('li')[0].firstChild.href.substr(software_$(software_$('#software_ad_region_' + ad_region_name + ' ul.menu a.current')[0].parentNode).prev('li')[0].firstChild.href.lastIndexOf('#') + 1) });
                }
            });

            // Update the next button so that the ad region will fade to the next ad when it is clicked.
            software_$('#software_ad_region_' + ad_region_name + ' .next').click(function(){
                // If we have reached the last ad, then trigger with the first ad.
                if (software_$('#software_ad_region_' + ad_region_name + ' ul.menu li:last-child a').attr('class') == 'current') {
                    trigger({id : software_$('#software_ad_region_' + ad_region_name + ' ul.menu a:first-child').attr('href').substr(1)});

                // Otherwise we have not reached the last ad, so trigger with the next ad.
                } else {
                    trigger({ id : software_$(software_$('#software_ad_region_' + ad_region_name + ' ul.menu a.current')[0].parentNode).next('li')[0].firstChild.href.substr(software_$(software_$('#software_ad_region_' + ad_region_name + ' ul.menu a.current')[0].parentNode).next('li')[0].firstChild.href.lastIndexOf('#') + 1) });
                }
            });
            
            // if there is a bookmark in the location, then unhide it's ad and select the corresponding menu item
            if (window.location.hash) {
                // set the corresponding ad to be visable
                software_$('#software_ad_region_' + ad_region_name + ' .items_container #' + window.location.hash.substr(1)).css({
                    'filter:alpha' : '(opacity=1)',
                    '-moz-opacity' : '1',
                    '-khtml-opacity' : '1',
                    'opacity' : '1'
                });
                
                // trigger the change to update the menu
                trigger({ id : window.location.hash.substr(1) });
                
            // else there is not a bookmark in the location, so unhide the first ad and select the first menu item
            } else {
                // set the first ad to be visable
                software_$(software_$('#software_ad_region_' + ad_region_name + ' .items_container .item')[0]).css({
                    'filter:alpha' : '(opacity=1)',
                    '-moz-opacity' : '1',
                    '-khtml-opacity' : '1',
                    'opacity' : '1'
                });
                
                // trigger the change to update the menu
                trigger({ id : software_$('#software_ad_region_' + ad_region_name + ' ul.menu a:first')[0].href.substr(software_$('#software_ad_region_' + ad_region_name + ' ul.menu a:first')[0].href.lastIndexOf('#') + 1) });
            }
        }
        
        // if slideshow is enabled for this ad region, then initialize slideshow
        if (slideshow == true) {
            // start the slideshow with the correct interval
            var cycle_timer = setInterval(function () {
                // if this transition type is a slide, then trigger the slide
                if (transition_type == 'slide') {
                    items_container_element.trigger('next');
                
                // else this is a fade so trigger the next fade
                } else {
                    // If we have reached the end of the slideshow, then trigger with the first ad.
                    if (software_$('#software_ad_region_' + ad_region_name + ' ul.menu li:last-child a').attr('class') == 'current') {
                        trigger({id : software_$('#software_ad_region_' + ad_region_name + ' ul.menu a:first-child').attr('href').substr(1)});

                    // Otherwise we have not reached the end of the slideshow, so trigger with the next ad.
                    } else {
                        trigger({ id : software_$(software_$('#software_ad_region_' + ad_region_name + ' ul.menu a.current')[0].parentNode).next('li')[0].firstChild.href.substr(software_$(software_$('#software_ad_region_' + ad_region_name + ' ul.menu a.current')[0].parentNode).next('li')[0].firstChild.href.lastIndexOf('#') + 1) });
                    }
                }
                
                // If we have reached the end of the slideshow, and continuous is disabled, then stop the slideshow.
                if (
                    (software_$('#software_ad_region_' + ad_region_name + ' ul.menu li:last-child a').attr('class') == 'current')
                    && (slideshow_continuous == false)
                ) {
                    // if this is the fade transition type, then send the slideshow back to the first ad after the set amount of time has passed
                    if (transition_type == 'fade') {
                        setTimeout("software_fade_ads('', '" + ad_region_name + "', " + transition_duration + ");", slideshow_interval * 1000);
                    }

                    clearInterval(cycle_timer);
                }
               
            }, slideshow_interval * 1000);
            
            // set some trigger elements to stop the slideshow
            var stop_triggers =
                software_$('#software_ad_region_' + ad_region_name + ' .menu').find('a') // menu items
                .add('#software_ad_region_' + ad_region_name + ' .items_container') // ads container
                .add('#software_ad_region_' + ad_region_name + ' .previous') // previous button
                .add('#software_ad_region_' + ad_region_name + ' .next') // next button
            
            // create a function to stop the slideshow
            function stop_slideshow() {
                // remove the stop triggers
                stop_triggers.unbind('click.cycle');
                
                // stop the slideshow
                clearInterval(cycle_timer);
            }
            
            // bind the stop slideshow function to the stop triggers
            stop_triggers.bind('click.cycle', stop_slideshow);
        }
    });
}

// this function fades one ad in and one ad out
function software_fade_ads(selected_menu_item, ad_region_name, transition_duration) {
    // if there is not a selected menu item, then set it to the first menu item
    if ((!selected_menu_item) || (selected_menu_item == '')) {
        selected_menu_item = software_$('#software_ad_region_' + ad_region_name + ' ul.menu a:first')[0];
    }
    
    // get the selected ad id
    var selected_ad_id = selected_menu_item.href.substr(selected_menu_item.href.lastIndexOf('#') + 1);
    
    var current_ad_id = 0;
    
    // if there is a current menu item, then get the current ad's id
    if (software_$('#software_ad_region_' + ad_region_name + ' .menu a.current')[0]) {
        current_ad_id = software_$('#software_ad_region_' + ad_region_name + ' .menu a.current')[0].href.substr(software_$('#software_ad_region_' + ad_region_name + ' .menu a.current')[0].href.lastIndexOf('#') + 1);
    }
    
    // update the current menu item
    software_update_current_ad_menu_item(selected_menu_item);
    
    // if the transition duration is 0, then default it to one second
    if (transition_duration == 0) {
        transition_duration = 1000;
    }
    
    // fade in the new ad, and after the fade is complete set it's z-index to 1 so it's on top of the stack
    software_$('#software_ad_region_' + ad_region_name + ' .items_container #' + selected_ad_id).animate({
        opacity: 1
    }, transition_duration, function () {
        software_$('#software_ad_region_' + ad_region_name + ' .items_container #' + selected_ad_id).css('z-index', '1');
        
        // if the browser is IE 7 or IE 8
        // and if there is no background color or background image set (which is another fix for this issue),
        // then remove filter in order to workaround IE jagged text bug
        // setting a background color or image if possible is better
        // because it removes the jagged text, even during the transition,
        // so that is why we don't want to interfere with it
        if (
            (software_$.browser.msie == true)
            &&
            (
                (parseInt(software_$.browser.version, 10) == 7)
                || (parseInt(software_$.browser.version, 10) == 8)
            )
            && (software_$(this).css('background-color') == 'transparent')
            && (software_$(this).css('background-image') == 'none')
        ) {
            software_$(this).css('filter','');
        }
    });

    // If caption exists for new ad then fade it in.
    if (document.getElementById(selected_ad_id + '_caption')) {
        software_$('#' + selected_ad_id + '_caption').animate({
            opacity: 1
        }, transition_duration, function () {
            software_$('#' + selected_ad_id + '_caption').css('z-index', '1');
        });
    }
    
    // fade out the old ad, and after the fade is complete set it's z-index to 0 so that it is under the current ad
    software_$('#software_ad_region_' + ad_region_name + ' .items_container #' + current_ad_id).animate({
        opacity: 0
    }, transition_duration, function () {
        software_$('#software_ad_region_' + ad_region_name + ' .items_container #' + current_ad_id).css('z-index', '0');
    });

    // If caption exists for old ad then fade it out.
    if (document.getElementById(current_ad_id + '_caption')) {
        software_$('#' + current_ad_id + '_caption').animate({
            opacity: 0
        }, transition_duration, function () {
            software_$('#' + current_ad_id + '_caption').css('z-index', '0');
        });
    }
}

// this function updates the current menu item
function software_update_current_ad_menu_item(object)
{
    software_$(object)
        .parents('ul:first')
            .find('a')
                .removeClass('current')
            .end()
        .end()
        .addClass('current');
}

function prepare_content_for_html(content)
{
    var chars = new Array ('&','à','á','â','ã','ä','å','æ','ç','è','é',
                         'ê','ë','ì','í','î','ï','ð','ñ','ò','ó','ô',
                         'õ','ö','ø','ù','ú','û','ü','ý','þ','ÿ','À',
                         'Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
                         'Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö',
                         'Ø','Ù','Ú','Û','Ü','Ý','Þ','€','\"','ß','<',
                         '>','¢','£','¤','¥','¦','§','¨','©','ª','«',
                         '¬','­','®','¯','°','±','²','³','´','µ','¶',
                         '·','¸','¹','º','»','¼','½','¾');

    var entities = new Array ('amp','agrave','aacute','acirc','atilde','auml','aring',
                            'aelig','ccedil','egrave','eacute','ecirc','euml','igrave',
                            'iacute','icirc','iuml','eth','ntilde','ograve','oacute',
                            'ocirc','otilde','ouml','oslash','ugrave','uacute','ucirc',
                            'uuml','yacute','thorn','yuml','Agrave','Aacute','Acirc',
                            'Atilde','Auml','Aring','AElig','Ccedil','Egrave','Eacute',
                            'Ecirc','Euml','Igrave','Iacute','Icirc','Iuml','ETH','Ntilde',
                            'Ograve','Oacute','Ocirc','Otilde','Ouml','Oslash','Ugrave',
                            'Uacute','Ucirc','Uuml','Yacute','THORN','euro','quot','szlig',
                            'lt','gt','cent','pound','curren','yen','brvbar','sect','uml',
                            'copy','ordf','laquo','not','shy','reg','macr','deg','plusmn',
                            'sup2','sup3','acute','micro','para','middot','cedil','sup1',
                            'ordm','raquo','frac14','frac12','frac34');

    for (var i = 0; i < chars.length; i++) {
        myRegExp = new RegExp();
        myRegExp.compile(chars[i],'g');
        content = content.replace (myRegExp, '&' + entities[i] + ';');
    }

    return content;
}

// this is the timer used for the image editor button animation
var software_edit_image_button_timer = Array;

function software_show_or_hide_image_edit_button(image_id, event) 
{
    clearTimeout(software_edit_image_button_timer[image_id]);
    
    image = document.getElementById(image_id);
    
    // if the edit button is hidden then update it's position and show it
    if (event.type == 'mouseover') {
        // if this is not a photo gallery page, then adjust the position of the image editor button
        if (!software_$('.software_photo_gallery_album')[0]) {
            // if the images parent's position is not relative then set the position to be relative,
            // and get the position of the parent and add it to the relative image position to get the screen position
            if (image.offsetParent.style.position != 'relative') {
                // get the orginal position styling for the object
                var orignal_position_styling = image.offsetParent.style.position;
                
                // set it's position to be relative
                image.offsetParent.style.position = 'relative';
                
                // get the image's dimensions
                var image_left_position = image.offsetParent.offsetLeft + image.offsetLeft;
                var image_top_position = image.offsetParent.offsetTop + image.offsetTop;
                
                // switch the position back to what it was originally
                image.offsetParent.style.position = orignal_position_styling;
                
            // else the parent is relative so we do not need to get the parent's position
            } else {
                var image_left_position = image.offsetLeft;
                var image_top_position = image.offsetTop;
            }
            
            // update button position
            document.getElementById("software_edit_button_for_" + image_id).style.left = image_left_position + "px";
            document.getElementById("software_edit_button_for_" + image_id).style.top = image_top_position + "px";
        }
        
        // show the image
        document.getElementById("software_edit_button_for_" + image_id).style.display = "block";
        
    // else if the event was a mouseout, then slide up the button to hide it.
    } else if (event.type == 'mouseout') {
        software_edit_image_button_timer[image_id] = setTimeout('software_$(document.getElementById("software_edit_button_for_' + image_id + '")).slideUp("fast");', 250);
    }
}

function software_show_form_view_directory_summary(summary)
{
    // do different things based on which summary was selected
    switch (summary) {
        case 'most_recent':
            // show and hide summary tables
            document.getElementById('software_form_view_directory_summary_table_most_viewed').style.display = 'none';
            document.getElementById('software_form_view_directory_summary_table_most_active').style.display = 'none';
            document.getElementById('software_form_view_directory_summary_table_most_recent').style.display = '';
            
            // update font weight for summary links
            document.getElementById('software_form_view_directory_summary_link_most_viewed').style.fontWeight = '';
            document.getElementById('software_form_view_directory_summary_link_most_active').style.fontWeight = '';
            document.getElementById('software_form_view_directory_summary_link_most_recent').style.fontWeight = 'bold';
            
            break
                
        case 'most_viewed':
            // show and hide summary tables
            document.getElementById('software_form_view_directory_summary_table_most_recent').style.display = 'none';
            document.getElementById('software_form_view_directory_summary_table_most_active').style.display = 'none';
            document.getElementById('software_form_view_directory_summary_table_most_viewed').style.display = '';

            // update font weight for summary links
            document.getElementById('software_form_view_directory_summary_link_most_recent').style.fontWeight = '';
            document.getElementById('software_form_view_directory_summary_link_most_active').style.fontWeight = '';
            document.getElementById('software_form_view_directory_summary_link_most_viewed').style.fontWeight = 'bold';
            
            break
                
        case 'most_active':
            // show and hide summary tables
            document.getElementById('software_form_view_directory_summary_table_most_recent').style.display = 'none';
            document.getElementById('software_form_view_directory_summary_table_most_viewed').style.display = 'none';
            document.getElementById('software_form_view_directory_summary_table_most_active').style.display = '';
            
            // update font weight for summary links
            document.getElementById('software_form_view_directory_summary_link_most_recent').style.fontWeight = '';
            document.getElementById('software_form_view_directory_summary_link_most_viewed').style.fontWeight = '';
            document.getElementById('software_form_view_directory_summary_link_most_active').style.fontWeight = 'bold';
            
            break;
    }
}

// this function is responsible for initializing the edit region dialog
function software_initialize_edit_region_dialog()
{
    var edit_region_dialog = software_$('#software_edit_region_dialog');

    // initialize the edit region dialog
    edit_region_dialog.dialog({
        autoOpen: false,
        modal: true,
        dialogClass: 'standard',
        open: function() {
            // set the dialog box's default width and height
            var dialog_width = 750;
            var dialog_height = 587;

            // Get window width and height.
            var window_width = software_$(window).width();
            var window_height = software_$(window).height();
            
            // if the dialog's new width is greater than the default, then set the width
            if ((window_width * .75) >= dialog_width) {
                dialog_width = window_width * .75;
            }
            
            // if the dialog's new height is greater than the default, then set the width
            if ((window_height * .75) >= dialog_height) {
                dialog_height = window_height * .75;
            }

            // Update dialog width and height and position it in the center.
            edit_region_dialog.dialog('option', 'width', dialog_width);
            edit_region_dialog.dialog('option', 'height', dialog_height);
            edit_region_dialog.dialog('option', 'position', 'center');
            
            // remove the close button from the dialog
            software_$('.ui-dialog-titlebar-close').css('display','none');
        },
        close: function() {
            // destroy the text editor instance
            tinyMCE.execCommand('mceRemoveControl', false, 'software_edit_region_textarea');
            
            // clear the content
            document.getElementById('software_edit_region_textarea').value = '';
        },
        resize: function() {
            // Get dialog element, which we will use below to get the width and height.
            var ui_dialog = software_$('.standard.ui-dialog');

            // Update the width and height for the rich-text editor based on the size of the dialog.
            software_$('#software_edit_region_dialog #software_edit_region_textarea_ifr').css({
                'width': parseInt(ui_dialog.width() - 60),
                'height': parseInt(ui_dialog.height() - 240)
            });
        }
    });
}

// this function is responsible for showing the edit region dialog
// which is used for editing page regions, common regions, and the system region header and footer
function software_open_edit_region_dialog(region_id, region_type, region_name, region_order)
{
    // open the dialog
    software_$('#software_edit_region_dialog').dialog('open');
    
    var region_name_for_title_bar = '';

    // prepare the region name differently based on the region type
    switch (region_type) {
        case 'pregion':
            region_name_for_title_bar = 'Page Region #' + region_order;
            break;
                
        case 'cregion':
            region_name_for_title_bar = 'Common Region: ' + region_name;
            break;
                
        case 'system_region_header':
            region_name_for_title_bar = 'System Region Header';
            break;
            
        case 'system_region_footer':
            region_name_for_title_bar = 'System Region Footer';
            break;
    }
    
    // add the text editor title content to the title bar
    software_$('#software_edit_region_dialog')[0].parentNode.firstChild.firstChild.innerHTML = '<table class="title_bar_table"><tr><td style="width: 33%;">Rich-text Editor</td><td style="width: 33%; text-align: center;">' + region_name_for_title_bar + '</td><td style="width: 33%; text-align: right"><a href="javascript:void(0)" onclick="window.open(\'' + software_path + software_directory + '/help.php?article=0080_rich_text_editor\', \'popup\', \'toolbar=no,location=no,directories=no,status=yes,menubar=no,resizable=yes,copyhistory=no,scrollbars=yes,width=600,height=520\')">Help</a></td></tr></table>';
    
    // update the hidden form fields with the values for this region
    software_$('#software_edit_region_dialog #region_id')[0].value = region_id;
    software_$('#software_edit_region_dialog #region_type')[0].value = region_type;
    
    // if there is a region order, then update the region order hidden field
    if (region_order != '') {
        document.getElementById('region_order').value = region_order;
    }
    
    // make ajax call to get the content from the database and set content for textarea value
    document.getElementById('software_edit_region_textarea').value = software_$.ajax({
        type: 'GET',
        url: software_path + software_directory + '/get_region_content.php',
        data: 'page_id=' + software_$('#software_edit_region_dialog #page_id')[0].value + '&region_id=' + region_id + '&region_type=' + region_type,
        async: false
    }).responseText;
    
    // initiate the editor
    tinyMCE.execCommand('mceAddControl', false, 'software_edit_region_textarea');
}

// this function is called once the editor is done loading
// the editor is resized to fit the dialog
// we have to have this separate function because we have to wait until the mceAddControl is completely done or the resize will not work
function software_activate_edit_region_dialog()
{
    // Get dialog element, which we will use below to get the width and height.
    var ui_dialog = software_$('.standard.ui-dialog');

    // Update the width and height for the rich-text editor based on the size of the dialog.
    software_$('#software_edit_region_dialog #software_edit_region_textarea_ifr').css({
        'width': parseInt(ui_dialog.width() - 60),
        'height': parseInt(ui_dialog.height() - 240)
    });
}

// this function initializes the photo gallery
function software_init_photo_gallery(thumbnails)
{
    // prepare the thumbnails
    software_$(thumbnails).each(function(index) {
        // save the thumbnail properties so that we can access them later
        var object_id = this[0];
        
        // get the image object
        var image = software_$('.software_photo_gallery_album #' + object_id)[0];
        
        // add mouseover and mouseout listeners to the image so that we can add a hover effect
        software_$(image).mouseover(function() { software_$(image).addClass('image_hover'); });
        software_$(image).mouseout(function() { software_$(image).removeClass('image_hover'); });
        
        // get the type of object (photo or album)
        var object_type = object_id.substr(0, object_id.lastIndexOf('_'));
        
        // if this is an album, then adjust it's frame's width and height, 
        // and then add a click event listener to send the browser to the next level of the photo gallery
        if (object_type == 'album') {
            // set a dealy to resize the album frames, 
            // this is required so that safari will correctly render the album frames
            setTimeout (function () {
                // adjust the width and height for the ablum frames
                software_$(software_$(software_$('.software_photo_gallery_album #' + object_id)[0].parentNode).find('#album_frame_1')[0]).css('width', software_$(image).outerWidth(true))
                software_$(software_$(software_$('.software_photo_gallery_album #' + object_id)[0].parentNode).find('#album_frame_1')[0]).css('height', software_$(image).outerHeight(true))
                software_$(software_$(software_$('.software_photo_gallery_album #' + object_id)[0].parentNode).find('#album_frame_2')[0]).css('width', software_$(image).outerWidth(true))
                software_$(software_$(software_$('.software_photo_gallery_album #' + object_id)[0].parentNode).find('#album_frame_2')[0]).css('height', software_$(image).outerHeight(true))
            }, 250);
            
            // add a click listener to send the browser to the next level of the photo gallery
            software_$(image).click(function() { 
                // get the album's folder id
                var folder_id = this.id.substr(this.id.lastIndexOf('_') + 1);
                
                // send the user to the next level of the photo gallery
                window.location = software_path + 'pages/' + software_page_name + '?folder_id=' + folder_id;
            });
        }
    });
    
    // initialize lightbox for all photos
    software_$('.software_photo_gallery_album .photo a.link').lightBox();
}

function software_change_verified_country()
{
    // hide various containers until we find what should be displayed
    document.getElementById('verified_state_container').style.display = 'none';
    document.getElementById('verified_address_container').style.display = 'none';
    document.getElementById('verified_message').style.display = 'none';
    document.getElementById('verified_summary').style.display = 'none';
    document.getElementById('verified_button').style.display = 'none';
    
    // if a country was selected, then continue to show details for country
    if (document.getElementById('verified_country_id').value != '') {
        // remove existing options from state pick list
        document.getElementById('verified_state_id').options.length = 0;
        
        // add blank option to state pick list
        document.getElementById('verified_state_id').options[document.getElementById('verified_state_id').length] = new Option('', '');
        
        var states_exist = false;
        
        // loop through all of the states in order to add options to states pick list
        for (i = 0; i < software_verified_states.length; i++) {
            // if this state is in the selected country, then add option to states pick list
            if (software_verified_states[i]['country_id'] == document.getElementById('verified_country_id').value) {
                document.getElementById('verified_state_id').options[document.getElementById('verified_state_id').length] = new Option(software_verified_states[i]['name'], software_verified_states[i]['id']);
                states_exist = true;
            }
        }
        
        // if states exist for the selected country, then show states
        if (states_exist == true) {
            document.getElementById('verified_state_container').style.display = '';
            
        // else states do not exist for the selected country, so output error
        } else {
            document.getElementById('verified_message').innerHTML = 'Sorry, we don\'t have any verified addresses for that Country.';
            document.getElementById('verified_message').style.color = 'red';
            document.getElementById('verified_message').style.display = '';
        }
    }
}

function software_change_verified_state()
{
    // hide various containers until we find what should be displayed
    document.getElementById('verified_address_container').style.display = 'none';
    document.getElementById('verified_message').style.display = 'none';
    document.getElementById('verified_summary').style.display = 'none';
    document.getElementById('verified_button').style.display = 'none';
    
    // if a state was selected, then continue to show details for state
    if (document.getElementById('verified_state_id').value != '') {
        // remove existing options from address pick list
        document.getElementById('verified_address_id').options.length = 0;
        
        // add blank option to address pick list
        document.getElementById('verified_address_id').options[document.getElementById('verified_address_id').length] = new Option('', '');
        
        var addresses_exist = false;
        
        // loop through all of the addresses in order to add options to address pick list
        for (i = 0; i < software_verified_addresses.length; i++) {
            // if this address is in the selected state, then add option to address pick list
            if (software_verified_addresses[i]['state_id'] == document.getElementById('verified_state_id').value) {
                document.getElementById('verified_address_id').options[document.getElementById('verified_address_id').length] = new Option(software_verified_addresses[i]['label'], software_verified_addresses[i]['id']);
                addresses_exist = true;
            }
        }
        
        // if addresses exist for the selected state, then show addresses
        if (addresses_exist == true) {
            document.getElementById('verified_address_container').style.display = '';
            
        // else addresses do not exist for the selected state, so output error
        } else {
            document.getElementById('verified_message').innerHTML = 'Sorry, we don\'t have any verified addresses for that State.';
            document.getElementById('verified_message').style.color = 'red';
            document.getElementById('verified_message').style.display = '';
            
        }
    }
}

function software_change_verified_address()
{
    // hide various containers until we find what should be displayed
    document.getElementById('verified_message').style.display = 'none';
    document.getElementById('verified_summary').style.display = 'none';
    document.getElementById('verified_button').style.display = 'none';
    
    // if an address was selected, then continue to show details for address
    if (document.getElementById('verified_address_id').value != '') {
        // loop through all of the addresses in order to get the info for the selected address
        for (i = 0; i < software_verified_addresses.length; i++) {
            // if this address is the selected address then store info and break out of loop
            if (software_verified_addresses[i]['id'] == document.getElementById('verified_address_id').value) {
                var company = software_verified_addresses[i]['company'];
                var address_1 = software_verified_addresses[i]['address_1'];
                var address_2 = software_verified_addresses[i]['address_2'];
                var city = software_verified_addresses[i]['city'];
                var state_code = software_verified_addresses[i]['state_code'];
                var zip_code = software_verified_addresses[i]['zip_code'];
                var country_code = software_verified_addresses[i]['country_code'];
                var country_name = software_verified_addresses[i]['country_name'];
                
                break;
            }
        }
        
        var output_address = '';
        
        // if there is a company then add it to address
        if (company != '') {
            output_address += prepare_content_for_html(company) + '<br />';
        }
        
        // add address 1 to address
        output_address += prepare_content_for_html(address_1) + '<br />';
        
        // if there is an address 2 then add it to address
        if (address_2 != '') {
            output_address += prepare_content_for_html(address_2) + '<br />';
        }
        
        // add city, state, zip code, and country to address
        output_address +=
            prepare_content_for_html(city) + ', ' + prepare_content_for_html(state_code) + ' ' + prepare_content_for_html(zip_code) + '<br />' +
            prepare_content_for_html(country_name);
        
        document.getElementById('verified_summary').innerHTML = output_address;
        document.getElementById('verified_summary').style.display = '';
        document.getElementById('verified_button').style.display = '';
    }
}

function software_use_verified_address()
{
    // loop through all of the addresses in order to get the info for the selected address
    for (i = 0; i < software_verified_addresses.length; i++) {
        // if this address is the selected address then store info and break out of loop
        if (software_verified_addresses[i]['id'] == document.getElementById('verified_address_id').value) {
            var company = software_verified_addresses[i]['company'];
            var address_1 = software_verified_addresses[i]['address_1'];
            var address_2 = software_verified_addresses[i]['address_2'];
            var city = software_verified_addresses[i]['city'];
            var state_code = software_verified_addresses[i]['state_code'];
            var zip_code = software_verified_addresses[i]['zip_code'];
            var country_code = software_verified_addresses[i]['country_code'];
            
            break;
        }
    }
    
    // copy address info into shipping address fields
    document.getElementById('company').value = company;
    document.getElementById('address_1').value = address_1;
    document.getElementById('address_2').value = address_2;
    document.getElementById('city').value = city;
    document.getElementById('zip_code').value = zip_code;
    document.getElementById('country').value = country_code;
    change_states('country', 'state');
    document.getElementById('state').value = state_code;
    
    // hide button
    document.getElementById('verified_button').style.display = 'none';
    
    // update verified address field so that no option is selected
    document.getElementById('verified_address_id').value = '';
    
    // add confirmation message
    document.getElementById('verified_message').innerHTML = 'The shipping address fields have been updated with:';
    document.getElementById('verified_message').style.color = '';
    document.getElementById('verified_message').style.display = '';
}

// Create global namespace object that all future variables and functions should go in.
var software = {
    // Create object to allow us to base64 encode and decode content.
    Base64: {
        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = this._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = this._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }
    },

    // Create function to allow us to rot13 content.
    get_rot13: function(string) {
        // If there is a string, then rot13 it.
        if (string) {
            return string.replace(/[a-zA-Z]/g, function(c){
                return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
            });

        // Otherwise there is not a string, so return empty string.
        } else {
            return '';
        }
    },

    // Create a function that will prepare the search feature for a form list view.
    initialize_form_list_view: function (properties) {
        var page_id = properties.page_id;

        var browse_pick_list = software_$('#' + page_id + '_browse_field_id');
        var simple_query = software_$('#'+ page_id + '_query');
        var advanced_status_hidden_field = software_$('#'+ page_id + '_advanced');
        var advanced_toggle = software_$('.software_form_list_view .page_' + page_id + ' .advanced_toggle');
        var advanced = software_$('.software_form_list_view .page_' + page_id + ' .advanced');

        // If the browse pick list exists, then browse is enabled so initialize browse features.
        if (browse_pick_list.length) {
            // Remember the currently selected browse field id, so that we can close the correct filter container when it changes.
            // This value might change.
            var browse_field_id = software_$('#' + page_id + '_browse_field_id option:selected').val();

            // Remember the original browse field id value when the page first loaded,
            // so later we know if we need to submit the form/refresh the page when the browse toggle is clicked.
            // This value will not change.
            var original_browse_field_id = browse_field_id;

            var browse_toggle = software_$('.software_form_list_view .page_' + page_id + ' .browse_toggle');

            // Complete tasks when visitor changes the browse pick list selection.
            browse_pick_list.change(function () {
                var new_browse_field_id = software_$('#' + page_id + '_browse_field_id option:selected').val();

                // If search is enabled, then clear search field.
                if (simple_query.length) {
                    simple_query[0].value = 'Search';

                    // Add default class so that text in field can appear lighter.
                    simple_query.addClass('default');
                }

                // If advanced search is enabled and it is expanded, then collapse it.
                if (
                    (advanced_toggle.length)
                    && (advanced_status_hidden_field[0].value == 'true')
                ) {
                    // Update advanced status hidden field so that when the form is submitted
                    // we can know that the advanced search was collapsed.
                    advanced_status_hidden_field[0].value = 'false';

                    advanced.slideUp('slow', function () {
                        // Remove advanced_expanded class from search container.
                        software_$('.software_form_list_view .page_' + page_id).removeClass('advanced_expanded');

                        // Update label for toggle.
                        advanced_toggle[0].innerHTML = '+';

                        // Update title for toggle.
                        advanced_toggle[0].title = 'Add Advanced Search';

                        // If there is a new browse field selected, then show browse toggle.
                        if (new_browse_field_id != '') {
                            browse_toggle[0].style.display = '';

                        // Otherwise there is not a new browse field selected, so hide browse toggle.
                        } else {
                            browse_toggle[0].style.display = 'none';
                        }

                        // If there was a browse field selected before, then hide filter container for it.
                        if (browse_field_id != '') {
                            software_$('.software_form_list_view .page_' + page_id + ' .browse_filter_container.field_' + browse_field_id).slideUp('slow', function () {
                                // If there is a new browse field selected, then show filter container for it.
                                if (new_browse_field_id != '') {
                                    software_$('.software_form_list_view .page_' + page_id + ' .browse_filter_container.field_' + new_browse_field_id).slideDown('slow');
                                    software_$('.software_form_list_view .page_' + page_id).addClass('browse_expanded');
                                } else {
                                    software_$('.software_form_list_view .page_' + page_id).removeClass('browse_expanded');
                                }
                            });

                        } else {
                            // If there is a new browse field selected, then show filter container for it.
                            if (new_browse_field_id != '') {
                                software_$('.software_form_list_view .page_' + page_id + ' .browse_filter_container.field_' + new_browse_field_id).slideDown('slow');
                                software_$('.software_form_list_view .page_' + page_id).addClass('browse_expanded');
                            } else {
                                software_$('.software_form_list_view .page_' + page_id).removeClass('browse_expanded');
                            }
                        }

                        browse_field_id = new_browse_field_id;
                    });

                } else {
                    // If there is a new browse field selected, then show browse toggle.
                    if (new_browse_field_id != '') {
                        browse_toggle[0].style.display = '';

                    // Otherwise there is not a new browse field selected, so hide browse toggle.
                    } else {
                        browse_toggle[0].style.display = 'none';
                    }

                    // If there was a browse field selected before, then hide filter container for it.
                    if (browse_field_id != '') {
                        software_$('.software_form_list_view .page_' + page_id + ' .browse_filter_container.field_' + browse_field_id).slideUp('slow', function () {
                            // If there is a new browse field selected, then show filter container for it.
                            if (new_browse_field_id != '') {
                                software_$('.software_form_list_view .page_' + page_id + ' .browse_filter_container.field_' + new_browse_field_id).slideDown('slow');
                                software_$('.software_form_list_view .page_' + page_id).addClass('browse_expanded');
                            } else {
                                software_$('.software_form_list_view .page_' + page_id).removeClass('browse_expanded');

                                // If the browse was expanded when the page originally loaded
                                // then submit form in order to refresh page because results might be different
                                // without browse.  This also changes the address in the address bar
                                // so if the visitor browses away and comes back, the system will remember
                                // that the browse is collapsed.  This also allows a visitor to copy address
                                // in address bar and send to someone else and have the results be the same.
                                if (original_browse_field_id != '') {
                                    software_$('.software_form_list_view .browse_and_search_form.page_' + page_id).submit();
                                }
                            }
                        });

                    } else {
                        // If there is a new browse field selected, then show filter container for it.
                        if (new_browse_field_id != '') {
                            software_$('.software_form_list_view .page_' + page_id + ' .browse_filter_container.field_' + new_browse_field_id).slideDown('slow');
                            software_$('.software_form_list_view .page_' + page_id).addClass('browse_expanded');
                        } else {
                            software_$('.software_form_list_view .page_' + page_id).removeClass('browse_expanded');
                        }
                    }

                    browse_field_id = new_browse_field_id;
                }
            });
            
            // Deactivate browse field when toggle is clicked.
            browse_toggle.click(function () {
                // Hide toggle.
                browse_toggle[0].style.display = 'none';

                // Set browse pick list to default value.
                browse_pick_list.val('');

                // Slide filter container up and then remove browse expanded class.
                software_$('.software_form_list_view .page_' + page_id + ' .browse_filter_container.field_' + browse_field_id).slideUp('slow', function () {
                    software_$('.software_form_list_view .page_' + page_id).removeClass('browse_expanded');

                    // If the browse was expanded when the page originally loaded
                    // then submit form in order to refresh page because results might be different
                    // without browse.  This also changes the address in the address bar
                    // so if the visitor browses away and comes back, the system will remember
                    // that the browse is collapsed.  This also allows a visitor to copy address
                    // in address bar and send to someone else and have the results be the same.
                    if (original_browse_field_id != '') {
                        software_$('.software_form_list_view .browse_and_search_form.page_' + page_id).submit();
                    }
                });

                browse_field_id = '';

                // Prevent link from going anywhere.
                return false;
            });
        }

        // If search is enabled, then prepare search.
        if (simple_query.length) {
            // If the simple query field does not have a value, then set default value and add class.
            if (simple_query[0].value == '') {
                simple_query[0].value = 'Search';

                // Add default class so that text in field can appear lighter.
                simple_query.addClass('default');
            };

            // Set simple query field so that the default value is removed when focus is placed on the field.
            simple_query[0].onfocus = function () {
                // If browse is enabled and browse is active, then deactivate it.
                if ((browse_pick_list.length) && (browse_field_id != '')) {
                    // Hide browse toggle.
                    browse_toggle[0].style.display = 'none';

                    // Set browse pick list to default value.
                    browse_pick_list.val('');

                    // Slide filter container up and then remove browse expanded class.
                    software_$('.software_form_list_view .page_' + page_id + ' .browse_filter_container.field_' + browse_field_id).slideUp('slow', function () {
                        software_$('.software_form_list_view .page_' + page_id).removeClass('browse_expanded');
                    });

                    // Remember that browse is inactive.
                    browse_field_id = '';
                }

                if (simple_query[0].value == 'Search') {
                    simple_query[0].value = '';

                    // Remove default class so that text in field can appear darker now that default text is removed.
                    simple_query.removeClass('default');
                }
            };

            // Set simple query field so that the default value is restored when focus is removed from the field and the field is empty.
            simple_query[0].onblur = function () {
                if (simple_query[0].value == '') {
                    simple_query[0].value = 'Search';

                    // Add default class so that text in field can appear lighter.
                    simple_query.addClass('default');
                }
            };

            // If the advanced toggle exists, then prepare it.
            if (advanced_toggle.length) {
                // Assume that the advanced search is not expanded until we find out otherwise.
                // We use this later in order to determine if we need to submit the form.
                var original_advanced_expanded = false;

                // If the advanced search is expanded, then remember that.
                if (advanced_status_hidden_field[0].value == 'true') {
                    original_advanced_expanded = true;
                }

                advanced_toggle.click(function () {
                    // If the advanced search is collapsed, then expand it.
                    if (advanced_status_hidden_field[0].value == 'false') {
                        // Update advanced status hidden field so that when the form is submitted
                        // we can know that the advanced search was expanded.
                        advanced_status_hidden_field[0].value = 'true';

                        // If browse is enabled and browse is active, then deactivate it and then activate advanced search.
                        if ((browse_pick_list.length) && (browse_field_id != '')) {
                            // Hide browse toggle.
                            browse_toggle[0].style.display = 'none';

                            // Set browse pick list to default value.
                            browse_pick_list.val('');

                            // Slide filter container up and then remove browse expanded class and activate advanced search.
                            software_$('.software_form_list_view .page_' + page_id + ' .browse_filter_container.field_' + browse_field_id).slideUp('slow', function () {
                                software_$('.software_form_list_view .page_' + page_id).removeClass('browse_expanded');

                                // Add advanced_expanded class to search container.
                                software_$('.software_form_list_view .page_' + page_id).addClass('advanced_expanded');

                                // Update label for toggle.
                                advanced_toggle[0].innerHTML = '&ndash;';

                                // Update title for toggle.
                                advanced_toggle[0].title = 'Remove Advanced Search';

                                advanced.slideDown('slow');
                            });

                            // Remember that browse is inactive.
                            browse_field_id = '';

                        // Otherwise browse is not enabled or not active, so just deal with advanced search.
                        } else {
                            // Add advanced_expanded class to search container.
                            software_$('.software_form_list_view .page_' + page_id).addClass('advanced_expanded');

                            // Update label for toggle.
                            advanced_toggle[0].innerHTML = '&ndash;';

                            // Update title for toggle.
                            advanced_toggle[0].title = 'Remove Advanced Search';

                            advanced.slideDown('slow');
                        }

                    // Otherwise the advanced search is expanded, so collapse it.
                    } else {
                        // Update advanced status hidden field so that when the form is submitted
                        // we can know that the advanced search was collapsed.
                        advanced_status_hidden_field[0].value = 'false';

                        // Update label for toggle.
                        advanced_toggle[0].innerHTML = '+';

                        // Update title for toggle.
                        advanced_toggle[0].title = 'Add Advanced Search';

                        advanced.slideUp('slow', function () {
                            // Remove advanced_expanded class from search container.
                            software_$('.software_form_list_view .page_' + page_id).removeClass('advanced_expanded');

                            // If the advanced search was expanded when the page originally loaded
                            // then submit form in order to refresh page because results might be different
                            // without advanced search.  This also changes the address in the address bar
                            // so if the visitor browses away and comes back, the system will remember
                            // that the advanced search is collapsed.  This also allows a visitor to copy address
                            // in address bar and send to someone else and have the search be the same.
                            if (original_advanced_expanded == true) {
                                software_$('.software_form_list_view .browse_and_search_form.page_' + page_id).submit();
                            }
                        });
                    }

                    // Prevent link from going anywhere.
                    return false;
                });
            }
        }
    },

    // Create a function that will open a jQuery dialog that contains an iframe.
    open_dialog: function(properties) {
        var height = properties.height;
        var modal = properties.modal;
        var title = properties.title;
        var url = properties.url;
        var width = properties.width;

        // If the height is not set, or the visitor is using a mobile device,
        // then set height as a percentage of the browser height.
        if (
            (height === undefined)
            || (software_device_type == 'mobile')
        ) {
            height = software_$(window).height() * .75;

        // Otherwise the height is set and the visitor is using a desktop device,
        // so use height parameter and add 25px to make up for the jQuery dialog iframe height.
        } else {
            height = height + 25;
        }

        // If modal is not set, then enable it by default.
        if (modal === undefined) {
            modal = true;
        }

        // If the width is not set, or the visitor is using a mobile device,
        // then set width as a percentage of the browser width.
        if (
            (width === undefined)
            || (software_device_type == 'mobile')
        ) {
            width = software_$(window).width() * .75;
        }

        // Create unique id from number of milliseconds since epoch
        // so that multiple dialogs can exist at once.
        var date = new Date;
        var unique_id = date.getTime();

        // Add iframe to body.
        var iframe = document.createElement('iframe');
        iframe.id = 'software_dialog_' + unique_id;
        iframe.src = url;
        iframe.style.border = 'none';
        iframe.frameBorder = 0;
        document.body.appendChild(iframe);

        // Open jQuery dialog.
        software_$('#software_dialog_' + unique_id).dialog({
            autoOpen: true,
            open: function() {
                // Add container around iframe so we can set overflow and webkit overflow scrolling,
                // so that the iframe does not go outside the dialog horizontally in iOS and so
                // visitors can scroll in the iframe in iOS.
                // We have not yet solved the iframe being extended vertically in iOS.
                // We add the container div for other environments also just because it does not appear
                // to have any side effects.  We could probably add container up above when iframe is created,
                // instead of placing it in this open function, however we have not tested that.
                software_$('#software_dialog_' + unique_id).wrap('<div id="software_dialog_' + unique_id + '_container" />');
                software_$('#software_dialog_' + unique_id + '_container').css({
                    'overflow': 'auto',
                    '-webkit-overflow-scrolling': 'touch'
                });
            },
            close: function() {
                // Remove iframe and iframe container.
                software_$('#software_dialog_' + unique_id).remove();
                software_$('#software_dialog_' + unique_id + '_container').remove();
            },
            dialogClass: 'software mobile_dialog',
            height: height,
            modal: modal,
            title: title,
            width: width
        });
    },

    // Create a function that will be responsible for taking an encrypted email link, decrypting it,
    // and then outputting it.  This function is used in order to protect email addresses from harvesters.
    output_email_link: function(email_link) {
        document.write(this.get_rot13(this.Base64.decode(email_link)));

        // Remove script tag that called this function in order to avoid a bug, where a blank white page appears,
        // if this content is located in a dynamic area that is processed by jQuery (e.g. tab content).
        software_$('#software_email_link_script').remove();
    }
};

