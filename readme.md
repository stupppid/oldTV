## Install

```
$ npm install oldtvdemo
```

## Usage

###html:

```
<div id="bell"></div>
```

###js:

```
let bell = new Bell({id: 'bell', overTime: 9, reverse: true}, function () {
    console.log('time over')
})
```