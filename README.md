[![Build Status](https://travis-ci.org/n3okill/enfslist.svg)](https://travis-ci.org/n3okill/enfslist)
[![Build status](https://ci.appveyor.com/api/projects/status/13d4v3xra2f565rt?svg=true)](https://ci.appveyor.com/project/n3okill/enfslist)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/02cba6c651d44e9c96068d3d2d57e89a)](https://www.codacy.com/app/n3okill/enfslist)
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=64PYTCDH5UNZ6)

[![NPM](https://nodei.co/npm/enfslist.png)](https://nodei.co/npm/enfslist/)

enfslist
=========
Module that add list functionality to node fs module

**enfs** stands for [E]asy [N]ode [fs]

This module is intended to work as a sub-module of [enfs](https://www.npmjs.com/package/enfs)

Description
-----------
This module will add a method that allows the obtaining of the 
list of items in the file system under one directory and sub-directories.

- This module will add following methods to node fs module:
  * list
  * listSync
  
Usage
-----
`enfslist`

```js
    var enfslist = require("enfslist");
```

Errors
------
All the methods follows the node culture.
- Async: Every async method returns an Error in the first callback parameter
- Sync: Every sync method throws an Error.


Additional Methods
------------------
- [list](#list)
- [listSync](#listsync)


### list
  - **list(path, [options], callback)**

> Obtain the list of items under a directory and sub-directories asynchronously.
Each item will be an object containing: {path: pathToItem, stat: itemStat}

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))
  * dereference (Boolean): if true will dereference symlinks listing the items to where it points (default: false)
  * back (Number): What you want to get back (0- an array of objects with path and stats, 1- only the paths, 2- only the stats);
  * stats (Array): What information you want in stats. Ex: ```js ["isFile", "atime", "size"] ```
  * ignoreAccessError (Boolean): If true will ignore all files and folder's without access permission (default false)

```js
    enfslist.list("/home", function(err, listOfItems){
        listOfItems.forEach(function(item){
            //do something
        });
    });
```


### listSync
  - **listSync(path, [options])**

> Obtain the list of items under a directory and sub-directories synchronously
Each item will be an object containing: {path: pathToItem, stat: itemStat}

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))
  * dereference (Boolean): if true will dereference symlinks listing the items to where it points (default: false)
  * back (Number): What you want to get back (0- an array of objects with path and stats, 1- only the paths, 2- only the stats);
  * stats (Array): What information you want in stats. Ex: ```js ["isFile", "atime", "size"] ```
  * ignoreAccessError (Boolean): If true will ignore all files and folder's without access permission (default false)

```js
    var listOfItems = enfslist.listSync("/home");
    listOfItems.forEach(function(item){
        //do something
    });
```


License
-------

Creative Commons Attribution 4.0 International License

Copyright (c) 2016 Joao Parreira <joaofrparreira@gmail.com> [GitHub](https://github.com/n3okill)

This work is licensed under the Creative Commons Attribution 4.0 International License. 
To view a copy of this license, visit [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/).


