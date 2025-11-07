/**
 * @author Claude Code
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Render HTML operation
 */
class RenderHTML extends Operation {

    /**
     * RenderHTML constructor
     */
    constructor() {
        super();

        this.name = "Render HTML";
        this.module = "Code";
        this.description = "Renders input HTML in a sandboxed iframe for safe preview. The iframe is sandboxed to prevent script execution and other potentially harmful operations.";
        this.infoURL = "https://wikipedia.org/wiki/HTML";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                name: "Iframe width",
                type: "string",
                value: "100%"
            },
            {
                name: "Iframe height",
                type: "string",
                value: "500px"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const [width, height] = args;

        if (!input || input.length === 0) {
            return "<div>No HTML content to render</div>";
        }

        // Encode the HTML for use in data URI
        const encodedHTML = encodeURIComponent(input);

        // Create a sandboxed iframe that displays the HTML
        // sandbox attribute prevents: scripts, forms, popups, top navigation, etc.
        return `<iframe
            sandbox="allow-same-origin"
            style="width: ${width}; height: ${height}; border: 1px solid #ccc;"
            src="data:text/html;charset=utf-8,${encodedHTML}"
            title="Rendered HTML Preview">
        </iframe>
        <div style="margin-top: 10px; font-size: 12px; color: #666;">
            <strong>Note:</strong> JavaScript execution is disabled for security. The HTML is rendered in a sandboxed iframe.
        </div>`;
    }

}

export default RenderHTML;
