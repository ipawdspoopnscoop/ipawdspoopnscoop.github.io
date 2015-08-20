<!--
function update_help_content(article, update_article_pick_list)
{
    // if article is undefined, then set to the default, which is index
    if ((article === undefined) || (article == '')) {
        article = 'index';
    }
    
    // update content in help dialog
    $.get(
        'get_help_content.php',
        {article: article},
        function(data) {
            document.getElementById('help_dialog_content').innerHTML = data;
            
            // if article picklist needs to be updated, then update it.
            if (update_article_pick_list == true) {
                document.getElementById('help_dialog_pick_list').value = article;
            }
        });
    
    help_dialog_article = article;
}

function get_scroll_height()
{
    var height = 0;
    
    if (window.pageYOffset) {
        height = window.pageYOffset;
    } else if (document.body.scrollTop) {
        height = document.body.scrollTop;
    } else if (document.documentElement.scrollTop) {
        height = document.documentElement.scrollTop;
    }
    
    return height;
}

$(document).ready(function() {
    
    // if the help button exists, or if auto open is true, initialize help system
    if ((document.getElementById("help_link")) || ((typeof help_window_auto_open !== 'undefined') && (help_window_auto_open == true))) {
        
        // store original property values for help dialog so that we can determine if values have been changed later
        var original_help_dialog_enabled = help_dialog_enabled;
        var original_help_dialog_width = help_dialog_width;
        var original_help_dialog_height = help_dialog_height;
        var original_help_dialog_top = help_dialog_top;
        var original_help_dialog_left = help_dialog_left;
        var original_help_dialog_update = help_dialog_update;
        var original_help_dialog_article = help_dialog_article;
        
        function update_help_dialog_variables()
        {
            // get properties
            help_dialog_width = $('.standard.ui-dialog').css('width');
            help_dialog_height = $('.standard.ui-dialog').css('height');
            help_dialog_top = $('.standard.ui-dialog').css('top');
            help_dialog_left = $('.standard.ui-dialog').css('left');
            
            // remove "px" from properties
            help_dialog_width = help_dialog_width.substring(0, help_dialog_width.lastIndexOf('p'));
            help_dialog_height = help_dialog_height.substring(0, help_dialog_height.lastIndexOf('p'));
            help_dialog_top = help_dialog_top.substring(0, help_dialog_top.lastIndexOf('p'));
            help_dialog_left = help_dialog_left.substring(0, help_dialog_left.lastIndexOf('p'));
            
            // calculate the height for the help dialog content container and apply it to the help dialog content container
            document.getElementById("help_dialog_content").style.height = parseInt(document.getElementById("help_dialog").style.height) - parseInt($('#help_dialog_header').css('height')) + "px";
        }
        
        var help_dialog_draggable = true;
        var help_dialog_resizable = true;
        
        // if auto open is true then we are opening this from the help pop-up window, so set the extra properties so the dialog box is not resizeable or dragable,
        if (help_window_auto_open == true) {
            help_dialog_draggable = false;
            help_dialog_resizable = false;
        }
        
        $('#help_dialog').dialog({
            autoOpen: help_dialog_enabled,
            width: help_dialog_width,
            height: help_dialog_height,
            position: [help_dialog_left, help_dialog_top],
            title: 'Help',
            dialogClass: 'standard',
            draggable: help_dialog_draggable,
            resizable: help_dialog_resizable,
            open: function() {
                $('.standard.ui-dialog').css({
                    top: help_dialog_top + 'px',
                    left: help_dialog_left + 'px',
                    position: 'fixed'
                });
                
                update_help_content(help_dialog_article, false);
                
                $("#help_dialog").css("display", "block");
                
                // calculate the height for the help dialog content container and apply it to the help dialog content container
                document.getElementById("help_dialog_content").style.height = parseInt(document.getElementById("help_dialog").style.height) - parseInt($('#help_dialog_header').css('height')) + "px";
                
                help_dialog_enabled = true;
            },
            close: function() {
                help_dialog_enabled = false;
            },
            dragStop: function() {
                update_help_dialog_variables();
            },
            resizeStop: function() {
                // get the absolute top, so that we can adjust the top based on the scroll height
                // if we don't adjust the top, then the help dialog jumps after resize
                var absolute_top = $('.standard.ui-dialog').css('top');
                absolute_top = absolute_top.substring(0, absolute_top.lastIndexOf('p'));
                
                $('.standard.ui-dialog').css({
                    top: absolute_top - get_scroll_height() + 'px',
                    position: 'fixed'
                });
                
                update_help_dialog_variables();
            }
        });
        
        // when the help link is clicked open the help dialog
        $('#help_link').click(function() {
            $('#help_dialog').dialog('open');
            return false;
        });
        
        document.getElementById('help_dialog_pick_list').onchange = function() {
            update_help_content(this.options[this.selectedIndex].value, false);
        }
        
        // if the pin article check box should be checked, then check it
        if (help_dialog_update == false) {
            document.getElementById('help_dialog_pin_article').checked = true;
        }
        
        document.getElementById('help_dialog_pin_article').onclick = function() {
            // if the pin article check box is checked, then set update to false
            if (document.getElementById('help_dialog_pin_article').checked == true) {
                help_dialog_update = false;
                
            // else the pin article check box is not checked, so set update to true
            } else {
                help_dialog_update = true;
            }
        }
        
        // if auto open is true then we are opening this from the help pop-up window, so hide the close help dialog button,
        // and add an event listener to the window to detect the window resizing
        if (help_window_auto_open == true) {
            // hide the close help dialog button
            $('.ui-dialog-titlebar-close').css('display','none');
            
            // if the window is being resized, then resize the help window to match the pop-up window
            $(window).resize(function() {
                // update the width and height for the dialog container
                $('.standard.ui-dialog').css('width', Math.round(document.documentElement.clientWidth));
                $('.standard.ui-dialog').css('height', document.documentElement.clientHeight);
                
                // update the width and height for the help dialog container
                $('#help_dialog').css('width', parseInt($('.standard.ui-dialog').css('width')) - (parseInt($('#help_dialog').css('margin-left')) + parseInt($('#help_dialog').css('margin-right'))));
                $('#help_dialog').css('height', parseInt($('.standard.ui-dialog').css('height')) - parseInt($('.ui-dialog-titlebar').css('height')) - (parseInt($('#help_dialog').css('margin-top')) + parseInt($('#help_dialog').css('margin-bottom'))));
                
                // update the width and height for the help dialog content container
                $('#help_dialog_content').css('width', parseInt($('#help_dialog').css('width')));
                $('#help_dialog_content').css('height', parseInt($('#help_dialog').css('height')) - parseInt($('#help_dialog_header').css('height')));
            });
        }
    }
    
    // when the user browses away from this page, check to see if various properties need to be saved
    window.onbeforeunload = function() {
        // if the help button exists and if any of the help dialog properties have changed, then save changes
        if (
            (document.getElementById("help_link"))
            &&
            (
                (original_help_dialog_enabled != help_dialog_enabled)
                || (original_help_dialog_width != help_dialog_width)
                || (original_help_dialog_height != help_dialog_height)
                || (original_help_dialog_top != help_dialog_top)
                || (original_help_dialog_left != help_dialog_left)
                || (original_help_dialog_update != help_dialog_update)
                || ((original_help_dialog_article != help_dialog_article) && (help_dialog_update == false))
            )
        ) {
            // send an AJAX POST in order to save the help dialog properties in the session
            // async is set to false so that the request is sent before the browser window goes to the next page
            $.ajax({
                type: 'POST',
                url: 'save_help_dialog_properties.php',
                data: 'enabled=' + help_dialog_enabled + '&width=' + help_dialog_width + '&height=' + help_dialog_height + '&top=' + help_dialog_top + '&left=' + help_dialog_left + '&update=' + help_dialog_update + '&article=' + help_dialog_article + '&token=' + software_token,
                async: false
            });
        }
    };
    
    // Search the document for all tables.
    var chart_table = document.getElementsByTagName("table");
    
    // Loop through the table results.
    for (var i=0; i<=chart_table.length; i++) {
        
        // If a table exists and the class is chart.
        if (chart_table[i] && chart_table[i].className == "chart") {
            
            // Get the rows of that table.
            var chart_table_row = chart_table[i].getElementsByTagName("tr");
            
            // Loop through the table row results.
            for (var x=0; x<=chart_table_row.length; x++) {
                
                // If a table row exists.
                if (chart_table_row[x]) {
                    
                    // Set background variable
                    var background = '';
                    
                    // Check to see if the row contains a table head.
                    if ((chart_table_row[x].firstChild.tagName != 'TH') && (chart_table_row[x].innerHTML.match("<th") == null)) {
                        
                        // Add jquery listener for mouseover.
                        $(chart_table_row[x]).mouseover( function () {
                            
                            // Save background color.
                            background = $(this).css("background-color");
                            // Change the background color.
                            this.style.background = "#FBEDA3";
                        });
                        
                        // Add jquery listener for mouseout.
                        $(chart_table_row[x]).mouseout( function () {
                            
                            // Replace the background color.
                            this.style.background = background;
                        });
                    }
                }
            }
        }
    }
    
    // Add a listener to the select button.
    $("#select_all").click( function () {
        
        // The cycle number is the amount of times we have looped through the results
        var cycle_number = "0";
        
        // Loop through the results
        for (var i=0; i<=chart_table.length; i++) {
            
            // If a table exists and the class is chart.
            if ((chart_table[i]) && (chart_table[i].className == "chart")) {
                
                // Search the document for table cells.
                var chart_table_cell = chart_table[i].getElementsByTagName("td");
                
                // Loop through the results.
                for (var x=0; x<=chart_table_cell.length; x++) {
                    
                    // If table cell exists, if it is not empty, and if the class is checkbox.
                    if ((chart_table_cell[x]) && (chart_table_cell[x].firstChild) && (chart_table_cell[x].firstChild.className == "checkbox")) {
                        
                        // Compaire the Select button to see if the class is Select.
                        if (this.className == "Select" && cycle_number == "0") {
                            
                            // Set the checked variable to true.
                            var checked = true;
                            // Change the Select button's class name to clear.
                            this.className = "Deselect";
                            // Changes the Select button's value to Clear
                            this.firstChild.nodeValue = "Deselect";
                            // sets the cycle number to 1
                            cycle_number = "1";
                        
                        // If the Select button's class is not Select check to see if the class is Clear.
                        } else if (this.className == "Deselect" && cycle_number == "0") {
                            // Set the checked variable to true.
                            var checked = false;
                            // Change the Select button's class name to Select.
                            this.className = "Select";
                            // Changes the Select button's value to Select
                            this.firstChild.nodeValue = "Select";
                            // sets the cycle number to 1
                            cycle_number = "1";
                        
                        // If neither assume that the button's class name is Select
                        } else if (!this.className && cycle_number == "0") {
                            // Set the checked variable to true.
                            var checked = true;
                            // Change the Select button's class name to clear.
                            this.className = "Deselect";
                            // Changes the Select button's value to Clear
                            this.firstChild.nodeValue = "Deselect";
                            cycle_number = "1";
                            // sets the cycle number to 1
                        }
                        
                        // If checked variable is false.
                        if (chart_table_cell[x].firstChild.disabled != true) {
                            if(checked == false) {
                                // Uncheck all checkboxes.
                                chart_table_cell[x].firstChild.checked = false;
                            // If checked variable is true.
                            } else {
                                // Check all checkboxes.
                                chart_table_cell[x].firstChild.checked = true;
                            }
                        }
                    }
                }
            }
        }
    });
});

function check_all(field_name)
{
    for (var i = 0; i < document.forms.length; i++) {
        for (var j = 0; j < document.forms[i].length; j++) {
            if (document.forms[i].elements[j].name == field_name) {
                document.forms[i].elements[j].checked = true;
            }
        }
    }
}

function uncheck_all(field_name)
{
    for (var i = 0; i < document.forms.length; i++) {
        for (var j = 0; j < document.forms[i].length; j++) {
            if (document.forms[i].elements[j].name == field_name) {
                document.forms[i].elements[j].checked = false;
            }
        }
    }
}

function edit_pages(action)
{
    var result;

    switch (action) {
        case 'edit':
            document.form.action.value = 'edit';
            break;
            
        case 'delete':
            document.form.action.value = 'delete';
            result = confirm('WARNING: The selected page(s) will be permanently deleted.')
            break;
    }

    // if user select ok to confirmation, submit form
    if (result == true) {
        document.form.submit();
    }
}

function edit_files(action)
{
    var result;

    switch (action) {
        case 'edit':
            document.form.action.value = 'edit';
            break;
        
        case 'delete':
            document.form.action.value = 'delete';
            result = confirm('WARNING: The selected files(s) will be permanently deleted.')
            break;
    }

    // if user select ok to confirmation, submit form
    if (result == true) {
        document.form.submit();
    }
}

function edit_contacts(action)
{
    var result;

    switch (action) {
        case 'optin':
            document.form.action.value = 'optin';
            result = confirm('WARNING: The selected contact(s) will be opted-in.')
            break;

        case 'optout':
            document.form.action.value = 'optout';
            result = confirm('WARNING: The selected contact(s) will be opted-out.')
            break;

        case 'delete':
            document.form.action.value = 'delete';
            result = confirm('WARNING: The selected contact(s) will be permanently deleted.')
            break;
            
        case 'merge':
            document.form.action.value = 'merge';
            result = confirm('WARNING: The selected duplicate contact(s) will be merged together.')
            break;
    }

    // if user select ok to confirmation, submit form
    if (result == true) {
        document.form.submit();
    }
}

function change_page_type(page_type)
{
    // hide all objects
    document.getElementById('email_a_friend_submit_button_label_row').style.display = 'none';
    document.getElementById('email_a_friend_next_page_id_row').style.display = 'none';
    document.getElementById('folder_view_pages_row').style.display = 'none';
    document.getElementById('folder_view_files_row').style.display = 'none';
    document.getElementById('photo_gallery_number_of_columns_row').style.display = 'none';
    document.getElementById('photo_gallery_thumbnail_max_size_row').style.display = 'none';
    document.getElementById('update_address_book_address_type_row').style.display = 'none';
    document.getElementById('update_address_book_address_type_page_id_row').style.display = 'none';
    
    // if e-commerce is on
    if (document.getElementById('order_form_product_layout_row_1')) {
        document.getElementById('catalog_product_group_id_row').style.display = 'none';
        document.getElementById('catalog_menu_row').style.display = 'none';
        document.getElementById('catalog_search_row').style.display = 'none';
        document.getElementById('catalog_number_of_featured_items_row').style.display = 'none';
        document.getElementById('catalog_number_of_new_items_row').style.display = 'none';
        document.getElementById('catalog_number_of_columns_row').style.display = 'none';
        document.getElementById('catalog_image_width_row').style.display = 'none';
        document.getElementById('catalog_image_height_row').style.display = 'none';
        document.getElementById('catalog_back_button_label_row').style.display = 'none';
        document.getElementById('catalog_catalog_detail_page_id_row').style.display = 'none';
        document.getElementById('catalog_detail_allow_customer_to_add_product_to_order_row').style.display = 'none';
        document.getElementById('catalog_detail_add_button_label_row').style.display = 'none';
        document.getElementById('catalog_detail_back_button_label_row').style.display = 'none';
        document.getElementById('catalog_detail_next_page_id_row').style.display = 'none';
        document.getElementById('express_order_shopping_cart_label_row').style.display = 'none';
        document.getElementById('express_order_quick_add_label_row').style.display = 'none';
        document.getElementById('express_order_quick_add_product_group_id_row').style.display = 'none';
        document.getElementById('express_order_shipping_address_and_arrival_page_id_row').style.display = 'none';
        document.getElementById('express_order_special_offer_code_label_row').style.display = 'none';
        document.getElementById('express_order_special_offer_code_message_row').style.display = 'none';
        document.getElementById('express_order_custom_field_1_label_row').style.display = 'none';
        document.getElementById('express_order_custom_field_2_label_row').style.display = 'none';
        document.getElementById('express_order_po_number_row').style.display = 'none';
        document.getElementById('express_order_card_verification_number_page_id_row').style.display = 'none';
        
        if (document.getElementById('express_order_offline_payment_label_row')) {
            document.getElementById('express_order_offline_payment_label_row').style.display = 'none';
        }
        
        document.getElementById('express_order_terms_page_id_row').style.display = 'none';
        document.getElementById('express_order_update_button_label_row').style.display = 'none';
        document.getElementById('express_order_purchase_now_button_label_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_subject_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_format_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_header_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_footer_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_page_id_row').style.display = 'none';
        document.getElementById('express_order_next_page_id_row').style.display = 'none';
        document.getElementById('order_form_product_layout_row_1').style.display = 'none';
        document.getElementById('order_form_product_group_id_row').style.display = 'none';
        document.getElementById('order_form_product_layout_row_1').style.display = 'none';
        document.getElementById('order_form_product_layout_row_2').style.display = 'none';
        document.getElementById('order_form_add_button_label_row').style.display = 'none';
        document.getElementById('order_form_add_button_next_page_id_row').style.display = 'none';
        document.getElementById('order_form_skip_button_label_row').style.display = 'none';
        document.getElementById('order_form_skip_button_next_page_id_row').style.display = 'none';

        // If search folder row exists (i.e. advanced search is enabled), then hide it.
        if (document.getElementById('search_results_search_folder_id_row')) {
            document.getElementById('search_results_search_folder_id_row').style.display = 'none';
        }
        
        // if the ecommerce search results rows exist (i.e. if user has more than a user role), then hide them
        if (document.getElementById('search_results_search_catalog_items_row')) {
            document.getElementById('search_results_search_catalog_items_row').style.display = 'none';
            document.getElementById('search_results_product_group_id_row').style.display = 'none';
            document.getElementById('search_results_catalog_detail_page_id_row').style.display = 'none';
        }
        
        document.getElementById('shopping_cart_shopping_cart_label_row').style.display = 'none';
        document.getElementById('shopping_cart_quick_add_label_row').style.display = 'none';
        document.getElementById('shopping_cart_quick_add_product_group_id_row').style.display = 'none';
        document.getElementById('shopping_cart_special_offer_code_label_row').style.display = 'none';
        document.getElementById('shopping_cart_special_offer_code_message_row').style.display = 'none';
        document.getElementById('shopping_cart_update_button_label_row').style.display = 'none';
        document.getElementById('shopping_cart_checkout_button_label_row').style.display = 'none';
        document.getElementById('shopping_cart_next_page_id_with_shipping_row').style.display = 'none';
        document.getElementById('shopping_cart_next_page_id_without_shipping_row').style.display = 'none';
        document.getElementById('shipping_address_and_arrival_address_type_row').style.display = 'none';
        document.getElementById('shipping_address_and_arrival_address_type_page_id_row').style.display = 'none';
        document.getElementById('shipping_address_and_arrival_form_row').style.display = 'none';
        document.getElementById('shipping_address_and_arrival_form_notice').style.display = 'none';
        document.getElementById('shipping_address_and_arrival_form_name_row').style.display = 'none';
        document.getElementById('shipping_address_and_arrival_form_label_column_width_row').style.display = 'none';
        document.getElementById('shipping_address_and_arrival_submit_button_label_row').style.display = 'none';
        document.getElementById('shipping_address_and_arrival_next_page_id_row').style.display = 'none';
        document.getElementById('shipping_method_submit_button_label_row').style.display = 'none';
        document.getElementById('shipping_method_next_page_id_row').style.display = 'none';
        document.getElementById('billing_information_custom_field_1_label_row').style.display = 'none';
        document.getElementById('billing_information_custom_field_2_label_row').style.display = 'none';
        document.getElementById('billing_information_po_number_row').style.display = 'none';
        document.getElementById('billing_information_submit_button_label_row').style.display = 'none';
        document.getElementById('billing_information_next_page_id_row').style.display = 'none';
        document.getElementById('order_preview_card_verification_number_page_id_row').style.display = 'none';
        
        if (document.getElementById('order_preview_offline_payment_label_row')) {
            document.getElementById('order_preview_offline_payment_label_row').style.display = 'none';
        }
        
        document.getElementById('order_preview_terms_page_id_row').style.display = 'none';
        document.getElementById('order_preview_submit_button_label_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_subject_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_format_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_header_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_footer_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_page_id_row').style.display = 'none';
        document.getElementById('order_preview_next_page_id_row').style.display = 'none';
        document.getElementById('order_receipt_product_description_type_row').style.display = 'none';
    }
    
    // if forms is on
    if (document.getElementById('custom_form_form_name_row')) {
        document.getElementById('custom_form_form_name_row').style.display = 'none';
        document.getElementById('custom_form_enabled_row').style.display = 'none';
        document.getElementById('custom_form_quiz_row').style.display = 'none';
        document.getElementById('custom_form_quiz_pass_percentage_row').style.display = 'none';
        document.getElementById('custom_form_label_column_width_row').style.display = 'none';
        document.getElementById('custom_form_watcher_page_id_row').style.display = 'none';
        document.getElementById('custom_form_submit_button_label_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_from_email_address_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_subject_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_format_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_body_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_page_id_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_to_email_address_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_bcc_email_address_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_subject_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_format_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_body_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_page_id_row').style.display = 'none';
        document.getElementById('custom_form_contact_group_id_row').style.display = 'none';
        document.getElementById('custom_form_membership_row').style.display = 'none';
        document.getElementById('custom_form_membership_days_row').style.display = 'none';
        document.getElementById('custom_form_membership_start_page_id_row').style.display = 'none';
        document.getElementById('custom_form_confirmation_type_row').style.display = 'none';
        document.getElementById('custom_form_confirmation_message_row').style.display = 'none';
        document.getElementById('custom_form_confirmation_page_id_row').style.display = 'none';
        document.getElementById('custom_form_confirmation_alternative_page_row').style.display = 'none';
        document.getElementById('custom_form_confirmation_alternative_page_contact_group_id_row').style.display = 'none';
        document.getElementById('custom_form_confirmation_alternative_page_id_row').style.display = 'none';
        document.getElementById('custom_form_return_type_row').style.display = 'none';
        document.getElementById('custom_form_return_message_row').style.display = 'none';
        document.getElementById('custom_form_return_page_id_row').style.display = 'none';
        document.getElementById('custom_form_return_alternative_page_row').style.display = 'none';
        document.getElementById('custom_form_return_alternative_page_contact_group_id_row').style.display = 'none';
        document.getElementById('custom_form_return_alternative_page_id_row').style.display = 'none';
        document.getElementById('custom_form_confirmation_continue_button_label_row').style.display = 'none';
        document.getElementById('custom_form_confirmation_next_page_id_row').style.display = 'none';
        document.getElementById('form_list_view_custom_form_page_id_row').style.display = 'none';
        document.getElementById('form_list_view_form_item_view_page_id_row').style.display = 'none';
        document.getElementById('form_item_view_custom_form_page_id_row').style.display = 'none';
        document.getElementById('form_item_view_submitter_security_row').style.display = 'none';
        document.getElementById('form_item_view_submitted_form_editable_by_registered_user_row').style.display = 'none';
        document.getElementById('form_item_view_submitted_form_editable_by_submitter_row').style.display = 'none';
        document.getElementById('form_view_directory_form_list_views_row').style.display = 'none';
        document.getElementById('form_view_directory_summary_row').style.display = 'none';
        document.getElementById('form_view_directory_summary_days_row').style.display = 'none';
        document.getElementById('form_view_directory_summary_maximum_number_of_results_row').style.display = 'none';
        document.getElementById('form_view_directory_form_list_view_heading_row').style.display = 'none';
        document.getElementById('form_view_directory_subject_heading_row').style.display = 'none';
        document.getElementById('form_view_directory_number_of_submitted_forms_heading_row').style.display = 'none';
    }
    
    // if calendars is on
    if (document.getElementById('calendar_view_default_view_row')) {
        document.getElementById('calendar_view_calendars_row').style.display = 'none';
        document.getElementById('calendar_view_default_view_row').style.display = 'none';
        document.getElementById('calendar_view_calendar_event_view_page_id_row').style.display = 'none';
        document.getElementById('calendar_event_view_calendars_row').style.display = 'none';
        document.getElementById('calendar_view_number_of_upcoming_events_row').style.display = 'none';
        document.getElementById('calendar_event_view_notes_row').style.display = 'none';
        document.getElementById('calendar_event_view_back_button_label_row').style.display = 'none';
    }

    // if affiliate program is on
    if (document.getElementById('affiliate_sign_up_form_terms_page_id_row')) {
        document.getElementById('affiliate_sign_up_form_terms_page_id_row').style.display = 'none';
        document.getElementById('affiliate_sign_up_form_submit_button_label_row').style.display = 'none';
        document.getElementById('affiliate_sign_up_form_next_page_id_row').style.display = 'none';
    }

    // show needed objects
    switch (page_type) {
        case 'email a friend':
            document.getElementById('email_a_friend_submit_button_label_row').style.display = '';
            document.getElementById('email_a_friend_next_page_id_row').style.display = '';
            break;

        case 'folder view':
            document.getElementById('folder_view_pages_row').style.display = '';
            document.getElementById('folder_view_files_row').style.display = '';
            break;
            
        case 'photo gallery':
            document.getElementById('photo_gallery_number_of_columns_row').style.display = '';
            document.getElementById('photo_gallery_thumbnail_max_size_row').style.display = '';
            break;
            
        case 'update address book':
            document.getElementById('update_address_book_address_type_row').style.display = '';
            show_or_hide_update_address_book_address_type();
            break;
            
        case 'custom form':
            document.getElementById('custom_form_form_name_row').style.display = '';
            document.getElementById('custom_form_enabled_row').style.display = '';
            document.getElementById('custom_form_quiz_row').style.display = '';
            
            show_or_hide_quiz();
            
            document.getElementById('custom_form_label_column_width_row').style.display = '';
            document.getElementById('custom_form_watcher_page_id_row').style.display = '';
            document.getElementById('custom_form_submit_button_label_row').style.display = '';
            document.getElementById('custom_form_submitter_email_row').style.display = '';

            show_or_hide_custom_form_submitter_email();

            document.getElementById('custom_form_administrator_email_row').style.display = '';

            show_or_hide_custom_form_administrator_email();

            document.getElementById('custom_form_contact_group_id_row').style.display = '';
            document.getElementById('custom_form_membership_row').style.display = '';
            
            show_or_hide_custom_form_membership();

            document.getElementById('custom_form_confirmation_type_row').style.display = '';

            show_or_hide_custom_form_confirmation_type();

            document.getElementById('custom_form_return_type_row').style.display = '';

            show_or_hide_custom_form_return_type();
            
            break;
        
        case 'custom form confirmation':
            document.getElementById('custom_form_confirmation_continue_button_label_row').style.display = '';
            document.getElementById('custom_form_confirmation_next_page_id_row').style.display = '';
            break;
            
        case 'form list view':
            document.getElementById('form_list_view_custom_form_page_id_row').style.display = '';
            document.getElementById('form_list_view_form_item_view_page_id_row').style.display = '';        
            break;
            
        case 'form item view':
            document.getElementById('form_item_view_custom_form_page_id_row').style.display = '';
            document.getElementById('form_item_view_submitter_security_row').style.display = '';
            document.getElementById('form_item_view_submitted_form_editable_by_registered_user_row').style.display = '';
            show_or_hide_form_item_view_editor();
            break;
            
        case 'form view directory':
            document.getElementById('form_view_directory_form_list_views_row').style.display = '';
            document.getElementById('form_view_directory_summary_row').style.display = '';
            show_or_hide_form_view_directory_summary();
            document.getElementById('form_view_directory_form_list_view_heading_row').style.display = '';
            document.getElementById('form_view_directory_subject_heading_row').style.display = '';
            document.getElementById('form_view_directory_number_of_submitted_forms_heading_row').style.display = '';
            break;
            
        case 'calendar view':
            document.getElementById('calendar_view_calendars_row').style.display = '';
            document.getElementById('calendar_view_default_view_row').style.display = '';
            document.getElementById('calendar_view_calendar_event_view_page_id_row').style.display = '';
            
            show_or_hide_calendar_view_number_of_upcoming_events();
            break;
            
        case 'calendar event view':
            document.getElementById('calendar_event_view_calendars_row').style.display = '';
            document.getElementById('calendar_event_view_notes_row').style.display = '';
            document.getElementById('calendar_event_view_back_button_label_row').style.display = '';
            break;
            
        case 'catalog':
            document.getElementById('catalog_product_group_id_row').style.display = '';
            document.getElementById('catalog_menu_row').style.display = '';
            document.getElementById('catalog_search_row').style.display = '';
            document.getElementById('catalog_number_of_featured_items_row').style.display = '';
            document.getElementById('catalog_number_of_new_items_row').style.display = '';
            document.getElementById('catalog_number_of_columns_row').style.display = '';
            document.getElementById('catalog_image_width_row').style.display = '';
            document.getElementById('catalog_image_height_row').style.display = '';
            document.getElementById('catalog_back_button_label_row').style.display = '';
            document.getElementById('catalog_catalog_detail_page_id_row').style.display = '';
            break;
            
        case 'catalog detail':
            document.getElementById('catalog_detail_allow_customer_to_add_product_to_order_row').style.display = '';
            show_or_hide_allow_customer_to_add_product_to_order();
            document.getElementById('catalog_detail_back_button_label_row').style.display = '';
            break;

        case 'express order':
            document.getElementById('express_order_shopping_cart_label_row').style.display = '';
            document.getElementById('express_order_quick_add_label_row').style.display = '';
            document.getElementById('express_order_quick_add_product_group_id_row').style.display = '';
            document.getElementById('express_order_shipping_address_and_arrival_page_id_row').style.display = '';
            document.getElementById('express_order_special_offer_code_label_row').style.display = '';
            document.getElementById('express_order_special_offer_code_message_row').style.display = '';
            document.getElementById('express_order_custom_field_1_label_row').style.display = '';
            document.getElementById('express_order_custom_field_2_label_row').style.display = '';
            document.getElementById('express_order_po_number_row').style.display = '';
            document.getElementById('express_order_card_verification_number_page_id_row').style.display = '';
            
            if (document.getElementById('express_order_offline_payment_label_row')) {
                document.getElementById('express_order_offline_payment_label_row').style.display = '';
            }
            
            document.getElementById('express_order_terms_page_id_row').style.display = '';
            document.getElementById('express_order_update_button_label_row').style.display = '';
            document.getElementById('express_order_purchase_now_button_label_row').style.display = '';
            document.getElementById('express_order_order_receipt_email_row').style.display = '';
            show_or_hide_express_order_order_receipt_email();
            document.getElementById('express_order_next_page_id_row').style.display = '';
            break;
        
        case 'order form':
            document.getElementById('order_form_product_group_id_row').style.display = '';
            document.getElementById('order_form_product_layout_row_1').style.display = '';
            document.getElementById('order_form_product_layout_row_2').style.display = '';
            document.getElementById('order_form_add_button_label_row').style.display = '';
            document.getElementById('order_form_add_button_next_page_id_row').style.display = '';
            document.getElementById('order_form_skip_button_label_row').style.display = '';
            document.getElementById('order_form_skip_button_next_page_id_row').style.display = '';
            break;

        case 'search results':
            // If search folder row exists (i.e. advanced search is enabled), then show it.
            if (document.getElementById('search_results_search_folder_id_row')) {
                document.getElementById('search_results_search_folder_id_row').style.display = '';
            }

            // if e-commerce is on, then show e-commerce fields for search results
            if (document.getElementById('search_results_search_catalog_items_row')) {
                document.getElementById('search_results_search_catalog_items_row').style.display = '';
            
                show_or_hide_search_catalog_items();
            }
            break;

        case 'shopping cart':
            document.getElementById('shopping_cart_shopping_cart_label_row').style.display = '';
            document.getElementById('shopping_cart_quick_add_label_row').style.display = '';
            document.getElementById('shopping_cart_quick_add_product_group_id_row').style.display = '';
            document.getElementById('shopping_cart_special_offer_code_label_row').style.display = '';
            document.getElementById('shopping_cart_special_offer_code_message_row').style.display = '';
            document.getElementById('shopping_cart_update_button_label_row').style.display = '';
            document.getElementById('shopping_cart_checkout_button_label_row').style.display = '';
            document.getElementById('shopping_cart_next_page_id_with_shipping_row').style.display = '';
            document.getElementById('shopping_cart_next_page_id_without_shipping_row').style.display = '';
            break;

        case 'shipping address and arrival':
            document.getElementById('shipping_address_and_arrival_address_type_row').style.display = '';
            show_or_hide_shipping_address_and_arrival_address_type();
            document.getElementById('shipping_address_and_arrival_form_row').style.display = '';
            show_or_hide_custom_shipping_form();
            document.getElementById('shipping_address_and_arrival_submit_button_label_row').style.display = '';
            document.getElementById('shipping_address_and_arrival_next_page_id_row').style.display = '';
            break;

        case 'shipping method':
            document.getElementById('shipping_method_submit_button_label_row').style.display = '';
            document.getElementById('shipping_method_next_page_id_row').style.display = '';
            break;

        case 'billing information':
            document.getElementById('billing_information_custom_field_1_label_row').style.display = '';
            document.getElementById('billing_information_custom_field_2_label_row').style.display = '';
            document.getElementById('billing_information_po_number_row').style.display = '';
            document.getElementById('billing_information_submit_button_label_row').style.display = '';
            document.getElementById('billing_information_next_page_id_row').style.display = '';
            break;

        case 'order preview':
            document.getElementById('order_preview_card_verification_number_page_id_row').style.display = '';
            
            if (document.getElementById('order_preview_offline_payment_label_row')) {
                document.getElementById('order_preview_offline_payment_label_row').style.display = '';
            }
            
            document.getElementById('order_preview_terms_page_id_row').style.display = '';
            document.getElementById('order_preview_submit_button_label_row').style.display = '';
            document.getElementById('order_preview_order_receipt_email_row').style.display = '';
            show_or_hide_order_preview_order_receipt_email();
            document.getElementById('order_preview_next_page_id_row').style.display = '';
            break;

        case 'order receipt':
            document.getElementById('order_receipt_product_description_type_row').style.display = '';
            break;
            
        case 'affiliate sign up form':
            document.getElementById('affiliate_sign_up_form_terms_page_id_row').style.display = '';
            document.getElementById('affiliate_sign_up_form_submit_button_label_row').style.display = '';
            document.getElementById('affiliate_sign_up_form_next_page_id_row').style.display = '';
            break;
    }
    
    // if the selected page type is a valid page type for the sitemap, then show sitemap row
    if (
        (page_type == 'standard')
        || (page_type == 'folder view')
        || (page_type == 'photo gallery')
        || (page_type == 'custom form')
        || (page_type == 'form list view')
        || (page_type == 'form item view')
        || (page_type == 'form view directory')
        || (page_type == 'calendar view')
        || (page_type == 'calendar event view')
        || (page_type == 'catalog')
        || (page_type == 'catalog detail')
        || (page_type == 'express order')
        || (page_type == 'order form')
        || (page_type == 'shopping cart')
        || (page_type == 'search results')
    ) {
        document.getElementById('search_engine_optimization_heading_row').style.display = '';
        document.getElementById('sitemap_row').style.display = '';
        
    // else the selected page type is not a validate page type for the sitemap, so hide sitemap row
    } else {
        // if the title field does not exist (i.e. this is the create page screen),
        // then hide the search engine optimization heading row also, because there won't be any other fields for that area
        if (!document.getElementById('title')) {
            document.getElementById('search_engine_optimization_heading_row').style.display = 'none';
        }
        
        document.getElementById('sitemap_row').style.display = 'none';
    }
    
    // if the comment fields exist (e.g. edit page screen, not create page screen), then show or hide the form item view comment fields
    if (document.getElementById('comments')) {
        show_or_hide_form_item_view_comment_fields();
    }
    
    // if the page type is now custom form and it was not before
    // or if the page type is now shipping address & arrival and form is enabled and it was not enabled originally
    // then update the submit button to contain "Save & Continue"
    if (
        ((page_type == 'custom form') && (original_page_type != 'custom form'))
        || ((page_type == 'shipping address and arrival') && (document.getElementById('shipping_address_and_arrival_form').checked == true) && (original_shipping_address_and_arrival_form != 1))
    ) {
        document.getElementById('create_button').value = 'Save & Continue';
        
    // else the submit button should contain the normal "Save"
    } else {
        document.getElementById('create_button').value = 'Save';
    }
}

