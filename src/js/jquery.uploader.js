/*!
 * jquery.uploader

 * Simple HTML5 file uploader
 * Copyright (c) 2017 Radoslav Salov
 * Distributed under MIT license
 * Portions of the project are licensed under Apache 2.0
 * Copyright for portions of the project are held by:
 * CreativeDream (c) 2016 ( https://github.com/CreativeDream/jQuery.filer )
 */
 
 
/* 
(function( $ ){

    var methods = {
        init : function(options) {

        },
        show : function( ) {    },// IS
        hide : function( ) {  },// GOOD
        update : function( content ) {  }// !!!
    };

    $.fn.tooltip = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
        }    
    };


})( jQuery );
*/ 
 
(function ($) {
    "use strict";
    
    var Uploader = function () {
        this.initialize.apply(this, arguments);
    };
    
    $.extend(Uploader.prototype, {
        
        'initialize': function (el, idx, options) {
            this.el = el;
            this.idx = idx;
            this.$el = $(el);
            // Set options
            this.options = options;
            this.getOptionsFromAttributes();
            
            // Public access
            this.$public = {
                'options': this.options,
                'inputEl': this.$el,
                'boxEl': null,
                'newEl': null
            };
            this.$el.data('uploader', this.$public);
            
            // Rended the input
            this.render();
        },
        
        'getOptionsFromAttributes': function () {
            var allowed = [
                "name", 
                "limit", 
                "maxSize", 
                "allowExt", 
                "allowDuplicates", 
                "replaceInput", 
                "showThumbs", 
                "appendTo", 
                "theme", 
                "options", 
                "files"
            ];
            
            var idx, key, data;
            for (idx in allowed) {
                key = allowed[idx];
                data = this.$el.data(key);
                if (typeof data !== 'undefined') {
                    if (["allowDuplicates", "showThumbs", "replaceInput"].indexOf(key) > -1) {
                        this.options[key] = (data === 'true');
                    } else if (["maxSize", "limit"].indexOf(key) > -1) {
                        this.options[key] = parseInt(data, 10);
                    } else if (key === 'allowExt') {
                        this.options[key] = data.replace(/ /g, '').split(",");
                    } else {
                        this.options[key] = data;
                    }
                }
            }
        },
        
        'render': function () {
            this.$el.wrap('<div class="uploader"></div>');
            this.$boxEl = $(this.$el.closest('.uploader'));
            
            // Add theme class
            if (this.options.theme) {
                this.$boxEl.addClass('uploader-theme-' + this.options.theme);
            }
            
            // Before render hook
            if (this.options.beforeRender !== null && typeof this.options.beforeRender === "function") {
                this.options.beforeRender(this.$boxEl, this.$el);
            }
            
            if (this.$el.get(0).tagName.toLowerCase() !== "input" && this.$el.get(0).type !== "file") {
                this.$newEl = this.$el;
                this.$el = $('<input type="file" name="' + this.options.name + '">');
                this.$boxEl.prepend(this.$el);
            } else {
                if (this.options.replaceInput) {
                    if (typeof this.options.replaceInput === 'boolean' && this.options.replaceInput) {
                        this.$newEl = $('<div class="uploader-input"><div class="uploader-input-caption"><span>' + this.options.captions.feedback + '</span></div><div class="uploader-input-button">' + this.options.captions.button + '</div></div>');
                    } else if (["object", "string"].indexOf(typeof this.options.replaceInput) > -1) {
                        this.$newEl = $(this.options.replaceInput);
                    } else if (typeof this.options.replaceInput === 'function') {
                        this.$newEl = $(this.options.replaceInput(this.$boxEl, this.$el, this.options));
                    }
                    if (this.$newEl) {
                        this.$el.after(this.$newEl);
                    }
                }
            }
            
            this.$el.css({
                'position': 'absolute',
                'left': '-9999px',
                'top': '-9999px',
                'z-index': '-9999'
            });
            
            this.$public.boxEl = this.$boxEl;
            this.$public.newEl = this.$newEl;
            
            if (this.options.dragDrop) {
                this.options.dragDrop.container = (this.options.dragDrop.container ? $(this.options.dragDrop.container) : this.$newEl);
            }
            if (!this.options.limit || (this.options.limit && this.options.limit > 1)) {
                this.$el.attr("multiple", "multiple");
                if (this.$el.attr("name").slice(-2) !== "[]") {
                    this.$el.attr("name", this.$el.attr("name") + "[]");
                }
            }
            if (!this.$el.attr("disabled") && !this.options.disabled) {
                this.options.disabled = false;
                //~ f._bindInput();
                this.$boxEl.removeClass("uploader-disabled");
            } else {
                this.options.disabled = true;
                //~ f._unbindInput(true);
                this.$boxEl.addClass("uploader-disabled");
            }
            //~ if (this.options.files) {
                //~ f._append(false, {
                    //~ files: this.options.files
                //~ });
            //~ }
            
            // After render hook
            if (this.options.afterRender !== null && typeof this.options.afterRender === "function") {
                this.options.afterRender(this.$boxEl, this.$el, this.$newEl);
            }
        },
        
    });
    
    $.fn.uploader = function (options) {
        
        var opts = $.extend({}, $.fn.uploader.defaults, options);
        
        return this.each(function (idx, elem) {
            var upl = new Uploader(elem, idx, opts);

            return this;
        });
    };
    
    $.fn.uploader.defaults = {
        'limit': null,
        'maxSize': null,
        'allowExt': null,
        'replaceInput': true,
        'showThumbs': false,
        'appendTo': null,
        'theme': 'default',
        'templates': {
            'box': '<ul class="uploader-items-list uploader-items-default"></ul>',
            'item': '<li class="uploader-item"><div class="uploader-item-container"><div class="uploader-item-inner"><div class="uploader-item-icon pull-left">{{fi-icon}}</div><div class="uploader-item-info pull-left"><div class="uploader-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</div><div class="uploader-item-others"><span>size: {{fi-size2}}</span><span>type: {{fi-extension}}</span><span class="uploader-item-status">{{fi-progressBar}}</span></div><div class="uploader-item-assets"><ul class="list-inline"><li><a class="{{fi-trash}} uploader-item-trash-action"></a></li></ul></div></div></div></div></li>',
            'itemAppend': '<li class="uploader-item"><div class="uploader-item-container"><div class="uploader-item-inner"><div class="uploader-item-icon pull-left">{{fi-icon}}</div><div class="uploader-item-info pull-left"><div class="uploader-item-title">{{fi-name | limitTo:35}}</div><div class="uploader-item-others"><span>size: {{fi-size2}}</span><span>type: {{fi-extension}}</span><span class="uploader-item-status"></span></div><div class="uploader-item-assets"><ul class="list-inline"><li><a class="{{fi-trash}} uploader-item-trash-action"></a></li></ul></div></div></div></div></li>',
            'progressBar': '<div class="bar"></div>',
            'itemAppendToEnd': false,
            'removeConfirmation': true,
            'canvasImage': true,
            'selectors': {
                'list': '.uploader-items-list',
                'item': '.uploader-item',
                'progressBar': '.bar',
                'remove': '.uploader-item-trash-action'
            }
        },
        'files': null,
        'uploadFile': null,
        'dragDrop': null,
        'addMore': false,
        'allowDuplicates': false,
        'clipBoardPaste': true,
        'excludeName': null,
        'beforeRender': null,
        'afterRender': null,
        'beforeShow': null,
        'beforeSelect': null,
        'onSelect': null,
        'onFileCheck': null,
        'afterShow': null,
        'onRemove': null,
        'onEmpty': null,
        'options': null,
        'dialogs': {
            'alert': function (text) {
                return alert(text);
            },
            'confirm': function (text, cb) {
                if (confirm(text)) {
                    cb();
                }
            }
        },
        'captions': {
            'button': "Choose Files",
            'feedback': "Choose files To Upload",
            'feedback2': "files were chosen",
            'drop': "Drop file here to Upload",
            'removeConfirmation': "Are you sure you want to remove this file?",
            'errors': {
                'filesLimit': "Only {{fi-limit}} files are allowed to be uploaded.",
                'filesType': "Only Images are allowed to be uploaded.",
                'filesSize': "{{fi-name}} is too large! Please upload file up to {{fi-fileMaxSize}} MB.",
                'filesSizeAll': "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB.",
                'folderUpload': "You are not allowed to upload folders."
            }
        },
        'icons': {
            'default': "fa",
            'trash': "fa-trash-o",
            'file': "fa-file-o",
            'image': "fa-file-image-o",
            'video': "fa-file-video-o",
            'audio': "fa-file-audio-o",
            'code': "fa-file-code-o",
            'xls': "fa-file-excel-o",
            'pdf': "fa-file-pdf-o",
            'ppt': "fa-file-powerpoint-o",
            'text': "fa-file-text-o",
            'odt': "fa-file-text-o",
            'doc': "fa-file-word-o",
            'docx': "fa-file-word-o",
            'zip': "fa-file-zip-o"
        }
    };

    
})(jQuery);
