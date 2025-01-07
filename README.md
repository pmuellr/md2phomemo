md2phomemo - print Markdown files on a Phomemo m02 printer
================================================================================

You're probably wondering, "What's a Phomemo m02 printer?".

It's this: https://phomemo.com/products/m02-portable-printer

There are cheaper versions, and sold cheaper at the you-know-where.

This program will take the name of a markdown file, and render it to be
printed on the Phomemo printer.  Keep in mind the width of the
printer rows is 384 pixels.

Basic processing:
- connect to the printer
- convert the Markdown to HTML
- open the HTML in Chrome with Puppeteer
- save the page content as a PNG
- rasterize the PNG to a bitmap (1bpp)
- generate the data to send to the printer
- send the data to the printer


install
================================================================================

    npm install -g pmuellr/md2phomemo

or run via

    npx pmuellr/md2phomemo
    

usage
================================================================================

    md2phomemo [options] markdown-file
    
options:

| short | long                 | description
| ----- |--------------------- | ---------------------------------------------
| `-h`  | `--help`             | display help
| `-d`  | `--debug`            | generate verbose output when running
| `-v`  | `--version`          | print version
| `-p`  | `--printer <name>`   | use this printer name
| `-l`  | `--list`             | list available Bluetooth devices
| `-o`  | `--output <file>`    | generates the image to print as a png


change log
================================================================================

#### 1.0.0 - ... not yet ...

- initial working version


license
================================================================================

This package is licensed under the MIT license.  See the [LICENSE.md][] file
for more information.


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md][] file for more information.


[LICENSE.md]: LICENSE.md
[CONTRIBUTING.md]: CONTRIBUTING.md
[CHANGELOG.md]: CHANGELOG.md