function show_or_hide_recurring() {
    if (document.getElementById('recurring').checked == true) {
        document.getElementById('recurring_schedule_editable_by_customer_row').style.display = '';
        
        if (document.getElementById('start_row')) {
            document.getElementById('start_row').style.display = '';
        }
        
        document.getElementById('number_of_payments_row').style.display = '';
        document.getElementById('payment_period_row').style.display = '';
        
        if (document.getElementById('recurring_profile_disabled_perform_actions_row')) {
            document.getElementById('recurring_profile_disabled_perform_actions_row').style.display = '';
            show_or_hide_recurring_profile_disabled_perform_actions();
        }
        
        // if the Sage group ID field exists, then show it
        if (document.getElementById('sage_group_id_row')) {
            document.getElementById('sage_group_id_row').style.display = '';
        }
        
    } else {
        document.getElementById('recurring_schedule_editable_by_customer_row').style.display = 'none';
        
        if (document.getElementById('start_row')) {
            document.getElementById('start_row').style.display = 'none';
        }
        
        document.getElementById('number_of_payments_row').style.display = 'none';
        document.getElementById('payment_period_row').style.display = 'none';
        
        if (document.getElementById('recurring_profile_disabled_perform_actions_row')) {
            document.getElementById('recurring_profile_disabled_perform_actions_row').style.display = 'none';
            document.getElementById('recurring_profile_disabled_expire_membership_row').style.display = 'none';
            document.getElementById('recurring_profile_disabled_revoke_private_access_row').style.display = 'none';
            document.getElementById('recurring_profile_disabled_email_row').style.display = 'none';
            document.getElementById('recurring_profile_disabled_email_subject_row').style.display = 'none';
            document.getElementById('recurring_profile_disabled_email_page_id_row').style.display = 'none';
        }
        
        // if the Sage group ID field exists, then hide it
        if (document.getElementById('sage_group_id_row')) {
            document.getElementById('sage_group_id_row').style.display = 'none';
        }
    }
}

function show_or_hide_recurring_profile_disabled_perform_actions()
{
    if (document.getElementById('recurring_profile_disabled_perform_actions').checked == true) {
        document.getElementById('recurring_profile_disabled_expire_membership_row').style.display = '';
        document.getElementById('recurring_profile_disabled_revoke_private_access_row').style.display = '';
        document.getElementById('recurring_profile_disabled_email_row').style.display = '';
        show_or_hide_recurring_profile_disabled_email();
        
    } else {
        document.getElementById('recurring_profile_disabled_expire_membership_row').style.display = 'none';
        document.getElementById('recurring_profile_disabled_revoke_private_access_row').style.display = 'none';
        document.getElementById('recurring_profile_disabled_email_row').style.display = 'none';
        document.getElementById('recurring_profile_disabled_email_subject_row').style.display = 'none';
        document.getElementById('recurring_profile_disabled_email_page_id_row').style.display = 'none';
    }
}

function show_or_hide_recurring_profile_disabled_email()
{
    if (document.getElementById('recurring_profile_disabled_email').checked == true) {
        document.getElementById('recurring_profile_disabled_email_subject_row').style.display = '';
        document.getElementById('recurring_profile_disabled_email_page_id_row').style.display = '';
        
    } else {
        document.getElementById('recurring_profile_disabled_email_subject_row').style.display = 'none';
        document.getElementById('recurring_profile_disabled_email_page_id_row').style.display = 'none';
    }
}

function show_or_hide_grant_private_access() {
    if (document.getElementById('grant_private_access').checked == true) {
        document.getElementById('private_folder_row').style.display = '';
        document.getElementById('private_days_row').style.display = '';
        document.getElementById('send_to_page_row').style.display = '';
    } else {
        document.getElementById('private_folder_row').style.display = 'none';
        document.getElementById('private_days_row').style.display = 'none';
        document.getElementById('send_to_page_row').style.display = 'none';
    }
}

function show_or_hide_form() {
    // Put create button in variable to be used by function.
    var create_button = document.getElementById('create_button');
    var current_form_state = document.getElementById('current_form_state');

    if (document.getElementById('product_form').checked == true) {
        document.getElementById('form_name_row').style.display = '';
        document.getElementById('form_label_column_width_row').style.display = '';
        document.getElementById('form_quantity_type_row').style.display = '';
        
        // If the page was loaded with the form turned form off.
        if ((!document.getElementById('original_form_state')) || (document.getElementById('original_form_state').value == "0")) {
            
            // Show form notice
            document.getElementById('form_notice').style.display = '';
            
            // If the user is on the edit product page comeback
            if (document.URL.match("edit_product") == "edit_product") {
                // Change the submit button's value to Save and Continue.
                create_button.value = "Save & Continue";
            
            // Else user is on the add product page.
            } else {
                // Change the submit button's value to Create and Continue.
                create_button.value = "Create & Continue";
            }
            // Change value of form state hidden field.
            current_form_state.value = "1";
        }
        
    } else {
        document.getElementById('form_name_row').style.display = 'none';
        document.getElementById('form_label_column_width_row').style.display = 'none';
        document.getElementById('form_quantity_type_row').style.display = 'none';
        
        // Hide form notice
        if (document.getElementById('form_notice').style.display != 'none') {
            document.getElementById('form_notice').style.display = 'none';
        }
        
        // If the user is on the edit product page comeback
        if (document.URL.match("edit_product") == "edit_product") {
            // Change the submit button's value to Save and Continue.
            create_button.value = "Save";
            
        // Else user is on the add product page.
        } else {
            
            // Change the submit button's value to Create.
            create_button.value = "Create";
        }
        // Change value of form state hidden field.
        current_form_state.value = "0";
    }
}

function show_or_hide_social_networking()
{
    // If social networking is checked, then determine what rows should be shown.
    if (document.getElementById('social_networking').checked == true) {
        document.getElementById('social_networking_type_row').style.display = '';
        show_or_hide_social_networking_type();

    // Otherwise social networking is not checked, so hide rows.
    } else {
        document.getElementById('social_networking_type_row').style.display = 'none';
        document.getElementById('social_networking_services_row').style.display = 'none';
        document.getElementById('social_networking_code_row').style.display = 'none';
    }
}

function show_or_hide_social_networking_type()
{
    // If the "simple" option is selected, then show services row and hide code row.
    if (document.getElementById('social_networking_type_simple').checked == true) {
        document.getElementById('social_networking_services_row').style.display = '';
        document.getElementById('social_networking_code_row').style.display = 'none';
    
    // Otherwise the "advanced" option is selected, so hide services row and show code row.
    } else {
        document.getElementById('social_networking_services_row').style.display = 'none';
        document.getElementById('social_networking_code_row').style.display = '';
    }
}

function show_or_hide_membership_expiration_warning_email() {
    if (document.getElementById('membership_expiration_warning_email').checked == true) {
        document.getElementById('membership_expiration_warning_email_subject').style.display = '';
        document.getElementById('membership_expiration_warning_email_page_id').style.display = '';
        document.getElementById('membership_expiration_warning_email_days_before_expiration').style.display = '';
    } else {
        document.getElementById('membership_expiration_warning_email_subject').style.display = 'none';
        document.getElementById('membership_expiration_warning_email_page_id').style.display = 'none';
        document.getElementById('membership_expiration_warning_email_days_before_expiration').style.display = 'none';
    }
}

function show_or_hide_ecommerce() {
    if (document.getElementById('ecommerce').checked == true) {
        document.getElementById('ecommerce_multicurrency_row').style.display = '';
        document.getElementById('ecommerce_tax_row').style.display = '';
        show_or_hide_ecommerce_tax();
        document.getElementById('ecommerce_shipping_row').style.display = '';
        show_or_hide_ecommerce_shipping();
        document.getElementById('ecommerce_address_verification_row').style.display = '';
        show_or_hide_ecommerce_address_verification();
        document.getElementById('ecommerce_next_order_number_row').style.display = '';
        document.getElementById('ecommerce_email_address_row').style.display = '';
        document.getElementById('ecommerce_gift_card_row').style.display = '';
        show_or_hide_ecommerce_gift_card();
        document.getElementById('ecommerce_payment_methods_row').style.display = '';
        document.getElementById('ecommerce_credit_debit_card_row').style.display = '';
        show_or_hide_ecommerce_credit_debit_card();
        document.getElementById('ecommerce_paypal_express_checkout_row').style.display = '';
        show_or_hide_ecommerce_paypal_express_checkout();
        document.getElementById('ecommerce_offline_payment_row').style.display = '';
        show_or_hide_ecommerce_offline_payment();
        document.getElementById('ecommerce_retrieve_order_next_page_id_row').style.display = '';
        document.getElementById('ecommerce_reward_program_row').style.display = '';
        show_or_hide_ecommerce_reward_program();
        document.getElementById('ecommerce_custom_product_field_1_label_row').style.display = '';
        document.getElementById('ecommerce_custom_product_field_2_label_row').style.display = '';
        
    } else {
        document.getElementById('ecommerce_multicurrency_row').style.display = 'none';
        document.getElementById('ecommerce_tax_row').style.display = 'none';
        document.getElementById('ecommerce_tax_exempt_row').style.display = 'none';
        document.getElementById('ecommerce_tax_exempt_label_row').style.display = 'none';
        document.getElementById('ecommerce_shipping_row').style.display = 'none';
        document.getElementById('ecommerce_recipient_mode_row').style.display = 'none';
        document.getElementById('ecommerce_address_verification_row').style.display = 'none';
        document.getElementById('ecommerce_address_verification_usps_user_id_row').style.display = 'none';
        document.getElementById('ecommerce_product_restriction_message_row').style.display = 'none';
        document.getElementById('ecommerce_no_shipping_methods_message_row').style.display = 'none';
        document.getElementById('ecommerce_end_of_day_time_row').style.display = 'none';
        document.getElementById('ecommerce_next_order_number_row').style.display = 'none';
        document.getElementById('ecommerce_email_address_row').style.display = 'none';
        document.getElementById('ecommerce_gift_card_row').style.display = 'none';
        document.getElementById('ecommerce_givex_primary_hostname_row').style.display = 'none';
        document.getElementById('ecommerce_givex_secondary_hostname_row').style.display = 'none';
        document.getElementById('ecommerce_givex_user_id_row').style.display = 'none';
        document.getElementById('ecommerce_givex_password_row').style.display = 'none';
        document.getElementById('ecommerce_payment_methods_row').style.display = 'none';
        document.getElementById('ecommerce_credit_debit_card_row').style.display = 'none';
        document.getElementById('ecommerce_accepted_cards_row').style.display = 'none';
        document.getElementById('ecommerce_payment_gateway_row').style.display = 'none';
        document.getElementById('ecommerce_payment_gateway_transaction_type_row').style.display = 'none';
        document.getElementById('ecommerce_payment_gateway_mode_row').style.display = 'none';
        document.getElementById('ecommerce_authorizenet_api_login_id_row').style.display = 'none';
        document.getElementById('ecommerce_authorizenet_transaction_key_row').style.display = 'none';
        document.getElementById('ecommerce_clearcommerce_client_id_row').style.display = 'none';
        document.getElementById('ecommerce_clearcommerce_user_id_row').style.display = 'none';
        document.getElementById('ecommerce_clearcommerce_password_row').style.display = 'none';
        document.getElementById('ecommerce_first_data_global_gateway_store_number_row').style.display = 'none';
        document.getElementById('ecommerce_first_data_global_gateway_pem_file_name_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_payflow_pro_partner_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_payflow_pro_merchant_login_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_payflow_pro_user_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_payflow_pro_password_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_website_payments_pro_gateway_mode_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_website_payments_pro_api_username_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_website_payments_pro_api_password_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_website_payments_pro_api_signature_row').style.display = 'none';
        document.getElementById('ecommerce_sage_merchant_id_row').style.display = 'none';
        document.getElementById('ecommerce_sage_merchant_key_row').style.display = 'none';
        document.getElementById('ecommerce_reset_encryption_key_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_transaction_type_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_mode_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_api_username_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_api_password_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_api_signature_row').style.display = 'none';
        document.getElementById('ecommerce_offline_payment_row').style.display = 'none';
        document.getElementById('ecommerce_offline_payment_only_specific_orders_row').style.display = 'none';
        document.getElementById('ecommerce_retrieve_order_next_page_id_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_points_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_membership_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_membership_days_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_bcc_email_address_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_subject_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_page_id_row').style.display = 'none';
        document.getElementById('ecommerce_custom_product_field_1_label_row').style.display = 'none';
        document.getElementById('ecommerce_custom_product_field_2_label_row').style.display = 'none';
    }
}

function show_or_hide_ecommerce_tax() {
    if (document.getElementById('ecommerce_tax').checked == true) {
        document.getElementById('ecommerce_tax_exempt_row').style.display = '';
        show_or_hide_ecommerce_tax_exempt();
    } else {
        document.getElementById('ecommerce_tax_exempt_row').style.display = 'none';
        document.getElementById('ecommerce_tax_exempt_label_row').style.display = 'none';
    }
}

function show_or_hide_ecommerce_tax_exempt() {
    if (document.getElementById('ecommerce_tax_exempt').checked == true) {
        document.getElementById('ecommerce_tax_exempt_label_row').style.display = '';
    } else {
        document.getElementById('ecommerce_tax_exempt_label_row').style.display = 'none';
    }
}

function show_or_hide_search_catalog_items()
{
    if (document.getElementById('search_results_search_catalog_items').checked == true) {
        document.getElementById('search_results_product_group_id_row').style.display = '';
        document.getElementById('search_results_catalog_detail_page_id_row').style.display = '';
        
    } else {
        document.getElementById('search_results_product_group_id_row').style.display = 'none';
        document.getElementById('search_results_catalog_detail_page_id_row').style.display = 'none';
    }
}

function show_or_hide_calendar_view_number_of_upcoming_events()
{
    if ((document.getElementById('calendar_view_default_view').options[document.getElementById('calendar_view_default_view').selectedIndex].value == 'upcoming')
        && (document.getElementById('calendar_view_number_of_upcoming_events_row').style.display == 'none')) {
        document.getElementById('calendar_view_number_of_upcoming_events_row').style.display = '';
        
    } else {
        document.getElementById('calendar_view_number_of_upcoming_events_row').style.display = 'none';
    }
}

function show_or_hide_update_address_book_address_type()
{
    if (document.getElementById('update_address_book_address_type').checked == true) {
        document.getElementById('update_address_book_address_type_page_id_row').style.display = '';
        
    } else {
        document.getElementById('update_address_book_address_type_page_id_row').style.display = 'none';
    }
}

function show_or_hide_shipping_address_and_arrival_address_type()
{
    if (document.getElementById('shipping_address_and_arrival_address_type').checked == true) {
        document.getElementById('shipping_address_and_arrival_address_type_page_id_row').style.display = '';
        
    } else {
        document.getElementById('shipping_address_and_arrival_address_type_page_id_row').style.display = 'none';
    }
}

function show_or_hide_custom_shipping_form()
{
    if (document.getElementById('shipping_address_and_arrival_form').checked == true) {
        document.getElementById('shipping_address_and_arrival_form_name_row').style.display = '';
        document.getElementById('shipping_address_and_arrival_form_label_column_width_row').style.display = '';
        
    } else {
        document.getElementById('shipping_address_and_arrival_form_name_row').style.display = 'none';
        document.getElementById('shipping_address_and_arrival_form_label_column_width_row').style.display = 'none';
    }
    
    // if the form is enabled and the form was not originally enabled, then show notice and update the submit button to contain "Save & Continue"
    if ((document.getElementById('shipping_address_and_arrival_form').checked == true) && (original_shipping_address_and_arrival_form != 1)) {
        document.getElementById('shipping_address_and_arrival_form_notice').style.display = '';
        document.getElementById('create_button').value = 'Save & Continue';
        
    // else the form is disabled or the form was already enabled, so do not show notice and update the submit button to contain "Save"
    } else {
        document.getElementById('shipping_address_and_arrival_form_notice').style.display = 'none';
        document.getElementById('create_button').value = 'Save';
    }
}

function show_or_hide_ecommerce_shipping() {
    if (document.getElementById('ecommerce_shipping').checked == true) {
        document.getElementById('ecommerce_recipient_mode_row').style.display = '';
        document.getElementById('ecommerce_product_restriction_message_row').style.display = '';
        document.getElementById('ecommerce_no_shipping_methods_message_row').style.display = '';
        document.getElementById('ecommerce_end_of_day_time_row').style.display = '';
    } else {
        document.getElementById('ecommerce_recipient_mode_row').style.display = 'none';
        document.getElementById('ecommerce_product_restriction_message_row').style.display = 'none';
        document.getElementById('ecommerce_no_shipping_methods_message_row').style.display = 'none';
        document.getElementById('ecommerce_end_of_day_time_row').style.display = 'none';
    }
}

