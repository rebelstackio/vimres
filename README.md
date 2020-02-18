# vimres
Video and image resizer, compressor for responsive viewports that can be embedded in dev toolchain

Media manipulation written in Rust and targeting webassembly and wrapped in npm so that it can be run in browser or node.js (apart of CI/CD process).


## Installation

```sh
npm install vimres --global
```

## .vimres
The .vimres configuration file resides in top-level directory (or multiple directories to allow definition of various viewports) and defines the viewport definitions (json) to be supported for responsive-sizing. Use vimres command ```init``` to create default .vimres file with default viewport definitions:

```sh
vimres init
```

### viewports

The viewports definition controls the media queries in html, scaling up and down between defined sizes when a given device does not match exactly to a definition:

```json
{
    "viewports":[
        { "h":768, "w":1024, "pr":2, "name":"generic_old_tablet" … },
        …
    ]
}
```
The ```viewports``` definitions provide an abstraction (fewer sets) of viewports that designers can design against as opposed to designing for 1000s of devices individually. 

At build-time, vimres manages the creation of viewport definition (with media queries). It also creates a global CSS file with variables and media-queries in the same directories it finds .vimres configuration files. It scans for html files in the same directory (and child directories) and injects viewport meta and links CSS files it has created when it finds the html <head> tag without the vimres:skip attribute.

## <vimres:picture>
The vimres:picture tag allows designers to reference just the original source file while designing. At build time, vimres injects references to resized/compressed images via media-query.

### attributes of vimres:picture
    src - path to original source file
    height - csspixel
    width - csspixel
    load - [ *ondom*|lazy|aggressive ]
    economy - [ *off* | on ]


### Continued reading and reference:

- https://medium.com/@flik185/understanding-device-resolution-for-web-design-and-development-3bb4a5183478
- https://stackoverflow.com/questions/2557801/how-do-i-reset-the-scale-zoom-of-a-web-app-on-an-orientation-change-on-the-iphon
- https://www.mydevice.io/
- http://screensiz.es/
- http://viewportsizes.mattstow.com/
- https://caniuse.com/#search=-webkit-device-pixel-ratio
- https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag
- https://www.quirksmode.org/mobile/viewports2.html


## Local Dev Enviroment
- set the npm and node version to 13
```bash
nvm install
```
- start devserver
```bash
npm start
```
- deploy project
```bash
npm run deploy
```