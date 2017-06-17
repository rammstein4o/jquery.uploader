## API Methods:

The plugin comes with a number of public values and functions to help you utilize the plugin in a number of different scenarios. 
To use it you will need to get the input property. Example:

```javascript
var uploader = $(':input[type="file"]').prop('uploader');
```

#### options
Your jquery.uploader config object.

#### boxEl
jquery.uploader box element.

#### listEl
Thumbnails list element.

#### newInputEl
jquery.uploader new input element.

#### inputEl
Basic input element.

#### files
HTML5 FileList object.

#### files_list
jquery.uploader Files object.

#### current_file
jquery.uploader last choosed or last uploaded File object.

#### append(parameter)
Append a file to the input.

parameter:
```
{
    'name': 'appended_file.jpg',
    'size': 5453,
    'type': 'image/jpg',
    'file': '/path/to/file.jpg'
}
```

#### retry(parameter)
Retry a file that wasn't successfully uploaded by sending in parameter the index or DOM Element.

#### remove(index)
Remove a file from the input by index

#### reset()
Reset the input.

## More information
* [Available Options](https://rammstein4o.github.io/jquery.uploader/options)
* [Examples](https://rammstein4o.github.io/jquery.uploader/examples/)
* [Back to index](https://rammstein4o.github.io/jquery.uploader/)