function show_or_hide_ecommerce_address_verification() {
    if (document.getElementById('ecommerce_address_verification').checked == true) {
        document.getElementById('ecommerce_address_verification_usps_user_id_row').style.display = '';
    } else {
        document.getElementById('ecommerce_address_verification_usps_user_id_row').style.display = 'none';
    }
}

function show_or_hide_ecommerce_gift_card()
{
    if (document.getElementById('ecommerce_gift_card').checked == true) {
        document.getElementById('ecommerce_givex_primary_hostname_row').style.display = '';
        document.getElementById('ecommerce_givex_secondary_hostname_row').style.display = '';
        document.getElementById('ecommerce_givex_user_id_row').style.display = '';
        document.getElementById('ecommerce_givex_password_row').style.display = '';
        
    } else {
        document.getElementById('ecommerce_givex_primary_hostname_row').style.display = 'none';
        document.getElementById('ecommerce_givex_secondary_hostname_row').style.display = 'none';
        document.getElementById('ecommerce_givex_user_id_row').style.display = 'none';
        document.getElementById('ecommerce_givex_password_row').style.display = 'none';
    }
}

function show_or_hide_ecommerce_credit_debit_card()
{
    if (document.getElementById('ecommerce_credit_debit_card').checked == true) {
        document.getElementById('ecommerce_accepted_cards_row').style.display = '';
        document.getElementById('ecommerce_payment_gateway_row').style.display = '';
        document.getElementById('ecommerce_reset_encryption_key_row').style.display = '';
    } else {
        document.getElementById('ecommerce_accepted_cards_row').style.display = 'none';
        document.getElementById('ecommerce_payment_gateway_row').style.display = 'none';
        document.getElementById('ecommerce_reset_encryption_key_row').style.display = 'none';
    }
    
    show_or_hide_ecommerce_payment_gateway();
}

function show_or_hide_ecommerce_offline_payment()
{
    if (document.getElementById('ecommerce_offline_payment').checked == true) {
        document.getElementById('ecommerce_offline_payment_only_specific_orders_row').style.display = '';
    } else {
        document.getElementById('ecommerce_offline_payment_only_specific_orders_row').style.display = 'none';
    }
}

function show_or_hide_ecommerce_paypal_express_checkout()
{
    if (document.getElementById('ecommerce_paypal_express_checkout').checked == true) {
        document.getElementById('ecommerce_paypal_express_checkout_transaction_type_row').style.display = '';
        document.getElementById('ecommerce_paypal_express_checkout_mode_row').style.display = '';
        document.getElementById('ecommerce_paypal_express_checkout_api_username_row').style.display = '';
        document.getElementById('ecommerce_paypal_express_checkout_api_password_row').style.display = '';
        document.getElementById('ecommerce_paypal_express_checkout_api_signature_row').style.display = '';
    } else {
        document.getElementById('ecommerce_paypal_express_checkout_transaction_type_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_mode_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_api_username_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_api_password_row').style.display = 'none';
        document.getElementById('ecommerce_paypal_express_checkout_api_signature_row').style.display = 'none';
    }
}

function show_or_hide_ecommerce_payment_gateway() {
    // hide all payment gateway fields until we determine which should be displayed
    document.getElementById('ecommerce_payment_gateway_transaction_type_row').style.display = 'none';
    document.getElementById('ecommerce_payment_gateway_mode_row').style.display = 'none';
    document.getElementById('ecommerce_authorizenet_api_login_id_row').style.display = 'none';
    document.getElementById('ecommerce_authorizenet_transaction_key_row').style.display = 'none';
    document.getElementById('ecommerce_clearcommerce_client_id_row').style.display = 'none';
    document.getElementById('ecommerce_clearcommerce_user_id_row').style.display = 'none';
    document.getElementById('ecommerce_clearcommerce_password_row').style.display = 'none';
    document.getElementById('ecommerce_first_data_global_gateway_store_number_row').style.display = 'none';
    document.getElementById('ecommerce_first_data_global_gateway_pem_file_name_row').style.display = 'none';
    document.getElementById('ecommerce_paypal_payflow_pro_partner_row').style.display = 'none';
    document.getElementById('ecommerce_paypal_payflow_pro_merchant_login_row').style.display = 'none';
    document.getElementById('ecommerce_paypal_payflow_pro_user_row').style.display = 'none';
    document.getElementById('ecommerce_paypal_payflow_pro_password_row').style.display = 'none';
    document.getElementById('ecommerce_paypal_website_payments_pro_gateway_mode_row').style.display = 'none';
    document.getElementById('ecommerce_paypal_website_payments_pro_api_username_row').style.display = 'none';
    document.getElementById('ecommerce_paypal_website_payments_pro_api_password_row').style.display = 'none';
    document.getElementById('ecommerce_paypal_website_payments_pro_api_signature_row').style.display = 'none';
    document.getElementById('ecommerce_sage_merchant_id_row').style.display = 'none';
    document.getElementById('ecommerce_sage_merchant_key_row').style.display = 'none';
    
    // if credit/debit card is checked, the prepare to show fields
    if (document.getElementById('ecommerce_credit_debit_card').checked == true) {
        // show different fields depending on payment gateway choice
        switch (document.getElementById('ecommerce_payment_gateway').options[document.getElementById('ecommerce_payment_gateway').selectedIndex].value) {
            case 'Authorize.Net':
                document.getElementById('ecommerce_payment_gateway_transaction_type_row').style.display = '';
                document.getElementById('ecommerce_payment_gateway_mode_row').style.display = '';
                document.getElementById('ecommerce_authorizenet_api_login_id_row').style.display = '';
                document.getElementById('ecommerce_authorizenet_transaction_key_row').style.display = '';
                break;
                
            case 'ClearCommerce':
                document.getElementById('ecommerce_payment_gateway_transaction_type_row').style.display = '';
                document.getElementById('ecommerce_payment_gateway_mode_row').style.display = '';
                document.getElementById('ecommerce_clearcommerce_client_id_row').style.display = '';
                document.getElementById('ecommerce_clearcommerce_user_id_row').style.display = '';
                document.getElementById('ecommerce_clearcommerce_password_row').style.display = '';
                break;
                
            case 'First Data Global Gateway':
                document.getElementById('ecommerce_payment_gateway_transaction_type_row').style.display = '';
                document.getElementById('ecommerce_payment_gateway_mode_row').style.display = '';
                document.getElementById('ecommerce_first_data_global_gateway_store_number_row').style.display = '';
                document.getElementById('ecommerce_first_data_global_gateway_pem_file_name_row').style.display = '';
                break;
            
            case 'PayPal Payflow Pro':
                document.getElementById('ecommerce_payment_gateway_transaction_type_row').style.display = '';
                document.getElementById('ecommerce_payment_gateway_mode_row').style.display = '';
                document.getElementById('ecommerce_paypal_payflow_pro_partner_row').style.display = '';
                document.getElementById('ecommerce_paypal_payflow_pro_merchant_login_row').style.display = '';
                document.getElementById('ecommerce_paypal_payflow_pro_user_row').style.display = '';
                document.getElementById('ecommerce_paypal_payflow_pro_password_row').style.display = '';
                break;
                
            case 'PayPal Website Payments Pro':
                document.getElementById('ecommerce_payment_gateway_transaction_type_row').style.display = '';
                document.getElementById('ecommerce_paypal_website_payments_pro_gateway_mode_row').style.display = '';
                document.getElementById('ecommerce_paypal_website_payments_pro_api_username_row').style.display = '';
                document.getElementById('ecommerce_paypal_website_payments_pro_api_password_row').style.display = '';
                document.getElementById('ecommerce_paypal_website_payments_pro_api_signature_row').style.display = '';
                break;
                
            case 'Sage':
                document.getElementById('ecommerce_payment_gateway_transaction_type_row').style.display = '';
                document.getElementById('ecommerce_sage_merchant_id_row').style.display = '';
                document.getElementById('ecommerce_sage_merchant_key_row').style.display = '';
                break;
        }
    }
}

function show_or_hide_ecommerce_reward_program() {
    if (document.getElementById('ecommerce_reward_program').checked == true) {
        document.getElementById('ecommerce_reward_program_points_row').style.display = '';
        document.getElementById('ecommerce_reward_program_membership_row').style.display = '';
        show_or_hide_ecommerce_reward_program_membership();
        document.getElementById('ecommerce_reward_program_email_row').style.display = '';
        show_or_hide_ecommerce_reward_program_email();
        
    } else {
        document.getElementById('ecommerce_reward_program_points_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_membership_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_membership_days_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_bcc_email_address_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_subject_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_page_id_row').style.display = 'none';
    }
}

function show_or_hide_ecommerce_reward_program_membership() {
    if (document.getElementById('ecommerce_reward_program_membership').checked == true) {
        document.getElementById('ecommerce_reward_program_membership_days_row').style.display = '';
    } else {
        document.getElementById('ecommerce_reward_program_membership_days_row').style.display = 'none';
    }
}

function show_or_hide_ecommerce_reward_program_email() {
    if (document.getElementById('ecommerce_reward_program_email').checked == true) {
        document.getElementById('ecommerce_reward_program_email_bcc_email_address_row').style.display = '';
        document.getElementById('ecommerce_reward_program_email_subject_row').style.display = '';
        document.getElementById('ecommerce_reward_program_email_page_id_row').style.display = '';
    } else {
        document.getElementById('ecommerce_reward_program_email_bcc_email_address_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_subject_row').style.display = 'none';
        document.getElementById('ecommerce_reward_program_email_page_id_row').style.display = 'none';
    }
}

function show_or_hide_shippable() {
    if (document.getElementById('shippable').checked == true) {
        document.getElementById('primary_weight_points_row').style.display = '';
        document.getElementById('secondary_weight_points_row').style.display = '';
        document.getElementById('preparation_time_row').style.display = '';
        document.getElementById('free_shipping_row').style.display = '';
        show_or_hide_free_shipping();
        document.getElementById('allowed_zones_row').style.display = '';
    } else {
        document.getElementById('primary_weight_points_row').style.display = 'none';
        document.getElementById('secondary_weight_points_row').style.display = 'none';
        document.getElementById('preparation_time_row').style.display = 'none';
        document.getElementById('free_shipping_row').style.display = 'none';
        document.getElementById('extra_shipping_cost_row').style.display = 'none';
        document.getElementById('allowed_zones_row').style.display = 'none';
    }
}

function show_or_hide_free_shipping() {
    if (document.getElementById('free_shipping').checked == true) {
        document.getElementById('extra_shipping_cost_row').style.display = 'none';
    } else {
        document.getElementById('extra_shipping_cost_row').style.display = '';
    }
}

function show_or_hide_inventory() {
    if (document.getElementById('inventory').checked == true) {
        document.getElementById('inventory_quantity_row').style.display = '';
        document.getElementById('backorder_row').style.display = '';
        document.getElementById('out_of_stock_message_row').style.display = '';
    } else {
        document.getElementById('inventory_quantity_row').style.display = 'none';
        document.getElementById('backorder_row').style.display = 'none';
        document.getElementById('out_of_stock_message_row').style.display = 'none';
    }
}

function show_or_hide_commissionable() {
    if (document.getElementById('commissionable').checked == true) {
        document.getElementById('commission_rate_limit_row').style.display = '';
    } else {
        document.getElementById('commission_rate_limit_row').style.display = 'none';
    }
}

function show_or_hide_affiliate_program() {
    if (document.getElementById('affiliate_program').checked == true) {
        document.getElementById('affiliate_default_commission_rate_row').style.display = '';
        document.getElementById('affiliate_automatic_approval_row').style.display = '';
        document.getElementById('affiliate_contact_group_id_row').style.display = '';
        document.getElementById('affiliate_email_address_row').style.display = '';
        document.getElementById('affiliate_group_offer_id_row').style.display = '';
    } else {
        document.getElementById('affiliate_default_commission_rate_row').style.display = 'none';
        document.getElementById('affiliate_automatic_approval_row').style.display = 'none';
        document.getElementById('affiliate_contact_group_id_row').style.display = 'none';
        document.getElementById('affiliate_email_address_row').style.display = 'none';
        document.getElementById('affiliate_group_offer_id_row').style.display = 'none';
    }
}

function show_or_hide_google_analytics() {
    if (document.getElementById('google_analytics').checked == true) {
        document.getElementById('google_analytics_web_property_id_row').style.display = '';
    } else {
        document.getElementById('google_analytics_web_property_id_row').style.display = 'none';
    }
}

function show_or_hide_whos_online() {
    if (document.getElementById('whos_online').checked == true) {
        document.getElementById('whos_online_chat_button_online_file_name_row').style.display = '';
        document.getElementById('whos_online_chat_button_offline_file_name_row').style.display = '';
    } else {
        document.getElementById('whos_online_chat_button_online_file_name_row').style.display = 'none';
        document.getElementById('whos_online_chat_button_offline_file_name_row').style.display = 'none';
    }
}

function show_or_hide_translation() {
    if (document.getElementById('translation').checked == true) {
        document.getElementById('translation_api_id_row').style.display = '';
        document.getElementById('translation_source_language_row').style.display = '';
        document.getElementById('translation_target_language_row').style.display = '';
    } else {
        document.getElementById('translation_api_id_row').style.display = 'none';
        document.getElementById('translation_source_language_row').style.display = 'none';
        document.getElementById('translation_target_language_row').style.display = 'none';
    }
}

function show_or_hide_upsell() {
    if (document.getElementById('upsell').checked == true) {
        document.getElementById('upsell_message_row').style.display = '';
        document.getElementById('upsell_triggers_row').style.display = '';
        document.getElementById('upsell_trigger_subtotal_row').style.display = '';
        document.getElementById('upsell_and_or_row').style.display = '';
        document.getElementById('upsell_trigger_quantity_row').style.display = '';
        document.getElementById('upsell_action_button_label_row').style.display = '';
        document.getElementById('upsell_action_page_id_row').style.display = '';
    } else {
        document.getElementById('upsell_message_row').style.display = 'none';
        document.getElementById('upsell_triggers_row').style.display = 'none';
        document.getElementById('upsell_trigger_subtotal_row').style.display = 'none';
        document.getElementById('upsell_and_or_row').style.display = 'none';
        document.getElementById('upsell_trigger_quantity_row').style.display = 'none';
        document.getElementById('upsell_action_button_label_row').style.display = 'none';
        document.getElementById('upsell_action_page_id_row').style.display = 'none';
    }
}

function show_or_hide_multiple_recipients() {
    if (document.getElementById('order').checked == true) {
        document.getElementById('multiple_recipients_row').style.display = 'none';
    } else {
        document.getElementById('multiple_recipients_row').style.display = '';
    }
}

function show_or_hide_email_subscription() {
    if (document.getElementById('email_subscription').checked == true) {
        document.getElementById('email_subscription_type_row').style.display = '';
        document.getElementById('description_row').style.display = '';
        document.getElementById('description_heading_row').style.display = '';
    } else {
        document.getElementById('email_subscription_type_row').style.display = 'none';
        document.getElementById('description_row').style.display = 'none';
        document.getElementById('description_heading_row').style.display = 'none';
    }
}


function show_or_hide_contact_group_opt_in(contact_group_id) {
    if (document.getElementById('contact_group_' + contact_group_id).checked == true) {
        document.getElementById('contact_group_opt_in_cell_' + contact_group_id).style.display = '';
    } else {
        document.getElementById('contact_group_opt_in_cell_' + contact_group_id).style.display = 'none';
    }
}

function show_or_hide_reservations() {
    if (document.getElementById('reservations').checked == true) {
        // If recurrence is enabled then show separate reservations field.
        if (document.getElementById('recurrence').checked == true) {
            document.getElementById('separate_reservations_row').style.display = '';
        }
        
        document.getElementById('limit_reservations_row').style.display = '';
        show_or_hide_limit_reservations();
        document.getElementById('reserve_button_label_row').style.display = '';
        document.getElementById('product_id_row').style.display = '';
        document.getElementById('next_page_id_row').style.display = '';
    } else {
        document.getElementById('separate_reservations_row').style.display = 'none';
        document.getElementById('limit_reservations_row').style.display = 'none';
        document.getElementById('number_of_initial_spots_row').style.display = 'none';
        
        // if number of remaining spots exists, then hide it (exists on edit screen but not create screen)
        if (document.getElementById('number_of_remaining_spots_row')) {
            document.getElementById('number_of_remaining_spots_row').style.display = 'none';
        }
        
        document.getElementById('no_remaining_spots_message_row').style.display = 'none';
        document.getElementById('reserve_button_label_row').style.display = 'none';
        document.getElementById('product_id_row').style.display = 'none';
        document.getElementById('next_page_id_row').style.display = 'none';
    }
}

function show_or_hide_separate_reservations() {
    // if this is the create calendar event screen or this is a recurring event and separate reservations is enabled and limit reservations is enabled,
    // then show number of initial spots
    if (
        (!document.getElementById('number_of_remaining_spots_row'))
        ||
        (
            (document.getElementById('recurrence').checked == true)
            && (document.getElementById('separate_reservations').checked == true)
            && (document.getElementById('limit_reservations').checked == true)
        )
    ) {
        document.getElementById('number_of_initial_spots_row').style.display = '';
    
    // else do not show number of initial spots
    } else {
        document.getElementById('number_of_initial_spots_row').style.display = 'none';
    }
}

function show_or_hide_limit_reservations() {
    // if limit reservations is enabled then determine which sub-fields should be shown
    if (document.getElementById('limit_reservations').checked == true) {
        // if this is the create calendar event screen or this is a recurring event and separate reservations is enabled,
        // then show number of initial spots
        if (
            (!document.getElementById('number_of_remaining_spots_row'))
            ||
            (
                (document.getElementById('recurrence').checked == true)
                && (document.getElementById('separate_reservations').checked == true)
            )
        ) {
            document.getElementById('number_of_initial_spots_row').style.display = '';
        }
        
        // if number of remaining spots exists, then show it (exists on edit screen but not create screen)
        if (document.getElementById('number_of_remaining_spots_row')) {
            document.getElementById('number_of_remaining_spots_row').style.display = '';
        }
        
        document.getElementById('no_remaining_spots_message_row').style.display = '';
        
    // else limit reservations is not enabled, so hide sub-fields
    } else {
        document.getElementById('number_of_initial_spots_row').style.display = 'none';
        
        // if number of remaining spots exists, then hide it (exists on edit screen but not create screen)
        if (document.getElementById('number_of_remaining_spots_row')) {
            document.getElementById('number_of_remaining_spots_row').style.display = 'none';
        }
        
        document.getElementById('no_remaining_spots_message_row').style.display = 'none';
    }
}

function show_or_hide_calendar_access() {
    if (document.getElementById('manage_calendars').checked == true) {
        document.getElementById('calendar_access').style.display = '';
        document.getElementById('publish_calendar_events_container').style.display = '';
    } else {
        document.getElementById('calendar_access').style.display = 'none';
        document.getElementById('publish_calendar_events_container').style.display = 'none';
    }
}

function show_or_hide_contact_group_access() {
    if ((document.getElementById('manage_contacts').checked == true) || (document.getElementById('manage_emails').checked == true)) {
        document.getElementById('contact_group_access').style.display = '';
    } else {
        document.getElementById('contact_group_access').style.display = 'none';
    }
}

function show_or_hide_ecommerce_access() {
    if (document.getElementById('manage_ecommerce').checked == true) {
        document.getElementById('view_card_data_container').style.display = '';
    } else {
        document.getElementById('view_card_data_container').style.display = 'none';
    }
}

function show_or_hide_view_expiration_date(folder_id) {
    if (document.getElementById('view_' + folder_id).checked == true) {
        document.getElementById('view_' + folder_id + '_expiration_date_container').style.display = '';

        $('#view_' + folder_id + '_expiration_date').datepicker({
            dateFormat: "m/d/yy"
        });

    } else {
        document.getElementById('view_' + folder_id + '_expiration_date_container').style.display = 'none';

        $('#view_' + folder_id + '_expiration_date').datepicker('destroy');
    }
}

function show_or_hide_quiz() {
    if (document.getElementById('custom_form_quiz').checked == true) {
        document.getElementById('custom_form_quiz_pass_percentage_row').style.display = '';
    } else {
        document.getElementById('custom_form_quiz_pass_percentage_row').style.display = 'none';
    }
}

function show_or_hide_custom_form_submitter_email() {
    if (document.getElementById('custom_form_submitter_email').checked == true) {
        document.getElementById('custom_form_submitter_email_from_email_address_row').style.display = '';
        document.getElementById('custom_form_submitter_email_subject_row').style.display = '';
        document.getElementById('custom_form_submitter_email_format_row').style.display = '';
        show_or_hide_custom_form_submitter_email_format();
        
    } else {
        document.getElementById('custom_form_submitter_email_from_email_address_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_subject_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_format_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_body_row').style.display = 'none';
        document.getElementById('custom_form_submitter_email_page_id_row').style.display = 'none';
    }
}

function show_or_hide_custom_form_submitter_email_format()
{
    // start off by hiding all rows under the format field until we determine which should be shown
    document.getElementById('custom_form_submitter_email_body_row').style.display = 'none';
    document.getElementById('custom_form_submitter_email_page_id_row').style.display = 'none';

    // if the "plain text" option is selected, then show the body row
    if (document.getElementById('custom_form_submitter_email_format_plain_text').checked == true) {
        document.getElementById('custom_form_submitter_email_body_row').style.display = '';
    
    // else the "html" option is selected, so show page row
    } else {
        document.getElementById('custom_form_submitter_email_page_id_row').style.display = '';
    }
}

function show_or_hide_custom_form_administrator_email() {
    if (document.getElementById('custom_form_administrator_email').checked == true) {
        document.getElementById('custom_form_administrator_email_to_email_address_row').style.display = '';
        document.getElementById('custom_form_administrator_email_bcc_email_address_row').style.display = '';
        document.getElementById('custom_form_administrator_email_subject_row').style.display = '';
        document.getElementById('custom_form_administrator_email_format_row').style.display = '';
        show_or_hide_custom_form_administrator_email_format();
        
    } else {
        document.getElementById('custom_form_administrator_email_to_email_address_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_bcc_email_address_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_subject_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_format_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_body_row').style.display = 'none';
        document.getElementById('custom_form_administrator_email_page_id_row').style.display = 'none';
    }
}

function show_or_hide_custom_form_administrator_email_format()
{
    // start off by hiding all rows under the format field until we determine which should be shown
    document.getElementById('custom_form_administrator_email_body_row').style.display = 'none';
    document.getElementById('custom_form_administrator_email_page_id_row').style.display = 'none';

    // if the "plain text" option is selected, then show the body row
    if (document.getElementById('custom_form_administrator_email_format_plain_text').checked == true) {
        document.getElementById('custom_form_administrator_email_body_row').style.display = '';
    
    // else the "html" option is selected, so show page row
    } else {
        document.getElementById('custom_form_administrator_email_page_id_row').style.display = '';
    }
}

function show_or_hide_custom_form_membership() {
    if (document.getElementById('custom_form_membership').checked == true) {
        document.getElementById('custom_form_membership_days_row').style.display = '';
        document.getElementById('custom_form_membership_start_page_id_row').style.display = '';
    } else {
        document.getElementById('custom_form_membership_days_row').style.display = 'none';
        document.getElementById('custom_form_membership_start_page_id_row').style.display = 'none';
    }
}

function show_or_hide_custom_form_confirmation_type()
{
    // Start off by hiding all rows under the confirmation type field until we determine which should be shown.
    document.getElementById('custom_form_confirmation_message_row').style.display = 'none';
    document.getElementById('custom_form_confirmation_page_id_row').style.display = 'none';
    document.getElementById('custom_form_confirmation_alternative_page_row').style.display = 'none';
    document.getElementById('custom_form_confirmation_alternative_page_contact_group_id_row').style.display = 'none';
    document.getElementById('custom_form_confirmation_alternative_page_id_row').style.display = 'none';

    // If the message option is selected, then show the message row
    if (document.getElementById('custom_form_confirmation_type_message').checked == true) {
        document.getElementById('custom_form_confirmation_message_row').style.display = '';

        // If the rich-text editor has not been loaded already for the message field, then load it.
        if (tinyMCE.getInstanceById('custom_form_confirmation_message') == null) {
            tinyMCE.execCommand('mceAddControl', false, 'custom_form_confirmation_message');
        }
    
    // Otherwise the page option is selected, so show page rows.
    } else {
        document.getElementById('custom_form_confirmation_page_id_row').style.display = '';
        document.getElementById('custom_form_confirmation_alternative_page_row').style.display = '';

        show_or_hide_custom_form_confirmation_alternative_page();
    }
}

function show_or_hide_custom_form_confirmation_alternative_page()
{
    // Start off by hiding all rows under the alternative page field until we determine which should be shown.
    document.getElementById('custom_form_confirmation_alternative_page_contact_group_id_row').style.display = 'none';
    document.getElementById('custom_form_confirmation_alternative_page_id_row').style.display = 'none';

    // If the alternative page check box is checked, then show the alternative page rows.
    if (document.getElementById('custom_form_confirmation_alternative_page').checked == true) {
        document.getElementById('custom_form_confirmation_alternative_page_contact_group_id_row').style.display = '';
        document.getElementById('custom_form_confirmation_alternative_page_id_row').style.display = '';
    }
}

function show_or_hide_custom_form_return_type()
{
    // Start off by hiding all rows under the return type field until we determine which should be shown.
    document.getElementById('custom_form_return_message_row').style.display = 'none';
    document.getElementById('custom_form_return_page_id_row').style.display = 'none';
    document.getElementById('custom_form_return_alternative_page_row').style.display = 'none';
    document.getElementById('custom_form_return_alternative_page_contact_group_id_row').style.display = 'none';
    document.getElementById('custom_form_return_alternative_page_id_row').style.display = 'none';

    // If the message option is selected, then show the message row
    if (document.getElementById('custom_form_return_type_message').checked == true) {
        document.getElementById('custom_form_return_message_row').style.display = '';

        // If the rich-text editor has not been loaded already for the message field, then load it.
        if (tinyMCE.getInstanceById('custom_form_return_message') == null) {
            tinyMCE.execCommand('mceAddControl', false, 'custom_form_return_message');
        }
    
    // Otherwise if the page option is selected, then show page rows.
    } else if (document.getElementById('custom_form_return_type_page').checked == true) {
        document.getElementById('custom_form_return_page_id_row').style.display = '';
        document.getElementById('custom_form_return_alternative_page_row').style.display = '';

        show_or_hide_custom_form_return_alternative_page();
    }
}

