/*!
 * jquery.uploader

 * Simple HTML5 file uploader
 * Copyright (c) 2017 Radoslav Salov
 * Distributed under MIT license
 * Portions of the project are licensed under Apache 2.0
 * Copyright for portions of the project are held by:
 * CreativeDream (c) 2016 ( https://github.com/CreativeDream/jQuery.filer )
 */
 
(function ($) {
    "use strict";
    
    $.fn.uploader = function (options) {
        
        var opts = $.extend({}, $.fn.uploader.defaults, options);
        
        return this.each(function (idx, elem) {
            var $el = $(elem),
                b = '.uploader',
                p = $(),
                o = $(),
                l = $(),
                sl = [],
                f = {
                    init: function () {
                        $el.wrap('<div class="uploader"></div>');
                        f._set('props');
                        $el.prop("uploader").boxEl = p = $el.closest(b);
                        f._changeInput();
                    },
                    _bindInput: function () {
                        if (opts.changeInput && o.length > 0) {
                            o.on("click", f._clickHandler);
                        }
                        $el.on({
                            "focus": function () {
                                o.addClass('focused');
                            },
                            "blur": function () {
                                o.removeClass('focused');
                            },
                            "change": f._onChange
                        });
                        if (opts.dragDrop) {
                            opts.dragDrop.dragContainer.on("drag dragstart dragend dragover dragenter dragleave drop", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                            });
                            opts.dragDrop.dragContainer.on("drop", f._dragDrop.drop);
                            opts.dragDrop.dragContainer.on("dragover", f._dragDrop.dragEnter);
                            opts.dragDrop.dragContainer.on("dragleave", f._dragDrop.dragLeave);
                        }
                        if (opts.uploadFile && opts.clipBoardPaste) {
                            $(window)
                                .on("paste", f._clipboardPaste);
                        }
                    },
                    _unbindInput: function (all) {
                        if (opts.changeInput && o.length > 0) {
                            o.off("click", f._clickHandler);
                        }

                        if (all) {
                            $el.off("change", f._onChange);
                            if (opts.dragDrop) {
                                opts.dragDrop.dragContainer.off("drop", f._dragDrop.drop);
                                opts.dragDrop.dragContainer.off("dragover", f._dragDrop.dragEnter);
                                opts.dragDrop.dragContainer.off("dragleave", f._dragDrop.dragLeave);
                            }
                            if (opts.uploadFile && opts.clipBoardPaste) {
                                $(window)
                                    .off("paste", f._clipboardPaste);
                            }
                        }
                    },
                    _clickHandler: function () {
                        if (!opts.uploadFile && opts.addMore && $el.val().length !== 0) {
                            f._unbindInput(true);
                            var elem = $('<input type="file" />');
                            var attributes = $el.prop("attributes");
                            $.each(attributes, function () {
                                if (this.name === "required") {
                                    return;
                                }
                                elem.attr(this.name, this.value);
                            });
                            $el.after(elem);
                            sl.push(elem);
                            $el = elem;
                            f._bindInput();
                            f._set('props');
                        }
                        $el.click();
                    },
                    _applyAttrSettings: function () {
                        var d = ["name", "limit", "maxSize", "fileMaxSize", "extensions", "changeInput", "showThumbs", "appendTo", "theme", "addMore", "excludeName", "files", "uploadUrl", "uploadData", "options"];
                        for (var k in d) {
                            var j = "data-uploader-" + d[k];
                            if (f._assets.hasAttr(j)) {
                                switch (d[k]) {
                                    case "changeInput":
                                    case "showThumbs":
                                    case "addMore":
                                        opts[d[k]] = (["true", "false"].indexOf($el.attr(j)) > -1 ? $el.attr(j) === "true" : $el.attr(j));
                                        break;
                                    case "extensions":
                                        opts[d[k]] = $el.attr(j)
                                            .replace(/ /g, '')
                                            .split(",");
                                        break;
                                    case "uploadUrl":
                                        if (opts.uploadFile) {
                                            opts.uploadFile.url = $el.attr(j);
                                        }
                                        break;
                                    case "uploadData":
                                        if (opts.uploadFile) {
                                            opts.uploadFile.data = JSON.parse($el.attr(j));
                                        }
                                        break;
                                    case "files":
                                    case "options":
                                        opts[d[k]] = JSON.parse($el.attr(j));
                                        break;
                                    default:
                                        opts[d[k]] = $el.attr(j);
                                }
                                $el.removeAttr(j);
                            }
                        }
                    },
                    _changeInput: function () {
                        f._applyAttrSettings();
                        if (opts.beforeRender !== null && typeof opts.beforeRender === "function") {
                            opts.beforeRender(p, $el);
                        }
                        if (opts.theme) {
                            p.addClass('uploader-theme-' + opts.theme);
                        }
                        if ($el.get(0)
                            .tagName.toLowerCase() !== "input" && $el.get(0)
                            .type !== "file") {
                            o = $el;
                            $el = $("<input type=\"file\" name=\"" + opts.name + "\" />");
                            $el.css({
                                position: "absolute",
                                left: "-9999px",
                                top: "-9999px",
                                "z-index": "-9999"
                            });
                            p.prepend($el);
                            f._isGn = $el;
                        } else {
                            if (opts.changeInput) {
                                switch (typeof opts.changeInput) {
                                    case "boolean":
                                        o = $('<div class="uploader-input"><div class="uploader-input-caption"><span>' + opts.captions.feedback + '</span></div><div class="uploader-input-button">' + opts.captions.button + '</div></div>');
                                        break;
                                    case "string":
                                    case "object":
                                        o = $(opts.changeInput);
                                        break;
                                    case "function":
                                        o = $(opts.changeInput(p, $el, opts));
                                        break;
                                }
                                $el.after(o);
                                $el.css({
                                    position: "absolute",
                                    left: "-9999px",
                                    top: "-9999px",
                                    "z-index": "-9999"
                                });
                            }
                        }
                        $el.prop("uploader").newInputEl = o;
                        if (opts.dragDrop) {
                            opts.dragDrop.dragContainer = opts.dragDrop.dragContainer ? $(opts.dragDrop.dragContainer) : o;
                        }
                        if (!opts.limit || (opts.limit && opts.limit >= 2)) {
                            $el.attr("multiple", "multiple");
                            if ($el.attr("name").slice(-2) !== "[]") {
                                $el.attr("name", $el.attr("name") + "[]");
                            }
                        }
                        if (!$el.attr("disabled") && !opts.disabled) {
                            opts.disabled = false;
                            f._bindInput();
                            p.removeClass("uploader-disabled");
                        } else {
                            opts.disabled = true;
                            f._unbindInput(true);
                            p.addClass("uploader-disabled");
                        }
                        if (opts.files) {
                            f._append(false, {
                                files: opts.files
                            });
                        }
                        if (opts.afterRender !== null && typeof opts.afterRender === "function") {
                            opts.afterRender(l, p, o, $el);
                        }
                    },
                    _clear: function () {
                        f.files = null;
                        $el.prop("uploader")
                            .files = null;
                        if (!opts.uploadFile && !opts.addMore) {
                            f._reset();
                        }
                        f._set('feedback', (f._itFl && f._itFl.length > 0 ? f._itFl.length + ' ' + opts.captions.feedback2 : opts.captions.feedback));
                        if (opts.onEmpty !== null && typeof opts.onEmpty === "function") {
                            opts.onEmpty(p, o, $el);
                        }
                    },
                    _reset: function (a) {
                        if (!a) {
                            if (!opts.uploadFile && opts.addMore) {
                                for (var i = 0; i < sl.length; i++) {
                                    sl[i].remove();
                                }
                                sl = [];
                                f._unbindInput(true);
                                if (f._isGn) {
                                    $el = f._isGn;
                                } else {
                                    $el = $(elem);
                                }
                                f._bindInput();
                            }
                            f._set('input', '');
                        }
                        f._itFl = [];
                        f._itFc = null;
                        f._ajFc = 0;
                        f._set('props');
                        $el.prop("uploader")
                            .files_list = f._itFl;
                        $el.prop("uploader")
                            .current_file = f._itFc;
                        f._itFr = [];
                        p.find("input[name^='uploader-items-exclude-']:hidden")
                            .remove();
                        l.fadeOut("fast", function () {
                            $(this)
                                .remove();
                        });
                        $el.prop("uploader").listEl = l = $();
                    },
                    _set: function (element, value) {
                        switch (element) {
                            case 'input':
                                $el.val(value);
                                break;
                            case 'feedback':
                                if (o.length > 0) {
                                    o.find('.uploader-input-caption span')
                                        .html(value);
                                }
                                break;
                            case 'props':
                                if (!$el.prop("uploader")) {
                                    $el.prop("uploader", {
                                        options: opts,
                                        listEl: l,
                                        boxEl: p,
                                        newInputEl: o,
                                        inputEl: $el,
                                        files: f.files,
                                        files_list: f._itFl,
                                        current_file: f._itFc,
                                        append: function (data) {
                                            return f._append(false, {
                                                files: [data]
                                            });
                                        },
                                        enable: function () {
                                            if (!opts.disabled) {
                                                return;
                                            }
                                            opts.disabled = false;
                                            $el.removeAttr("disabled");
                                            p.removeClass("uploader-disabled");
                                            f._bindInput();
                                        },
                                        disable: function () {
                                            if (opts.disabled) {
                                                return;
                                            }
                                            opts.disabled = true;
                                            p.addClass("uploader-disabled");
                                            f._unbindInput(true);
                                        },
                                        remove: function (id) {
                                            f._remove(null, {
                                                binded: true,
                                                data: {
                                                    id: id
                                                }
                                            });
                                            return true;
                                        },
                                        reset: function () {
                                            f._reset();
                                            f._clear();
                                            return true;
                                        },
                                        retry: function (data) {
                                            return f._retryUpload(data);
                                        }
                                    });
                                }
                        }
                    },
                    _filesCheck: function () {
                        var s = 0, m;
                        if (opts.limit && f.files.length + f._itFl.length > opts.limit) {
                            opts.dialogs.alert(f._assets.textParse(opts.captions.errors.filesLimit));
                            return false;
                        }
                        for (var t = 0; t < f.files.length; t++) {
                            var file = f.files[t],
                                x = file.name.split(".")
                                    .pop()
                                    .toLowerCase();
                            m = {
                                name: file.name,
                                size: file.size,
                                size2: f._assets.bytesToSize(file.size),
                                type: file.type,
                                ext: x
                            };
                            if (opts.extensions !== null && $.inArray(x, opts.extensions) === -1 && $.inArray(m.type, opts.extensions) === -1) {
                                opts.dialogs.alert(f._assets.textParse(opts.captions.errors.filesType, m));
                                return false;
                            }
                            if ((opts.maxSize !== null && f.files[t].size > opts.maxSize * 1048576) || (opts.fileMaxSize !== null && f.files[t].size > opts.fileMaxSize * 1048576)) {
                                opts.dialogs.alert(f._assets.textParse(opts.captions.errors.filesSize, m));
                                return false;
                            }
                            if (file.size === 4096 && file.type.length === 0) {
                                opts.dialogs.alert(f._assets.textParse(opts.captions.errors.folderUpload, m));
                                return false;
                            }
                            if (opts.onFileCheck !== null && typeof opts.onFileCheck === "function" ? opts.onFileCheck(m, opts, f._assets.textParse) === false : null) {
                                return false;
                            }

                            if ((opts.uploadFile || opts.addMore) && !opts.allowDuplicates) {
                                m = f._itFl.filter(function (a) {
                                    if (a.file.name === file.name && a.file.size === file.size && a.file.type === file.type && (file.lastModified ? a.file.lastModified === file.lastModified : true)) {
                                        return true;
                                    }
                                });
                                if (m.length > 0) {
                                    if (f.files.length === 1) {
                                        return false;
                                    } else {
                                        file._pendRemove = true;
                                    }
                                }
                            }

                            s += f.files[t].size;
                        }
                        if (opts.maxSize !== null && s >= Math.round(opts.maxSize * 1048576)) {
                            opts.dialogs.alert(f._assets.textParse(opts.captions.errors.filesSizeAll));
                            return false;
                        }
                        return true;
                    },
                    _thumbCreator: {
                        create: function (i) {
                            var file = f.files[i],
                                id = (f._itFc ? f._itFc.id : i),
                                name = file.name,
                                size = file.size,
                                url = file.file,
                                type = file.type ? file.type.split("/", 1) : ""
                                .toString()
                                .toLowerCase(),
                                ext = name.indexOf(".") !== -1 ? name.split(".")
                                .pop()
                                .toLowerCase() : "",
                                progressBar = opts.uploadFile ? '<div class="uploader-progress">' + opts.templates.progressBar + '</div>' : '',
                                opts2 = {
                                    id: id,
                                    name: name,
                                    size: size,
                                    size2: f._assets.bytesToSize(size),
                                    url: url,
                                    type: type,
                                    extension: ext,
                                    trash: opts.icons['default'] + ' ' + opts.icons['trash'],
                                    icon: f._assets.getIcon(ext, type),
                                    icon2: f._thumbCreator.generateIcon({
                                        type: type,
                                        extension: ext
                                    }),
                                    image: '<div class="uploader-item-thumb-image fi-loading"></div>',
                                    progressBar: progressBar,
                                    _appended: file._appended
                                },
                                html = "";
                            if (file.opts2) {
                                opts2 = $.extend({}, file.opts2, opts2);
                            }
                            html = $(f._thumbCreator.renderContent(opts2))
                                .attr("data-uploader-index", id);
                            html.get(0)
                                .uploader_id = id;
                            f._thumbCreator.renderFile(file, html, opts2);
                            if (file.forList) {
                                return html;
                            }
                            f._itFc.html = html;
                            html.hide()[opts.templates.itemAppendToEnd ? "appendTo" : "prependTo"](l.find(opts.templates.selectors.list))
                                .show();
                            if (!file._appended) {
                                f._onSelect(i);
                            }
                        },
                        renderContent: function (opts2) {
                            return f._assets.textParse((opts2._appended ? opts.templates.itemAppend : opts.templates.item), opts2);
                        },
                        renderFile: function (file, html, opts2) {
                            var g, m;
                            if (html.find('.uploader-item-thumb-image')
                                .length === 0) {
                                return false;
                            }
                            if (file.file && opts2.type === "image") {
                                g = '<img src="' + file.file + '" draggable="false" />';
                                m = html.find('.uploader-item-thumb-image.fi-loading');
                                
                                $(g)
                                    .error(function () {
                                        g = f._thumbCreator.generateIcon(opts2);
                                        html.addClass('uploader-no-thumbnail');
                                        m.removeClass('fi-loading')
                                            .html(g);
                                    })
                                    .load(function () {
                                        m.removeClass('fi-loading')
                                            .html(g);
                                    });
                                return true;
                            }
                            if (window.File && window.FileList && window.FileReader && opts2.type === "image" && opts2.size < 1e+7) {
                                var y = new FileReader();
                                y.onload = function (e) {
                                    m = html.find('.uploader-item-thumb-image.fi-loading');
                                    if (opts.templates.canvasImage) {
                                        var canvas = document.createElement('canvas'),
                                            context = canvas.getContext('2d'),
                                            img = new Image();

                                        img.onload = function () {
                                            var height = m.height(),
                                                width = m.width(),
                                                heightRatio = img.height / height,
                                                widthRatio = img.width / width,
                                                optimalRatio = heightRatio < widthRatio ? heightRatio : widthRatio,
                                                optimalHeight = img.height / optimalRatio,
                                                optimalWidth = img.width / optimalRatio,
                                                steps = Math.ceil(Math.log(img.width / optimalWidth) / Math.log(2));

                                            canvas.height = height;
                                            canvas.width = width;

                                            if (img.width < canvas.width || img.height < canvas.height || steps <= 1) {
                                                var x = img.width < canvas.width ? canvas.width / 2 - img.width / 2 : img.width > canvas.width ? -(img.width - canvas.width) / 2 : 0,
                                                    y = img.height < canvas.height ? canvas.height / 2 - img.height / 2 : 0;
                                                context.drawImage(img, x, y, img.width, img.height);
                                            } else {
                                                var oc = document.createElement('canvas'),
                                                    octx = oc.getContext('2d');
                                                oc.width = img.width * 0.5;
                                                oc.height = img.height * 0.5;
                                                octx.fillStyle = "#fff";
                                                octx.fillRect(0, 0, oc.width, oc.height);
                                                octx.drawImage(img, 0, 0, oc.width, oc.height);
                                                octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

                                                context.drawImage(oc, optimalWidth > canvas.width ? optimalWidth - canvas.width : 0, 0, oc.width * 0.5, oc.height * 0.5, 0, 0, optimalWidth, optimalHeight);
                                            }
                                            m.removeClass('fi-loading').html('<img src="' + canvas.toDataURL("image/png") + '" draggable="false" />');
                                        };
                                        img.onerror = function () {
                                            html.addClass('uploader-no-thumbnail');
                                            m.removeClass('fi-loading')
                                                .html(f._thumbCreator.generateIcon(opts2));
                                        };
                                        img.src = e.target.result;
                                    } else {
                                        m.removeClass('fi-loading').html('<img src="' + e.target.result + '" draggable="false" />');
                                    }
                                };
                                y.readAsDataURL(file);
                            } else {
                                g = f._thumbCreator.generateIcon(opts2);
                                m = html.find('.uploader-item-thumb-image.fi-loading');
                                
                                html.addClass('uploader-no-thumbnail');
                                m.removeClass('fi-loading')
                                    .html(g);
                            }
                        },
                        generateIcon: function (obj) {
                            var m = new Array(3);
                            if (obj && obj.type && obj.type[0] && obj.extension) {
                                switch (obj.type[0]) {
                                    case "image":
                                        m[0] = "f-image";
                                        m[1] = "<i class=\"" + opts.icons['default'] + " " + opts.icons['image'] + "\"></i>";
                                        break;
                                    case "video":
                                        m[0] = "f-video";
                                        m[1] = "<i class=\"" + opts.icons['default'] + " " + opts.icons['video'] + "\"></i>";
                                        break;
                                    case "audio":
                                        m[0] = "f-audio";
                                        m[1] = "<i class=\"" + opts.icons['default'] + " " + opts.icons['audio'] + "\"></i>";
                                        break;
                                    default:
                                        m[0] = "f-file f-file-ext-" + obj.extension;
                                        m[1] = (obj.extension.length > 0 ? "." + obj.extension : "");
                                        m[2] = 1;
                                }
                            } else {
                                m[0] = "f-file";
                                m[1] = (obj.extension && obj.extension.length > 0 ? "." + obj.extension : "");
                                m[2] = 1;
                            }
                            var el = '<span class="uploader-icon-file ' + m[0] + '">' + m[1] + '</span>';
                            if (m[2] === 1) {
                                var c = f._assets.text2Color(obj.extension);
                                if (c) {
                                    var j = $(el)
                                        .appendTo("body");

                                    j.css('background-color', f._assets.text2Color(obj.extension));
                                    el = j.prop('outerHTML');
                                    j.remove();
                                }
                            }
                            return el;
                        },
                        _box: function (params) {
                            var appendTo;
                            if (opts.beforeShow !== null && typeof opts.beforeShow === "function" ? !opts.beforeShow(f.files, l, p, o, $el) : false) {
                                return false;
                            }
                            if (l.length < 1) {
                                if (opts.appendTo) {
                                    appendTo = $(opts.appendTo);
                                } else {
                                    appendTo = p;
                                }
                                appendTo.find('.uploader-items')
                                    .remove();
                                l = $('<div class="uploader-items uploader-row"></div>');
                                $el.prop("uploader").listEl = l;
                                l.append(f._assets.textParse(opts.templates.box))
                                    .appendTo(appendTo);
                                l.on('click', opts.templates.selectors.remove, function (e) {
                                    e.preventDefault();
                                    var m = [params ? params.remove.event : e, params ? params.remove.el : $(this).closest(opts.templates.selectors.item)],
                                        c = function () {
                                            f._remove(m[0], m[1]);
                                        };
                                    if (opts.templates.removeConfirmation) {
                                        opts.dialogs.confirm(opts.captions.removeConfirmation, c);
                                    } else {
                                        c();
                                    }
                                });
                            }
                            for (var i = 0; i < f.files.length; i++) {
                                if (!f.files[i]._appended) {
                                    f.files[i]._choosed = true;
                                }
                                f._addToMemory(i);
                                f._thumbCreator.create(i);
                            }
                        }
                    },
                    _upload: function (i) {
                        var c = f._itFl[i],
                            el = c.html,
                            formData = new FormData();
                        formData.append($el.attr('name'), c.file, (c.file.name ? c.file.name : false));
                        if (opts.uploadFile.data !== null && $.isPlainObject(typeof(opts.uploadFile.data) === "function" ? opts.uploadFile.data(c.file) : opts.uploadFile.data)) {
                            for (var k in opts.uploadFile.data) {
                                formData.append(k, opts.uploadFile.data[k]);
                            }
                        }

                        f._ajax.send(el, formData, c);
                    },
                    _ajax: {
                        send: function (el, formData, c) {
                            c.ajax = $.ajax({
                                url: opts.uploadFile.url,
                                data: formData,
                                type: opts.uploadFile.type,
                                enctype: opts.uploadFile.enctype,
                                headers: opts.uploadFile.headers || {},
                                xhr: function () {
                                    var myXhr = $.ajaxSettings.xhr();
                                    if (myXhr.upload) {
                                        myXhr.upload.addEventListener("progress", function (e) {
                                            f._ajax.progressHandling(e, el);
                                        }, false);
                                    }
                                    return myXhr;
                                },
                                complete: function (jqXHR, textStatus) {
                                    c.ajax = false;
                                    f._ajFc++;

                                    if (opts.uploadFile.synchron && c.id + 1 < f._itFl.length) {
                                        f._upload(c.id + 1);
                                    }

                                    if (f._ajFc >= f.files.length) {
                                        f._ajFc = 0;
                                        $el.get(0).value = "";
                                        if (opts.uploadFile.onComplete !== null && typeof opts.uploadFile.onComplete === "function") {
                                            opts.uploadFile.onComplete(l, p, o, $el, jqXHR, textStatus);
                                        }
                                    }
                                },
                                beforeSend: function (jqXHR, settings) {
                                    return opts.uploadFile.beforeSend !== null && typeof opts.uploadFile.beforeSend === "function" ? opts.uploadFile.beforeSend(el, l, p, o, $el, c.id, jqXHR, settings) : true;
                                },
                                success: function (data, textStatus, jqXHR) {
                                    c.uploaded = true;
                                    if (opts.uploadFile.success !== null && typeof opts.uploadFile.success === "function") {
                                        opts.uploadFile.success(data, el, l, p, o, $el, c.id, textStatus, jqXHR);
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    c.uploaded = false;
                                    if (opts.uploadFile.error !== null && typeof opts.uploadFile.error === "function") {
                                        opts.uploadFile.error(el, l, p, o, $el, c.id, jqXHR, textStatus, errorThrown);
                                    }
                                },
                                statusCode: opts.uploadFile.statusCode,
                                cache: false,
                                contentType: false,
                                processData: false
                            });
                            return c.ajax;
                        },
                        progressHandling: function (e, el) {
                            if (e.lengthComputable) {
                                var t = Math.round(e.loaded * 100 / e.total).toString();
                                if (opts.uploadFile.onProgress !== null && typeof opts.uploadFile.onProgress === "function") {
                                    opts.uploadFile.onProgress(t, el, l, p, o, $el);
                                }
                                el.find('.uploader-progress')
                                    .find(opts.templates.selectors.progressBar)
                                    .css("width", t + "%");
                            }
                        }
                    },
                    _dragDrop: {
                        dragEnter: function (e) {
                            clearTimeout(f._dragDrop._drt);
                            opts.dragDrop.dragContainer.addClass('dragged');
                            f._set('feedback', opts.captions.drop);
                            if (opts.dragDrop.dragEnter !== null && typeof opts.dragDrop.dragEnter === "function") {
                                opts.dragDrop.dragEnter(e, o, $el, p);
                            }
                        },
                        dragLeave: function (e) {
                            clearTimeout(f._dragDrop._drt);
                            f._dragDrop._drt = setTimeout(function (e) {
                                if (!f._dragDrop._dragLeaveCheck(e)) {
                                    f._dragDrop.dragLeave(e);
                                    return false;
                                }
                                opts.dragDrop.dragContainer.removeClass('dragged');
                                f._set('feedback', opts.captions.feedback);
                                if (opts.dragDrop.dragLeave !== null && typeof opts.dragDrop.dragLeave === "function") {
                                    opts.dragDrop.dragLeave(e, o, $el, p);
                                }
                            }, 100, e);
                        },
                        drop: function (e) {
                            clearTimeout(f._dragDrop._drt);
                            opts.dragDrop.dragContainer.removeClass('dragged');
                            f._set('feedback', opts.captions.feedback);
                            if (e && e.originalEvent && e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files.length > 0) {
                                f._onChange(e, e.originalEvent.dataTransfer.files);
                            }
                            if (opts.dragDrop.drop !== null && typeof opts.dragDrop.drop === "function") {
                                opts.dragDrop.drop(e.originalEvent.dataTransfer.files, e, o, $el, p);
                            }
                        },
                        _dragLeaveCheck: function (e) {
                            var related = $(e.currentTarget),
                                insideEls = 0;
                            if (!related.is(o)) {
                                insideEls = o.find(related).length;

                                if (insideEls > 0) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    },
                    _clipboardPaste: function (e, fromDrop) {
                        if (!fromDrop && (!e.originalEvent.clipboardData && !e.originalEvent.clipboardData.items)) {
                            return;
                        }
                        if (fromDrop && (!e.originalEvent.dataTransfer && !e.originalEvent.dataTransfer.items)) {
                            return;
                        }
                        if (f._clPsePre) {
                            return;
                        }
                        var items = (fromDrop ? e.originalEvent.dataTransfer.items : e.originalEvent.clipboardData.items),
                            b64toBlob = function (b64Data, contentType, sliceSize) {
                                contentType = contentType || '';
                                sliceSize = sliceSize || 512;
                                var byteCharacters = atob(b64Data);
                                var byteArrays = [];
                                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                                    var slice = byteCharacters.slice(offset, offset + sliceSize);
                                    var byteNumbers = new Array(slice.length);
                                    for (var i = 0; i < slice.length; i++) {
                                        byteNumbers[i] = slice.charCodeAt(i);
                                    }
                                    var byteArray = new Uint8Array(byteNumbers);
                                    byteArrays.push(byteArray);
                                }
                                var blob = new Blob(byteArrays, {
                                    type: contentType
                                });
                                return blob;
                            };
                        if (items) {
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("text/uri-list") !== -1) {
                                    if (fromDrop) {
                                        try {
                                            window.atob(e.originalEvent.dataTransfer.getData("text/uri-list")
                                                .toString()
                                                .split(',')[1]);
                                        } catch (error) {
                                            return;
                                        }
                                    }
                                    var blob = (fromDrop ? b64toBlob(e.originalEvent.dataTransfer.getData("text/uri-list")
                                        .toString()
                                        .split(',')[1], "image/png") : items[i].getAsFile());
                                    blob.name = Math.random()
                                        .toString(36)
                                        .substring(5);
                                    blob.name += blob.type.indexOf("/") !== -1 ? "." + blob.type.split("/")[1].toString()
                                        .toLowerCase() : ".png";
                                    f._onChange(e, [blob]);
                                    f._clPsePre = setTimeout(function () {
                                        delete f._clPsePre;
                                    }, 1000);
                                }
                            }
                        }
                    },
                    _onSelect: function (i) {
                        if (opts.uploadFile && !$.isEmptyObject(opts.uploadFile)) {
                            if (!opts.uploadFile.synchron || (opts.uploadFile.synchron && $.grep(f._itFl, function (a) {
                                    return a.ajax;
                                }).length === 0)) {
                                f._upload(f._itFc.id);
                            }
                        }
                        if (f.files[i]._pendRemove) {
                            f._itFc.html.hide();
                            f._remove(null, {
                                binded: true,
                                data: {
                                    id: f._itFc.id
                                }
                            });
                        }
                        if (opts.onSelect !== null && typeof opts.onSelect === "function") {
                            opts.onSelect(f.files[i], f._itFc.html, l, p, o, $el);
                        }
                        if (i + 1 >= f.files.length) {
                            if (opts.afterShow !== null && typeof opts.afterShow === "function") {
                                opts.afterShow(l, p, o, $el);
                            }
                        }
                    },
                    _onChange: function (e, d) {
                        if (!d) {
                            if (!$el.get(0)
                                .files || typeof $el.get(0)
                                .files === "undefined" || $el.get(0)
                                .files.length === 0) {
                                if (!opts.uploadFile && !opts.addMore) {
                                    f._set('input', '');
                                    f._clear();
                                }
                                return false;
                            }
                            f.files = $el.get(0)
                                .files;
                        } else {
                            if (!d || d.length === 0) {
                                f._set('input', '');
                                f._clear();
                                return false;
                            }
                            f.files = d;
                        }
                        if (!opts.uploadFile && !opts.addMore) {
                            f._reset(true);
                        }
                        $el.prop("uploader")
                            .files = f.files;
                        if (!f._filesCheck() || (opts.beforeSelect !== null && typeof opts.beforeSelect === "function" ? !opts.beforeSelect(f.files, l, p, o, $el) : false)) {
                            f._set('input', '');
                            f._clear();
                            if (opts.addMore && sl.length > 0) {
                                f._unbindInput(true);
                                sl[sl.length - 1].remove();
                                sl.splice(sl.length - 1, 1);
                                $el = sl.length > 0 ? sl[sl.length - 1] : $(elem);
                                f._bindInput();
                            }
                            return false;
                        }
                        f._set('feedback', f.files.length + f._itFl.length + ' ' + opts.captions.feedback2);
                        if (opts.showThumbs) {
                            f._thumbCreator._box();
                        } else {
                            for (var i = 0; i < f.files.length; i++) {
                                f.files[i]._choosed = true;
                                f._addToMemory(i);
                                f._onSelect(i);
                            }
                        }
                    },
                    _append: function (e, data) {
                        var files = (!data ? false : data.files);
                        if (!files || files.length <= 0) {
                            return;
                        }
                        f.files = files;
                        $el.prop("uploader")
                            .files = f.files;
                        if (opts.showThumbs) {
                            for (var i = 0; i < f.files.length; i++) {
                                f.files[i]._appended = true;
                            }
                            f._thumbCreator._box();
                        }
                    },
                    _getList: function (e, data) {
                        var files = (!data ? false : data.files);
                        if (!files || files.length <= 0) {
                            return;
                        }
                        f.files = files;
                        $el.prop("uploader")
                            .files = f.files;
                        if (opts.showThumbs) {
                            var returnData = [];
                            for (var i = 0; i < f.files.length; i++) {
                                f.files[i].forList = true;
                                returnData.push(f._thumbCreator.create(i));
                            }
                            if (data.callback) {
                                data.callback(returnData, l, p, o, $el);
                            }
                        }
                    },
                    _retryUpload: function (e, data) {
                        var id = parseInt(typeof data === "object" ? data.attr("data-uploader-index") : data),
                            obj = f._itFl.filter(function (value) {
                                return value.id === id;
                            });
                        if (obj.length > 0) {
                            if (opts.uploadFile && !$.isEmptyObject(opts.uploadFile) && !obj[0].uploaded) {
                                f._itFc = obj[0];
                                $el.prop("uploader")
                                    .current_file = f._itFc;
                                f._upload(id);
                                return true;
                            }
                        } else {
                            return false;
                        }
                    },
                    _remove: function (e, el) {
                        if (el.binded) {
                            if (typeof(el.data.id) !== "undefined") {
                                el = l.find(opts.templates.selectors.item + "[data-uploader-index='" + el.data.id + "']");
                                if (el.length === 0) {
                                    return false;
                                }
                            }
                            if (el.data.el) {
                                el = el.data.el;
                            }
                        }
                        var excl_input = function (val) {
                            var input = p.find("input[name^='uploader-items-exclude-']:hidden")
                                .first();

                            if (input.length === 0) {
                                input = $('<input type="hidden" name="uploader-items-exclude-' + (opts.excludeName ? opts.excludeName : ($el.attr("name")
                                    .slice(-2) !== "[]" ? $el.attr("name") : $el.attr("name")
                                    .substring(0, $el.attr("name")
                                        .length - 2)) + "-" + idx) + '">');
                                input.appendTo(p);
                            }

                            if (val && $.isArray(val)) {
                                val = JSON.stringify(val);
                                input.val(val);
                            }
                        };
                        var callback = function (el, id) {
                            var item = f._itFl[id],
                                val = [];

                            if (item.file._choosed || item.file._appended || item.uploaded) {
                                f._itFr.push(item);

                                var m = f._itFl.filter(function (a) {
                                    return a.file.name === item.file.name;
                                });

                                for (var i = 0; i < f._itFr.length; i++) {
                                    if (opts.addMore && f._itFr[i] === item && m.length > 0) {
                                        f._itFr[i].remove_name = m.indexOf(item) + "://" + f._itFr[i].file.name;
                                    }
                                    val.push(f._itFr[i].remove_name ? f._itFr[i].remove_name : f._itFr[i].file.name);
                                }
                            }
                            excl_input(val);
                            f._itFl.splice(id, 1);
                            if (f._itFl.length < 1) {
                                f._reset();
                                f._clear();
                            } else {
                                f._set('feedback', f._itFl.length + ' ' + opts.captions.feedback2);
                            }
                            el.fadeOut("fast", function () {
                                $(this)
                                    .remove();
                            });
                        };

                        var attrId = el.get(0).uploader_id || el.attr('data-uploader-index'),
                            id = null;
                            
                        attrId = parseInt(attrId, 10);
                        for (var key in f._itFl) {
                            if (key === 'length' || !f._itFl.hasOwnProperty(key)) {
                                continue;
                            }
                            if (f._itFl[key].id === attrId) {
                                id = key;
                            }
                        }
                        if (!f._itFl.hasOwnProperty(id)) {
                            return false;
                        }
                        if (f._itFl[id].ajax) {
                            f._itFl[id].ajax.abort();
                            callback(el, id);
                            return;
                        }
                        if (opts.onRemove !== null && typeof opts.onRemove === "function" ? opts.onRemove(el, f._itFl[id].file, id, l, p, o, $el) !== false : true) {
                            callback(el, id);
                        }
                    },
                    _addToMemory: function (i) {
                        f._itFl.push({
                            id: f._itFl.length,
                            file: f.files[i],
                            html: $(),
                            ajax: false,
                            uploaded: false,
                        });
                        if (opts.addMore || f.files[i]._appended) {
                            f._itFl[f._itFl.length - 1].input = $el;
                        }
                        f._itFc = f._itFl[f._itFl.length - 1];
                        $el.prop("uploader")
                            .files_list = f._itFl;
                        $el.prop("uploader")
                            .current_file = f._itFc;
                    },
                    _assets: {
                        bytesToSize: function (bytes) {
                            if (bytes === 0) {
                                return '0 Byte';
                            }
                            var k = 1000;
                            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                            var i = Math.floor(Math.log(bytes) / Math.log(k));
                            return (bytes / Math.pow(k, i))
                                .toPrecision(3) + ' ' + sizes[i];
                        },
                        hasAttr: function (attr, el) {
                            el = (!el ? $el : el);
                            var a = el.attr(attr);
                            if (!a || typeof a === "undefined") {
                                return false;
                            } else {
                                return true;
                            }
                        },
                        getIcon: function (ext, type) {
                            var fileIcon = opts.icons['default'] + ' ' + opts.icons['file'];
                            var typeIcon = (typeof opts.icons[type] !== 'undefined' ?  ' ' + opts.icons[type] : '');
                            var extIcon = (typeof opts.icons[ext] !== 'undefined' ? ' ' + opts.icons[ext] : '');
                            return '<i class="' + fileIcon + typeIcon + extIcon + '"></i>';
                        },
                        textParse: function (text, opts2) {
                            opts2 = $.extend({}, {
                                limit: opts.limit,
                                maxSize: opts.maxSize,
                                fileMaxSize: opts.fileMaxSize,
                                extensions: opts.extensions ? opts.extensions.join(',') : null,
                            }, (opts2 && $.isPlainObject(opts2) ? opts2 : {}), opts.options);
                            
                            if (typeof text === 'string') {
                                return text.replace(/\{\{fi-(.*?)\}\}/g, function (match, a) {
                                    a = a.replace(/ /g, '');
                                    if (a.match(/(.*?)\|limitTo\:(\d+)/)) {
                                        return a.replace(/(.*?)\|limitTo\:(\d+)/, function (match, a, b) {
                                            a = (opts2[a] ? opts2[a] : "");
                                            var str = a.substring(0, b);
                                            str = (a.length > str.length ? str.substring(0, str.length - 3) + "..." : str);
                                            return str;
                                        });
                                    } else {
                                        return (opts2[a] ? opts2[a] : "");
                                    }
                                });
                            } else if (typeof text === 'function') {
                                return text(opts2);
                            }
                            return text;
                        },
                        text2Color: function (str) {
                            if (!str || str.length === 0) {
                                return false;
                            }
                            var i, colour, hash = 0;
                            for (i = 0; i < str.length; i ++) {
                                hash = str.charCodeAt(i) + ((hash << 5) - hash);
                            }
                            for (i = 0; i < 3; i ++) {
                                colour = "#" + ("00" + ((hash >> i * 2) & 0xFF).toString(16)).slice(-2);
                            }
                            return colour;
                        }
                    },
                    files: null,
                    _itFl: [],
                    _itFc: null,
                    _itFr: [],
                    _itPl: [],
                    _ajFc: 0
                };

            $el.on("uploader.append", function (e, data) {
                f._append(e, data);
            }).on("uploader.remove", function (e, data) {
                data.binded = true;
                f._remove(e, data);
            }).on("uploader.reset", function () {
                f._reset();
                f._clear();
                return true;
            }).on("uploader.generateList", function (e, data) {
                return f._getList(e, data);
            }).on("uploader.retry", function (e, data) {
                return f._retryUpload(e, data);
            });

            f.init();

            return this;
        });
    };
    
    $.fn.uploader.defaults = {
        'limit': null,
        'maxSize': null,
        'fileMaxSize': null,
        'extensions': null,
        'changeInput': true,
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
