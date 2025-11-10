/**
 * @author Aiden Mitchell
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import JSON5 from "json5";
import OperationError from "../errors/OperationError.mjs";
import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * JSON Validate operation
 */
class JSONValidate extends Operation {

    /**
     * JSONValidate constructor
     */
    constructor() {
        super();

        this.name = "JSON Validate";
        this.module = "Code";
        this.description = "Validates JavaScript Object Notation (JSON) code and provides detailed error messages if the JSON is invalid.<br><br>Supports both standard JSON and JSON5 formats (with comments, trailing commas, etc.).<br><br>Tags: json validator, json checker, json lint, syntax check";
        this.inputType = "string";
        this.outputType = "string";
        this.presentType = "html";
        this.args = [
            {
                name: "JSON Standard",
                type: "option",
                value: ["JSON5", "JSON"]
            },
            {
                name: "Compact output",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [jsonStandard, compactOutput] = args;

        if (!input) {
            return compactOutput ? "Valid: Empty input" : "✓ Valid JSON\n\nInput is empty.";
        }

        try {
            let parsed;
            if (jsonStandard === "JSON5") {
                parsed = JSON5.parse(input);
            } else {
                parsed = JSON.parse(input);
            }

            // Get some statistics about the parsed JSON
            const stats = this.getJSONStats(parsed);

            if (compactOutput) {
                return `Valid: ${stats.type}`;
            }

            let output = "✓ Valid JSON\n\n";
            output += `Type: ${stats.type}\n`;
            if (stats.type === "Object") {
                output += `Keys: ${stats.keyCount}\n`;
            } else if (stats.type === "Array") {
                output += `Length: ${stats.length}\n`;
            }
            output += `Size: ${input.length} characters`;

            return output;
        } catch (err) {
            // Parse the error to provide helpful information
            const errorInfo = this.parseError(err, input, jsonStandard);

            if (compactOutput) {
                return `Invalid: ${errorInfo.message}`;
            }

            let output = "✗ Invalid JSON\n\n";
            output += `Error: ${errorInfo.message}\n`;

            if (errorInfo.line !== null) {
                output += `Line: ${errorInfo.line}\n`;
                output += `Column: ${errorInfo.column}\n\n`;

                // Show the problematic line with context
                output += "Context:\n";
                output += errorInfo.context;
            }

            return output;
        }
    }

    /**
     * Get statistics about the parsed JSON
     *
     * @param {*} json
     * @returns {Object}
     */
    getJSONStats(json) {
        const type = Array.isArray(json) ? "Array" :
                    json === null ? "Null" :
                    typeof json === "object" ? "Object" :
                    typeof json === "string" ? "String" :
                    typeof json === "number" ? "Number" :
                    typeof json === "boolean" ? "Boolean" : "Unknown";

        const stats = { type };

        if (type === "Object") {
            stats.keyCount = Object.keys(json).length;
        } else if (type === "Array") {
            stats.length = json.length;
        }

        return stats;
    }

    /**
     * Parse error information from JSON parsing exception
     *
     * @param {Error} err
     * @param {string} input
     * @param {string} jsonStandard
     * @returns {Object}
     */
    parseError(err, input, jsonStandard) {
        let message = err.message;
        let line = null;
        let column = null;

        // Try to extract line and column information from error message
        const positionMatch = message.match(/at (?:line )?(\d+)(?: column | col )?(\d+)?/i) ||
                             message.match(/position (\d+)/i);

        if (positionMatch) {
            if (positionMatch[2]) {
                line = parseInt(positionMatch[1]);
                column = parseInt(positionMatch[2]);
            } else {
                // If only position is given, calculate line and column
                const position = parseInt(positionMatch[1]);
                const lines = input.substring(0, position).split("\n");
                line = lines.length;
                column = lines[lines.length - 1].length + 1;
            }
        }

        // Generate context showing the error location
        let context = "";
        if (line !== null) {
            const lines = input.split("\n");
            const startLine = Math.max(0, line - 2);
            const endLine = Math.min(lines.length, line + 1);

            for (let i = startLine; i < endLine; i++) {
                const lineNum = (i + 1).toString().padStart(4, " ");
                const marker = i === line - 1 ? ">" : " ";
                context += `${marker} ${lineNum} | ${lines[i]}\n`;

                // Add a pointer to the column if we know it
                if (i === line - 1 && column !== null) {
                    const pointer = " ".repeat(8 + column) + "^";
                    context += pointer + "\n";
                }
            }
        }

        // Clean up the message
        message = message.replace(/at (?:line )?(\d+)(?: column | col )?(\d+)?/i, "").trim();

        return {
            message: Utils.escapeHtml(message),
            line,
            column,
            context: Utils.escapeHtml(context)
        };
    }

    /**
     * Displays the validation result with syntax highlighting
     *
     * @param {string} data
     * @param {Object[]} args
     * @returns {html}
     */
    present(data, args) {
        const compactOutput = args[1];

        if (compactOutput || data.startsWith("✗")) {
            // For compact output or errors, just escape and return
            return `<pre>${Utils.escapeHtml(data)}</pre>`;
        }

        // For successful validation, format nicely with some color
        const escapedData = Utils.escapeHtml(data);
        return `<pre style="color: #0f0;">${escapedData}</pre>`;
    }
}

export default JSONValidate;