function show_or_hide_custom_form_return_alternative_page()
{
    // Start off by hiding all rows under the alternative page field until we determine which should be shown.
    document.getElementById('custom_form_return_alternative_page_contact_group_id_row').style.display = 'none';
    document.getElementById('custom_form_return_alternative_page_id_row').style.display = 'none';

    // If the alternative page check box is checked, then show the alternative page rows.
    if (document.getElementById('custom_form_return_alternative_page').checked == true) {
        document.getElementById('custom_form_return_alternative_page_contact_group_id_row').style.display = '';
        document.getElementById('custom_form_return_alternative_page_id_row').style.display = '';
    }
}

function show_or_hide_allow_customer_to_add_product_to_order() {
    if (document.getElementById('catalog_detail_allow_customer_to_add_product_to_order').checked == true) {
        document.getElementById('catalog_detail_add_button_label_row').style.display = '';
        document.getElementById('catalog_detail_next_page_id_row').style.display = '';
    } else {
        document.getElementById('catalog_detail_add_button_label_row').style.display = 'none';
        document.getElementById('catalog_detail_next_page_id_row').style.display = 'none';
    }
}

function show_or_hide_express_order_order_receipt_email() {
    if (document.getElementById('express_order_order_receipt_email').checked == true) {
        document.getElementById('express_order_order_receipt_email_subject_row').style.display = '';
        document.getElementById('express_order_order_receipt_email_format_row').style.display = '';
        show_or_hide_express_order_order_receipt_email_format();
        
    } else {
        document.getElementById('express_order_order_receipt_email_subject_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_format_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_header_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_footer_row').style.display = 'none';
        document.getElementById('express_order_order_receipt_email_page_id_row').style.display = 'none';
    }
}

function show_or_hide_express_order_order_receipt_email_format()
{
    // start off by hiding all rows under the format field until we determine which should be shown
    document.getElementById('express_order_order_receipt_email_header_row').style.display = 'none';
    document.getElementById('express_order_order_receipt_email_footer_row').style.display = 'none';
    document.getElementById('express_order_order_receipt_email_page_id_row').style.display = 'none';

    // if the "plain text" option is selected, then show the header and footer rows
    if (document.getElementById('express_order_order_receipt_email_format_plain_text').checked == true) {
        document.getElementById('express_order_order_receipt_email_header_row').style.display = '';
        document.getElementById('express_order_order_receipt_email_footer_row').style.display = '';
    
    // else the "html" option is selected, so show page row
    } else {
        document.getElementById('express_order_order_receipt_email_page_id_row').style.display = '';
    }
}

function show_or_hide_order_preview_order_receipt_email() {
    if (document.getElementById('order_preview_order_receipt_email').checked == true) {
        document.getElementById('order_preview_order_receipt_email_subject_row').style.display = '';
        document.getElementById('order_preview_order_receipt_email_format_row').style.display = '';
        show_or_hide_order_preview_order_receipt_email_format();
        
    } else {
        document.getElementById('order_preview_order_receipt_email_subject_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_format_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_header_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_footer_row').style.display = 'none';
        document.getElementById('order_preview_order_receipt_email_page_id_row').style.display = 'none';
    }
}

function show_or_hide_order_preview_order_receipt_email_format()
{
    // start off by hiding all rows under the format field until we determine which should be shown
    document.getElementById('order_preview_order_receipt_email_header_row').style.display = 'none';
    document.getElementById('order_preview_order_receipt_email_footer_row').style.display = 'none';
    document.getElementById('order_preview_order_receipt_email_page_id_row').style.display = 'none';

    // if the "plain text" option is selected, then show the header and footer rows
    if (document.getElementById('order_preview_order_receipt_email_format_plain_text').checked == true) {
        document.getElementById('order_preview_order_receipt_email_header_row').style.display = '';
        document.getElementById('order_preview_order_receipt_email_footer_row').style.display = '';
    
    // else the "html" option is selected, so show page row
    } else {
        document.getElementById('order_preview_order_receipt_email_page_id_row').style.display = '';
    }
}

function show_or_hide_quiz_question() {
    if (document.getElementById('quiz_question').checked == true) {
        document.getElementById('quiz_answer_row').style.display = '';
    } else {
        document.getElementById('quiz_answer_row').style.display = 'none';
    }
}

function show_or_hide_custom() {
    if (document.getElementById('custom').checked == true) {
        document.getElementById('custom_maximum_arrival_date_row').style.display = '';
        document.getElementById('shipping_cutoff_heading_row').style.display = 'none';
        document.getElementById('shipping_cutoff_row').style.display = 'none';
    } else {
        document.getElementById('custom_maximum_arrival_date_row').style.display = 'none';
        document.getElementById('shipping_cutoff_heading_row').style.display = '';
        document.getElementById('shipping_cutoff_row').style.display = '';
    }
}

function show_or_hide_comments()
{
    // if comments is checked then prepare to show rows
    if (document.getElementById('comments').checked == true) {
        document.getElementById('comments_allow_new_comments_row').style.display = '';
        document.getElementById('comments_disallow_new_comment_message_row').style.display = '';
        document.getElementById('comments_automatic_publish_row').style.display = '';
        document.getElementById('comments_allow_user_to_select_name_row').style.display = '';
        document.getElementById('comments_require_login_to_comment_row').style.display = '';
        document.getElementById('comments_allow_file_attachments_row').style.display = '';
        document.getElementById('comments_show_submitted_date_and_time_row').style.display = '';
        document.getElementById('comments_administrator_email_row').style.display = '';
        document.getElementById('comments_administrator_email_to_email_address_row').style.display = '';
        document.getElementById('comments_administrator_email_subject_row').style.display = '';
        
        show_or_hide_form_item_view_comment_fields();
        
        document.getElementById('comments_watcher_email_row').style.display = '';
        document.getElementById('comments_watcher_email_page_id_row').style.display = '';
        document.getElementById('comments_watcher_email_subject_row').style.display = '';
    
    // else hide all rows
    } else {
        document.getElementById('comments_allow_new_comments_row').style.display = 'none';
        document.getElementById('comments_disallow_new_comment_message_row').style.display = 'none';
        document.getElementById('comments_automatic_publish_row').style.display = 'none';
        document.getElementById('comments_allow_user_to_select_name_row').style.display = 'none';
        document.getElementById('comments_require_login_to_comment_row').style.display = 'none';
        document.getElementById('comments_allow_file_attachments_row').style.display = 'none';
        document.getElementById('comments_show_submitted_date_and_time_row').style.display = 'none';
        document.getElementById('comments_administrator_email_row').style.display = 'none';
        document.getElementById('comments_administrator_email_to_email_address_row').style.display = 'none';
        document.getElementById('comments_administrator_email_subject_row').style.display = 'none';
        document.getElementById('comments_administrator_email_conditional_administrators_row').style.display = 'none';
        document.getElementById('comments_submitter_email_row').style.display = 'none';
        document.getElementById('comments_submitter_email_page_id_row').style.display = 'none';
        document.getElementById('comments_submitter_email_subject_row').style.display = 'none';
        document.getElementById('comments_watcher_email_row').style.display = 'none';
        document.getElementById('comments_watcher_email_page_id_row').style.display = 'none';
        document.getElementById('comments_watcher_email_subject_row').style.display = 'none';
        document.getElementById('comments_watchers_managed_by_submitter_row').style.display = 'none';
    }
}

function show_or_hide_form_item_view_comment_fields()
{
    // get page type
    var page_type = document.getElementById('page_type').options[document.getElementById('page_type').selectedIndex].value;
    
    // if comments are enabled and the page type is form item view then show rows
    if ((document.getElementById('comments').checked == true) && (page_type == 'form item view')) {
        document.getElementById('comments_administrator_email_conditional_administrators_row').style.display = '';
        document.getElementById('comments_submitter_email_row').style.display = '';
        document.getElementById('comments_submitter_email_page_id_row').style.display = '';
        document.getElementById('comments_submitter_email_subject_row').style.display = '';
        document.getElementById('comments_watchers_managed_by_submitter_row').style.display = '';
        
    // else hide rows
    } else {
        document.getElementById('comments_administrator_email_conditional_administrators_row').style.display = 'none';
        document.getElementById('comments_submitter_email_row').style.display = 'none';
        document.getElementById('comments_submitter_email_page_id_row').style.display = 'none';
        document.getElementById('comments_submitter_email_subject_row').style.display = 'none';
        document.getElementById('comments_watchers_managed_by_submitter_row').style.display = 'none';
    }
}

function move_options(left_element_id, right_element_id, direction) {
    left = document.getElementById(left_element_id);
    right = document.getElementById(right_element_id);

    if (direction != 'left') {
        var tmp;
        tmp = left;
        left = right;
        right = tmp;
    }

    while(right.selectedIndex != -1) {
        left.options[left.options.length] = new Option(right.options[right.selectedIndex].text, right.options[right.selectedIndex].value);
        right.options[right.selectedIndex] = null;
    }
}

function prepare_selects(elements) {
    for (i = 0; i < elements.length; i++) {
        if (document.getElementById(elements[i])) {
            if (document.getElementById(elements[i] + "_hidden").value == '') {
                for (x = 0; x < document.getElementById(elements[i]).options.length; x++) {
                    document.getElementById(elements[i] + "_hidden").value += document.getElementById(elements[i]).options[x].value + ",";
                }
            }
        }
    }
    return true;
}

function change_offer_action_type($offer_action_type)
{
    // hide all objects
    document.getElementById('discount_order').style.display = 'none';
    document.getElementById('discount_product').style.display = 'none';
    document.getElementById('add_product').style.display = 'none';
    document.getElementById('discount_shipping').style.display = 'none';

    // show needed objects
    switch ($offer_action_type) {
        case 'discount order':
            document.getElementById('discount_order').style.display = '';
            break;

        case 'discount product':
            document.getElementById('discount_product').style.display = '';
            break;

        case 'add product':
            document.getElementById('add_product').style.display = '';
            break;
            
        case 'discount shipping':
            document.getElementById('discount_shipping').style.display = '';
            break;
    }
}

function change_field_type($field_type)
{
    // hide all objects
    document.getElementById('name_row').style.display = 'none';
    if (document.getElementById('rss_field_row')) {
        document.getElementById('rss_field_heading').style.display = 'none';
        document.getElementById('rss_field_row').style.display = 'none';
    }
    document.getElementById('name_row_header').style.display = 'none';
    document.getElementById('label_row').style.display = 'none';
    document.getElementById('label_row_header').style.display = 'none';
    document.getElementById('required_row').style.display = 'none';
    document.getElementById('required_row_header').style.display = 'none';
            
    // if upload_folder_id_row exists
    if (document.getElementById('upload_folder_id_row')) {
        document.getElementById('upload_folder_id_row').style.display = 'none';
        document.getElementById('upload_folder_id_row_header').style.display = 'none';
    }

    document.getElementById('default_value_row').style.display = 'none';
    document.getElementById('default_value_row_header').style.display = 'none';
    document.getElementById('position_row').style.display = 'none';
    document.getElementById('size_row').style.display = 'none';
    document.getElementById('maxlength_row').style.display = 'none';
    document.getElementById('wysiwyg_row').style.display = 'none';
    document.getElementById('wysiwyg_row_header').style.display = 'none';
    document.getElementById('rows_row').style.display = 'none';
    document.getElementById('rows_row_header').style.display = 'none';
    document.getElementById('cols_row').style.display = 'none';
    document.getElementById('multiple_row').style.display = 'none';
    document.getElementById('multiple_row_header').style.display = 'none';
    document.getElementById('spacing_row').style.display = 'none';
    
    // if contact_field_row exists
    if (document.getElementById('contact_field_row')) {
        document.getElementById('contact_field_row').style.display = 'none';
        document.getElementById('contact_field_row_header').style.display = 'none';
    }
    
    // if office_use_only_row exists
    if (document.getElementById('office_use_only_row')) {
        document.getElementById('office_use_only_row').style.display = 'none';
        document.getElementById('office_use_only_row_header').style.display = 'none';
    }
    
    // if quiz is enabled for this custom form
    if (document.getElementById('quiz_question_row')) {
        document.getElementById('quiz_question_row').style.display = 'none';
        document.getElementById('quiz_answer_row').style.display = 'none';
    }
    
    document.getElementById('choices_row').style.display = 'none';
    document.getElementById('information_row').style.display = 'none';

    // show needed objects
    switch ($field_type) {
        case 'text box':
            document.getElementById('name_row').style.display = '';
            if (document.getElementById('rss_field_row')) {
                document.getElementById('rss_field_heading').style.display = '';
                document.getElementById('rss_field_row').style.display = '';
            }
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('default_value_row').style.display = '';
            document.getElementById('default_value_row_header').style.display = '';
            document.getElementById('size_row').style.display = '';
            document.getElementById('maxlength_row').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if contact_field_row exists
            if (document.getElementById('contact_field_row')) {
                document.getElementById('contact_field_row').style.display = '';
                document.getElementById('contact_field_row_header').style.display = '';
            }
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }
            
            // if quiz is enabled for this custom form
            if (document.getElementById('quiz_question_row')) {
                document.getElementById('quiz_question_row').style.display = '';
                show_or_hide_quiz_question();
            }
            
            break;
        
        case 'text area':
            document.getElementById('name_row').style.display = '';
            if (document.getElementById('rss_field_row')) {
                document.getElementById('rss_field_heading').style.display = '';
                document.getElementById('rss_field_row').style.display = '';
            }
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('default_value_row').style.display = '';
            document.getElementById('default_value_row_header').style.display = '';
            document.getElementById('wysiwyg_row').style.display = '';
            document.getElementById('wysiwyg_row_header').style.display = '';
            document.getElementById('rows_row').style.display = '';
            document.getElementById('rows_row_header').style.display = '';
            document.getElementById('cols_row').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if contact_field_row exists
            if (document.getElementById('contact_field_row')) {
                document.getElementById('contact_field_row').style.display = '';
                document.getElementById('contact_field_row_header').style.display = '';
            }
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }
            break;

        case 'pick list':
            document.getElementById('name_row').style.display = '';
            if (document.getElementById('rss_field_row')) {
                document.getElementById('rss_field_heading').style.display = '';
                document.getElementById('rss_field_row').style.display = '';
            }
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('default_value_row').style.display = '';
            document.getElementById('default_value_row_header').style.display = '';
            document.getElementById('size_row').style.display = '';
            document.getElementById('multiple_row').style.display = '';
            document.getElementById('multiple_row_header').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if contact_field_row exists
            if (document.getElementById('contact_field_row')) {
                document.getElementById('contact_field_row').style.display = '';
                document.getElementById('contact_field_row_header').style.display = '';
            }
            
            document.getElementById('choices_row').style.display = '';
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }
            
            // if quiz is enabled for this custom form
            if (document.getElementById('quiz_question_row')) {
                document.getElementById('quiz_question_row').style.display = '';
                show_or_hide_quiz_question();
            }
            
            break;

        case 'radio button':
            document.getElementById('name_row').style.display = '';
            if (document.getElementById('rss_field_row')) {
                document.getElementById('rss_field_heading').style.display = '';
                document.getElementById('rss_field_row').style.display = '';
            }
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('default_value_row').style.display = '';
            document.getElementById('default_value_row_header').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if contact_field_row exists
            if (document.getElementById('contact_field_row')) {
                document.getElementById('contact_field_row').style.display = '';
                document.getElementById('contact_field_row_header').style.display = '';
            }
            
            document.getElementById('choices_row').style.display = '';
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }

            // if quiz is enabled for this custom form
            if (document.getElementById('quiz_question_row')) {
                document.getElementById('quiz_question_row').style.display = '';
                show_or_hide_quiz_question();
            }
            
            break;

        case 'check box':
            document.getElementById('name_row').style.display = '';
            if (document.getElementById('rss_field_row')) {
                document.getElementById('rss_field_heading').style.display = '';
                document.getElementById('rss_field_row').style.display = '';
            }
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('default_value_row').style.display = '';
            document.getElementById('default_value_row_header').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if contact_field_row exists
            if (document.getElementById('contact_field_row')) {
                document.getElementById('contact_field_row').style.display = '';
                document.getElementById('contact_field_row_header').style.display = '';
            }
            document.getElementById('choices_row').style.display = '';
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }

            // if quiz is enabled for this custom form
            if (document.getElementById('quiz_question_row')) {
                document.getElementById('quiz_question_row').style.display = '';
                show_or_hide_quiz_question();
            }
            
            break;
            
        case 'file upload':
            document.getElementById('name_row').style.display = '';
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('upload_folder_id_row').style.display = '';
            document.getElementById('upload_folder_id_row_header').style.display = '';
            document.getElementById('size_row').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }
            break;
            
        case 'date':
            document.getElementById('name_row').style.display = '';
            if (document.getElementById('rss_field_row')) {
                document.getElementById('rss_field_heading').style.display = '';
                document.getElementById('rss_field_row').style.display = '';
            }
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('default_value_row').style.display = '';
            document.getElementById('default_value_row_header').style.display = '';
            document.getElementById('size_row').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }

            // if quiz is enabled for this custom form
            if (document.getElementById('quiz_question_row')) {
                document.getElementById('quiz_question_row').style.display = '';
                show_or_hide_quiz_question();
            }
            
            break;
            
        case 'date and time':
            document.getElementById('name_row').style.display = '';
            if (document.getElementById('rss_field_row')) {
                document.getElementById('rss_field_heading').style.display = '';
                document.getElementById('rss_field_row').style.display = '';
            }
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('default_value_row').style.display = '';
            document.getElementById('default_value_row_header').style.display = '';
            document.getElementById('size_row').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }

            // if quiz is enabled for this custom form
            if (document.getElementById('quiz_question_row')) {
                document.getElementById('quiz_question_row').style.display = '';
                show_or_hide_quiz_question();
            }
            
            break;
            
        case 'email address':
            document.getElementById('name_row').style.display = '';
            if (document.getElementById('rss_field_row')) {
                document.getElementById('rss_field_heading').style.display = '';
                document.getElementById('rss_field_row').style.display = '';
            }
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('default_value_row').style.display = '';
            document.getElementById('default_value_row_header').style.display = '';
            document.getElementById('size_row').style.display = '';
            document.getElementById('maxlength_row').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if contact_field_row exists
            if (document.getElementById('contact_field_row')) {
                document.getElementById('contact_field_row').style.display = '';
                document.getElementById('contact_field_row_header').style.display = '';
            }
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }

            // if quiz is enabled for this custom form
            if (document.getElementById('quiz_question_row')) {
                document.getElementById('quiz_question_row').style.display = '';
                show_or_hide_quiz_question();
            }
            
            break;

        case 'information':
            document.getElementById('name_row').style.display = '';
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('information_row').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }
            
            if (tinyMCE.getInstanceById('information') == null) {
                tinyMCE.execCommand('mceAddControl', false, 'information');
            }
            
            break;
            
        case 'time':
            document.getElementById('name_row').style.display = '';
            if (document.getElementById('rss_field_row')) {
                document.getElementById('rss_field_heading').style.display = '';
                document.getElementById('rss_field_row').style.display = '';
            }
            document.getElementById('name_row_header').style.display = '';
            document.getElementById('label_row').style.display = '';
            document.getElementById('label_row_header').style.display = '';
            document.getElementById('position_row').style.display = '';
            document.getElementById('required_row').style.display = '';
            document.getElementById('required_row_header').style.display = '';
            document.getElementById('default_value_row').style.display = '';
            document.getElementById('default_value_row_header').style.display = '';
            document.getElementById('size_row').style.display = '';
            document.getElementById('spacing_row').style.display = '';
            
            // if office_use_only_row exists
            if (document.getElementById('office_use_only_row')) {
                document.getElementById('office_use_only_row').style.display = '';
                document.getElementById('office_use_only_row_header').style.display = '';
            }

            // if quiz is enabled for this custom form
            if (document.getElementById('quiz_question_row')) {
                document.getElementById('quiz_question_row').style.display = '';
                show_or_hide_quiz_question();
            }
            
            break;
    }
}

// Create a function that will be used to set the start and end time fields
// for calendar events so they either accept both a date & time if "all day" is disabled
// or just a date if "all day" is enabled.
function toggle_calendar_event_all_day() {
    // If all day is checked, then prepare start and end date fields to just contain dates.
    if (document.getElementById('all_day').checked == true) {
        document.getElementById('start_time_label').style.display = 'none';
        document.getElementById('end_time_label').style.display = 'none';
        document.getElementById('start_time_format').style.display = 'none';
        document.getElementById('end_time_format').style.display = 'none';

        // Remove time picker by removing its parent date picker.
        $("#start_time").datepicker('destroy');
        $("#end_time").datepicker('destroy');

        // Add date picker to both fields.

        $("#start_time").datepicker({
            dateFormat: "m/d/yy"
        });
        
        $("#end_time").datepicker({
            dateFormat: "m/d/yy"
        });

        // Get just the date values in order to strip the times from the fields.
        var start_date = $.datepicker.formatDate('m/d/yy', $('#start_time').datepicker('getDate'));
        var end_date = $.datepicker.formatDate('m/d/yy', $('#end_time').datepicker('getDate'));

        // Update fields to only contain the date.
        $("#start_time").datepicker('setDate', start_date);
        $("#end_time").datepicker('setDate', end_date);

        // Update the size and maxlength of the fields to support just a date.
        $('#start_time').attr('size', 10);
        $('#start_time').attr('maxlength', 10);
        $('#end_time').attr('size', 10);
        $('#end_time').attr('maxlength', 10);

    // Otherwise all day is not checked, so prepare start and end date fields to contain both dates and times.
    } else {
        document.getElementById('start_time_label').style.display = '';
        document.getElementById('end_time_label').style.display = '';
        document.getElementById('start_time_format').style.display = '';
        document.getElementById('end_time_format').style.display = '';

        // Remove date picker in preparation for adding date/time picker.
        $("#start_time").datepicker('destroy');
        $("#end_time").datepicker('destroy');

        // Add date/time picker to both fields.

        $("#start_time").datetimepicker({
            dateFormat: "m/d/yy",
            timeFormat: "h:mm TT"
        });

        $("#end_time").datetimepicker({
            dateFormat: "m/d/yy",
            timeFormat: "h:mm TT"
        });

        // Update the size and maxlength of the fields to support both a date and time.
        $('#start_time').attr('size', 19);
        $('#start_time').attr('maxlength', 19);
        $('#end_time').attr('size', 19);
        $('#end_time').attr('maxlength', 19);
    }
}

function toggle_calendar_event_recurrence()
{
    // Assume that rows should be hidden until we find out otherwise.
    document.getElementById('recurrence_number_and_type_row').style.display = 'none';
    document.getElementById('recurrence_month_type_row').style.display = 'none';

    // If recurrence is checked, then determine which recurrence rows should be shown.
    if (document.getElementById('recurrence').checked == true) {
        document.getElementById('recurrence_number_and_type_row').style.display = '';
        change_calendar_event_recurrence_type();
    }

    // if this is a recurring event and reservations is enabled then show separate reservations field
    if (
        (document.getElementById('recurrence').checked == true)
        && (document.getElementById('reservations').checked == true)
    ) {
        document.getElementById('separate_reservations_row').style.display = '';
        
    // else separate reservations should not be shown, so hide it
    } else {
        document.getElementById('separate_reservations_row').style.display = 'none';
    }
    
    // if this is the edit calendar event screen, then determine if we should show or hide initial spots
    // the initial spots field is always displayed on the create calendar event screen, so that is why we don't have to deal with it
    if (document.getElementById('number_of_remaining_spots_row')) {
        // if this is a recurring event and reservations is enabled and separate reservations is enabled and limit reservations is enabled,
        // then show initial spots field
        if (
            (document.getElementById('recurrence').checked == true)
            && (document.getElementById('reservations').checked == true)
            && (document.getElementById('separate_reservations').checked == true)
            && (document.getElementById('limit_reservations').checked == true)
        ) {
            document.getElementById('number_of_initial_spots_row').style.display = '';
         
        // else hide initial spots field
        } else {
            document.getElementById('number_of_initial_spots_row').style.display = 'none';
        }
    }
}

function change_calendar_event_recurrence_type()
{
    // Assume that recurrence month type row should be hidden until we find out otherwise.
    document.getElementById('recurrence_month_type_row').style.display = 'none';

    // If month is selected, then show month type row.
    if (document.getElementById('recurrence_type').options[document.getElementById('recurrence_type').selectedIndex].value == 'month') {
        document.getElementById('recurrence_month_type_row').style.display = '';
    }
}

function change_short_link_destination_type()
{
    // Hide all rows until we determine which need to be shown.
    document.getElementById('page_id_row').style.display = 'none';
    document.getElementById('catalog_page_id_row').style.display = 'none';
    document.getElementById('or_row').style.display = 'none';
    document.getElementById('catalog_detail_page_id_row').style.display = 'none';
    document.getElementById('product_group_id_row').style.display = 'none';
    document.getElementById('product_id_row').style.display = 'none';
    document.getElementById('url_row').style.display = 'none';
    document.getElementById('tracking_code_row').style.display = 'none';

    // Show certain rows based on which destination type was selected.
    switch (document.getElementById('destination_type').options[document.getElementById('destination_type').selectedIndex].value) {
        case 'page':
            document.getElementById('page_id_row').style.display = '';
            document.getElementById('tracking_code_row').style.display = '';
            break;

        case 'product_group':
            document.getElementById('catalog_page_id_row').style.display = '';
            document.getElementById('or_row').style.display = '';
            document.getElementById('catalog_detail_page_id_row').style.display = '';
            document.getElementById('product_group_id_row').style.display = '';
            document.getElementById('tracking_code_row').style.display = '';
            break;

        case 'product':
            document.getElementById('catalog_detail_page_id_row').style.display = '';
            document.getElementById('product_id_row').style.display = '';
            document.getElementById('tracking_code_row').style.display = '';
            break;

        case 'url':
            document.getElementById('url_row').style.display = '';
            break;
    }
}

