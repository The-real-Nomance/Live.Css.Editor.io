Live Preview: Renders your uploaded HTML inside an isolated iframe so it doesn't mess with the main application UI.

    Click-to-Inspect: Hovering over elements shows a dotted outline, and clicking selects them to load their computed styles.

    Automatic Selectors: The tool attempts to generate a clean CSS selector automatically by checking for IDs, classes, or walking up the DOM tree to find parent tags.

    Visual Controls: Quick sliders, color pickers, and dropdowns for common properties:

        Colors (Text and Background)

        Typography (Font size, weight, alignment)

        Box Model (Padding, margin, borders, width)

        Layout (Display types like block, flex, grid, etc.)

    CSS Generation: Outputs structured, ready-to-copy CSS utilizing !important to ensure the rules actually override your existing stylesheets.

    100% Local: Uses the HTML5 FileReader API. Everything runs directly in your browser, so your files are never uploaded to a server.

File Structure

The project is completely self-contained and split into three core files:
Plaintext

├── index.html       # Layout structure, editor panels, and inspector UI
├── style.css        # Responsive layout and typography styling
└── script.js        # Event handling, selector generation, and preview rendering

How It Works

    File Loading: The script reads your local HTML file as text. If no file is uploaded on load, it falls back to a built-in demo page so you can try it out immediately.

    Style Injection: When you change a property in the UI, the script compiles your modifications into a CSS string. It then injects a custom <style id="live-overrides"> block into the header of the iframe's srcdoc.

    Event Listener Binding: Every time the preview rebuilts, the script loops through the iframe's DOM elements and binds mouseover, mouseout, and click listeners to handle the inspector highlights and selection.

    Selector Logic: The getSelector() function recursively checks the targeted element. It prioritizes IDs first, falls back to the primary class name if available, and defaults to standard parent-child traversal (parent > child) if needed.

Getting Started

Since this is a purely static frontend project, there is no installation or build step required.

    Clone or download this repository.

    Double-click index.html to open it in any modern web browser.

    Use the preloaded demo page to test it out, or drop your own HTML file right onto the page.

Usage

    Upload: Click the upload label or drag an .html file anywhere into the window.

    Select: Move your mouse into the live preview pane and click the element you want to edit.

    Tweak: Use the generated controls in the inspector panel to change colors, fonts, or spacing.

    Export: Copy the compiled CSS from the editor panel on the left (or the output block at the bottom) and paste it directly into your own project's stylesheet
