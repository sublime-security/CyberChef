/**
 * HTMLBeautify tests.
 *
 * @author Claude Code
 *
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "HTML Beautify: tab, empty",
        input: "",
        expectedOutput: "",
        recipeConfig: [
            {
                op: "HTML Beautify",
                args: ["\\t"],
            },
        ],
    },
    {
        name: "HTML Beautify: tab, simple HTML",
        input: "<html><head><title>Test</title></head><body><p>Hello World</p></body></html>",
        expectedOutput: "<html>\n\t<head>\n\t\t<title>Test</title>\n\t</head>\n\t<body>\n\t\t<p>Hello World</p>\n\t</body>\n</html>",
        recipeConfig: [
            {
                op: "HTML Beautify",
                args: ["\\t"],
            },
        ],
    },
    {
        name: "HTML Beautify: space, simple HTML",
        input: "<html><head><title>Test</title></head><body><p>Hello World</p></body></html>",
        expectedOutput: "<html>\n <head>\n  <title>Test</title>\n </head>\n <body>\n  <p>Hello World</p>\n </body>\n</html>",
        recipeConfig: [
            {
                op: "HTML Beautify",
                args: [" "],
            },
        ],
    },
    {
        name: "HTML Beautify: tab, nested elements",
        input: "<div><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div>",
        expectedOutput: "<div>\n\t<ul>\n\t\t<li>Item 1</li>\n\t\t<li>Item 2</li>\n\t\t<li>Item 3</li>\n\t</ul>\n</div>",
        recipeConfig: [
            {
                op: "HTML Beautify",
                args: ["\\t"],
            },
        ],
    },
    {
        name: "HTML Beautify: tab, with attributes",
        input: '<div class="container"><p id="para1">Text</p></div>',
        expectedOutput: '<div class="container">\n\t<p id="para1">Text</p>\n</div>',
        recipeConfig: [
            {
                op: "HTML Beautify",
                args: ["\\t"],
            },
        ],
    },
]);
