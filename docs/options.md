## Available Options:

#### limit
Maximal number of files.

#### maxSize
Maximal file size in MB's.

#### extensions
File extension's whitelist.

#### changeInput
Create a new file input element. You can use the default template or to write your own as String or jQuery Element.

#### showThumbs
Show the in-browser files previews.

#### appendTo
The target thumbnails target element selector. Use this option when you want to append your files previews into specific element.

#### theme
Specify the jquery.uploader theme. It will just set to main div as class the theme name.

#### templates
Specify the file preview templates, selectors and some options.
```javascript
{
    'box': null, //Thumbnail's box element {null, String}
    'item': null, //File item element {String(use uploader variables), Function}
    'itemAppend': null, //File item element for edit mode {String(use uploader variables), Function}
    'progressBar': null, //File upload progress bar element {String}
    'itemAppendToEnd': false, //Append the new file item to the end of the list {Boolean}
    'removeConfirmation': true, //Remove file confirmation {Boolean}
    '_selectors': {
        'list': null, //List selector {String}
        'item': null, //Item selector {String}
        'progressBar': null, //Progress bar selector {String}
        'remove': null //Remove button selector {String}
    }
}
```

#### uploadFile
Enable Instantly file uploading feature. In the object you can specify the normal jQuery $.ajax options, or callbacks.
```javascript
{
    'url': null, //URL to which the request is sent {String}
    'data': null, //Data to be sent to the server {Object}
    'type': 'POST', //The type of request {String}
    'enctype': 'multipart/form-data', //Request enctype {String}
    'beforeSend': null, //A pre-request callback function {Function}
    'success': null, //A function to be called if the request succeeds {Function}
    'error': null, //A function to be called if the request fails {Function}
    'statusCode': null, //An object of numeric HTTP codes {Object}
    'onProgress': null, //A function called while uploading file with progress percentage {Function}
    'onComplete': null //A function called when all files were uploaded {Function}
}
```

#### dragDrop
Enable Drag&Drop feature. In this object you can specify only the callbacks. Note that this feature wors only by instantly uploading.
```javascript
{
    'dragEnter': null, //A function that is fired when a dragged element enters the input. {Function}
    'dragLeave': null, //A function that is fired when a dragged element leaves the input. {Function}
    'drop': null, //A function that is fired when a dragged element is dropped on a valid drop target. {Function}
}
```

#### addMore
Multiple file selection without instantly uploading them. You need to enable this feature in Edit Mode when you need to upload more than 1 file.

#### clipBoardPaste
Printscreen or copied images would be uploaded by pasting. Note that this feature wors only by instantly uploading.

#### excludeName
By removing a file the script is creating an hidden input with it's name. Use this option if you want to specify the input's name.

#### files
The list with the already uploaded files. Use this option in Edit Mode.
```javascript
[
    {
        'name': 'appended_file.jpg',
        'size': 5453,
        'type': 'image/jpg',
        'file': '/path/to/file.jpg'
    },
    {
        'name': 'appended_file_2.jpg',
        'size': 9453,
        'type': 'image/jpg',
        'file': 'path/to/file2.jpg'
    }
]
```

#### beforeRender
A function that is fired before rendering the jquery.uploader input.

#### afterRender
A function that is fired after rendering the jquery.uploader input and applying some options.

#### beforeShow
A function that is fired before showing thumbnails. Note that this function should return a Boolean value.

#### afterShow
A function that is fired after appending all item's thumbnails.

#### beforeSelect
A function that is fired after selecting a file and before adding it to input. If you use it, note that this function should return a Boolean value(used for your own validation)

#### onSelect
A function that is fired after selecting a file.

#### onRemove
A function that is fired after deleting a file.

#### onEmpty
A function that is fired when no files are selected.

#### options
Define your own option values in this Object that you can use later everywhere, also as uploader variables.

#### captions
Specify your own captions. Here you can also use uploader variables.
```javascript
{
    'button': 'Choose Files',
    'feedback': 'Choose files To Upload',
    'feedback2': 'files were chosen',
    'drop': 'Drop file here to Upload',
    'removeConfirmation': 'Are you sure you want to remove this file?',
    'errors': {
        'filesLimit': 'Only {{fi-limit}} files are allowed to be uploaded.',
        'filesType': 'Only Images are allowed to be uploaded.',
        'filesSize': '{{fi-name}} is too large! Please upload file up to {{fi-maxSize}} MB.',
        'filesSizeAll': 'Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB.'
    }
}
```

## More information
* [API Methods](https://rammstein4o.github.io/jquery.uploader/api)
* [Examples](https://rammstein4o.github.io/jquery.uploader/examples/)
* [Back to index](https://rammstein4o.github.io/jquery.uploader/)
