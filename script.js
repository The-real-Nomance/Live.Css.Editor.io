//fuckass functions 
  (function(){
    const fileInput = document.getElementById('fileInput');
    const htmlDisplay = document.getElementById('htmlDisplay');
    const overrideEditor = document.getElementById('overrideEditor');
    const previewFrame = document.getElementById('previewFrame');
    const styleControlsDiv = document.getElementById('styleControls');
    const overrideDisplay = document.getElementById('overrideDisplay');
    const selectedPathSpan = document.getElementById('selectedPath');
    const refreshPreviewBtn = document.getElementById('refreshPreviewBtn');
    const copyOverrideBtn = document.getElementById('copyOverrideBtn');
    const clearOverridesBtn = document.getElementById('clearOverridesBtn');
    const uploadStatus = document.getElementById('uploadStatus');

    let currentIframeDoc = null;
    let selectedElement = null;
    let hoveredElement = null;
    let originalHtmlString = '';
    let overrides = {};

    function clearSelectedElement() {
      if (!selectedElement) return;
      selectedElement.style.outline = '';
      selectedElement = null;
      selectedPathSpan.innerText = 'none';
      styleControlsDiv.innerHTML = '';
    }

    function updateOverrideUI() {
      let output = '';
      for (let sel in overrides) {
        let props = overrides[sel];
        if (Object.keys(props).length === 0) continue;
        output += sel + ' {\n';
        for (let prop in props) {
          output += `  ${prop}: ${props[prop]};\n`;
        }
        output += '}\n\n';
      }
      if (output === '') {
        output = 'no overrides  click an element and adjust a property';
      }
      overrideEditor.value = output;
      overrideDisplay.textContent = output;
    }

    function rebuildPreview() {
      if (!originalHtmlString) {
        previewFrame.srcdoc = '<div style="padding:2rem; font-family:monospace;">upload an HTML file to start</div>';
        return;
      }
      
      let overrideCss = '';
      for (let sel in overrides) {
        let props = overrides[sel];
        if (Object.keys(props).length === 0) continue;
        overrideCss += sel + ' {\n';
        for (let prop in props) {
          overrideCss += `  ${prop}: ${props[prop]} !important;\n`;
        }
        overrideCss += '}\n\n';
      }
      
      let htmlWithOverrides = originalHtmlString;
      const styleTag = `<style id="live-overrides">\n${overrideCss}\n</style>`;
      if (htmlWithOverrides.includes('</head>')) {
        htmlWithOverrides = htmlWithOverrides.replace('</head>', `${styleTag}\n</head>`);
      } else if (htmlWithOverrides.includes('<head>')) {
        htmlWithOverrides = htmlWithOverrides.replace('<head>', `<head>\n${styleTag}\n`);
      } else {
        htmlWithOverrides = `<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8">${styleTag}</head>\n<body>${htmlWithOverrides}</body>\n</html>`;
      }
      
      const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
      frameDoc.open();
      frameDoc.write(htmlWithOverrides);
      frameDoc.close();
      currentIframeDoc = frameDoc;
      attachFrameEvents();
      
      if (selectedElement) {
        let selector = selectedPathSpan.innerText;
        if (selector && selector !== ' none ') {
          let newEl = currentIframeDoc.querySelector(selector);
          if (newEl) {
            selectedElement = newEl;
            selectedElement.style.outline = '2px solid #bd6b3b';
            renderStyleControls(selectedElement, selector);
          } else {
            clearSelectedElement();
          }
        } else {
          clearSelectedElement();
        }
      }
    }

    function attachFrameEvents() {
      if (!currentIframeDoc) return;
      const all = currentIframeDoc.querySelectorAll('*');
      all.forEach(el => {
        el.removeEventListener('mouseover', hoverHandler);
        el.removeEventListener('mouseout', unhoverHandler);
        el.removeEventListener('click', clickHandler);
        el.addEventListener('mouseover', hoverHandler);
        el.addEventListener('mouseout', unhoverHandler);
        el.addEventListener('click', clickHandler);
      });
      if (currentIframeDoc.body) {
        currentIframeDoc.body.removeEventListener('mouseover', hoverHandler);
        currentIframeDoc.body.removeEventListener('mouseout', unhoverHandler);
        currentIframeDoc.body.removeEventListener('click', clickHandler);
        currentIframeDoc.body.addEventListener('mouseover', hoverHandler);
        currentIframeDoc.body.addEventListener('mouseout', unhoverHandler);
        currentIframeDoc.body.addEventListener('click', clickHandler);
      }
    }
//for the hover
    function hoverHandler(e) {
      e.stopPropagation();
      const target = e.target;
      if (hoveredElement === target) return;
      if (hoveredElement) hoveredElement.style.outline = '';
      hoveredElement = target;
      hoveredElement.style.outline = '1px dotted #b48b5a';
    }
//opposite of hover
    function unhoverHandler(e) {
      if (hoveredElement) {
        hoveredElement.style.outline = '';
        hoveredElement = null;
      }
    }

    function clickHandler(e) {
      e.stopPropagation();
      e.preventDefault();
      const target = e.target;
      if (selectedElement === target) return;
      clearSelectedElement();
      selectedElement = target;
      selectedElement.style.outline = '2px solid #bd6b3b';
      const selector = getSelector(selectedElement);
      selectedPathSpan.innerText = selector;
      renderStyleControls(selectedElement, selector);
    }
//good enough not really worth the effort
    function getSelector(el) {
      if (!el) return 'unknown';
      if (el === currentIframeDoc?.body) return 'body';
      if (el.id && el.id.trim() !== '') return '#' + el.id;
      let tag = el.tagName.toLowerCase();
      if (el.className && typeof el.className === 'string') {
        const classes = el.className.trim().split(/\s+/);
        if (classes.length) return tag + '.' + classes[0];
      }
      let parent = el.parentElement;
      if (parent && parent !== currentIframeDoc?.body && parent.tagName) {
        let parentSel = getSelector(parent);
        if (parentSel && parentSel !== 'body') return parentSel + ' > ' + tag;
      }
      return tag;
    }

    function addOverride(selector, property, value) {
      if (!selector) return;
      overrides[selector] ??= {};
      if (value === '' || value == null) {
        delete overrides[selector][property];
        if (!Object.keys(overrides[selector]).length) delete overrides[selector];
      } else {
        overrides[selector][property] = value;
      }
      updateOverrideUI();
      rebuildPreview();
    }
//DONT MESS WITH THESE PROPERTIES took a fuck ton of time to figure out 
    function renderStyleControls(element, selector) {
      if (!element || !currentIframeDoc) return;
      styleControlsDiv.innerHTML = '';
      const computed = currentIframeDoc.defaultView.getComputedStyle(element);
      
      const createColorControl = (label, prop) => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'style-field';
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        fieldDiv.appendChild(labelSpan);
        const wrap = document.createElement('div');
        wrap.style.display = 'flex';
        wrap.style.gap = '4px';
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        let currentColor = computed.getPropertyValue(prop);
        if (!currentColor || currentColor === 'transparent') currentColor = '#000000';
        const toHex = (rgb) => {
          if (!rgb || rgb === 'transparent') return '#000000';
          if (rgb.startsWith('#')) return rgb;
          const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (!m) return '#000000';
          return '#' + ((1 << 24) + (parseInt(m[1]) << 16) + (parseInt(m[2]) << 8) + parseInt(m[3])).toString(16).slice(1);
        };
        colorPicker.value = toHex(currentColor);
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = colorPicker.value;
        textInput.style.width = '70px';
        const updateColor = (val) => {
          addOverride(selector, prop, val);
        };
        colorPicker.addEventListener('input', (e) => {
          textInput.value = e.target.value;
          updateColor(e.target.value);
        });
        textInput.addEventListener('change', (e) => updateColor(e.target.value));
        wrap.appendChild(colorPicker);
        wrap.appendChild(textInput);
        fieldDiv.appendChild(wrap);
        return fieldDiv;
      };
      
      const createSelectControl = (label, prop, options) => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'style-field';
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        fieldDiv.appendChild(labelSpan);
        const select = document.createElement('select');
        for (let opt of options) {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          let currentVal = computed.getPropertyValue(prop);
          if (currentVal === opt) option.selected = true;
          select.appendChild(option);
        }
        select.addEventListener('change', (e) => {
          addOverride(selector, prop, e.target.value);
        });
        fieldDiv.appendChild(select);
        return fieldDiv;
      };
      
      const createTextControl = (label, prop, placeholder) => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'style-field';
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        fieldDiv.appendChild(labelSpan);
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder || '';
        let compVal = computed.getPropertyValue(prop);
        if (compVal && compVal !== 'none') input.value = compVal;
        input.addEventListener('change', (e) => {
          addOverride(selector, prop, e.target.value);
        });
        fieldDiv.appendChild(input);
        return fieldDiv;
      };
      
      let properties = [
        { label: 'color', prop: 'color', type: 'color' },
        { label: 'background', prop: 'background-color', type: 'color' },
        { label: 'font-size', prop: 'font-size', type: 'text', placeholder: '1rem' },
        { label: 'font-weight', prop: 'font-weight', type: 'select', options: ['normal','bold','100','300','400','500','600','700','800'] },
        { label: 'padding', prop: 'padding', type: 'text', placeholder: '0.5rem' }
      ];
      properties.push(
        { label: 'margin', prop: 'margin', type: 'text', placeholder: '0' },
        { label: 'border', prop: 'border', type: 'text', placeholder: '1px solid #aaa' },
        { label: 'text-align', prop: 'text-align', type: 'select', options: ['left','center','right','justify'] },
        { label: 'width', prop: 'width', type: 'text', placeholder: 'auto' },
        { label: 'display', prop: 'display', type: 'select', options: ['block','inline','inline-block','flex','grid','none'] }
      );
      
      for (let p of properties) {
        let control;
        if (p.type === 'color') {
          control = createColorControl(p.label, p.prop);
        } else if (p.type === 'select') {
          control = createSelectControl(p.label, p.prop, p.options);
        } else {
          control = createTextControl(p.label, p.prop, p.placeholder);
        }
        styleControlsDiv.appendChild(control);
      }
    }

    function loadHtmlFromFile(file) {
      if (!file) return;
      uploadStatus.textContent = 'loading...';
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        originalHtmlString = content;
        htmlDisplay.textContent = content;
        overrides = {};
        updateOverrideUI();
        rebuildPreview();
        uploadStatus.textContent = 'click any element';
        setTimeout(() => {
          if (uploadStatus.textContent === 'click any element') uploadStatus.textContent = 'ready';
        }, 2000);
      };
      reader.onerror = () => {
        uploadStatus.textContent = 'error reading file';
      };
      reader.readAsText(file);
    }

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) loadHtmlFromFile(e.target.files[0]);
    });

    document.body.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });
    document.body.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files && files.length && files[0].name.match(/\.html?$/i)) {
        loadHtmlFromFile(files[0]);
      } else if (files.length) {
        alert('drop an .html file');
      }
    });

    refreshPreviewBtn.addEventListener('click', () => {
      rebuildPreview();
    });

    copyOverrideBtn.addEventListener('click', () => {
      const text = overrideEditor.value;
      navigator.clipboard.writeText(text).then(() => {
        uploadStatus.textContent = 'copied to clipboard';
        setTimeout(() => { if (uploadStatus.textContent === 'copied to clipboard') uploadStatus.textContent = 'ready'; }, 1500);
      });
    });

    clearOverridesBtn.addEventListener('click', () => {
      overrides = {};
      updateOverrideUI();
      rebuildPreview();
      clearSelectedElement();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && selectedElement) {
        clearSelectedElement();
      }
    });
//this demo is pretty shit but it kinda works?
    const demoHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>demo</title>
<style>
body {
  background: #fef6ef;
  font-family: Georgia, serif;
  margin: 2rem;
}
.card {
  max-width: 800px;
  background: white;
  border-left: 8px solid #b48b5a;
  padding: 1.5rem;
}
h1 {
  font-weight: normal;
  color: #2d2b26;
}
button {
  background: #e7d5c2;
  border: 1px solid #9f7c58;
  padding: 0.3rem 1rem;
  cursor: pointer;
}
.highlight {
  background: #f1e8df;
  padding: 0.6rem;
}
  
</style>
</head>
<body>
<div class="card">
<h1>Click any Element</h1>
<p>upload your own HTML file. select any element, adjust colors/spacing, then copy the generated CSS into your original file.</p>
<button>try me</button>
<div class="highlight">these overrides won't touch your source</div>
</div>
</body>
</html>`;
    originalHtmlString = demoHtml;
    htmlDisplay.textContent = demoHtml;
    overrides = {};
    updateOverrideUI();
    rebuildPreview();
  })();