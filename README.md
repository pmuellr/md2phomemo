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
- save the page content as a PNG image
- rasterize the PNG image to a bitmap (1bpp)
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

Will produce three files, in the same directory as `markdown-file`:

- `${markdown-file}.html`
- `${markdown-file}.orig.png`
- `${markdown-file}.png`

The `.html` file contains the HTML rendered from the Markdown.
The `.orig.png` file is the rendered HTML captured as a PNG image.
The `.png` file is the PNG "fixed" for printing on the Phomemo printer.

The final image will only be printed if the `--printer` option is used.

options:

| short | long                 | description
| ----- |--------------------- | ---------------------------------------------
| `-h`  | `--help`             | display help
| `-d`  | `--debug`            | generate verbose output when running
| `-v`  | `--version`          | display version
| `-p`  | `--printer <name>`   | name of the printer
| `-l`  | `--list`             | list available Bluetooth devices
| `-w`  | `--watch`            | regenerates the image when input changes

If there is a printer named (roughly) `m02`, it will be used if no
`--printer` option was provided.

If you don't know the name of the printer, use the `--list` option to
display the available devices by name.

If `--watch` is provided, the generated image will not be printed, and
the program will pause waiting for the `markdown-file` to change.  When
changed, it will regenerate the image.


references
================================================================================

- https://sharp.pixelplumbing.com/ - Sharp - 
  image manipulation
- https://pptr.dev/api - Puppeteer - 
  generate a `.png` file from a `.html` file
- https://github.com/abandonware/noble - noble - 
  Bluetooth connectivity to the printer
- https://github.com/vrk/cli-phomemo-printer - node.js example
- https://github.com/vivier/phomemo-tools/blob/master/README.md#3-protocol-for-m02 -
  printer protocol


change log
================================================================================

#### 1.0.1 - 2025-01-13

- fixed a number of small issues

#### 1.0.0 - 2025-01-12

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