function change_email_campaign_profile_action()
{
    // Hide all items until we determine which need to be shown.
    document.getElementById('calendar_event_id_row').style.display = 'none';
    document.getElementById('custom_form_page_id_row').style.display = 'none';
    document.getElementById('email_campaign_profile_id_row').style.display = 'none';

    // If product id row exists, then hide it
    // If commerce is disabled or user does not have access then row is not outputted.
    if (document.getElementById('product_id_row')) {
        document.getElementById('product_id_row').style.display = 'none';
    }
    
    document.getElementById('calendar_event_reserved_schedule_period_and_base').style.display = 'none';
    document.getElementById('standard_schedule_period_and_base').style.display = 'none';

    // Show certain rows based on which destination type was selected.
    switch (document.getElementById('action').options[document.getElementById('action').selectedIndex].value) {
        case 'calendar_event_reserved':
            document.getElementById('calendar_event_id_row').style.display = '';
            document.getElementById('calendar_event_reserved_schedule_period_and_base').style.display = '';
            break;

        case 'custom_form_submitted':
            document.getElementById('custom_form_page_id_row').style.display = '';
            document.getElementById('standard_schedule_period_and_base').style.display = '';
            break;

        case 'email_campaign_sent':
            document.getElementById('email_campaign_profile_id_row').style.display = '';
            document.getElementById('standard_schedule_period_and_base').style.display = '';
            break;

        case 'order_completed':
            document.getElementById('standard_schedule_period_and_base').style.display = '';
            break;

        case 'product_ordered':
            document.getElementById('product_id_row').style.display = '';
            document.getElementById('standard_schedule_period_and_base').style.display = '';
            break;

        default:
            document.getElementById('standard_schedule_period_and_base').style.display = '';
            break;
    }
}

function show_or_hide_email_campaign_profile_format()
{
    // start off by hiding all rows under the format field until we determine which should be shown
    document.getElementById('body_row').style.display = 'none';
    document.getElementById('page_id_row').style.display = 'none';
    document.getElementById('body_preview_row').style.display = 'none';

    // if the "plain text" option is selected, then show the body row
    if (document.getElementById('format_plain_text').checked == true) {
        document.getElementById('body_row').style.display = '';
    
    // else the "html" option is selected, so show page row and determine if body preview row should be shown
    } else {
        document.getElementById('page_id_row').style.display = '';

        change_email_campaign_profile_page_id();
    }
}

function change_email_campaign_profile_page_id()
{
    if (document.getElementById('page_id').options[document.getElementById('page_id').selectedIndex].firstChild) {
        document.getElementById('body_preview_iframe').src = path + 'pages/' + document.getElementById('page_id').options[document.getElementById('page_id').selectedIndex].firstChild.nodeValue + '?edit=no&email=true';
        document.getElementById('body_preview_row').style.display = '';
    } else {
        document.getElementById('body_preview_row').style.display = 'none';
    }
}

function createXMLHttpRequest() {
    if (window.XMLHttpRequest) {
        try {
            return new XMLHttpRequest();
        } catch(error) {
            return false;
        }
    } else if (window.ActiveXObject) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch(error) {
            return false;
        }
    }
}

function check_upload(file_path)
{
    // get file name
    if (file_path.indexOf('/') > -1) {
        var file_name = file_path.substring(file_path.lastIndexOf('/') + 1);
    } else {
        var file_name = file_path.substring(file_path.lastIndexOf('\\') + 1);
    }
    
    // get file extension
    var file_name_parts = file_name.split('.');
    var file_extension = file_name_parts[file_name_parts.length - 1];
    
    // if this upload form allows for zip file extraction and file is a zip file, then ask user if user wants to extract zip file
    if (document.form.extract && (file_extension == 'zip')) {
        if (confirm('Click "OK" to extract and upload all files within the ZIP file. Click "Cancel" to just upload the ZIP file itself.\n\nNOTE: Files will be extracted from all folders in the ZIP file.\n\nIf an extracted file\'s name already exists, then it will be given a new, unique name.') == true) {
            document.form.extract.value = 'true';
        }
    }
    
    // if the file is not being extracted, then check if file exists
    if (!document.form.extract || (document.form.extract.value != 'true')) {
        var requester = createXMLHttpRequest();

        requester.onreadystatechange =
            function ()
            {
                // if XMLHttpRequest communication is complete
                if (requester.readyState == 4) {
                    var temp = requester.responseXML.getElementsByTagName("response");
                    var response = temp[0].firstChild.nodeValue;
                    
                    if (response == 'upload') {
                        document.form.submit();
                        
                    } else if (response == 'overwrite') {
                        if (confirm('There is already a file named "' + file_name + '".  Would you like to replace the existing file?') == true) {
                            document.form.overwrite.value = 'true';
                            document.form.submit();
                        }
                        
                    } else if (response == 'access denied') {
                        alert('There is already a file named "' + file_name + '".  You do not have access to replace the file. Please rename the file on your computer and try again.');
                    }
                }
            };
        
        // if path is not defined then that means this function was called from a rich-text editor plugin (insert link, insert image),
        // so use a relative path. The rich-text editor plugins use standard html files so we can't set the path and software directory with PHP
        if (typeof path === 'undefined') {
            var software_directory_path = '../../../';
            
        // else path is defined so use it to set absolute software directory path
        } else {
            var software_directory_path = path + software_directory + '/';
        }
        
        requester.open("GET", software_directory_path + "check_if_file_exists.php?file_name=" + encodeURIComponent(file_name));
        requester.send(null);
        
        return false;
        
    // else the file is being extracted
    } else {
        return true;
    }
}

// this function handles an upload on the add theme script
function check_theme_upload()
{
    var file_path = '';
    
    // if this is a custom theme, then get the file path directly from the field
    if (document.getElementById('file_upload_field').value == 'custom_css_file') {
        file_path = document.getElementById('custom_css_file').value;
    
    // else if the file upload field is the system import field, then get the file path and change the file extension
    } else if (document.getElementById('file_upload_field').value == 'system_theme_csv_file') {
        file_path = document.getElementById('system_theme_csv_file').value;
        file_path = file_path.substr(0, file_path.lastIndexOf('.')) + '.css';
    }
    
    // get file name
    if (file_path.indexOf('/') > -1) {
        var file_name = file_path.substring(file_path.lastIndexOf('/') + 1);
    } else {
        var file_name = file_path.substring(file_path.lastIndexOf('\\') + 1);
    }
    
    // get file extension
    var file_name_parts = file_name.split('.');
    var file_extension = file_name_parts[file_name_parts.length - 1];
    
    var requester = createXMLHttpRequest();

    requester.onreadystatechange =
        function ()
        {
            // if XMLHttpRequest communication is complete
            if (requester.readyState == 4) {
                var temp = requester.responseXML.getElementsByTagName("response");
                var response = temp[0].firstChild.nodeValue;
                
                if (response == 'upload') {
                    document.form.submit();
                    
                } else if (response == 'overwrite') {
                    if (confirm('There is already a file named "' + file_name + '".  Would you like to replace the existing file?') == true) {
                        document.form.overwrite.value = 'true';
                        document.form.submit();
                    }
                    
                } else if (response == 'access denied') {
                    alert('There is already a file named "' + file_name + '".  You do not have access to replace the file. Please rename the file on your computer and try again.');
                }
            }
        };

    requester.open("GET", path + software_directory + "/check_if_file_exists.php?file_name=" + encodeURIComponent(file_name));
    requester.send(null);
    
    return false;
}

function export_forms()
{
    if (document.getElementById('custom_form')) {
        if (document.getElementById('custom_form').value != '[All]') {
            return true;
        } else {
            alert('You may only export forms from one custom form at a time. Please select only one custom form in the filters and try again.');
            return false;
        }
        
    } else {
        var number_of_selected_custom_forms = 0;

        for (var i = 0; i < document.forms.length; i++) {
            for (var j = 0; j < document.forms[i].length; j++) {
                if ((document.forms[i].elements[j].name == 'custom_forms[]') && (document.forms[i].elements[j].checked == true)) {
                    number_of_selected_custom_forms++;
                }
            }
        }
        
        if (number_of_selected_custom_forms == 1) {
            return true;
            
        } else if (number_of_selected_custom_forms == 0) {
            alert('Please select a custom form in the advanced filters.');
            return false;
            
        } else {
            alert('You may only export forms from one custom form at a time. Please select only one custom form in the advanced filters and try again.');
            return false;
        }
    }
}

function change_user_role(user_role)
{
    // if user role was selected, then show certain access fields
    if (user_role == 3) {
        if (document.getElementById('manage_ecommerce_heading_row')) {
            document.getElementById('manage_ecommerce_heading_row').style.display = '';
            document.getElementById('manage_ecommerce_row').style.display = '';
        }
        
        if (document.getElementById('manage_calendars_heading_row')) {
            document.getElementById('manage_calendars_heading_row').style.display = '';
            document.getElementById('manage_calendars_row').style.display = '';
        }
        
        document.getElementById('manage_visitors_heading_row').style.display = '';
        document.getElementById('manage_visitors_row').style.display = '';
        document.getElementById('edit_access_heading_row').style.display = '';
        document.getElementById('edit_access_row').style.display = '';
        document.getElementById('shared_content_access_rights_heading_row').style.display = '';
        document.getElementById('common_regions_access_row').style.display = '';
        document.getElementById('menus_access_row').style.display = '';
        show_or_hide_calendar_access();
        document.getElementById('manage_contacts_and_manage_emails_heading_row').style.display = '';
        document.getElementById('manage_contacts_and_manage_emails_row').style.display = '';
        show_or_hide_contact_group_access();
        show_or_hide_ecommerce_access();
        document.getElementById('manage_ad_regions_heading_row').style.display = '';
        document.getElementById('manage_ad_regions_row').style.display = '';
        document.getElementById('view_access_heading_row').style.display = '';
        document.getElementById('view_access_row').style.display = '';
        
    // else administrator, designer, or manager role was selected, so hide certain access fields
    } else {
        if (document.getElementById('manage_ecommerce_heading_row')) {
            document.getElementById('manage_ecommerce_heading_row').style.display = 'none';
            document.getElementById('manage_ecommerce_row').style.display = 'none';
        }
        
        if (document.getElementById('manage_calendars_heading_row')) {
            document.getElementById('manage_calendars_heading_row').style.display = 'none';
            document.getElementById('manage_calendars_row').style.display = 'none';
        }

        document.getElementById('manage_visitors_heading_row').style.display = 'none';
        document.getElementById('manage_visitors_row').style.display = 'none';
        document.getElementById('edit_access_heading_row').style.display = 'none';
        document.getElementById('edit_access_row').style.display = 'none';
        document.getElementById('shared_content_access_rights_heading_row').style.display = 'none';
        document.getElementById('common_regions_access_row').style.display = 'none';
        document.getElementById('menus_access_row').style.display = 'none';
        document.getElementById('calendar_access').style.display = 'none';
        document.getElementById('manage_contacts_and_manage_emails_heading_row').style.display = 'none';
        document.getElementById('manage_contacts_and_manage_emails_row').style.display = 'none';
        document.getElementById('manage_ad_regions_heading_row').style.display = 'none';
        document.getElementById('manage_ad_regions_row').style.display = 'none';
        document.getElementById('view_access_heading_row').style.display = 'none';
        document.getElementById('view_access_row').style.display = 'none';
    }
}



function getOffsetTop(element)
{
    el = document.getElementById(element);
    xPos = el.offsetTop;
    tempEl = el.offsetParent;
    while (tempEl != null) {
        xPos += tempEl.offsetTop;
        tempEl = tempEl.offsetParent;
    }
    return xPos;
}

function getOffsetLeft(element)
{
    el = document.getElementById(element);
    xPos = el.offsetLeft;
    tempEl = el.offsetParent;
    while (tempEl != null) {
        xPos += tempEl.offsetLeft;
        tempEl = tempEl.offsetParent;
    }
    return xPos;
}

function init_folder_tree()
{
    update_folder_tree(0);
}

