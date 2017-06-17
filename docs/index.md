# jquery.uploader

jquery.uploader - Simple HTML5 file uploader created as a plugin for jQuery. It is a fork of CreativeDream's jquery.filer

## Features

This section gives a short description about the most considerable script features.

* **Change file input** - Design your own file input with HTML&CSS or just use our default template.
* **Drag & Drop** - Drag and drop files straight from your desktop and upload directly them.
* **Instant uploading** - Upload the file directly to server after choosing or dragging it.
* **Add more** - Choose multiple files from different folders without instantly uploading them.
* **Delete/Retry/Cancel...** - Use this features or create your own action to manipulate with files.
* **Validators** - Limit your users to a specific file type, size, number of files or write your own custom validator.
* **Image & extension Previews** - Give your users an in-browser thumb preview of images or file extension before they upload.
* **Edit mode** - Keep the uploaded files to input for previewing or editing them.
* **API Methods** - Now you can use values or functions to get the information or to manipulate with the file.
* **Customizig** - Customize your input, templates(inline variables, 40+ icons), captions, callbacks and many others.

## Browser Support

* **Chrome 13+**
* **Firefox 3.6+**
* **Safari 6+**
* **Opera 11.1+**
* **Maxthon 3.4+**
* **IE 10+**
*   and others that supports **HTML5**

## Instructions:

Install the package with [npm](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)

```bash
npm install jquery.uploader
```

Include jquery.uploader script and stylesheets in your document (you will need to make sure the css and js files are on your server, and adjust the paths in the script and link tag). 
Make sure you also load the jQuery library. Example:

**Stylesheets:**

Include the jquery.uploader stylesheets into head.

```html
<link href="./css/jquery.uploader.css" type="text/css" rel="stylesheet" />
```

**Scripts:**

Include the jQuery library and jquery.uploader script file in your html page.

```html
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="./js/jquery.uploader.min.js"></script>
```

**HTML:**

Create a simple form with an input file element.

```html
<form action="./php/upload.php" method="post" enctype="multipart/form-data">
      <input type="file" name="files[]" multiple="multiple">
      <input type="submit" value="Submit">
</form>
```

**Javascript:**

The plugin is named "uploader" and can be applied to any element. If you are not familiar with jQuery, please, read this [tutorial for beginners](http://learn.jquery.com/about-jquery/how-jquery-works/).

```bash
$(document).ready(function() {
     $(':input[type="file"]').uploader();       
});
```

**Result:**

Here is the result of our effort. 

![result](https://rammstein4o.github.io/jquery.uploader/images/result.png)

## More information
* [Available Options](https://rammstein4o.github.io/jquery.uploader/options)
* [API Methods](https://rammstein4o.github.io/jquery.uploader/api)
* [Examples](https://rammstein4o.github.io/jquery.uploader/examples/)

## Support
If you run into an issue and need to report a bug or you just have a question, please create an [Issue](https://github.com/rammstein4o/jquery.uploader/issues) on GitHub issues and we will investigate it.

## License
Distributed under [MIT license](https://opensource.org/licenses/MIT)

Portions of the project are licensed under [Apache v2.0](https://opensource.org/licenses/Apache-2.0)

## Copyright

Copyright (c) 2017 Radoslav Salov

Copyright for portions of the project are held by: CreativeDream (c) 2016
