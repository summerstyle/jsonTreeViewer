/*
 * JSON Tree Viewer
 * http://github.com/summerstyle/jsonTreeViewer
 *
 * Copyright 2017 Vera Lobacheva (http://iamvera.com)
 * Released under the MIT license (LICENSE.txt)
 */

'use strict';

var jsonTreeViewer = (function() {

    /* Utilities */
    var utils = App.utils;
    
    var treeWrapper = document.getElementById("tree");
    var tree = jsonTree.create({}, treeWrapper);
    
    // Menu
    var menu = new App.Menu(utils.dom.id('nav'), {
        'load_button' : function() {
            load_json_form.show();
        },
        'expand_button' : function() {
            tree.expand();
        },
        'collapse_button' : function() {
            tree.collapse();
        },
        'help_button' : function() {
            help.show();
        } 
    });


    /* Load json form */
    var load_json_form = new App.Window({
        content_el : utils.dom.id('load_json_form'),
        overlay : true,
        js_module : function(self) {
            var form = self.content_el,
                code_input = document.getElementById('code_input'),
                load_button = document.getElementById('load_code_button');
            
            function load(e) {
                jsonTreeViewer.parse(code_input.value);
                self.hide();
                code_input.value = '';
            
                e.preventDefault();
            }
            
            load_button.addEventListener('click', load, false);
        }
    });
    
    
    /* Help block */
    var help = new App.Window({
        content_el : document.getElementById('help'),
        overlay : true
    });
    
    
    return {
        parse : function(json_str) {
            var temp;
            
            try {
                temp = JSON.parse(json_str);
            } catch(e) {
                alert(e);
            }
            
            tree.loadData(temp);
        }
    };
})();
