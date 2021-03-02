# markdown-cli-compiler
Hello, this readme is a WIP.

## Installation
```
npm i -g markdown-cli-compiler
```

## Usage
```
mdc <args>
```

## CLI arguments
- `--ignore`: boolean. Doesn't run the command. Useful in a `mdconfig.json`.
### File I/O args
- `--input` or `-i`: string. the input file path. Can be a Markdown file or a directory.
- `--output` or `-o`: string. The output path. By default it's the input file name with an additional `.html` extension.
- `--enc`: string. Input Markdown file encoding ([list of supported encodings](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings)). It's also used for the mdconfig.json. **Default**: `utf8`
### Content args
- `--plugins` or `-p`: array. The names of the plugins to use. Works without the `markdown-it-` prefix too. [got from here](https://www.npmjs.com/search?q=keywords:markdown-it-plugin). **eg**: `--plugins mark ins`
- `--styles` or `-s`: array. The paths of the CSS files that will be linked in a `<link>` tag in the head of the output html file. Glob works.
- `--hls`: string. The name of an highlight.js theme ([list of themes](https://github.com/highlightjs/highlight.js/tree/master/src/styles)). **eg**: `--hls monokai`
- `--copiedStyles`: array. The paths of the CSS files whose content will be copied and pasted into the output html. Paths should be relative to the output path. Glob works.
- `--inlineStyle`: string. Raw CSS to write as it is into a `<style>` tag.
- `--title`: string. Goes in the `<title>` tag.
- `--comment`: boolean. Adds to the html output a comment after `<!DOCTYPE html>` with in it the command called with all the args.
### CLI behaviour args
- `--force`: boolean. Doesn't emit a warning before overriding a file. (I wanted the "Are you sure you want to override the file?", but since I haven't made it yet, this doesn't really make sense).
- `--noOk`: boolean. Doesn't emit success messages.
- `--noWarn`: boolean. Doesn't emit warning messages.
- `--failOnWarn`: boolean. Stops the program when encounters a warning.
- `--debug`: boolean. Doesn't quit on fail.
### markdown-it args
- `--html`, `--xhtmlOut`, `--breaks`, `--langPrefix`, `--linkify`, `--typographer` and `--quotes` (all: boolean) are explained [here](https://github.com/markdown-it/markdown-it#readme).

## mdconfig.json
If the input field is a directory, the program will look for a file named `mdconfig.json` there. It has to be an array of json objects with configurations that work the same way as the [cli args](#CLI-arguments). Aliases like `-i`, `-o` and `-s` will not work. [**Example**](https://github.com/catonif/markdown-cli-compiler/blob/main/examples/mdconfig.json).

## Basic usage examples
```powershell
mdc -i .
# compiles the mdconfig.json in the current folder

mdc -i test.md --enc latin1 --typographer
# compiles test.md with latin1 into test.md.html with utf8 with typographer enabled

mdc -i mathfile.md -o math.html -p texmath ins
# uses the markdown-it-texmath plugin and the markdown-it-ins one, list of avaliable plugins is in the dependency list

mdc -i stylish.md -s ../styles/*.css
# references all the css files in the styles folder in the <link> tag in the html
```