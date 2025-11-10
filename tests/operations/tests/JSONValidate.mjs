/**
 * JSONValidate tests.
 *
 * @author Aiden Mitchell
 *
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "JSON Validate: empty input",
        input: "",
        expectedOutput: "✓ Valid JSON\n\nInput is empty.",
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid simple object",
        input: "{\"name\":\"test\",\"value\":42}",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Object[\s\S]*Keys: 2/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid simple array",
        input: "[1,2,3,4,5]",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Array[\s\S]*Length: 5/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid string primitive",
        input: "\"hello world\"",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: String/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid number primitive",
        input: "42",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Number/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid boolean primitive",
        input: "true",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Boolean/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid null",
        input: "null",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Null/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid nested structure",
        input: "{\"users\":[{\"name\":\"Alice\",\"age\":30},{\"name\":\"Bob\",\"age\":25}],\"total\":2}",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Object[\s\S]*Keys: 2/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: invalid JSON - missing quote",
        input: "{\"name:\"test\"}",
        expectedOutput: /✗ Invalid JSON/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: invalid JSON - trailing comma (strict JSON)",
        input: "{\"name\":\"test\",\"value\":42,}",
        expectedOutput: /✗ Invalid JSON/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid JSON5 - trailing comma",
        input: "{\"name\":\"test\",\"value\":42,}",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Object/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid JSON5 - comments",
        input: "{\n  // This is a comment\n  \"name\": \"test\",\n  /* multi-line\n     comment */\n  \"value\": 42\n}",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Object/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: invalid JSON5 - comments in strict JSON",
        input: "{\n  // This is a comment\n  \"name\": \"test\"\n}",
        expectedOutput: /✗ Invalid JSON/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON", false],
            },
        ],
    },
    {
        name: "JSON Validate: invalid JSON - missing closing brace",
        input: "{\"name\":\"test\",\"value\":42",
        expectedOutput: /✗ Invalid JSON/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: invalid JSON - missing closing bracket",
        input: "[1,2,3,4,5",
        expectedOutput: /✗ Invalid JSON/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: invalid JSON - single quotes in strict JSON",
        input: "{'name':'test'}",
        expectedOutput: /✗ Invalid JSON/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON", false],
            },
        ],
    },
    {
        name: "JSON Validate: valid JSON5 - single quotes",
        input: "{'name':'test','value':42}",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Object/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: compact output - valid",
        input: "{\"name\":\"test\"}",
        expectedOutput: "Valid: Object",
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", true],
            },
        ],
    },
    {
        name: "JSON Validate: compact output - invalid",
        input: "{\"name\":\"test\"",
        expectedOutput: /Invalid:/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", true],
            },
        ],
    },
    {
        name: "JSON Validate: empty object",
        input: "{}",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Object[\s\S]*Keys: 0/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
    {
        name: "JSON Validate: empty array",
        input: "[]",
        expectedOutput: /✓ Valid JSON[\s\S]*Type: Array[\s\S]*Length: 0/,
        recipeConfig: [
            {
                op: "JSON Validate",
                args: ["JSON5", false],
            },
        ],
    },
]);
