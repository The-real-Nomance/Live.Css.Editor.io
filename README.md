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
