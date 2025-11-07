/**
 * @author Claude Code
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import beautify from "js-beautify";
import Operation from "../Operation.mjs";

const beautifyHtml = beautify.html;

/**
 * HTML Beautify operation
 */
class HTMLBeautify extends Operation {

    /**
     * HTMLBeautify constructor
     */
    constructor() {
        super();

        this.name = "HTML Beautify";
        this.module = "Code";
        this.description = "Indents and prettifies HyperText Markup Language (HTML) code.";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Indent string",
                "type": "binaryShortString",
                "value": "\\t"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const indentStr = args[0];
        /* eslint-disable camelcase */
        return beautifyHtml(input, {
            indent_size: 1,
            indent_char: indentStr,
            preserve_newlines: true,
            max_preserve_newlines: 2
        });
        /* eslint-enable camelcase */
    }

}

export default HTMLBeautify;
