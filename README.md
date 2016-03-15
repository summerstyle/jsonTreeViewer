#jsonTreeViewer and jsonTree library

The library and the viewer released under the MIT license (LICENSE.txt).

###jsonTreeViewer

A simple json formatter/viewer based on [jsonTree library] (#jsontree-library) and [app.js] (https://github.com/summerstyle/app.js) framework.

[http://github.com/summerstyle/jsonTreeViewer] (http://github.com/summerstyle/jsonTreeViewer)

1. Load json: click on "load" button and load a json-string to opened form
2. Expand/collapse single nodes by click on properties names (recursively - by SHIFT + click)
3. Expand/collapse all tree nodes by click on "expand all" and "collapse all" buttons


###jsonTree library

Gets json-object and draws tree of json nodes.
Includes 2 files - jsonTree.js and jsonTree.css.
You can get json-object from json-string by `JSON.parse(str)` method. 

#####How to use:

html:
```html
<link href="libs/jsonTree/jsonTree.css" rel="stylesheet" />
<script src="libs/jsonTree/jsonTree.js"></script>
```
javascript:
```javascript
var wrapper = document.getElementById("wrapper");
var data = {
    "firstName": "Jonh",
    "lastName": "Smith",
    "phones": [
        "123-45-67",
        "987-65-43"
    ]
};
var tree = jsonTree.create(data, wrapper);
```
You can create many trees on one html-page.

#####The aviable methods for each json tree:

* `loadData(jsonObj)` - Fill new data in current json tree
* `appendTo(domEl)` - Appends tree to DOM-element (or move it to new place)
* `expand()` - Expands all tree nodes (objects or arrays) recursively 
* `collapse()` - Collapses all tree nodes (objects or arrays) recursively
