/**
 * RenderHTML tests.
 *
 * @author Claude Code
 *
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Render HTML: empty input",
        input: "",
        expectedMatch: /No HTML content to render/,
        recipeConfig: [
            {
                op: "Render HTML",
                args: ["100%", "500px"],
            },
        ],
    },
    {
        name: "Render HTML: simple HTML",
        input: "<h1>Hello World</h1>",
        expectedMatch: /<iframe[\s\S]*sandbox="allow-same-origin"[\s\S]*<\/iframe>/,
        recipeConfig: [
            {
                op: "Render HTML",
                args: ["100%", "500px"],
            },
        ],
    },
    {
        name: "Render HTML: contains data URI",
        input: "<p>Test paragraph</p>",
        expectedMatch: /data:text\/html;charset=utf-8,/,
        recipeConfig: [
            {
                op: "Render HTML",
                args: ["100%", "500px"],
            },
        ],
    },
    {
        name: "Render HTML: custom dimensions",
        input: "<div>Test</div>",
        expectedMatch: /width: 800px; height: 600px/,
        recipeConfig: [
            {
                op: "Render HTML",
                args: ["800px", "600px"],
            },
        ],
    },
    {
        name: "Render HTML: includes security note",
        input: "<p>Test</p>",
        expectedMatch: /JavaScript execution is disabled for security/,
        recipeConfig: [
            {
                op: "Render HTML",
                args: ["100%", "500px"],
            },
        ],
    },
]);
