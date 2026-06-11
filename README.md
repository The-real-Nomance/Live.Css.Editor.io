<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live CSS Editor</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">
      <div class="inspector">
        <div class="inspector-header">
          <span>Selected Element</span>
          <span id="selectedPath">none</span>
        </div>
        <div class="style-grid" id="styleControls"></div>
        <hr>
        <div class="override-output" id="overrideDisplay">no overrides yet, click an element and change a property</div>
        <div class="actions">
          <button id="copyOverrideBtn" class="btn">Copy</button>
          <button id="clearOverridesBtn" class="btn">Clear All</button>
        </div>
      </div>

  <div class="two-columns">
    <div class="left-editors">
      <div class="raw-panel">
        <div class="raw-header">HTML</div>
        <div id="htmlDisplay"></div>
      </div>
      <div class="raw-panel">
        <div class="raw-header">CSS</div>
        <textarea id="overrideEditor" placeholder="your custom overrides will appear here  copy this into your own CSS file"></textarea>
      </div>
    </div>

    <div class="right-preview">
      <div class="preview-container">
        <div class="preview-header">
          <span>Live Preview</span>
          <button id="refreshPreviewBtn" class="btn">Reload</button>
        </div>
        <iframe id="previewFrame" title="live preview"></iframe>
      </div>

  <div class="header">
    <div>
      <h1>Fuck Tradition, Embrace Modernity</h1>
      <div class="sub">Upload HTML on the side </div>
    </div>
    <div class="upload-panel">
      <label for="fileInput" class="file-label">Upload</label>
      <input type="file" id="fileInput" accept="text/html,.html">
      <span id="uploadStatus" class="status-badge">ready</span>
    </div>
  </div>

    </div>
  </div>
</div>
<script src="script.js" defer></script>
</body>
</html>