function update_folder_tree(folder_id, expand_all)
{
    var expanded_folders_cookie = get_cookie_value('software[view_folders][expanded_folders]');
    expanded_folders = new Array();
    
    if (expanded_folders_cookie) {
        expanded_folders = expanded_folders_cookie.split(',');
    }
    
    // if folder is collapsed, expand folder
    if ((document.getElementById('ul_' + folder_id).style.display == 'none') || (expand_all == true)) {
        expanded_folders[expanded_folders.length] = folder_id;
        
        document.getElementById('ul_' + folder_id).innerHTML = '<li class="loading"><img src="images/loading.gif" width="16" height="16" border="0" alt="" />&nbsp;&nbsp;Loading...</li>';
        document.getElementById('ul_' + folder_id).style.display = 'block';
        
        var requester = createXMLHttpRequest();
        
        requester.onreadystatechange =
            function ()
            {
                // if XMLHttpRequest communication is complete
                if (requester.readyState == 4) {
                    var temp = requester.responseXML.getElementsByTagName("root");
                    var root = temp[0];
                    
                    document.getElementById('ul_' + folder_id).innerHTML = get_folder_content(root, expand_all);
                    
                    if (document.getElementById('image_' + folder_id)) {
                        document.getElementById('image_' + folder_id).src = 'images/icon_folder_expanded.gif';
                    }
                    
                    save_expanded_folders_cookie();
                }
            };

        if (expand_all == true) {
            expand_all_value = 'true';
        } else {
            expand_all_value = 'false';
        }

        requester.open("GET", "get_folder_tree.php?folder_id=" + folder_id + "&expand_all=" + expand_all_value);
        requester.send(null);
    
    // else folder is not expanded, so collapse folder
    } else {
        // remove items in this folder
        document.getElementById('ul_' + folder_id).innerHTML = '';
        
        // collapse folder
        document.getElementById('ul_' + folder_id).style.display = 'none';
        
        // change status image to plus icon
        if (document.getElementById('image_' + folder_id)) {
            document.getElementById('image_' + folder_id).src = 'images/icon_folder_collapsed.gif';
        }
        
        // loop through all expanded folders, so we can remove collapsed folder
        for (var i = 0; i < expanded_folders.length; i++) {
            // if this folder is the collapsed folder, remove folder from array
            if (expanded_folders[i] == folder_id) {
                expanded_folders.splice(i, 1);
            }
        }
        
        save_expanded_folders_cookie();
    }
    
    function get_folder_content(parent, expand_all)
    {
        var content = '';
        
        for (var i = 0; i < parent.childNodes.length; i++) {
            switch (parent.childNodes[i].tagName) {
                case 'folder':
                    var archived = '';
                    
                    for (var j = 0; j < parent.childNodes[i].childNodes.length; j++) {
                        if (parent.childNodes[i].childNodes[j].tagName == 'id') {
                            id = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'name') {
                            name = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'style') {
                            if (parent.childNodes[i].childNodes[j].firstChild) {
                                style = " || Page Style: " + parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                            }
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'access_control_type') {
                            access_control_type = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'archived') {
                            archived = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                    }
                    
                    // Get user friendly access control type names
                    access_control_type_name = get_access_control_name (access_control_type)
                        
                    // if folder should be expanded
                    if ((expand_all == true) || (in_array(id, expanded_folders) == true) || (id == 1)) {
                        expanded_collapsed_icon = '<img id="image_' + id + '" src="images/icon_folder_expanded.gif" width="25" height="25" border="0" class="icon_folder" alt="" />';
                        display = 'block';
                        expanded_folders[expanded_folders.length] = id;
                    } else {
                        expanded_collapsed_icon = '<img id="image_' + id + '" src="images/icon_folder_collapsed.gif" width="25" height="25" border="0" class="icon_folder" alt="" />';
                        display = 'none';
                    }
                    
                    var last_class;
                    
                    // if this is the last li in this ul
                    if (i == (parent.childNodes.length - 1)) {
                        last_class = ' last';
                    } else {
                        last_class = '';
                    }
                    
                    var archived_class = '';
                    
                    // if archived is true, then output the archived styling
                    if (archived == 'true') {
                        archived_class = ' archived';
                    }
                    
                    content += '<li class="' + access_control_type + last_class + ' heading"><span onclick="update_folder_tree(' + id + ')" onmouseover="this.className=\'highlight\'" onmouseout="this.className=\'\'">' + expanded_collapsed_icon + '</span><span onmouseover="this.className=\'highlight\'" onmouseout="this.className=\'\'"><span id="folder_' + id + '" class="object' + archived_class + '" onmouseover="document.getElementById(\'folder_properties_' + id + '\').style.visibility = \'visible\';" onmouseout="document.getElementById(\'folder_properties_' + id + '\').style.visibility = \'hidden\';"><span onclick="window.location.href=\'edit_folder.php?id=' + id + '\'"><span class="folder">' + prepare_content_for_html(name) + '</span><span id="folder_properties_' + id + '" style="visibility: hidden"> || Access Control: ' + access_control_type_name + style + '</span></span></span></span><ul id="ul_' + id + '" style="display: ' + display + '">';
                    content += get_folder_content(parent.childNodes[i], expand_all);
                    content += '</ul></li>';
                    break;
                    
                case 'page':
                    var archived = '';
                    
                    for (var j = 0; j < parent.childNodes[i].childNodes.length; j++) {
                        if (parent.childNodes[i].childNodes[j].tagName == 'id') {
                            id = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'name') {
                            name = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'style') {
                            if (parent.childNodes[i].childNodes[j].firstChild && (parent.childNodes[i].childNodes[j].firstChild.nodeValue != '&nbsp;')) {
                                style = " || Page Style Override: " + parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                            } else {
                                style = '';
                            }
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'home') {
                            home = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'type') {
                            if (parent.childNodes[i].childNodes[j].firstChild) {
                                type = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                            } else {
                                type = '';
                            }
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'archived') {
                            archived = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                    }
                    
                    if (home == 'true') {
                        page_icon = '<img src="images/icon_home_page.gif" width="16" height="14" border="0" align="absbottom" class="icon_home_page" alt="" />';
                    } else {
                        page_icon = '<img src="images/icon_page.gif" width="12" height="14" border="0" align="absbottom" class="icon_page" alt="" />';
                    }
                    
                    var last_class;
                    
                    // if this is the last li in this ul
                    if (i == (parent.childNodes.length - 1)) {
                        last_class = ' class="last"';
                    } else {
                        last_class = '';
                    }
                    
                    var query_string_from = '';
                    
                    // if page type is a certain page type, then prepare from
                    switch(type) {
                        case 'view order':
                        case 'custom form':
                        case 'custom form confirmation':
                        case 'form item view':
                        case 'calendar event view':
                        case 'catalog detail':
                        case 'shipping address and arrival':
                        case 'shipping method':
                        case 'logout':
                            query_string_from = '?from=control_panel';
                            break;
                    }
                    
                    var archived_class = '';
                    
                    // if archived is true, then output the italic styling
                    if (archived == 'true') {
                        archived_class = ' archived';
                    }
                    
                    content += '<li' + last_class + '><span onclick="window.location.href=\'' + prepare_content_for_html(path) + 'pages/' + name + query_string_from + '\'" onmouseover="this.className=\'highlight\'" onmouseout="this.className=\'\'"><span id="page_' + id + '" class="object' + archived_class + '" onmouseover="document.getElementById(\'page_properties_' + id + '\').style.visibility = \'visible\';" onmouseout="document.getElementById(\'page_properties_' + id + '\').style.visibility = \'hidden\';">' + page_icon + '<span class="file">' + prepare_content_for_html(name) + '</span><span id="page_properties_' + id + '" style="visibility: hidden"> ' + style + '</span></span></span></li>';
                    break;
                    
                case 'file':
                    var design = '';
                    var access = '';
                    var archived = '';
                    
                    for (var j = 0; j < parent.childNodes[i].childNodes.length; j++) {
                        if (parent.childNodes[i].childNodes[j].tagName == 'id') {
                            id = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'name') {
                            name = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }

                        if (parent.childNodes[i].childNodes[j].tagName == 'design') {
                            design = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }

                        if (parent.childNodes[i].childNodes[j].tagName == 'access') {
                            access = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'archived') {
                            archived = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                    }

                    var link = '';

                    // if the user has access to this file (i.e. not a design file or user is a designer or administrator),
                    // then output link
                    if (access == 'true') {
                        link = ' onclick="window.location.href=\'edit_file.php?id=' + id + '\'" onmouseover="this.className=\'highlight\'" onmouseout="this.className=\'\'"';
                    }
                    
                    var last_class;
                    
                    // if this is the last li in this ul
                    if (i == (parent.childNodes.length - 1)) {
                        last_class = ' class="last"';
                    } else {
                        last_class = '';
                    }

                    var design_class = '';
                    
                    // if file is a design file then output design class for lighter color
                    if (design == 'true') {
                        design_class = ' design';
                    }
                    
                    var archived_class = '';
                    
                    // if archived is true, then output the italic styling
                    if (archived == 'true') {
                        archived_class = ' archived';
                    }
                    
                    content += '<li' + last_class + '><span' + link + '><span id="file_' + id + '" class="object' + design_class + archived_class + '"><img src="images/icon_file.gif" width="12" height="14" border="0" align="absbottom" class="icon_file" alt="" /><span class="no_style">' + prepare_content_for_html(name) + '</span></span></span></li>';
                    break;
            }
        }
        
        return content;
    }
}

function init_product_group_tree()
{
    update_product_group_tree(0);
}

function update_product_group_tree(product_group_id, expand_all)
{
    var expanded_product_groups_cookie = get_cookie_value('software[product_group_tree][expanded_product_groups]');
    expanded_product_groups = new Array();
    
    if (expanded_product_groups_cookie) {
        expanded_product_groups = expanded_product_groups_cookie.split(',');
    }
    
    // if product_group is collapsed, expand product_group
    if ((document.getElementById('ul_' + product_group_id).style.display == 'none') || (expand_all == true)) {
        expanded_product_groups[expanded_product_groups.length] = product_group_id;
        
        document.getElementById('ul_' + product_group_id).innerHTML = '<li class="loading"><img src="images/loading.gif" width="16" height="16" border="0" alt="" />&nbsp;&nbsp;Loading...</li>';
        document.getElementById('ul_' + product_group_id).style.display = 'block';
        
        var requester = createXMLHttpRequest();
        
        requester.onreadystatechange =
            function ()
            {
                // if XMLHttpRequest communication is complete
                if (requester.readyState == 4) {
                    var temp = requester.responseXML.getElementsByTagName("root");
                    var root = temp[0];
                    
                    document.getElementById('ul_' + product_group_id).innerHTML = get_product_group_content(root, expand_all);
                    
                    if (document.getElementById('image_' + product_group_id)) {
                        document.getElementById('image_' + product_group_id).src = 'images/icon_product_group_expanded.gif';
                    }
                    
                    save_expanded_product_groups_cookie();
                }
            };

        if (expand_all == true) {
            expand_all_value = 'true';
        } else {
            expand_all_value = 'false';
        }

        requester.open("GET", "get_product_group_tree.php?product_group_id=" + product_group_id + "&expand_all=" + expand_all_value);
        requester.send(null);
    
    // else product_group is expanded, so collapse product_group
    } else {
        // remove items in this product_group
        document.getElementById('ul_' + product_group_id).innerHTML = '';
        
        // collapse product_group
        document.getElementById('ul_' + product_group_id).style.display = 'none';
        
        // change status image to plus icon
        if (document.getElementById('image_' + product_group_id)) {
            document.getElementById('image_' + product_group_id).src = 'images/icon_product_group_collapsed.gif';
        }
        
        // loop through all expanded product_groups, so we can remove collapsed product_group
        for (var i = 0; i < expanded_product_groups.length; i++) {
            // if this product_group is the collapsed product_group, remove product_group from array
            if (expanded_product_groups[i] == product_group_id) {
                expanded_product_groups.splice(i, 1);
            }
        }
        
        save_expanded_product_groups_cookie();
    }
    
    function get_product_group_content(parent, expand_all)
    {
        var content = '';
        
        for (var i = 0; i < parent.childNodes.length; i++) {
            switch (parent.childNodes[i].tagName) {
                case 'product_group':
                    for (var j = 0; j < parent.childNodes[i].childNodes.length; j++) {
                        if (parent.childNodes[i].childNodes[j].tagName == 'id') {
                            id = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'name') {
                            name = '';
                            
                            // if there is a name, then set name
                            if (parent.childNodes[i].childNodes[j].firstChild) {
                                name = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                            }
                        }
                    }
                    
                    // if product_group should be expanded
                    if ((expand_all == true) || (in_array(id, expanded_product_groups) == true) || (id == 1)) {
                        expanded_collapsed_icon = '<img id="image_' + id + '" src="images/icon_product_group_expanded.gif" width="35" height="35" border="0" alt="" class="icon_product_group" />';
                        display = 'block';
                        expanded_product_groups[expanded_product_groups.length] = id;
                    } else {
                        expanded_collapsed_icon = '<img id="image_' + id + '" src="images/icon_product_group_collapsed.gif" width="35" height="35" border="0" alt="" class="icon_product_group" />';
                        display = 'none';
                    }
                    
                    var last_class;
                    
                    // if this is the last li in this ul
                    if (i == (parent.childNodes.length - 1)) {
                        last_class = ' last';
                    } else {
                        last_class = '';
                    }
                    
                    content += '<li class="' + last_class + '"><span onclick="update_product_group_tree(' + id + ')" onmouseover="this.className=\'highlight\'" onmouseout="this.className=\'\'">' + expanded_collapsed_icon +'</span><span onmouseover="this.className=\'highlight\'" onmouseout="this.className=\'\'"><span id="product_group_' + id + '" class="object" onmouseover="document.getElementById(\'product_group_properties_' + id + '\').style.visibility = \'visible\';" onmouseout="document.getElementById(\'product_group_properties_' + id + '\').style.visibility = \'hidden\';"><span onclick="window.location.href=\'edit_product_group.php?id=' + id + '\'"><span class="product_group">' + prepare_content_for_html(name) + '</span></span></span></span><ul id="ul_' + id + '" style="display: ' + display + '">';
                    content += get_product_group_content(parent.childNodes[i], expand_all);
                    content += '</ul></li>';
                    break;
                    
                case 'product':
                    for (var j = 0; j < parent.childNodes[i].childNodes.length; j++) {
                        if (parent.childNodes[i].childNodes[j].tagName == 'id') {
                            id = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'parent_id') {
                            parent_id = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'name') {
                            name = '';
                            
                            // if there is a name, then set name
                            if (parent.childNodes[i].childNodes[j].firstChild) {
                                name = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                            }
                        }

                        if (parent.childNodes[i].childNodes[j].tagName == 'enabled') {
                            enabled = '';
                            
                            // If there is an enabled value, then set it.
                            if (parent.childNodes[i].childNodes[j].firstChild) {
                                enabled = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                            }
                        }
                        
                        if (parent.childNodes[i].childNodes[j].tagName == 'short_description') {
                            short_description = '';
                            
                            // if there is a short description, then set short description
                            if (parent.childNodes[i].childNodes[j].firstChild) {
                                short_description = parent.childNodes[i].childNodes[j].firstChild.nodeValue;
                            }
                        }
                    }

                    var product_enabled_or_disabled_class;

                    if (enabled == '1') {
                        product_enabled_or_disabled_class = ' product_enabled';
                    } else {
                        product_enabled_or_disabled_class = ' product_disabled';
                    }
                    
                    var last_class;
                    
                    // if this is the last li in this ul
                    if (i == (parent.childNodes.length - 1)) {
                        last_class = ' last';
                    } else {
                        last_class = '';
                    }
                    
                    content += '<li class="' + product_enabled_or_disabled_class + last_class + '"><span onclick="window.location.href=\'edit_product.php?id=' + id + '&send_to=' + encodeURIComponent(path + software_directory + '/') + 'view_product_groups.php\'" onmouseover="this.className=\'highlight\'" onmouseout="this.className=\'\'"><span id="product_' + id + '" class="object" onmouseover="document.getElementById(\'product_properties_' + id + '\').style.visibility = \'visible\';" onmouseout="document.getElementById(\'product_properties_' + id + '\').style.visibility = \'hidden\';"><img width="25" height="25" border="0" align="absbottom" alt="" class="icon_product" src="images/icon_product.gif"/> ' + prepare_content_for_html(name) + ' - ' + prepare_content_for_html(short_description) + '</span></span></li>';
                    break;
            }
        }
        
        return content;
    }
}

// Create user friendly access control names.
function get_access_control_name(access_control_type) {
    switch (access_control_type) {
        case 'public':
            return 'Public';
            break;
            
        case 'guest':
            return 'Guest';
            break;
        
        case 'private':
            return 'Private';
            break;
        
        case 'registration':
            return 'Registration';
            break;
        
        case 'membership':
            return 'Membership';
            break;
    }
}

function collapse_folder_tree()
{
    alluls = document.getElementsByTagName('UL');
    for (i = 0; i < alluls.length; i++) {
        ul = alluls[i];
        if (ul.parentNode.tagName == 'LI') {
            id = ul.id.substr(3);

            image_id = 'image_' + id;
            image = document.getElementById(image_id);

            ul.style.display = 'none';
            image.src = 'images/icon_folder_collapsed.gif';
        }
    }

    expanded_folders = new Array();

    // set cookie to remember that this folder is collapsed
    document.cookie = "software[view_folders][expanded_folders]=0; expires=Tue, 01 Jan 2030 06:00:00 GMT";
}

function collapse_product_group_tree()
{
    alluls = document.getElementsByTagName('UL');
    for (i = 0; i < alluls.length; i++) {
        ul = alluls[i];
        if (ul.parentNode.tagName == 'LI') {
            id = ul.id.substr(3);

            image_id = 'image_' + id;
            image = document.getElementById(image_id);

            ul.style.display = 'none';
            image.src = 'images/icon_product_group_collapsed.gif';
        }
    }

    expanded_product_groups = new Array();

    // set cookie to remember that this product_group is collapsed
    document.cookie = "software[product_group_tree][expanded_product_groups]=0; expires=Tue, 01 Jan 2030 06:00:00 GMT";
}

function get_cookie_value(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function in_array(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return true;
        }
    }
    
    return false;
}

function save_expanded_folders_cookie()
{
    // sort expanded folders
    expanded_folders.sort();
    
    var expanded_folders_cookie = '';
    
    // loop through all expanded folders
    for (var i = 0; i < expanded_folders.length; i++) {
        // if this folder is not a duplicate then add to cookie value
        if (expanded_folders[i] != expanded_folders[i - 1]) {
            expanded_folders_cookie += expanded_folders[i] + ',';
        }
    }
        
    // remove last comma
    expanded_folders_cookie = expanded_folders_cookie.substring(0, expanded_folders_cookie.length - 1);
    
    // save cookie
    document.cookie = "software[view_folders][expanded_folders]=" + expanded_folders_cookie + "; expires=Tue, 01 Jan 2030 06:00:00 GMT";
}

function save_expanded_product_groups_cookie()
{
    // sort expanded product_groups
    expanded_product_groups.sort();
    
    var expanded_product_groups_cookie = '';
    
    // loop through all expanded product_groups
    for (var i = 0; i < expanded_product_groups.length; i++) {
        // if this product_group is not a duplicate then add to cookie value
        if (expanded_product_groups[i] != expanded_product_groups[i - 1]) {
            expanded_product_groups_cookie += expanded_product_groups[i] + ',';
        }
    }
        
    // remove last comma
    expanded_product_groups_cookie = expanded_product_groups_cookie.substring(0, expanded_product_groups_cookie.length - 1);
    
    // save cookie
    document.cookie = "software[product_group_tree][expanded_product_groups]=" + expanded_product_groups_cookie + "; expires=Tue, 01 Jan 2030 06:00:00 GMT";
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

function show_or_hide_search()
{
    if (document.getElementById('search').checked == true) {
        document.getElementById('search_keywords').style.display = '';
    } else {
        document.getElementById('search_keywords').style.display = 'none';
    }
}

function show_or_hide_form_item_view_editor()
{
    if (document.getElementById('form_item_view_submitted_form_editable_by_registered_user').checked == true) {
        document.getElementById('form_item_view_submitted_form_editable_by_submitter_row').style.display = 'none';
    } else {
        document.getElementById('form_item_view_submitted_form_editable_by_submitter_row').style.display = '';
    }
}

function show_or_hide_form_view_directory_form_list_view(id)
{
    if (document.getElementById('form_view_directory_form_list_view_' + id).checked == true) {
        document.getElementById('form_view_directory_form_list_view_' + id + '_name_container').style.display = '';
        document.getElementById('form_view_directory_form_list_view_' + id + '_subject_form_field_id_container').style.display = '';
    } else {
        document.getElementById('form_view_directory_form_list_view_' + id + '_name_container').style.display = 'none';
        document.getElementById('form_view_directory_form_list_view_' + id + '_subject_form_field_id_container').style.display = 'none';
    }
}

function show_or_hide_form_view_directory_summary()
{
    if (document.getElementById('form_view_directory_summary').checked == true) {
        document.getElementById('form_view_directory_summary_days_row').style.display = '';
        document.getElementById('form_view_directory_summary_maximum_number_of_results_row').style.display = '';
    } else {
        document.getElementById('form_view_directory_summary_days_row').style.display = 'none';
        document.getElementById('form_view_directory_summary_maximum_number_of_results_row').style.display = 'none';
    }
}

function show_or_hide_effect(option)
{
    if (option == "Pop-up") {
        document.getElementById('popup_properties_heading_row').style.display = '';
        document.getElementById('first_level_popup_position_row').style.display = '';
        document.getElementById('second_level_popup_position_row').style.display = '';
    } else {
        document.getElementById('popup_properties_heading_row').style.display = 'none';
        document.getElementById('first_level_popup_position_row').style.display = 'none';
        document.getElementById('second_level_popup_position_row').style.display = 'none';
    }
}

function show_or_hide_display_type(option)
{
    // if the clicked option is static, then hide dynamic rows
    if (option == 'static') {
        document.getElementById('transition_type_row').style.display = 'none';
        document.getElementById('transition_duration_row').style.display = 'none';
        document.getElementById('slideshow_row').style.display = 'none';
        document.getElementById('slideshow_interval_row').style.display = 'none';
        document.getElementById('slideshow_continuous_row').style.display = 'none';
    
    // else if the option is dynamic, then show dynamic rows
    } else if (option == 'dynamic') {
        document.getElementById('transition_type_row').style.display = '';
        document.getElementById('transition_duration_row').style.display = '';
        document.getElementById('slideshow_row').style.display = '';
        show_or_hide_slideshow();
    }
}

function show_or_hide_slideshow()
{
    // if slideshow is checked, then show slideshow rows
    if (document.getElementById('slideshow').checked == true) {
        document.getElementById('slideshow_interval_row').style.display = '';
        document.getElementById('slideshow_continuous_row').style.display = '';
        
    // else slideshow is not checked, so hide slideshow rows
    } else {
        document.getElementById('slideshow_interval_row').style.display = 'none';
        document.getElementById('slideshow_continuous_row').style.display = 'none';
    }
}

function show_or_hide_product_group_display_type(option)
{
    // if the clicked option is browse, then hide select rows
    if (option == 'browse') {
        document.getElementById('details_row').style.display = 'none';
        document.getElementById('keywords_row').style.display = 'none';
    
    // else the option is select, so show select rows
    } else {
        document.getElementById('details_row').style.display = '';
        document.getElementById('keywords_row').style.display = '';
    }
}

function change_order_by(number)
{
    var order_by = document.getElementById('order_by_' + number).options[document.getElementById('order_by_' + number).selectedIndex].value;
    
    // if order by is blank or random, then hide ascending/descending pick list
    if ((order_by == '') || (order_by == 'random')) {
        document.getElementById('order_by_' + number + '_type').style.display = 'none';
        
    // else order by is not blank or random, so show ascending/descending pick list
    } else {
        document.getElementById('order_by_' + number + '_type').style.display = 'inline';
    }
}

// loop through all filters in order to create rows for filters
function initialize_filters()
{
    for (var i = 0; i < filters.length; i++) {
        create_filter(filters[i]);
    }
}

// create row for filter
function create_filter(properties)
{
    // if no properties were passed, then set blank values
    if (!properties) {
        var properties = new Array();
        properties['field'] = '';
        properties['operator'] = '';
        properties['value'] = '';
        properties['dynamic_value'] = '';
        properties['dynamic_value_attribute'] = '';
    }
    
    // get filter number by adding one to the current number of filters
    var filter_number = last_filter_number + 1;
    
    var tbody = document.getElementById('filter_table').getElementsByTagName('tbody')[0]; 
    var tr = document.createElement('tr');
    
    // prepare content for field cell
    var field_cell_html =
        '<select id="filter_' + filter_number + '_field" name="filter_' + filter_number + '_field" onchange="update_value_cell(' + filter_number + '); update_dynamic_value(' + filter_number + ')">\n\
            <option value=""></option>';
    
    // loop through all field options in order to prepare field options for pick list
    for (var i = 0; i < field_options.length; i++) {
        // if the option is a starting optgroup, then prepare starting optgroup
        if (field_options[i]['value'] == '<optgroup>') {
            field_cell_html += '<optgroup label="' + prepare_content_for_html(field_options[i]['name']) + '">';
            
        // else if option is an ending optgroup, then prepare ending optgroup
        } else if (field_options[i]['value'] == '</optgroup>') {
            field_cell_html += '</optgroup>';
            
        // else option is a standard option, so prepare standard option
        } else {
            var status = '';
            
            // if this option should be selected by default, then select option by default
            if (properties['field'] == field_options[i]['value']) {
                status = ' selected="selected"';
            }
            
            field_cell_html += '<option value="' + field_options[i]['value'] + '"' + status + '>' + prepare_content_for_html(field_options[i]['name']) + '</option>';
        }
    }
    
    field_cell_html += '</select>';
    
    // insert content into field cell
    var td_1 = document.createElement('td');
    td_1.innerHTML = field_cell_html;
    
    // prepare content for operator cell
    var operator_cell_html = '<select name="filter_' + filter_number + '_operator">';
    
    // create array for operator options
    var operators = new Array(
        '',
        'contains',
        'does not contain',
        'is equal to',
        'is not equal to',
        'is less than',
        'is less than or equal to',
        'is greater than',
        'is greater than or equal to');
    
    // loop through all operators in order to prepare options
    for (var i = 0; i < operators.length; i++) {
        var status = '';
        
        // if this operator should be selected by default, then select operator by default
        if (properties['operator'] == operators[i]) {
            status = ' selected="selected"';
        }
        
        operator_cell_html += '<option value="' + operators[i] + '"' + status + '>' + operators[i] + '</option>';
    }
    
    operator_cell_html += '</select>';
    
    // insert content into operator cell
    var td_2 = document.createElement('td');
    td_2.innerHTML = operator_cell_html;
    
    var td_3 = document.createElement('td');
    td_3.id = 'filter_' + filter_number + '_value_cell';
    
    // prepare content for dynamic value cell
    var dynamic_value_cell_html =
        '<input id="filter_' + filter_number + '_dynamic_value_attribute" name="filter_' + filter_number + '_dynamic_value_attribute" type="text" value="' + prepare_content_for_html(properties['dynamic_value_attribute']) + '" size="2" maxlength="10" style="display: none" />\n\
        <select id="filter_' + filter_number + '_dynamic_value" name="filter_' + filter_number + '_dynamic_value" style="display: none" onchange="update_dynamic_value_attribute(' + filter_number + '); clear_value(' + filter_number + ')"></select>';
    
    // insert content into dynamic value cell
    var td_4 = document.createElement('td');
    td_4.innerHTML = dynamic_value_cell_html;
    
    // prepare content for delete cell
    var delete_cell_html = '<a href="javascript:void(0)" onclick="delete_filter(this.parentNode.parentNode)" class="button">Delete</a>';
    
    var td_5 = document.createElement('td');
    td_5.innerHTML = delete_cell_html;
    
    tr.appendChild(td_1);
    tr.appendChild(td_2);
    tr.appendChild(td_3);
    tr.appendChild(td_4);
    tr.appendChild(td_5);
    
    tbody.appendChild(tr);
    
    update_value_cell(filter_number, properties['value']); 
    update_dynamic_value(filter_number, properties['dynamic_value'], properties['dynamic_value_attribute']);
    
    // update number of filters
    last_filter_number++;
    document.getElementById('last_filter_number').value = last_filter_number;
    
}

function delete_filter(tr)
{
    tbody = tr.parentNode;
    tbody.removeChild(tr);
}

function update_value_cell(filter_number, value)
{
    // if value is not defined, then set value to empty string
    if (!value) {
        value = '';
    }
    
    // get field value for filter
    var field_value = document.getElementById('filter_' + filter_number + '_field').value;
    
    // loop through field options in order to determine if there are value options for field
    
    for (var i = 0; i < field_options.length; i++) {
        // if the option is the currently selected option, then prepare value cell HTML
        if (field_options[i]['value'] == field_value) {
            var value_cell_html = '';
            
            // if there are value options for the field, then create HTML for pick list of value options
            if (field_options[i]['value_options']) {
                value_cell_html =
                    '<select id="filter_' + filter_number + '_value" name="filter_' + filter_number + '_value">\n\
                        <option value=""></option>';
                
                // loop through all value options in order to prepare values options for pick list
                for (var j = 0; j < field_options[i]['value_options'].length; j++) {
                    var status = '';
                    
                    // if this option should be selected by default, then select option by default
                    if (value == field_options[i]['value_options'][j]['value']) {
                        status = ' selected="selected"';
                    }
                    
                    value_cell_html += '<option value="' + field_options[i]['value_options'][j]['value'] + '"' + status + '>' + prepare_content_for_html(field_options[i]['value_options'][j]['name']) + '</option>';
                }
                
                value_cell_html += '</select>';
                
            // else there are not value options for the field, so create HTML for value text box
            } else {
                value_cell_html = '<input id="filter_' + filter_number + '_value" name="filter_' + filter_number + '_value" type="text" value="' + prepare_content_for_html(value) + '" maxlength="255" />';
            }
            
            // update value cell with HTML
            document.getElementById('filter_' + filter_number + '_value_cell').innerHTML = value_cell_html;
            
            break;
        }
    }
}

function update_dynamic_value(filter_number, dynamic_value, dynamic_value_attribute)
{
    // get field value for filter
    field_value = document.getElementById('filter_' + filter_number + '_field').value;
    
    // get field type
    var field_type = '';
    
    // loop through all field options in order to find type
    for (var i = 0; i < field_options.length; i++) {
        // if this field option is the selected field option, then set type
        if (field_options[i]['value'] == field_value) {
            field_type = field_options[i]['type'];
            break;
        }
    }
    
    // create array for dynamic value options
    var dynamic_value_options = new Array();
    
    dynamic_value_options[0] = new Array();
    dynamic_value_options[0]['name'] = '';
    dynamic_value_options[0]['value'] = '';
    
    // if field type is date then add options for date
    if (field_type == 'date') {
        var index = dynamic_value_options.length;
        dynamic_value_options[index] = new Array();
        dynamic_value_options[index]['name'] = 'Current Date';
        dynamic_value_options[index]['value'] = 'current date';
    }
    
    // if field type is date and time then add options for date and time
    if (field_type == 'date and time') {
        var index = dynamic_value_options.length;
        dynamic_value_options[index] = new Array();
        dynamic_value_options[index]['name'] = 'Current Date & Time';
        dynamic_value_options[index]['value'] = 'current date and time';
    }
    
    // if field type is date and time then add options for date and time
    if ((field_type == 'date') || (field_type == 'date and time')) {
        var index = dynamic_value_options.length;
        dynamic_value_options[index] = new Array();
        dynamic_value_options[index]['name'] = 'Day(s) Ago';
        dynamic_value_options[index]['value'] = 'days ago';
    }
    
    // if field type is time then add options for time
    if (field_type == 'time') {
        var index = dynamic_value_options.length;
        dynamic_value_options[index] = new Array();
        dynamic_value_options[index]['name'] = 'Current Time';
        dynamic_value_options[index]['value'] = 'current time';
    }
    
    // if field type is username then add options for username
    if (field_type == 'username') {
        var index = dynamic_value_options.length;
        dynamic_value_options[index] = new Array();
        dynamic_value_options[index]['name'] = 'Viewer';
        dynamic_value_options[index]['value'] = 'viewer';
    }
    
    // if field type is email address then add options for email address
    if (field_type == 'email address') {
        var index = dynamic_value_options.length;
        dynamic_value_options[index] = new Array();
        dynamic_value_options[index]['name'] = 'Viewer\'s E-mail Address';
        dynamic_value_options[index]['value'] = 'viewers email address';
    }
    
    // remove any existing options from dynamic value pick list
    document.getElementById('filter_' + filter_number + '_dynamic_value').options.length = 0;
    
    // loop through all dynamic value options in order to add options to dynamic value pick list
    for (var i = 0; i < dynamic_value_options.length; i++) {
        document.getElementById('filter_' + filter_number + '_dynamic_value').options[i] = new Option(dynamic_value_options[i]['name'], dynamic_value_options[i]['value']);
        
        // if this dynamic value option should be selected by default, then select dynamic value option by default
        if (dynamic_value_options[i]['value'] == dynamic_value) {
            document.getElementById('filter_' + filter_number + '_dynamic_value').selectedIndex = i;
        }
    }
    
    // if there is more than one dynamic value option, then show dynamic value pick list
    if (dynamic_value_options.length > 1) {
        document.getElementById('filter_' + filter_number + '_dynamic_value').style.display = 'inline';
        
    // else there is not at least one dynamic value option, so hide dynamic value pick list and attribute
    } else {
        document.getElementById('filter_' + filter_number + '_dynamic_value').style.display = 'none';
    }
    
    update_dynamic_value_attribute(filter_number, dynamic_value_attribute);
}

function update_dynamic_value_attribute(filter_number, dynamic_value_attribute)
{
    // get dynamic value for filter
    dynamic_value = document.getElementById('filter_' + filter_number + '_dynamic_value').value;
    
    // if the dynamic value is days ago, then show attribute
    if (dynamic_value == 'days ago') {
        document.getElementById('filter_' + filter_number + '_dynamic_value_attribute').style.display = 'inline';
    
    // else the dynamic value is not days ago, so hide attribute
    } else {
        document.getElementById('filter_' + filter_number + '_dynamic_value_attribute').style.display = 'none';
    }
}

function clear_value(filter_number)
{
    // if an option was selected for dynamic value pick list, then clear value
    if (document.getElementById('filter_' + filter_number + '_dynamic_value').options[document.getElementById('filter_' + filter_number + '_dynamic_value').selectedIndex].value != '') {
        document.getElementById('filter_' + filter_number + '_value').value = '';
    }
}

function submit_form(form_name) {
    document.getElementById(form_name).submit();
}

function search_help() {
    // pass a search query to the script responsible for searching the help
    // get back a JSON object that has the search results,
    // and output the results to the dialog box
    $.getJSON(
        'get_help_search_results.php',
        {query: document.getElementById('help_dialog_search_query').value},
        function(help_search_results){
            var output_help_search_results = '';
            
            // if there are results, then output notice, loop through search results and add each result to the output for the dialog box
            if (help_search_results.results.length > 0) {
                // build results notice
                output_help_search_results = '<p>Found ' + help_search_results.results.length + ' result(s) for "' + document.getElementById('help_dialog_search_query').value + '" in Help.</p>';
                
                // loop through results and build links to each article
                for(var i = 0; i <= help_search_results.results.length; i++) {
                    if (help_search_results.results[i]) {
                        output_help_search_results += '<p class="search_result"><a href="javascript:void(0)" onclick="update_help_content(\'' + help_search_results.results[i].file_name + '\', true)">' + help_search_results.results[i].heading + '</a></p>';
                    }
                }
            
            // else output notice
            } else {
                output_help_search_results = '<p>No results were found for "' + document.getElementById('help_dialog_search_query').value + '" in Help.</p>';
            }
            
            // output search results to help dialog box
            document.getElementById('help_dialog_content').innerHTML = '<h1>Search Results</h1>' + output_help_search_results;
        }
    );
}

function submit_optimize_content()
{
    // if save and analyze button was clicked, then show analysis notice and determine if form should be submitted
    if (submit_button == 'save_and_analyze') {
        // show analysis notice
        document.getElementById('analysis_notice').style.display = '';
        
        // if analysis is allowed, then submit form
        if (allow_analysis == true) {
            return true;
            
        // else analysis is not allowed, so do not submit form
        } else {
            return false;
        }
        
    // else save and return button was clicked, so submit form
    } else {
        return true;
    }
}

function show_or_hide_cut_off_cell(checkbox) {
    // if the checkbox is checked, then show it's cut-off cell
    if (checkbox.checked == true) {
        document.getElementById(checkbox.id + '_cutoff_time_cell').style.display = '';
        
    // else hide it's cut-off cell
    } else {
        document.getElementById(checkbox.id + '_cutoff_time_cell').style.display = 'none';
    }
}

// create row for shipping cut-off
function create_shipping_cutoff(properties)
{
    // if no properties were passed, then set blank values
    if (!properties) {
        var properties = new Array();
        properties['shipping_method_id'] = '';
        properties['date_and_time'] = '';
    }
    
    // get shipping cut-off number by adding one to the current number of shipping cut-offs
    var shipping_cutoff_number = last_shipping_cutoff_number + 1;
    
    var tbody = document.getElementById('shipping_cutoff_table').getElementsByTagName('tbody')[0]; 
    var tr = document.createElement('tr');
    
    // prepare content for shipping method id cell
    var shipping_method_id_cell_html =
        '<select id="shipping_cutoff_' + shipping_cutoff_number + '_shipping_method_id" name="shipping_cutoff_' + shipping_cutoff_number + '_shipping_method_id">\n\
            <option value=""></option>';
    
    // loop through all shipping method id options in order to prepare options for pick list
    for (var i = 0; i < shipping_method_id_options.length; i++) {
        var status = '';
        
        // if this option should be selected by default, then select option by default
        if (properties['shipping_method_id'] == shipping_method_id_options[i]['value']) {
            status = ' selected="selected"';
        }
        
        shipping_method_id_cell_html += '<option value="' + shipping_method_id_options[i]['value'] + '"' + status + '>' + prepare_content_for_html(shipping_method_id_options[i]['name']) + '</option>';
    }
    
    shipping_method_id_cell_html += '</select>';
    
    // insert content into shipping method id cell
    var td_1 = document.createElement('td');
    td_1.innerHTML = shipping_method_id_cell_html;
    
    // prepare content for date and time cell
    var td_2 = document.createElement('td');
    td_2.innerHTML = '<input id="shipping_cutoff_' + shipping_cutoff_number + '_date_and_time" name="shipping_cutoff_' + shipping_cutoff_number + '_date_and_time" type="text" value="' + properties['date_and_time'] + '" size="20" maxlength="22" />';
    
    // prepare content for delete cell
    var td_3 = document.createElement('td');
    td_3.innerHTML = '<a href="javascript:void(0)" onclick="delete_shipping_cutoff(this.parentNode.parentNode)" class="button">Delete</a>';
    
    tr.appendChild(td_1);
    tr.appendChild(td_2);
    tr.appendChild(td_3);
    
    tbody.appendChild(tr);

    $('#shipping_cutoff_' + shipping_cutoff_number + '_date_and_time').datetimepicker({
        dateFormat: "m/d/yy",
        timeFormat: "h:mm TT"
    });
    
    // show the shipping cut-off table in case it was hidden
    document.getElementById('shipping_cutoff_table').style.display = '';
    
    // update number of shipping cut-offs
    last_shipping_cutoff_number++;
    document.getElementById('last_shipping_cutoff_number').value = last_shipping_cutoff_number;
}

function delete_shipping_cutoff(tr)
{
    tbody = tr.parentNode;
    tbody.removeChild(tr);
    
    // if there is only one row in the table, then it is the heading row, so hide the whole table
    if (document.getElementById('shipping_cutoff_table').getElementsByTagName('tr').length == 1) {
        document.getElementById('shipping_cutoff_table').style.display = 'none';
    }
}

// this function updates the theme designer's control panel and preview window's width and height to match the browser
function resize_theme_designer() {
    // set width and height for the theme preview
    $('#theme_preview_iframe').css('width', document.documentElement.clientWidth - $('#theme_designer_toolbar').css('width').substr(0, $('#theme_designer_toolbar').css('width').lastIndexOf('p')) - 2);
    $('#theme_preview_iframe').css('height', document.documentElement.clientHeight);
    
    // set the toolbar's height
    $('#theme_designer_toolbar').css('height', document.documentElement.clientHeight);
    
    // calculate the height for the modules container by looking at the browser height and subtracting various other contains that appear above and below the modules container
    var theme_designer_toolbar_modules_height = parseInt($(window).height() - $('#header').height() - $('#subnav').height() - $('#button_bar').height() - $('#button_bar').height() - $('#content_header').height() - $('#content_footer').height() - 83);
    
    // update the modules container height
    $('#theme_designer_toolbar #modules').css('height', theme_designer_toolbar_modules_height);
}

// Create function to allow a module to be highlighted in the preview pane of the theme designer
// when a user hovers over the module
function highlight_module(selector)
{
    $('#theme_preview_iframe').contents().find(selector).css('position', 'relative');
    $('#theme_preview_iframe').contents().find(selector).append('<div id="module_highlight" style="background-color: rgba(143, 195, 117, .7); border: 1px solid #428221; width:100%; height:100%; position: absolute; top: 0; left: 0; z-index: 2147483647"></div>');
}

// Create function to allow a module to be unhighlighted in the preview pane of the theme designer
// when a user hovers off the module
function unhighlight_module(selector)
{
    $('#theme_preview_iframe').contents().find('#module_highlight').remove();
    $('#theme_preview_iframe').contents().find(selector).css('position', '');
}

var last_closed_module_id = 0;

// this function initializes the theme design's accordion
function init_theme_designer_accordion()
{
    // add listeners to all headers to listen for a click, and update the accordion when clicked
    $('.module .header').click(function () {
        // get the selected module id
        var selected_module_id = this.parentNode.id;
        
        var current_module_id = 0;
        
        // if there is a current module then save it's id
        if ($('.module .content.current')[0]) {
            current_module_id = $('.module .content.current')[0].parentNode.id;
        }
        
        // if there is a current module id, then call the function that will hide the currently opened module
        if (current_module_id) {
            hide_current_module(selected_module_id, current_module_id);
        }
        
        // if the selected module is not the current module, and if the selected module id is not equal to the last closed module id, then open the selected module
        if ((selected_module_id != current_module_id) && (selected_module_id != last_closed_module_id)) {
            // if there is not a module inside of the area that was clicked on, and if the area is blank, make an ajax call to get the area's content
            if ((!$('#' + selected_module_id + '.module .content').find('.module')[0]) && (!$('#' + selected_module_id + '.module .content').find('.field')[0])) {
                var file_id = document.getElementById('file_id').value;
                
                // send an AJAX GET in order to get the module content
                // async is set to false so that the request is sent before the browser window goes to the next page
                var html_output = $.ajax({
                    type: 'GET',
                    url: 'get_theme_designer_module.php',
                    data: 'file_id=' + file_id + '&module_id=' + selected_module_id,
                    async: false
                }).responseText;
                
                // if there is html output, then put the HTML into the area and init the color pickers
                if (html_output) {
                    // put html into area
                    $('#' + selected_module_id + '.module .content')[0].innerHTML = html_output;
                    
                    // initiate the color pickers
                    init_color_picker();
                }
            }
            
            // slide down the selected module
            $($('#' + selected_module_id + '.module .content')[0]).slideDown('fast');
            
            // add the current class to the module
            $($('#' + selected_module_id + '.module .content')[0]).addClass('current');
            
            // remove the closed class from the header arrow
            $($('#' + selected_module_id + '.module .header span.heading_arrow_image')[0]).removeClass('closed');
            
            // add the expanded class to the header arrow
            $($('#' + selected_module_id + '.module .header span.heading_arrow_image')[0]).addClass('expanded');
            
            // if there is an anchor for the current module, then send the user to it's anchor
            if ($('#' + selected_module_id + '.module').find('.anchor')[0].name) {
                setTimeout (function () {
                    window.location = '#' + $('#' + selected_module_id + '.module').find('.anchor')[0].name;
                }, 250);
            }
            
        // else if the selected module id equals the current module id, then set it's parent to the current module
        } else if (selected_module_id == current_module_id) {
            $($('#' + selected_module_id + '.module .content')[0].parentNode.parentNode).addClass('current');
        }
        
        // reset the last closed module id
        last_closed_module_id = 0;
    });
}

// this function hides the current opened module
function hide_current_module(selected_module_id, current_module_id)
{
    // if there is an current module id, and if the selected module is not inside of this module, then continue to close the module
    if ((current_module_id != 0) && (!$('#' + current_module_id + '.module .content').find('#' + selected_module_id + '.module')[0])) {
        // if the current module's parent module is not equal to the selected module's parent module, or the root module then call this function again, but pass in the current module's parent module as the current module
        // this is so that we can go up a level to find the parent module that we need to close
        if ((document.getElementById(current_module_id).parentNode.parentNode.id != document.getElementById(selected_module_id).parentNode.parentNode.id) && (document.getElementById(current_module_id).parentNode.id != 'modules')) {
            hide_current_module(selected_module_id, document.getElementById(current_module_id).parentNode.parentNode.id);
            
        // else close the current module
        } else {
            // slide up the module, and then hide all of it's children
            $($('#' + current_module_id + '.module .content')[0]).slideUp('fast', function () {
                $('#' + current_module_id + '.module .content').css('display', 'none');
            });
            
            // remove the expanded class from the header arrow
            $('#' + current_module_id + '.module .header span.heading_arrow_image').removeClass('expanded');
            
            // add the closed class to the header arrow
            $('#' + current_module_id + '.module .header span.heading_arrow_image').addClass('closed');
            
            // set the last closed module id to the current module id that was just closed
            last_closed_module_id = current_module_id;
        }
    }
    
    // remove the current class from the module that has it
    $('.module .content.current').removeClass('current');
}

// this function opens a module in the theme designer accordion
function open_theme_designer_accordion_module(module_id, modules_to_open)
{
    // if the modules to open array is not defined, then define it
    if (!modules_to_open) {
        var modules_to_open = new Array();
    }
    
    // if the parent of this module is the modules container, then follow the click path to open the accordion
    if ($('#' + module_id + '.module')[0].parentNode.id == 'modules') {
        // add the top most level to the modules to open array
        modules_to_open.push($('#' + module_id + '.module')[0].id);
        
        // reverse the array so that the modules are opened in the correct order
        modules_to_open = modules_to_open.reverse();
        
        // loop through the modules to open the accordion
        for(var i = 0; i < modules_to_open.length; i++) {
            $($('#' + modules_to_open[i] + '.module .header')[0]).trigger('click');
        }
        
    // else save the module and call this function again with the parent as the module id
    } else {
        // save this module to the modules to open array
        modules_to_open.push($('#' + module_id + '.module')[0].id);
        
        // call the function again for the parent
        open_theme_designer_accordion_module($('#' + module_id + '.module')[0].parentNode.parentNode.id, modules_to_open);
    }
}

// this function initializes the color picker for all color picker objects in the document
function init_color_picker() {
    // get all of the color picker toggles in the document
    var color_picker_toggles = $('.color_picker_toggle');
    
    // loop through each color picker toggle, and create a color picker object for it
    for (var i = 0; i <= color_picker_toggles.length; i++) {
        // if there is a color picker toggle, then continue
        if (color_picker_toggles[i]) {
            // convert the rgb color value to hex, and store the value to be used later on
            var background_color = rgb_to_hex(color_picker_toggles[i].style.backgroundColor);
            
            var toggle_id = 0;
            var input_id = 0;
            var placeholder_id = 0;
            
            // initiate the color picker
            $(color_picker_toggles[i]).ColorPicker({
                eventName: 'click',
                color: background_color,
                flat: false,
                onShow: function (colpkr) {
    				// fade in the color picker
    				$(colpkr).fadeIn(100);
                    
                    // set the input field's id that is in the same table cell as the color picker toggle to reflect the color picker object's id
                    $(this.parentNode).find('input')[0].id = colpkr.id + '_input';
                    
                    // remember this input's id so that we can use it during the onChange function
                    input_id = colpkr.id + '_input';
                    
                    // set the span's id that is in the same table cell as the color picker toggle to reflect the color picker object's id
                    $(this.parentNode).find('span')[1].id = colpkr.id + '_placeholder';
                    
                    // remember this spans's id so that we can use it during the onChange function
                    placeholder_id = colpkr.id + '_placeholder';
                    
                    // set the current color picker toggle to include the color picker object's id
                    this.id = colpkr.id + '_toggle';
                    
                    // remember this toggle's id so that we can use it during the onChange function
                    toggle_id = colpkr.id + '_toggle';
                    
                    // add a click event to the none button, and when clicked, clear out the color
                    $('.colorpicker_none_button').click(function() {
                        // update the color picker toggle to be white
        				$('#' + toggle_id).css('background-color', '#FFFFFF');
                        
                        // update the color picker toggle's input field with the new hex value
                        document.getElementById(input_id).value = '';
                        
                        // update the color picker's value placeholder
                        document.getElementById(placeholder_id).firstChild.nodeValue = 'Inherit';
                        
                        // fade out the color picker
        				$('.colorpicker').fadeOut(100);
                    });
                    
                    return false;
    			},
    			onHide: function (colpkr) {
    				// fade out the color picker
    				$(colpkr).fadeOut(500);
                    return false;
    			},
    			onSubmit: function (hsb, hex, rgb) {
    				// update the color picker toggle with the new color
    				$('#' + toggle_id).css('background-color', '#' + hex.toUpperCase());
                    
                    // remove the background image so that we can see the color
                    $('#' + toggle_id).css('background-image', 'none');
                    
                    // update the color picker toggle's input field with the new hex value
                    document.getElementById(input_id).value = hex.toUpperCase();
                    
                    // update the color picker's value placeholder
                    document.getElementById(placeholder_id).firstChild.nodeValue = '#' + hex.toUpperCase();
                    
                    // fade out the color picker
    				$('.colorpicker').fadeOut(100);
    			}
            });
        }
    }
}

// this function takes an RGB value and converts it to a hex value
function rgb_to_hex(color) {
    // if the color has a pound sign, then return out of the function
    if (color.substr(0, 1) === '#') {
        return color;
    }
    
    // get the color digits from the string
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    
    // break the digits into their specific color values
    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);
    
    // convert each rgb color value to a hex value and then return the value as a hex color
    return '#' + color_to_hex(red) + color_to_hex(green) + color_to_hex(blue);

};

// this function takes a signle RGB value and converts it into a hex value
function color_to_hex(color) {
    // if the color is null, then return 00
    if (color == null){
        return "00";
    }
    
    // turn the color into only integers
    color = parseInt(color); 
    
    // if the color is 0 or not a number, then return 00
    if ((color==0) || (isNaN(color))){
        return "00";
    }
    
    // conver the colors to hex
    color = Math.max(0,color); 
    color = Math.min(color,255);
    color = Math.round(color);
    
    // return the hex value
    return "0123456789ABCDEF".charAt((color-color%16)/16) + "0123456789ABCDEF".charAt(color%16);
}

// this function shows and hides the background css rule options
function show_or_hide_background_options(option, options_container_path) {
    // if the option is solid color, then show the solid color options and hide the image options
    if (option == 'solid_color') {
        document.getElementById(options_container_path + '_background_color_row').style.display = '';
        document.getElementById(options_container_path + '_background_image_row').style.display = 'none';
        document.getElementById(options_container_path + '_background_horizontal_position_row').style.display = 'none';
        document.getElementById(options_container_path + '_background_vertical_position_row').style.display = 'none';
        document.getElementById(options_container_path + '_background_repeat_row').style.display = 'none';
        
    // if the option is image, then show the image options and hide the solid color options
    } else if (option == 'image') {
        document.getElementById(options_container_path + '_background_color_row').style.display = '';
        document.getElementById(options_container_path + '_background_image_row').style.display = '';
        document.getElementById(options_container_path + '_background_horizontal_position_row').style.display = '';
        document.getElementById(options_container_path + '_background_vertical_position_row').style.display = '';
        document.getElementById(options_container_path + '_background_repeat_row').style.display = '';
        
    // else none was selected so hide both the image and solid color options
    } else {
        document.getElementById(options_container_path + '_background_color_row').style.display = 'none';
        document.getElementById(options_container_path + '_background_image_row').style.display = 'none';
        document.getElementById(options_container_path + '_background_horizontal_position_row').style.display = 'none';
        document.getElementById(options_container_path + '_background_vertical_position_row').style.display = 'none';
        document.getElementById(options_container_path + '_background_repeat_row').style.display = 'none';
    }
}

// this function shows and hides the css rule options for the borders
function show_or_hide_css_rule_border_options(options_container_path, object) {
    if (document.getElementById(options_container_path + '_border_size_row').style.display == 'none') {
        document.getElementById(options_container_path + '_border_size_row').style.display = '';
        document.getElementById(options_container_path + '_border_color_row').style.display = '';
        document.getElementById(options_container_path + '_border_style_row').style.display = '';
        document.getElementById(options_container_path + '_border_position_row').style.display = '';
        
    } else {
        document.getElementById(options_container_path + '_border_size_row').style.display = 'none';
        document.getElementById(options_container_path + '_border_color_row').style.display = 'none';
        document.getElementById(options_container_path + '_border_style_row').style.display = 'none';
        document.getElementById(options_container_path + '_border_position_row').style.display = 'none';
    }
}

// this function shows and hides the css rule options for the rounded corners
function show_or_hide_css_rule_rounded_corner_options(options_container_path, object) {
    if (document.getElementById(options_container_path + '_rounded_corner_top_left_row').style.display == 'none') {
        document.getElementById(options_container_path + '_rounded_corner_top_left_row').style.display = '';
        document.getElementById(options_container_path + '_rounded_corner_top_right_row').style.display = '';
        document.getElementById(options_container_path + '_rounded_corner_bottom_left_row').style.display = '';
        document.getElementById(options_container_path + '_rounded_corner_bottom_right_row').style.display = '';
        
    } else {
        document.getElementById(options_container_path + '_rounded_corner_top_left_row').style.display = 'none';
        document.getElementById(options_container_path + '_rounded_corner_top_right_row').style.display = 'none';
        document.getElementById(options_container_path + '_rounded_corner_bottom_left_row').style.display = 'none';
        document.getElementById(options_container_path + '_rounded_corner_bottom_right_row').style.display = 'none';
    }
}

// this function shows and hides the css rule options for the shadows
function show_or_hide_css_rule_shadow_options(options_container_path, object) {
    if (document.getElementById(options_container_path + '_shadow_horizontal_offset_row').style.display == 'none') {
        document.getElementById(options_container_path + '_shadow_horizontal_offset_row').style.display = '';
        document.getElementById(options_container_path + '_shadow_vertical_offset_row').style.display = '';
        document.getElementById(options_container_path + '_shadow_blur_radius_row').style.display = '';
        document.getElementById(options_container_path + '_shadow_color_row').style.display = '';
        
    } else {
        document.getElementById(options_container_path + '_shadow_horizontal_offset_row').style.display = 'none';
        document.getElementById(options_container_path + '_shadow_vertical_offset_row').style.display = 'none';
        document.getElementById(options_container_path + '_shadow_blur_radius_row').style.display = 'none';
        document.getElementById(options_container_path + '_shadow_color_row').style.display = 'none';
    }
}

// This function shows and hides the css rule options for the previous & next buttons for ad regions.
function show_or_hide_css_rule_previous_and_next_buttons_options(options_container_path, object) {
    if (document.getElementById(options_container_path + '_previous_and_next_buttons_horizontal_offset_row').style.display == 'none') {
        document.getElementById(options_container_path + '_previous_and_next_buttons_horizontal_offset_row').style.display = '';
        document.getElementById(options_container_path + '_previous_and_next_buttons_vertical_offset_row').style.display = '';
        
    } else {
        document.getElementById(options_container_path + '_previous_and_next_buttons_horizontal_offset_row').style.display = 'none';
        document.getElementById(options_container_path + '_previous_and_next_buttons_vertical_offset_row').style.display = 'none';
    }
}

// this function shows or hides the style option
function show_or_hide_style_type(option)
{
    if (option == 'system') {
        document.getElementById('layout').style.display = '';
    } else {
        document.getElementById('layout').style.display = 'none';
    }
}

// this function shows or hides the theme type options
function show_or_hide_theme_type_options(option)
{
    // if the option is "system", then show the system theme options, hide the custom theme options and change the label of the submit button
    if (option == 'system') {
        // hide the custom theme option
        document.getElementById('custom_theme_type_option_heading_row').style.display = 'none';
        document.getElementById('custom_theme_type_option_row').style.display = 'none';
        
        // show the create system theme options
        document.getElementById('create_system_theme_options').style.display = '';
        
        // show the new system theme option heading and row
        document.getElementById('new_system_theme_type_option_heading_row').style.display = '';
        document.getElementById('new_system_theme_type_option_row').style.display = '';
        
        // set the hidden file upload field to custom file
        document.getElementById('file_upload_field').value = 'system_theme_csv_file';
        
        // change the submit button's value to say "Create & Continue"
        document.getElementById('submit_button').value = 'Create & Continue';
        
        // select the new theme option by default
        document.getElementById('new_theme').checked = 'checked';
    
    // else hide the system theme options, show the custom theme options and change the label of the submit button
    } else {
        // hide the create system theme options
        document.getElementById('create_system_theme_options').style.display = 'none';
        
        // hide the new system theme option heading and row
        document.getElementById('new_system_theme_type_option_heading_row').style.display = 'none';
        document.getElementById('new_system_theme_type_option_row').style.display = 'none';
        
        // hide the import system theme option heading and row
        document.getElementById('import_system_theme_type_option_heading_row').style.display = 'none';
        document.getElementById('import_system_theme_type_option_row').style.display = 'none';
        
        // show the custom theme option
        document.getElementById('custom_theme_type_option_heading_row').style.display = '';
        document.getElementById('custom_theme_type_option_row').style.display = '';
        
        // change the submit button's value to say "Create"
        document.getElementById('submit_button').value = 'Create';
        
        // set the hidden file load field to custom file
        document.getElementById('file_upload_field').value = 'custom_css_file';
    }
}

// this function shows or hides the theme type options
function show_or_hide_create_system_theme_options(option)
{
    // if the option is "import", then show the appropriate rows
    if (option == 'import') {
        // hide the new system theme option headign and row
        document.getElementById('new_system_theme_type_option_heading_row').style.display = 'none';
        document.getElementById('new_system_theme_type_option_row').style.display = 'none';
        
        // show the import system theme option headign and row
        document.getElementById('import_system_theme_type_option_heading_row').style.display = '';
        document.getElementById('import_system_theme_type_option_row').style.display = '';
        
        // change the submit button's value to say "Create"
        document.getElementById('submit_button').value = 'Create';
    
    // else set show new system theme rows
    } else {
        // hide the import system theme option headign and row
        document.getElementById('import_system_theme_type_option_heading_row').style.display = 'none';
        document.getElementById('import_system_theme_type_option_row').style.display = 'none';
        
        // show the new system theme option headign and row
        document.getElementById('new_system_theme_type_option_heading_row').style.display = '';
        document.getElementById('new_system_theme_type_option_row').style.display = '';
        
        // change the submit button's value to say "Create & Continue"
        document.getElementById('submit_button').value = 'Create & Continue';
    }
}

function show_or_hide_email_campaign_format()
{
    // start off by hiding all rows under the format field until we determine which should be shown
    document.getElementById('body_row').style.display = 'none';
    document.getElementById('page_id_row').style.display = 'none';
    document.getElementById('body_preview_row').style.display = 'none';

    // if the "plain text" option is selected, then show the body row
    if (document.getElementById('format_plain_text').checked == true) {
        document.getElementById('body_row').style.display = '';
    
    // else the "html" option is selected, so show page row and determine if body preview row should be shown
    } else {
        document.getElementById('page_id_row').style.display = '';

        if (document.getElementById('page_id').options[document.getElementById('page_id').selectedIndex].firstChild) {
            document.getElementById('body_preview_row').style.display = '';
        }
    }
}

function show_or_hide_edit_form_list_view_search()
{
    // Start off by hiding all rows under the search field until we determine which should be shown.
    document.getElementById('search_advanced_row').style.display = 'none';
    document.getElementById('search_advanced_show_by_default_row').style.display = 'none';
    document.getElementById('search_advanced_layout_container').style.display = 'none';

    // If search is enabled, then determine which rows should be shown.
    if (document.getElementById('search').checked == true) {
        // If MySQL version is new then show advanced fields.
        if (document.getElementById('mysql_version_new').value == 'true') {
            document.getElementById('search_advanced_row').style.display = '';

            show_or_hide_edit_form_list_view_search_advanced();
        }
    }
}

function show_or_hide_edit_form_list_view_search_advanced()
{
    // Start off by hiding all rows under the advanced search field until we determine which should be shown.
    document.getElementById('search_advanced_show_by_default_row').style.display = 'none';
    document.getElementById('search_advanced_layout_container').style.display = 'none';

    // If advanced search is enabled, then shows rows that are under it.
    if (document.getElementById('search_advanced').checked == true) {
        document.getElementById('search_advanced_show_by_default_row').style.display = '';
        document.getElementById('search_advanced_layout_container').style.display = '';
    }
}

function show_or_hide_edit_form_list_view_browse()
{
    // Start off by hiding all rows under the browse field until we determine which should be shown.
    document.getElementById('browse_show_by_default_form_field_id_row').style.display = 'none';
    document.getElementById('browse_fields_row').style.display = 'none';


    // If browse is enabled, then determine which rows should be shown.
    if (document.getElementById('browse').checked == true) {
        document.getElementById('browse_show_by_default_form_field_id_row').style.display = '';
        document.getElementById('browse_fields_row').style.display = '';
    }
}

function show_or_hide_edit_form_list_view_browse_field(field_id) {
    if (document.getElementById('browse_field_' + field_id).checked == true) {
        document.getElementById('browse_field_' + field_id + '_number_of_columns_cell').style.display = '';
        document.getElementById('browse_field_' + field_id + '_sort_order_cell').style.display = '';
        document.getElementById('browse_field_' + field_id + '_shortcut_cell').style.display = '';

        // If there is a date format field (i.e. field has a date or date and time type)
        // then show that cell also.
        if (document.getElementById('browse_field_' + field_id + '_date_format')) {
            document.getElementById('browse_field_' + field_id + '_date_format_cell').style.display = '';
        }

    } else {
        document.getElementById('browse_field_' + field_id + '_number_of_columns_cell').style.display = 'none';
        document.getElementById('browse_field_' + field_id + '_sort_order_cell').style.display = 'none';
        document.getElementById('browse_field_' + field_id + '_shortcut_cell').style.display = 'none';
        document.getElementById('browse_field_' + field_id + '_date_format_cell').style.display = 'none';
    }
}

function toggle_use_folder_name_for_default_value() {
    if (document.getElementById('use_folder_name_for_default_value').checked == true) {
        document.getElementById('default_value').disabled = true;
        $('#default_value').addClass('disabled');
    } else {
        document.getElementById('default_value').disabled = false;
        $('#default_value').removeClass('disabled');
    }
}

// initialize function for preparing layout cells
function initialize_style_designer()
{
    var selected_area = '';
    var selected_row_index = '';
    var selected_cell_index = '';
    
    // initialize function for deselecting a cell that should no longer be selected
    function deselect_cell(area, row_index, cell_index)
    {
        // add disable styling to add column before button
        $('#' + area + '_add_column_before').addClass('disabled');
        
        // remove onclick event for add column before button
        $('#' + area + '_add_column_before').unbind('click');

        // add disable styling to add column after button
        $('#' + area + '_add_column_after').addClass('disabled');
        
        // remove onclick event for add column after button
        $('#' + area + '_add_column_after').unbind('click');
        
        // add disable styling to edit cell properties button
        $('#' + area + '_edit_cell_properties').addClass('disabled');
        
        // remove onclick event for edit cell properties button
        $('#' + area + '_edit_cell_properties').unbind('click');
        
        // remove selected styling from cell
        $('#' + area + '_row_' + row_index + '_cell_' + cell_index).removeClass('selected');
        
        // clear values for selected variables
        selected_area = '';
        selected_row_index = '';
        selected_cell_index = '';
    }
    
    function select_cell(area, row_index, cell_index)
    {
        // if there is a selected cell, then deselect it
        if (selected_cell_index !== '') {
            deselect_cell(selected_area, selected_row_index, selected_cell_index);
        }

        // remove disable styling from add column before button
        $('#' + area + '_add_column_before').removeClass('disabled');
        
        // add onclick event for add column before button
        $('#' + area + '_add_column_before').bind('click', {area: area}, function(event) {
            var area = event.data.area;
            
            // set the new cell index
            var new_cell_index = selected_cell_index;
            
            // prepare the cell that will be added to a row
            var cell = {
                'region_type': '',
                'region_name': ''
            };
            
            // add the cell to the array
            areas[area]['rows'][selected_row_index]['cells'].splice(new_cell_index, 0, cell);
            
            // update the area so that the correct cells will be displayed for this area
            update_area(area);
            
            // select the cell that we just added
            select_cell(area, selected_row_index, new_cell_index);
        });
        
        // remove disable styling from add column after button
        $('#' + area + '_add_column_after').removeClass('disabled');
        
        // add onclick event for add column after button
        $('#' + area + '_add_column_after').bind('click', {area: area}, function(event) {
            var area = event.data.area;
            
            // set the new cell index to one more than the selected cell index
            var new_cell_index = selected_cell_index + 1;
            
            // prepare the cell that will be added to a row
            var cell = {
                'region_type': '',
                'region_name': ''
            };
            
            // add the cell to the array
            areas[area]['rows'][selected_row_index]['cells'].splice(new_cell_index, 0, cell);
            
            // update the area so that the correct cells will be displayed for this area
            update_area(area);
            
            // select the cell that we just added
            select_cell(area, selected_row_index, new_cell_index);
        });
        
        // remove disable styling from edit cell properties button
        $('#' + area + '_edit_cell_properties').removeClass('disabled');
        
        // add onclick event for edit cell properties button
        $('#' + area + '_edit_cell_properties').click(function() {
            $('#edit_cell_properties').dialog('open');
        });
        
        // update the selected variables so they store information for this cell
        selected_area = area;
        selected_row_index = row_index;
        selected_cell_index = cell_index;
        
        // add selected class to cell
        $('#' + area + '_row_' + row_index + '_cell_' + cell_index).addClass('selected');
    }
    
    // initialize function that will be responsible for updating the label that appears inside a cell
    function update_cell_label(area, row_index, cell_index)
    {
        var region_type = areas[area]['rows'][row_index]['cells'][cell_index]['region_type'];
        var region_name = prepare_content_for_html(areas[area]['rows'][row_index]['cells'][cell_index]['region_name']);
        var page_region_number = areas[area]['rows'][row_index]['cells'][cell_index]['page_region_number'];

        var row = row_index + 1;
        var col = cell_index + 1;
  
        var cell_label = '';
        
        // prepare cell label
        switch (region_type) {
            case '':
                cell_label = '&nbsp;<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .c' + col + '</span>';
                break;
                
            case 'ad':
                cell_label = 'Ad Region: ' + region_name + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .ad_' + region_name + ' .c' + col + '</span>';
                break;
                
            case 'cart':
                cell_label = 'Cart Region<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .cart .c' + col + '</span>';
                break;
            
            case 'chat':
                cell_label = 'Chat Region<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .chat .c' + col + '</span>';
                break;
            
            case 'common':
                cell_label = 'Common Region: ' + region_name + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .cregion_' + region_name + ' .c' + col + '</span>';
                break;
                
            case 'designer':
                cell_label = 'Designer Region: ' + region_name + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .cregion_' + region_name + ' .c' + col + '</span>';
                break;
                
            case 'dynamic':
                cell_label = 'Dynamic Region: ' + region_name + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .dregion_' + region_name + ' .c' + col + '</span>';
                break;
                
            case 'login':
                cell_label = 'Login Region: ' + region_name + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .login_' + region_name + ' .c' + col + '</span>';
                break;
                
            case 'menu':
                cell_label = 'Menu Region: ' + region_name + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .menu_' + region_name + ' .c' + col + '</span>';
                break;
                
            case 'menu_sequence':
                cell_label = 'Menu Sequence Region: ' + region_name + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .menu_sequence_' + region_name + ' .c' + col + '</span>';
                break;

            case 'mobile_switch':
                cell_label = 'Mobile Switch<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .mobile_switch .c' + col + '</span>';
                break;
                
            case 'page':
                cell_label = 'Page Region #' + page_region_number + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .pregion .c' + col + '</span>';
                break;
                
            case 'pdf':
                cell_label = 'PDF Region <sup>beta</sup><br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .pdf .c' + col + '</span>';
                break;
                
            case 'system':
                var region_name_for_label = '';
                var region_name_for_label_css = '';
                
                // if there is a region name, then output it next to the label
                if (region_name != '') {
                    region_name_for_label = region_name;
                    region_name_for_label_css = ' .system_' + region_name;
                
                // else just output the basic label
                } else {
                    region_name_for_label = 'Use Page';
                    region_name_for_label_css = ' .system'
                }
                
                cell_label = 'System Region: ' + region_name_for_label + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + region_name_for_label_css + ' .c' + col + '</span>';
                break;
                
            case 'tag_cloud':
                var output_region_name = '';
                var output_region_name_css = '';
                
                // if there is a region name for this tag cloud, then prepare to output it
                if (region_name != '') {
                    output_region_name = ': ' + region_name;
                    output_region_name_css = ' .tcloud_' + region_name;
                } else{
                    output_region_name_css = ' .tcloud';
                }
                
                cell_label = 'Tag Cloud Region' + output_region_name + '<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + output_region_name_css + ' .c' + col + '</span>';
                break;
                
            case 'translation':
                cell_label = 'Translation Region<br /><span class="theme_fold_css" style="padding: 0"> .r' + row + 'c' + col + ' .translation .c' + col + '</span>';
                break;
        }
        
        // update the label
        $('#' + area + '_row_' + row_index + '_cell_' + cell_index + ' .cell_label')[0].innerHTML = cell_label;
    }

    // Create function that will be used to update all of the page region numbers
    // anytime an event happens that affects the sequence of numbers (e.g. page region cell added)
    function update_page_region_numbers()
    {
        var page_region_number = 0;

        // Loop through the areas.
        for (var area in areas) {
            // Loop through the rows.
            for (var row_index = 0; row_index < areas[area]['rows'].length; row_index++) {
                // Loop through the cells.
                for (var cell_index = 0; cell_index < areas[area]['rows'][row_index]['cells'].length; cell_index++) {
                    // If this cell is a page region, then update number
                    if (areas[area]['rows'][row_index]['cells'][cell_index]['region_type'] == 'page') {
                        // increment page region number for this page region
                        page_region_number += 1;

                        areas[area]['rows'][row_index]['cells'][cell_index]['page_region_number'] = page_region_number;

                        // update page region number in cell label
                        update_cell_label(area, row_index, cell_index);
                    }
                }
            }
        }
    }
    
    // initialize function that will be responsible for looking at the array for an area in order to output cells
    function update_area(area)
    {
        // remove all cells from the cells container, because we are going to recreate cells
        $('#' + area + ' .cells').empty();
        
        // loop through rows in this area in order to add cells
        for (var row_index = 0; row_index < areas[area]['rows'].length; row_index++) {
            var number_of_cells = areas[area]['rows'][row_index]['cells'].length;
            var total_margin = (number_of_cells - 1) * 12;
            var total_border = number_of_cells * 2;
            var total_padding = number_of_cells * 24;
            
            // get the width for the cells based on how many cells are in this row
            var width = ($('#' + area + ' .cells').width() - total_margin - total_border - total_padding) / number_of_cells;
            
            // round down the width to the nearest whole number and subtract some in order to prevent problems with cells not fitting in one row
            width = Math.floor(width) - 5;
            
            // loop through cells in this row
            for (var cell_index = 0; cell_index < areas[area]['rows'][row_index]['cells'].length; cell_index++) {
                // add a div for the cell
                $('#' + area + ' .cells').append('\
                    <div id ="' + area + '_row_' + row_index + '_cell_' + cell_index + '" class="cell">\
                        <div class="cell_label"></div>\
                        <div class="cell_remove">X</div>\
                        <div class="clear"></div>\
                    </div>');
                
                // update the label that appears inside the cell
                update_cell_label(area, row_index, cell_index);
                
                // if the cell is selected, then add a class to the container
                if ((area === selected_area) && (row_index === selected_row_index) && (cell_index === selected_cell_index)) {
                    $('#' + area + '_row_' + row_index + '_cell_' + cell_index).addClass('selected');
                }
                
                // if this cell is the last cell in the row, then add last class, so that extra margin on the right is not added
                if (cell_index == (areas[area]['rows'][row_index]['cells'].length - 1)) {
                    $('#' + area + '_row_' + row_index + '_cell_' + cell_index).addClass('last');
                }
                
                // set the width for the cell
                $('#' + area + '_row_' + row_index + '_cell_' + cell_index).width(width);
                
                // add click event so that cell can be selected when clicked
                $('#' + area + '_row_' + row_index + '_cell_' + cell_index).bind('click', {area: area, row_index: row_index, cell_index: cell_index}, function(event) {
                    var area = event.data.area;
                    var row_index = event.data.row_index;
                    var cell_index = event.data.cell_index;
                    
                    // if this cell is already selected, then open edit cell properties modal dialog
                    if ((area === selected_area) && (row_index === selected_row_index) && (cell_index === selected_cell_index)) {
                        $('#edit_cell_properties').dialog('open');
                        
                    // else this cell is not already selected, so select it
                    } else {
                        select_cell(area, row_index, cell_index);
                    }
                });
                
                // add click event to the remove button, so that the cell can be removed
                $('#' + area + '_row_' + row_index + '_cell_' + cell_index + ' .cell_remove').bind('click', {area: area, row_index: row_index, cell_index: cell_index}, function(event) {
                    var area = event.data.area;
                    var row_index = event.data.row_index;
                    var cell_index = event.data.cell_index;

                    // store the region type before we remove it, so we know further below if it was a page region
                    var region_type = areas[area]['rows'][row_index]['cells'][cell_index]['region_type'];
                    
                    // if this cell is selected, then deselect cell
                    if ((area === selected_area) && (row_index === selected_row_index) && (cell_index === selected_cell_index)) {
                        deselect_cell(area, row_index, cell_index);
                    }
                    
                    // if there is only one cell in the row, then remove the whole row
                    if (areas[area]['rows'][row_index]['cells'].length == 1) {
                        areas[area]['rows'].splice(row_index, 1);
                        
                    // else there is more than one cell in the row, so just remove the cell
                    } else {
                        areas[area]['rows'][row_index]['cells'].splice(cell_index, 1);
                    }
                    
                    update_area(area);

                    // if the cell that was removed was a page region, then update page region numbers
                    if (region_type == 'page') {
                        update_page_region_numbers();
                    }
                });
            }
            
            // add clear div
            $('#' + area + ' .cells').append('<div class="clear"></div>');
        }
    }
    
    // loop through the areas, in order to prepare them
    for (var area in areas) {
        // add event listener to add row before button
        $('#' + area + '_add_row_before').bind('click', {area: area}, function(event) {
            var area = event.data.area;
            
            // if there is a selected cell in this area, then prepare to add the row and cell above the selected cell
            if (area == selected_area) {
                var new_row_index = selected_row_index;
                
            // else there is not a selected cell in this area, so prepare to add the cell to the top of the area
            } else {
                var new_row_index = 0;
            }
            
            // prepare the row and cell that will be added to the array
            var row = {
                'cells': [
                    {
                        'region_type': '',
                        'region_name': ''
                    }
                ]
            };
            
            // add the row and cell to the array
            areas[area]['rows'].splice(new_row_index, 0, row);
            
            // update the area so that the correct cells will be displayed for this area
            update_area(area);
            
            // select the cell that we just added
            select_cell(area, new_row_index, 0);
        });

        // add event listener to add row after button
        $('#' + area + '_add_row_after').bind('click', {area: area}, function(event) {
            var area = event.data.area;
            
            // if there is a selected cell in this area, then prepare to add the row and cell below the selected cell
            if (area == selected_area) {
                var new_row_index = selected_row_index + 1;
                
            // else there is not a selected cell in this area, so prepare to add the cell to the bottom of the area
            } else {
                var new_row_index = areas[area]['rows'].length;
            }
            
            // prepare the row and cell that will be added to the array
            var row = {
                'cells': [
                    {
                        'region_type': '',
                        'region_name': ''
                    }
                ]
            };
            
            // add the row and cell to the array
            areas[area]['rows'].splice(new_row_index, 0, row);
            
            // update the area so that the correct cells will be displayed for this area
            update_area(area);
            
            // select the cell that we just added
            select_cell(area, new_row_index, 0);
        });
        
        update_area(area);
    }
    
    // initialize function that will be responsible for showing or hiding region name field based on what region type is selected
    function show_or_hide_region_type()
    {
        var region_type = document.getElementById('region_type').options[document.getElementById('region_type').selectedIndex].value;

        // if the selected region type supports a region name, then update the region name pick list with options and show pick list
        if (
            (region_type == 'ad')
            || (region_type == 'common')
            || (region_type == 'designer')
            || (region_type == 'dynamic')
            || (region_type == 'login')
            || (region_type == 'menu')
            || (region_type == 'menu_sequence')
            || (region_type == 'tag_cloud')
            || (region_type == 'system')
        ) {
            // remove existing options from region name pick list
            document.getElementById('region_name').length = 0;
            
            // initialize variable for storing region names
            var region_names = [];
            
            // initialize the picklist's first option to be blank
            var picklist_first_option = '';
            
            // get the region names in different ways for different region types
            switch (region_type) {
                case 'ad':
                    region_names = ad_regions;
                    break;
                
                case 'common':
                    region_names = common_regions;
                    break;
                
                case 'designer':
                    region_names = designer_regions;
                    break;
                
                case 'dynamic':
                    region_names = dynamic_regions;
                    break;
                
                case 'login':
                    region_names = login_regions;
                    break;
                
                case 'menu':
                    region_names = menu_regions;
                    break;
                    
                case 'menu_sequence':
                    region_names = menu_sequence_regions;
                    break;
                
                case 'tag_cloud':
                    region_names = tag_cloud_regions;
                    break;
                    
                case 'system':
                    region_names = system_region_pages;
                    
                    // set the picklists first option for the picklist
                    picklist_first_option = '-Use Page-';
                    break;
            }
            
            // initialize variable for storing options that will be added to the region name pick list
            document.getElementById('region_name').options.add(new Option(picklist_first_option, ''));
            
            // loop through all region names in order to prepare options for pick list
            for (var i = 0; i < region_names.length; i++) {
                document.getElementById('region_name').options.add(new Option(region_names[i], region_names[i]));
            }
            
            // update the region name pick list so that the correct option is selected based on the selected region name
            $("#region_name").val(areas[selected_area]['rows'][selected_row_index]['cells'][selected_cell_index]['region_name']);
            
            // show the region name row
            document.getElementById('region_name_row').style.display = '';
            
        // else the selected region type does not require a region name, so hide region name row
        } else {
            document.getElementById('region_name_row').style.display = 'none';
        }
    }
    
    // initialize edit cell properties modal dialog
    $('#edit_cell_properties').dialog({
        autoOpen: false,
        modal: true,
        width: 500,
        height: 200,
        title: 'Edit Cell Properties',
        dialogClass: 'standard',
        open: function() {
            // if there is no region for the selected cell, then default the region type to page
            if (areas[selected_area]['rows'][selected_row_index]['cells'][selected_cell_index]['region_type'] == '') {
                $("#region_type").val('page');
                
            // else there is a region for the selected cell, so update the region type pick list so that the correct option is selected based on the selected cell
            } else {
                $("#region_type").val(areas[selected_area]['rows'][selected_row_index]['cells'][selected_cell_index]['region_type']);
            }
            
            show_or_hide_region_type();
        }
    });
    
    // add on change event to region type pick list
    $('#region_type').change(function() {
        show_or_hide_region_type();
    });
    
    // add click event to update cell properties button
    $('#update_cell_properties').click(function() {
        // prepare to update region type and name
        var region_type = '';
        var region_name = '';
        
        region_type = document.getElementById('region_type').options[document.getElementById('region_type').selectedIndex].value;
        
        // If the region type supports a region name, and there was at least one name for the user to select,
        // then get the name that was selected.
        if (
            (
                (region_type == 'ad')
                || (region_type == 'common')
                || (region_type == 'designer')
                || (region_type == 'dynamic')
                || (region_type == 'login')
                || (region_type == 'menu')
                || (region_type == 'menu_sequence')
                || (region_type == 'tag_cloud')
                || (region_type == 'system')
            )
            && (document.getElementById('region_name').options.length > 0)
        ) {
            region_name = document.getElementById('region_name').options[document.getElementById('region_name').selectedIndex].value;
        }
        
        // if the region type requires a region name and a region name was not selected, then alert the user
        if (
            (
                (region_type == 'ad')
                || (region_type == 'common')
                || (region_type == 'designer')
                || (region_type == 'dynamic')
                || (region_type == 'login')
                || (region_type == 'menu')
                || (region_type == 'menu_sequence')
            )
            && (region_name == '')
        ) {
            alert('Please select a region name.');
            return false;
        }
        
        // store original region type so further below we know if we need to update page region numbers
        var original_region_type = areas[selected_area]['rows'][selected_row_index]['cells'][selected_cell_index]['region_type'];

        // update cell's properties in array
        areas[selected_area]['rows'][selected_row_index]['cells'][selected_cell_index]['region_type'] = region_type;
        areas[selected_area]['rows'][selected_row_index]['cells'][selected_cell_index]['region_name'] = region_name;

        // if this cell was not a page region before and now it is, then update page region numbers
        if (
            (original_region_type != 'page')
            && (region_type == 'page')
        ) {
            update_page_region_numbers();

        // else if this cell was a page region before and now it is not,
        // then update cell label and page region numbers
        } else if (
            (original_region_type == 'page')
            && (region_type != 'page')
        ) {
            update_cell_label(selected_area, selected_row_index, selected_cell_index);

            update_page_region_numbers();

        // else this cell was not a page region before and it still is not one,
        // so just update cell label
        } else {
            update_cell_label(selected_area, selected_row_index, selected_cell_index);
        }
        
        // close the edit cell properties modal dialog
        $('#edit_cell_properties').dialog('close');
    });
    
    // add click event to cancel cell properties button
    $('#cancel_cell_properties').click(function() {
        // close the edit cell properties modal dialog
        $('#edit_cell_properties').dialog('close');
    });
    
    // add submit event for when the form is submitted
    $('#style_designer_form').submit(function() {
        // assume that a "Use Page" system region does not exist until we find out otherwise
        var use_page_system_region_exists = false;
        
        // loop through the areas in order to determine if there is a "Use Page" system region
        area_loop: for (var area in areas) {
            // loop through the rows
            for (var row_index = 0; row_index < areas[area]['rows'].length; row_index++) {
                // loop through the cells
                for (var cell_index = 0; cell_index < areas[area]['rows'][row_index]['cells'].length; cell_index++) {
                    // if this cell has a "Use Page" system region, then remember that and break out of loops
                    if (
                        (areas[area]['rows'][row_index]['cells'][cell_index]['region_type'] == 'system')
                        && (areas[area]['rows'][row_index]['cells'][cell_index]['region_name'] == '')
                    ) {
                        use_page_system_region_exists = true;
                        break area_loop;
                    }
                }
            }
        }
        
        // if a system region does not exist, then alert the user
        if (use_page_system_region_exists == false) {
            alert('Please add one "Use Page" system region before continuing.');
            return false;
        }
        
        document.getElementById('areas').value = JSON.stringify(areas);
        return true;
    });
}

// this function handles the confirm for the theme designer cancel button
function theme_designer_cancel_confirm(send_to, warning)
{
    var result;

    // if free trial or sandbox, skip warning message
    if (warning == true) {
        result = confirm('WARNING: Any changes to this Theme that have not been saved will be lost.');
    } else {
        result = true;
    }

    // if user select ok to confirmation, then clear the theme designer session and go to the edit theme screen
    if (result == true) {
        // send an AJAX POST in order to clear the theme designer session
        // async is set to false so that the request is sent before the browser window goes to the next page
        $.ajax({
            type: 'GET',
            url: 'clear_theme_designer_session.php?file_id=' + document.getElementById('file_id').value,
            async: false
        });
        
        window.location = send_to;
    }
}

function open_advanced_styling()
{
    var advanced_styling = $('#advanced_styling');

    // initialize modal dialog for advanced styling
    advanced_styling.dialog({
        autoOpen: true,
        title: 'Advanced Styling',
        modal: true,
        dialogClass: 'standard',
        open: function() {
            // set the dialog box's default width and height
            var dialog_width = 400;
            var dialog_height = 500;

            // Get window width and height.
            var window_width = $(window).width();
            var window_height = $(window).height();
            
            // if the dialog's new width is greater than the default, then set the width
            if ((window_width * .6) >= dialog_width) {
                dialog_width = window_width * .6;
            }
            
            // if the dialog's new height is greater than the default, then set the width
            if ((window_height * .75) >= dialog_height) {
                dialog_height = window_height * .75;
            }

            // Update dialog width and height and position it in the center.
            advanced_styling.dialog('option', 'width', dialog_width);
            advanced_styling.dialog('option', 'height', dialog_height);

            var scrollbar_position = 0;
            
            // if there is a pag y offest, then get the scrollbar pos
            if (window.pageYOffset) {
                scrollbar_position = window.pageYOffset;
                
            // else this is probally IE, so get the scrollbar position for IE
            } else {
                scrollbar_position = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
            }
            
            // set the left position, by subtracting the width of the window from the width of the dialog and dividing by 2
            var dialog_top = (window_height - dialog_height) / 2;
            
            // if the scrollbar is not at the very top of the page, then adjust the dialog box's top position
            if (scrollbar_position != 0) {
                dialog_top = dialog_top + scrollbar_position;
            }

            var ui_dialog = $('.standard.ui-dialog');
            
            // set the dialog box's position
            ui_dialog.css({
                top: dialog_top + 'px',
                left: '370px'
            });
            
            // set temp textarea to have the standard textarea's value
            document.getElementById('advanced_styling_textarea_temp').value = document.getElementById('advanced_styling_textarea').value;
            
            // show the advanced styling area
            document.getElementById('advanced_styling').style.display = 'block';
            
            // prepare the width and height for the CodeMirror editor
            var width = ui_dialog.width() - 100;
            var height = ui_dialog.height() - 130;
            
            // turn the advanced styling textarea into a CodeMirror editor
            advanced_styling_editor = CodeMirror.fromTextArea('advanced_styling_textarea_temp', {
                width: width + 'px',
                height: height + 'px',
                parserfile: 'parsecss.js',
                stylesheet: 'codemirror/css/csscolors.css',
                path: 'codemirror/js/',
                continuousScanning: 500,
                lineNumbers: true,
                indentUnit: 4,
                initCallback: function() {advanced_styling_editor.focus()} // this places cursor in editor (we have to do this in a callback or else cursor disappears in Firefox)
            });
            
            // resize the theme designer so that preview will not jump way down when this dialog is opened
            resize_theme_designer();
        },
        close: function() {
            // copy the code from CodeMirror editor to the textarea that will be submitted with the form
            document.getElementById('advanced_styling_textarea').value = advanced_styling_editor.getCode();
            
            // remove the CodeMirror editor
            $('.CodeMirror-wrapping').remove();
        },
        resize: function() {
            // resize CodeMirror editor because the dialog has been resized
            $('.CodeMirror-wrapping').css({'width': parseInt($('.standard.ui-dialog').width() - 100)});
            $('.CodeMirror-wrapping').css({'height': parseInt($('.standard.ui-dialog').height() - 130)});
        }
    });
}

function open_pre_styling()
{
    // initialize modal dialog for pre styling
    $('#pre_styling').dialog({
        autoOpen: true,
        title: 'Pre Styling',
        modal: true,
        dialogClass: 'standard',
        open: function() {
            // set the dialog box's default width and height
            var dialog_width = 400;
            var dialog_height = 500;
            
            // if the dialog's new width is greater than the default, then set the width
            if (($(window).width() * .6) >= dialog_width) {
                dialog_width = $(window).width() * .6;
            }
            
            // if the dialog's new height is greater than the default, then set the width
            if (($(window).height() * .75) >= dialog_height) {
                dialog_height = $(window).height() * .75;
            }
            
            // set the width and height of the dialog based on the size of the window
            $('.standard.ui-dialog').css({
                width: dialog_width,
                height: dialog_height
            });
            
            var scrollbar_position = 0;
            
            // if there is a pag y offest, then get the scrollbar pos
            if (window.pageYOffset) {
                scrollbar_position = window.pageYOffset;
                
            // else this is probally IE, so get the scrollbar position for IE
            } else {
                scrollbar_position = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
            }
            
            // set the left position, by subtracting the width of the window from the width of the dialog and dividing by 2
            var dialog_top = ($(window).height() - $('.standard.ui-dialog').height()) / 2;
            
            // if the scrollbar is not at the very top of the page, then adjust the dialog box's top position
            if (scrollbar_position != 0) {
                dialog_top = dialog_top + scrollbar_position;
            }
            
            // set the dialog box's position
            $('.standard.ui-dialog').css({
                top: dialog_top + 'px',
                left: '370px'
            });
            
            // set temp textarea to have the standard textarea's value
            document.getElementById('pre_styling_textarea_temp').value = document.getElementById('pre_styling_textarea').value;
            
            // show the advanced styling area
            document.getElementById('pre_styling').style.display = 'block';
            
            // prepare the width and height for the dialog
            var width = $('.standard.ui-dialog').width() - 100;
            var height = $('.standard.ui-dialog').height() - 130;
            
            // turn the pre styling textarea into a CodeMirror editor
            pre_styling_editor = CodeMirror.fromTextArea('pre_styling_textarea_temp', {
                width: width + 'px',
                height: height + 'px',
                parserfile: 'parsecss.js',
                stylesheet: 'codemirror/css/csscolors.css',
                path: 'codemirror/js/',
                continuousScanning: 500,
                lineNumbers: true,
                indentUnit: 4,
                initCallback: function() {pre_styling_editor.focus()} // this places cursor in editor (we have to do this in a callback or else cursor disappears in Firefox)
            });
            
            // resize the theme designer so that preview will not jump way down when this dialog is opened
            resize_theme_designer();
        },
        close: function() {
            // copy the code from CodeMirror editor to the textarea that will be submitted with the form
            document.getElementById('pre_styling_textarea').value = pre_styling_editor.getCode();
            
            // remove the CodeMirror editor
            $('.CodeMirror-wrapping').remove();
        },
        resize: function() {
            // resize CodeMirror editor because the dialog has been resized
            $('.CodeMirror-wrapping').css({'width': parseInt($('.standard.ui-dialog').width() - 100)});
            $('.CodeMirror-wrapping').css({'height': parseInt($('.standard.ui-dialog').height() - 130)});
        }
    });
}

function open_view_source()
{
    // initialize modal dialog for view source
    // we want view source to be non-modal so that the user can still click around into different modules in the background
    $('#view_source').dialog({
        autoOpen: true,
        title: 'View Source (read-only source from the last update or save)',
        modal: false,
        resizable: false,
        draggable: false,
        dialogClass: 'standard',
        open: function() {
            // set the dialog box's default width and height
            var dialog_width = 400;
            var dialog_height = 500;
            
            // if the dialog's new width is greater than the default, then set the width
            if (($(window).width() * .6) >= dialog_width) {
                dialog_width = $(window).width() * .6;
            }
            
            // if the dialog's new height is greater than the default, then set the width
            if (($(window).height() * .75) >= dialog_height) {
                dialog_height = $(window).height() * .75;
            }
            
            // set the width and height of the dialog based on the size of the window
            $('.standard.ui-dialog').css({
                width: dialog_width,
                height: dialog_height
            });
            
            var scrollbar_position = 0;
            
            // if there is a pag y offest, then get the scrollbar pos
            if (window.pageYOffset) {
                scrollbar_position = window.pageYOffset;
                
            // else this is probally IE, so get the scrollbar position for IE
            } else {
                scrollbar_position = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
            }
            
            // set the left position, by subtracting the width of the window from the width of the dialog and dividing by 2
            var dialog_top = ($(window).height() - $('.standard.ui-dialog').height()) / 2;
            
            // if the scrollbar is not at the very top of the page, then adjust the dialog box's top position
            if (scrollbar_position != 0) {
                dialog_top = dialog_top + scrollbar_position;
            }
            
            // set the dialog box's position
            $('.standard.ui-dialog').css({
                top: dialog_top + 'px',
                left: '370px'
            });
            
            // show the advanced styling area
            document.getElementById('view_source').style.display = 'block';
            
            // prepare the width and height for the dialog
            var width = $('.standard.ui-dialog').width() - 100;
            var height = $('.standard.ui-dialog').height() - 130;
            
            // turn the advanced styling textarea into a CodeMirror editor
            view_source_editor = CodeMirror.fromTextArea('view_source_textarea', {
                width: width + 'px',
                height: height + 'px',
                readOnly: true,
                parserfile: 'parsecss.js',
                stylesheet: 'codemirror/css/csscolors.css',
                path: 'codemirror/js/',
                continuousScanning: 500,
                lineNumbers: true,
                indentUnit: 4,
                initCallback: function() {view_source_editor.focus()} // this places cursor in editor (we have to do this in a callback or else cursor disappears in Firefox)
            });
            
            // resize the theme designer so that preview will not jump way down when this dialog is opened
            resize_theme_designer();
        },
        close: function() {
            // remove the CodeMirror editor
            $('.CodeMirror-wrapping').remove();
        },
        resize: function() {
            // resize CodeMirror editor because the dialog has been resized
            $('.CodeMirror-wrapping').css({'width': parseInt($('.standard.ui-dialog').width() - 100)});
            $('.CodeMirror-wrapping').css({'height': parseInt($('.standard.ui-dialog').height() - 130)});
        }
    });
}

// the following code is a minified version of http://www.json.org/json2.js
// it is used by the style designer to prepare a JSON string to be submitted to a PHP script
// this is necessary because some older browsers don't support the JSON object
if(!this.JSON){this.JSON={};}
(function(){function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());
//-->