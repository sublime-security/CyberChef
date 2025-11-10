# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CyberChef is a web-based "Cyber Swiss Army Knife" for encoding, decoding, encryption, compression, and data analysis. It processes data entirely client-side using a modular operation-based architecture.

## Build and Development Commands

### Development
```bash
npm start                    # Start development server with hot reload
npx grunt dev               # Alternative: create development build with watch
```

### Building
```bash
npm run build               # Production build (creates minified bundle)
npx grunt prod              # Alternative with optional --msg flag for compile message
npm run node                # Build for Node.js usage
```

### Testing
```bash
npm test                    # Run all config tests and operation tests
npm run testnodeconsumer    # Test Node.js CJS and ESM consumers
npm run testui              # Run UI tests (requires prod build first)
npm run testuidev           # Run UI tests in dev mode
npx grunt configTests       # Generate config files for testing
```

### Linting
```bash
npm run lint                # Run ESLint
npm run lint:grammar        # Run cspell grammar checker
```

### Creating New Operations
```bash
npm run newop               # Interactive script to generate operation template
```

### Other
```bash
npm run repl                # Start Node.js REPL with CyberChef
npm run minor               # Bump minor version
```

## Architecture

### Core Components

**src/core/** - Core logic (platform-agnostic)
- **Operation.mjs** - Base class for all operations
- **Dish.mjs** - Data container that flows through operations, handles type conversions
- **Recipe.mjs** - Manages sequence of operations and execution
- **operations/** - 300+ individual operation implementations
- **lib/** - Shared utility functions and libraries
- **dishTypes/** - Type-specific handlers (String, ByteArray, File, etc.)

**src/web/** - Browser-specific code
- **index.js** - Main entry point for web app
- **waiters/** - UI controllers (e.g., InputWaiter, OutputWaiter, OperationsWaiter)
- **workers/** - Web workers for background processing
- **html/** - HTML templates
- **stylesheets/** - CSS/PostCSS files

**src/node/** - Node.js-specific code
- **index.mjs** - ES module entry point
- **wrapper.js** - CommonJS wrapper
- **repl.mjs** - Interactive REPL

### Operation Structure

Operations inherit from `Operation` base class and define:
- `name` - Display name
- `module` - Loading group (Default, Crypto, Compression, etc.)
- `description` - HTML description with examples
- `inputType` / `outputType` - Data types (string, byteArray, number, etc.)
- `args` - Array of operation arguments with types
- `run(input, args)` - Main execution logic
- `highlight()` / `highlightReverse()` - Optional position mapping for UI highlighting
- `checks` - Optional patterns for auto-detection ("Magic" operation)

### Module System

Operations are grouped into modules for dynamic loading:
- **Default** - Core operations loaded immediately
- **Crypto, Compression, Hashing, etc.** - Loaded on first use to reduce initial bundle size

### Build System

- **Grunt** - Task runner (see Gruntfile.js)
- **Webpack** - Module bundler (see webpack.config.js)
- Entry points are generated dynamically by scanning `src/core/operations/`
- Babel transpiles ES6+ and handles polyfills
- Multiple build targets: web (main), node (CJS/ESM), standalone zip

### Configuration

- **src/core/config/OperationConfig.json** - Generated from operation classes
- **src/core/config/scripts/generateConfig.mjs** - Config generation script
- Operations automatically registered during build

## Testing

### Operation Tests
Located in `tests/operations/tests/*.mjs`:
- Use `TestRegister.addTests()` format
- Specify operation name, input, expectedOutput, and recipeConfig
- Tests run in Node.js environment with legacy OpenSSL provider

### UI Tests
Located in `tests/browser/`:
- Use Nightwatch.js framework
- Require production build before running

### Test Format Example
```javascript
TestRegister.addTests([
    {
        name: "Operation description",
        input: "test input",
        expectedOutput: "expected output",
        recipeConfig: [
            { "op": "Operation Name", "args": [arg1, arg2] }
        ]
    }
]);
```

## Adding New Operations

**IMPORTANT:** The `npm run newop` script can be problematic in interactive environments. It's often easier to manually create operation files by copying existing similar operations as templates.

### Manual Creation Method (Recommended)

1. **Find a similar operation** to use as a template:
   ```bash
   # Look for similar operations in src/core/operations/
   ls src/core/operations/ | grep -i <keyword>
   ```

2. **Create the operation file** at `src/core/operations/YourOperation.mjs`:
   - Copy structure from a similar operation (e.g., JSONBeautify.mjs, JSONMinify.mjs)
   - Key components to include:
     - Import statements: `Operation`, `OperationError`, `Utils`, and any libraries
     - Constructor with:
       - `this.name` - Display name (e.g., "JSON Validate")
       - `this.module` - Module category (e.g., "Code", "Crypto", "Default")
       - `this.description` - HTML description with tags for search
       - `this.inputType` / `this.outputType` - Data types
       - `this.args` - Array of argument definitions
     - `run(input, args)` method - Core operation logic
     - Optional: `present(data, args)` - Custom HTML presentation
     - Optional: `highlight()` / `highlightReverse()` - Position mapping
     - Export: `export default YourOperation;`

3. **Add operation to category** in `src/core/config/Categories.json`:
   - Find the appropriate category (e.g., "Code", "Data format", "Encryption")
   - Add operation name to the `"ops"` array
   - This step is **required** - operations not in a category will fail tests

4. **Create test file** at `tests/operations/tests/YourOperation.mjs`:
   - Use `TestRegister.addTests()` format
   - Include tests for:
     - Valid inputs (various types)
     - Edge cases (empty input, large input)
     - Invalid inputs (error handling)
     - Different argument combinations
   - Use regex patterns (`/pattern/`) for flexible output matching
   - Example test structure:
     ```javascript
     TestRegister.addTests([
         {
             name: "Operation Name: test case description",
             input: "test input",
             expectedOutput: "expected output", // or /regex pattern/
             recipeConfig: [
                 {
                     op: "Operation Name",
                     args: [arg1, arg2],
                 },
             ],
         },
     ]);
     ```

5. **Run tests** to verify:
   ```bash
   # Ensure you're using Node v22
   nvm use 22

   # Run all tests
   npm test
   ```

### Security Considerations

- **Always sanitize HTML output**: Use `Utils.escapeHtml()` for any user data displayed in HTML
- **Avoid XSS vulnerabilities**: Never use `innerHTML` with unsanitized data
- **Error messages**: Escape error messages before displaying them
- **Pattern**: Look at existing operations for security best practices

### Interactive Script Method (Alternative)

If you want to try the interactive script:
```bash
npm run newop
```

**Note:** This script may hang or have issues with stdin in some environments. If it doesn't work after 10 seconds, use the manual method instead.

## Key Data Types (Dish Types)

- **string** - Text data
- **byteArray** - Uint8Array of bytes
- **ArrayBuffer** - Raw binary data
- **number** - Numeric values
- **BigNumber** - Large number handling
- **JSON** - Parsed JSON objects
- **File** - File objects with metadata
- **List<File>** - Multiple files
- **html** - HTML content

The Dish class handles automatic conversion between types as operations require.

## Node.js API

CyberChef can be imported as a Node module:
```javascript
import chef from "cyberchef"; // ESM
const chef = require("cyberchef"); // CJS
```

See wiki page "Node API" for full documentation.

## Cloudflare Workers Deployment

CyberChef is configured for **automated CI/CD deployment** to Cloudflare Workers. Deployment happens automatically when changes are pushed to GitHub.

### Deployment Workflow (IMPORTANT)

**DO NOT deploy manually or commit directly to master.** Instead, follow this workflow:

1. **Create a feature branch** for your changes
2. **Make your changes** and commit to the branch
3. **Push the branch to GitHub**
4. **Open a Pull Request** to merge into master
5. **CI/CD will automatically:**
   - Run tests
   - Build the project with Node.js v18
   - Deploy to Cloudflare Workers if tests pass
6. **Merge the PR** once CI/CD passes

### CI/CD Configuration

The Cloudflare Workers build system is configured as follows:

- **Root Directory**: `/`
- **Build Command**: `npm run build:cloudflare`
- **Deploy Command**: `npx wrangler deploy`
- **Output Directory**: `build/prod`

**Note:** Cloudflare will automatically detect and use Node.js v22 from the `.nvmrc` file. No environment variables are needed.

### Manual Build/Deploy (For Local Testing Only)

If you need to test locally before pushing:

```bash
# Switch to Node v22
nvm use 22
npm run build

# Remove files we don't want to deploy
rm build/prod/*.zip build/prod/BundleAnalyzerReport.html

# Deploy to Cloudflare Workers (for testing only)
npx wrangler deploy
```

**Note:** Manual deployments should only be done for testing. Production deployments happen via CI/CD.

### Prerequisites

- **Node.js v22** - Required for building and deploying CyberChef (specified in `.nvmrc`)
- **nvm** or similar Node version manager - Recommended for local development

### Build Process

CyberChef builds with Node.js v22, which is compatible with both the build process and Wrangler deployment. The codebase uses the modern `with {type: "json"}` syntax for JSON imports (import attributes), which is supported in Node 20+.

This creates the production bundle in `./build/prod/` including:
- `index.html` - Main HTML file
- `assets/` - JavaScript and CSS bundles
- `modules/` - Dynamically loaded operation modules
- `images/` - Static images

**Note:** The build process also creates `CyberChef_v*.zip` and `BundleAnalyzerReport.html` which are automatically removed before deployment.

### Configuration Files

- **wrangler.toml** - Cloudflare Workers configuration
  - `name`: Worker name
  - `compatibility_date`: Workers runtime compatibility date
  - `[assets]`: Static assets configuration pointing to `./build/prod`

- **.nvmrc** - Specifies Node.js v18 for builds
  - Used by Cloudflare Workers build system
  - Used locally with `nvm use`

### Important Deployment Notes

- **Always use Pull Requests** - Never commit directly to master
- **CI/CD handles deployment** - No need to run `wrangler deploy` manually
- **Asset size limit**: Individual files must be < 25 MiB
- **Clean build directory**: CI/CD automatically removes `*.zip` and analysis files

### Troubleshooting

**Error: "Unexpected identifier 'assert'" or "Unexpected identifier 'with'"**
- Check that you're using Node.js v22 as specified in `.nvmrc`
- Solution: `nvm use 22 && npm run build`

**Error: "Asset too large"**
- The `CyberChef_v*.zip` file is in the build directory
- Solution: `rm build/prod/*.zip` before deploying

## Important Notes

- All processing is client-side; no data sent to servers
- Webpack builds can take significant time (large dependency tree)
- File size limit ~2GB depending on browser
- Node.js version 22 required for building and deployment (see `.nvmrc`)
- Some operations use legacy crypto algorithms requiring `--openssl-legacy-provider` flag
