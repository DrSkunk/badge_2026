(() => {
  'use strict';

  const scriptUrl = new URL(document.currentScript?.src || location.href, location.href);
  const DATA_URL = new URL('../diagrams/fri3d-2026-diagrams.json', scriptUrl).href;
  const ASSET_BASE = new URL('../../', scriptUrl);
  // Hotspot editor: open any diagram page with ?fri3d-edit to move/resize/
  // add/remove board hotspots and export a PHYSICAL_BOARDS config snippet.
  const EDIT_MODE = new URLSearchParams(location.search).has('fri3d-edit');
  let dataPromise;

  const I18N = {
    en: {
      controls: 'Diagram controls',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      fit: 'Fit diagram',
      fullscreen: 'Fill screen',
      exitFullscreen: 'Exit full screen',
      component: 'Component',
      components: 'Components',
      search: 'Search components…',
      searchLabel: 'Search components',
      noResults: 'No matching components.',
      sidebarHint: 'Hover to preview · click to pin',
      directConnections: 'Connections',
      noConnection: 'No direct connection is represented in this overview.',
      externalPath: 'External / board path',
      openDocs: 'Open documentation',
      clearSelection: 'Clear pinned component',
      resizeSidebar: 'Resize component sidebar',
      loading: 'Loading interactive diagram…',
      loadError: 'Could not load the interactive diagram.',
      physicalBoard: 'Physical board',
      boardSide: 'Board side',
      boardFront: 'Front',
      boardBack: 'Back',
      groups: {
        i2c: 'I²C',
        i2s: 'I²S / audio',
        uart: 'UART / serial',
        power: 'Power',
        gpio: 'GPIO / control',
        direct: 'Direct connections'
      }
    },
    nl: {
      controls: 'Diagramknoppen',
      zoomIn: 'Inzoomen',
      zoomOut: 'Uitzoomen',
      fit: 'Diagram passend maken',
      fullscreen: 'Scherm vullen',
      exitFullscreen: 'Volledig scherm sluiten',
      component: 'Component',
      components: 'Componenten',
      search: 'Zoek componenten…',
      searchLabel: 'Zoek componenten',
      noResults: 'Geen overeenkomende componenten.',
      sidebarHint: 'Beweeg voor voorbeeld · klik om vast te zetten',
      directConnections: 'Verbindingen',
      noConnection: 'In dit overzicht is geen directe verbinding weergegeven.',
      externalPath: 'Extern / bordpad',
      openDocs: 'Open documentatie',
      clearSelection: 'Vastgezet component sluiten',
      resizeSidebar: 'Zijbalk vergroten of verkleinen',
      loading: 'Interactief diagram laden…',
      loadError: 'Het interactieve diagram kon niet worden geladen.',
      physicalBoard: 'Fysiek bord',
      boardSide: 'Bordzijde',
      boardFront: 'Voorkant',
      boardBack: 'Achterkant',
      groups: {
        i2c: 'I²C',
        i2s: 'I²S / audio',
        uart: 'UART / serieel',
        power: 'Voeding',
        gpio: 'GPIO / besturing',
        direct: 'Directe verbindingen'
      }
    }
  };

  /*
   * Photo renders of the actual PCBs, shown as part of the same interactive
   * component. Hotspot x/y/w/h are percentages of the image. `match` entries
   * are case-insensitive substrings of node labels in the diagram data; a
   * hotspot is dropped when nothing in the current diagram matches it.
   */
  const PHYSICAL_BOARDS = {
    badge: [
      {
        side: 'front',
        image: 'assets/images/badge-front.png',
        hotspots: [
          {label:'LCD / touch', match:['ST7789v','Backlight','Touch'], x:26.8,y:4,w:46.5,h:67},
          {label:'IR receiver', match:['IR Receiver'], x:20.2,y:16.1,w:5.3,h:11},
          {label:'WS2812 NeoPixels', match:['WS2812'], x:30.2,y:70.5,w:38.7,h:13},
          {label:'Menu', match:['Menu Button'], x:36.2,y:81.3,w:5.6,h:11.6},
          {label:'Start', match:['Start Button'], x:58.4,y:81.9,w:5.4,h:10.8},
          {label:'Joystick', match:['Joystick'], x:7.4,y:34,w:15.3,h:31.4},
          {label:'X', match:['X Button'], x:84.5,y:28.4,w:5.7,h:11.1},
          {label:'Y', match:['Y Button'], x:76.9,y:45.3,w:5.5,h:11.3},
          {label:'A', match:['A Button'], x:92,y:45.3,w:5.4,h:11.6},
          {label:'B', match:['B Button'], x:84.7,y:63.2,w:5.6,h:10.3}
        ]
      },
      {
        side: 'back',
        image: 'assets/images/badge-back.png',
        hotspots: [
          {label:'ESP32-S3', match:['ESP32-S3 based'], x:41.7,y:5,w:17,h:46.2},
          {label:'USB-C', match:['USB C'], x:23.5,y:2.1,w:8.7,h:16.4},
          {label:'Reset', match:['Reset Button'], x:8.6,y:51,w:5.2,h:13.7},
          {label:'MicroSD', match:['MicroSD Card'], x:26.4,y:64,w:14.2,h:36},
          {label:'CH32X035', match:['WCH CH32X035'], x:64.3,y:31.3,w:7.4,h:13.5},
          {label:'Accelerometer', match:['Accelerometer'], x:88,y:38.5,w:3.7,h:8.6},
          {label:'Buzzer', match:['Buzzer'], x:44.2,y:55.1,w:11.3,h:23},
          {label:'Expansion', match:['Expansion Connector'], x:43.7,y:78,w:13.6,h:13.5},
          {label:'Power switch', match:['Power Switch'], x:70.5,y:86.5,w:9,h:10.3},
          {label:'LoRa', match:['LoRa Module'], x:3,y:22.9,w:11.2,h:27},
          {label:'SAO', match:['SAO v1.69 Bis'], x:85.8,y:4.5,w:8.6,h:16},
          {label:'Debug LED', match:['Debug LED'], x:88.6,y:54.7,w:10.3,h:18.4},
          {label:'Multimeter', match:['Multimeter'], x:90,y:71.2,w:8.8,h:24.7},
          {label:'STEMMA QT', match:['Stemma QT connector'], x:93.4,y:24.3,w:5.6,h:13.8},
          {label:'Headset', match:['Headset TRRS Connector'], x:80.4,y:1.5,w:5.9,h:25.8},
          {label:'I²S DAC', match:['I2S DAC'], x:78.5,y:43.5,w:7.5,h:15},
          {label:'Mic amplifier', match:['Microphone Amplifier','Microphone'], x:69,y:15.5,w:4.6,h:10},
          {label:'Battery charger', match:['Battery Charger'], x:70,y:65,w:7,h:14.5},
          {label:'3.3V rails', match:['3.3V Power rails'], rects:[
            {x:32.7,y:20,w:4.7,h:7.5},
            {x:18.2,y:37.6,w:4.7,h:10}
          ]},
          {label:'Badge Link', match:['Badge Link'], x:0.9,y:69.8,w:6.4,h:27}
        ]
      }
    ],

    dj: [
      {
        side: 'front',
        image: 'assets/images/dj-front.png',
        hotspots: [
          {label:'USB-C', match:['USB C'], x:75.3,y:3,w:7.0,h:12},
          {label:'CH32X035', match:['CH32X035'], x:71.5,y:12.4,w:4.5,h:9},
          {label:'Badge expansion connector', match:['Expansion Connector'], x:46.3,y:9.0,w:9.2,h:8.5},
          /* T1 / D9 / C5 / U2 / C6 regulator block left of P1. */
          {label:'3.3V power rail', match:['3.3V Power rail'], x:36.3,y:9.0,w:9.2,h:8.5},
          {label:'Encoder input', match:['2Ch encoder input'], rects:[
            {x:10,y:4.0,w:8.0,h:20.0},
            {x:83.0,y:4.0,w:8.0,h:20.0},
            {x:59,y:9.0,w:6.5,h:8.5}
          ]},

          {label:'Potentiometer', match:['6 x Potentiometers'], rects:[
            {x:5.6,y:17.0,w:8.2,h:16.0},
            {x:5.6,y:40.0,w:8.2,h:16.0},
            {x:5.6,y:60.0,w:8.2,h:16.5},
            {x:88.6,y:17.0,w:8.2,h:16.0},
            {x:88.6,y:40.0,w:8.2,h:16.0},
            {x:88.6,y:60.0,w:8.2,h:16.5}
          ]},

          {label:'Slider', match:['3 x Sliders'], rects:[
            {x:16.3,y:22.0,w:6.0,h:55.0},
            {x:79.0,y:22.0,w:6.0,h:55.0},
            {x:37.5,y:79.5,w:26.5,h:8.5}
          ]},

          {label:'Silicone keypad', match:['Silicone keypad'], rects:[
            {x:24.2,y:26.5,w:9.5,h:17.5},
            {x:38.8,y:26.5,w:9.5,h:17.5},
            {x:53.2,y:26.5,w:9.5,h:17.5},
            {x:67.4,y:26.5,w:9.5,h:17.5},
            {x:24.2,y:55.0,w:9.5,h:17.5},
            {x:38.8,y:55.0,w:9.5,h:17.5},
            {x:53.2,y:55.0,w:9.5,h:17.5},
            {x:67.4,y:55.0,w:9.5,h:17.5}
          ]},

          /* Small LED centers sit on top of the keypad pads (DOM order). */
          {label:'WS2812 RGB LED', match:['WS2812C RGB LEDs'], rects:[
            {x:27.2,y:31.5,w:3.6,h:7.5},
            {x:41.8,y:31.5,w:3.6,h:7.5},
            {x:56.2,y:31.5,w:3.6,h:7.5},
            {x:70.4,y:31.5,w:3.6,h:7.5},
            {x:27.2,y:60.0,w:3.6,h:7.5},
            {x:41.8,y:60.0,w:3.6,h:7.5},
            {x:56.2,y:60.0,w:3.6,h:7.5},
            {x:70.4,y:60.0,w:3.6,h:7.5}
          ]}
        ]
      }
    ],

    communicator: [
      {
        side: 'front',
        image: 'assets/images/communicator-front.png',
        hotspots: [
          {label:'USB-C', match:['USB C'], x:72.0,y:3.0,w:10.0,h:7.5},
          {label:'CH32X035', match:['CH32X035'], x:74.0,y:17.5,w:6.5,h:5.5},
          {label:'Badge expansion connector', match:['Expansion Connector'], x:42.5,y:44.3,w:15.5,h:6.2},
          /* U1 amp cluster plus the P2 speaker connector it drives. */
          {label:'MAX98357A DAC + amp', match:['MAX98357A'], x:22.5,y:34.0,w:10.0,h:8.0},
          {label:'Microphone', match:['SPH0645','Microphone'], x:10.3,y:36.5,w:5.5,h:6.0},
          {label:'KeebDeck', match:['KeebDeck'], x:9.0,y:49.5,w:83.0,h:47.5}
        ]
      }
    ]
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]
  ));

  const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase();

  // Serialize one diagram's board maps as a snippet that can be pasted
  // straight back into PHYSICAL_BOARDS above (used by the ?fri3d-edit editor).
  function serializeBoard(id) {
    const sides = PHYSICAL_BOARDS[id] || [];
    const num = v => String(Math.round(v * 10) / 10);
    const rectOf = r => `x:${num(r.x)},y:${num(r.y)},w:${num(r.w)},h:${num(r.h)}`;
    const q = s => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
    const defOf = def => {
      const match = `[${def.match.map(q).join(',')}]`;
      if (def.rects) {
        return `          {label:${q(def.label)}, match:${match}, rects:[\n` +
          def.rects.map(r => `            {${rectOf(r)}}`).join(',\n') +
          `\n          ]}`;
      }
      return `          {label:${q(def.label)}, match:${match}, ${rectOf(def)}}`;
    };
    return `    ${id}: [\n` + sides.map(side =>
      `      {\n        side: ${q(side.side)},\n        image: ${q(side.image)},\n        hotspots: [\n` +
      side.hotspots.map(defOf).join(',\n') +
      `\n        ]\n      }`
    ).join(',\n') + `\n    ],`;
  }

  const slugify = value => String(value)
    .split('\n')[0]
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const nodeById = (diagram, id) => diagram.nodes.find(node => node.id === id);
  const connectedEdges = (diagram, id) => diagram.edges.filter(edge => edge.source === id || edge.target === id);

  function classifyConnection(edge) {
    const text = (edge.labels || []).join(' ').toUpperCase();
    if (/SCL|SDA|I2C|I²C|DCK|DIO/.test(text)) return 'i2c';
    if (/LRCK|BCK|SCLK|DIN|DOUT|I2S|I²S/.test(text)) return 'i2s';
    if (/UART|TX|RX/.test(text)) return 'uart';
    if (/3V3|3\.3V|5V|VBAT|GND|POWER|VCC/.test(text)) return 'power';
    if (/IO\d|PA\d|PB\d|PC\d|RESET|INT|IRQ|CS|MOSI|MISO|CLK/.test(text)) return 'gpio';
    return 'direct';
  }

  async function render(host, diagram) {
    if (host.dataset.fri3dReady) return;
    host.dataset.fri3dReady = '1';
    host.classList.add('fri3d-diagram');

    const lang = (host.dataset.lang || document.documentElement.lang || 'en')
      .toLowerCase().startsWith('nl') ? 'nl' : 'en';
    const t = I18N[lang];
    const descriptionFor = node => node[`description_${lang}`] || node.description || '';
    const categoryFor = node => node[`category_${lang}`] || node.category_en || t.component;

    host.innerHTML = `<div class="fri3d-diagram__loading">${esc(t.loading)}</div>`;

    let raw;
    try {
      const response = await fetch(new URL(diagram.svg, ASSET_BASE).href);
      if (!response.ok) throw new Error(String(response.status));
      raw = await response.text();
    } catch (error) {
      host.innerHTML = `<p class="fri3d-diagram__error">${esc(t.loadError)}</p>`;
      console.error('Fri3d diagram SVG load failed', error);
      return;
    }

    const svgMarkup = raw
      .replace(/<\?xml[\s\S]*?\?>/i, '')
      .replace(/<!DOCTYPE[\s\S]*?>/i, '');

    const parsed = new DOMParser().parseFromString(svgMarkup, 'image/svg+xml');
    const parserError = parsed.querySelector('parsererror');
    if (parserError) {
      host.innerHTML = `<p class="fri3d-diagram__error">${esc(t.loadError)}</p>`;
      console.error('Fri3d diagram SVG parse failed', parserError.textContent);
      return;
    }

    const svg = document.importNode(parsed.documentElement, true);

    // Draw.io exports a page-sized adaptive background rectangle inside the SVG:
    //   <rect width="100%" height="100%" style="fill: var(--ge-adaptive-bg, #ffffff)">
    // In a normal static SVG that is fine, but in this viewer we pan by changing
    // the viewBox. That makes the exported page rectangle move with the content,
    // producing the black block/cut-off effect in dark mode. Remove only that
    // root-level background and let the viewer surface provide the background.
    const exportedBackground = [...svg.children].find(el =>
      el.tagName?.toLowerCase() === 'rect' &&
      el.getAttribute('width') === '100%' &&
      el.getAttribute('height') === '100%'
    );
    exportedBackground?.remove();

    svg.style.background = 'transparent';
    svg.style.backgroundColor = 'transparent';
    svg.style.colorScheme = 'inherit';
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.classList.add('fri3d-diagram__svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const shell = document.createElement('div');
    shell.className = 'fri3d-diagram__shell';

    const stage = document.createElement('div');
    stage.className = 'fri3d-diagram__stage';
    stage.tabIndex = 0;
    stage.append(svg);

    const toolbar = document.createElement('div');
    toolbar.className = 'fri3d-toolbar';
    toolbar.setAttribute('aria-label', t.controls);
    toolbar.innerHTML = `
      <button type="button" data-action="zoom-in" title="${esc(t.zoomIn)}" aria-label="${esc(t.zoomIn)}">+</button>
      <button type="button" data-action="zoom-out" title="${esc(t.zoomOut)}" aria-label="${esc(t.zoomOut)}">−</button>
      <button type="button" data-action="fit" title="${esc(t.fit)}" aria-label="${esc(t.fit)}">⌂</button>
      <button type="button" data-action="fullscreen" title="${esc(t.fullscreen)}" aria-label="${esc(t.fullscreen)}">⛶</button>
    `;
    stage.append(toolbar);

    const tooltip = document.createElement('div');
    tooltip.className = 'fri3d-tooltip';
    tooltip.hidden = true;
    stage.append(tooltip);

    const resizer = document.createElement('div');
    resizer.className = 'fri3d-resizer';
    resizer.setAttribute('role', 'separator');
    resizer.setAttribute('aria-orientation', 'vertical');
    resizer.setAttribute('aria-label', t.resizeSidebar);
    resizer.tabIndex = 0;

    const sidebar = document.createElement('aside');
    sidebar.className = 'fri3d-index';
    sidebar.setAttribute('aria-label', t.components);
    sidebar.innerHTML = `
      <div class="fri3d-index__inner">
        <div class="fri3d-index__header">
          <strong>${esc(t.components)}</strong>
          <span>${esc(t.sidebarHint)}</span>
        </div>
        <div class="fri3d-index__body">
          <div class="fri3d-index__list"></div>
          <div class="fri3d-index__detail" hidden aria-live="polite"></div>
        </div>
      </div>
    `;

    // Left column: diagram stage with the physical board (when available)
    // below it, so the sidebar can span the full component height.
    const main = document.createElement('div');
    main.className = 'fri3d-diagram__main';
    main.append(stage);

    shell.append(main, resizer, sidebar);
    host.replaceChildren(shell);

    const realNodes = [...svg.querySelectorAll('[data-fri3d-node-id]')];
    const realEdges = [...svg.querySelectorAll('[data-fri3d-edge-cell]')];
    realEdges.forEach(group => {
      if (!group.dataset.fri3dEdgeId) {
        group.dataset.fri3dEdgeId =
          group.dataset.fri3dEdgeCell ||
          group.getAttribute('data-cell-id') ||
          '';
      }
    });
    const list = sidebar.querySelector('.fri3d-index__list');
    const detail = sidebar.querySelector('.fri3d-index__detail');

    const originalViewBox = (svg.getAttribute('viewBox') || '0 0 100 100')
      .trim().split(/\s+/).map(Number);
    const base = {x: originalViewBox[0], y: originalViewBox[1], w: originalViewBox[2], h: originalViewBox[3]};
    const view = {...base};

    // The stage follows the diagram's real aspect ratio (used by the layout
    // with the physical board below), so no letterbox gap appears between
    // the diagram and the board.
    stage.style.setProperty('--fri3d-stage-aspect', `${base.w} / ${base.h}`);

    let pan = null;
    let hovered = null;
    let previewed = null;
    let selected = null;
    const boardHotspots = [];
    const boardFigures = [];
    const boardToggleButtons = [];
    const pointers = new Map();
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 10;

    function applyView() {
      svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
    }

    function fit() {
      Object.assign(view, base);
      applyView();
    }

    function currentZoom() {
      return base.w / view.w;
    }

    function zoomAt(factor, clientX, clientY) {
      const oldZoom = currentZoom();
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, oldZoom * factor));
      if (newZoom === oldZoom) return;

      const rect = stage.getBoundingClientRect();
      const px = clientX == null ? 0.5 : (clientX - rect.left) / rect.width;
      const py = clientY == null ? 0.5 : (clientY - rect.top) / rect.height;
      const anchorX = view.x + view.w * px;
      const anchorY = view.y + view.h * py;
      const width = base.w / newZoom;
      const height = base.h / newZoom;

      view.x = anchorX - width * px;
      view.y = anchorY - height * py;
      view.w = width;
      view.h = height;
      applyView();
    }

    function itemFor(id) {
      return sidebar.querySelector(`[data-fri3d-index-id="${CSS.escape(id)}"]`);
    }

    function ensureItemVisible(id) {
      const item = itemFor(id);
      if (!item) return;
      const itemRect = item.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      if (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom) {
        item.scrollIntoView({block: 'nearest', behavior: 'smooth'});
      }
    }

    function updateFocus() {
      const focus = hovered || previewed || selected;

      realNodes.forEach(group => {
        const id = group.dataset.fri3dNodeId;
        group.classList.toggle('is-fri3d-related', !!focus && id === focus);
        group.classList.toggle('is-fri3d-selected', !!selected && id === selected);
        group.classList.toggle('is-fri3d-muted', !!focus && id !== focus);
      });

      realEdges.forEach(group => {
        const active = !!focus && (
          group.dataset.fri3dSource === focus ||
          group.dataset.fri3dTarget === focus
        );
        group.classList.toggle('is-fri3d-active', active);
        group.classList.toggle('is-fri3d-muted', !!focus && !active);
      });

      sidebar.querySelectorAll('[data-fri3d-index-id]').forEach(item => {
        const id = item.dataset.fri3dIndexId;
        item.classList.toggle('is-active', !!hovered && id === hovered);
        item.classList.toggle('is-selected', !!selected && id === selected);
        item.setAttribute('aria-current', selected === id ? 'true' : 'false');
      });

      boardHotspots.forEach(spot => {
        spot.el.classList.toggle('is-active', !!focus && spot.ids.includes(focus));
        spot.el.classList.toggle('is-selected', !!selected && spot.ids.includes(selected));
      });
    }

    function shortDescription(node) {
      const full = descriptionFor(node).trim();
      if (!full) return '';
      const first = full.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || full;
      return first.length > 170 ? `${first.slice(0, 167).trimEnd()}…` : first;
    }

    function connectionRows(id) {
      return connectedEdges(diagram, id).map(edge => {
        const otherId = edge.source === id ? edge.target : edge.source;
        const other = nodeById(diagram, otherId);
        return {
          edgeId: edge.id,
          source: edge.source,
          target: edge.target,
          otherId,
          other: other?.label || t.externalPath,
          labels: (edge.labels || [])
            .flatMap(label => label.split(/\n+/))
            .map(label => label.trim())
            .filter(Boolean)
        };
      });
    }

    function renderDetails(id) {
      const node = nodeById(diagram, id);
      if (!node) return;

      selected = id;
      previewed = null;
      const rows = connectionRows(id);

      let metadata = '';
      if (node.bus || node.i2c_address) {
        metadata = `<div class="fri3d-node-meta">
          ${node.bus ? `<span><strong>Bus</strong> ${esc(node.bus === 'I2C' ? 'I²C' : node.bus)}</span>` : ''}
          ${node.i2c_address ? `<span><strong>${lang === 'nl' ? 'Adres' : 'Address'}</strong> <code>${esc(node.i2c_address)}</code></span>` : ''}
        </div>`;
      }

      list.hidden = true;
      detail.hidden = false;
      sidebar.classList.add('is-showing-detail');

      detail.innerHTML = `
        <button type="button" class="fri3d-index__back">← ${esc(lang === 'nl' ? 'Componenten' : 'Components')}</button>
        <div class="fri3d-index__detail-head">
          <div>
            <span class="fri3d-chip">${esc(categoryFor(node))}</span>
            <h3>${esc(node.label)}</h3>
          </div>
        </div>
        <p>${esc(descriptionFor(node))}</p>
        ${metadata}
        ${rows.length ? `
          <h4>${esc(t.directConnections)}</h4>
          <div class="fri3d-connections">
            ${rows.map((row, index) => `
              <button type="button" class="fri3d-connection-row"
                data-connection-index="${index}">
                <strong>${esc(row.other)}</strong>
                ${row.labels.length ? `<span>${esc(row.labels.join(' · '))}</span>` : ''}
              </button>`).join('')}
          </div>` : ''}
        ${node.url ? `<a class="fri3d-more" href="${esc(node.url)}" target="_blank" rel="noopener noreferrer">${esc(t.openDocs)} ↗</a>` : ''}
      `;

      detail.querySelector('.fri3d-index__back')?.addEventListener('click', clearSelection);

      detail.querySelectorAll('.fri3d-connection-row').forEach(button => {
        const row = rows[Number(button.dataset.connectionIndex)];
        if (!row) return;

        const enter = () => {
          hovered = row.otherId || null;

          // Highlight only this exact exported SVG edge.
          realEdges.forEach(group => {
            const sameEdge = row.edgeId && group.dataset.fri3dEdgeId === row.edgeId;
            const sameEndpoints =
              group.dataset.fri3dSource === row.source &&
              group.dataset.fri3dTarget === row.target;
            group.classList.toggle('is-fri3d-active', sameEdge || sameEndpoints);
            group.classList.toggle('is-fri3d-muted', !(sameEdge || sameEndpoints));
          });

          realNodes.forEach(group => {
            const gid = group.dataset.fri3dNodeId;
            const related = gid === selected || gid === row.otherId;
            group.classList.toggle('is-fri3d-related', related);
            group.classList.toggle('is-fri3d-muted', !related);
          });

          itemFor(row.otherId)?.classList.add('is-active');
          ensureItemVisible(row.otherId);
        };

        const leave = () => {
          hovered = null;
          updateFocus();
        };

        button.addEventListener('pointerenter', enter);
        button.addEventListener('pointerleave', leave);
        button.addEventListener('focus', enter);
        button.addEventListener('blur', leave);

        button.addEventListener('click', () => {
          if (row.otherId && nodeById(diagram, row.otherId)) {
            pin(row.otherId);
          }
        });
      });

      updateFocus();
    }

    function componentHash(node) {
      return `component-${slugify(node.label)}`;
    }

    function setHashFor(node) {
      const url = new URL(location.href);
      url.hash = componentHash(node);
      history.replaceState(null, '', url);
    }

    function clearComponentHash() {
      if (!location.hash.startsWith('#component-')) return;
      history.replaceState(null, '', `${location.pathname}${location.search}`);
    }

    function pin(id, {updateHash = true} = {}) {
      const node = nodeById(diagram, id);
      if (!node) return;
      hovered = null;
      previewed = null;
      selected = id;
      tooltip.hidden = true;
      renderDetails(id);
      ensureItemVisible(id);
      revealOnBoard(id);
      if (updateHash) setHashFor(node);
    }

    function showBoardSide(side) {
      boardFigures.forEach(figure => {
        figure.hidden = figure.dataset.boardSide !== side;
      });
      boardToggleButtons.forEach(button => {
        const active = button.dataset.boardSide === side;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }

    // If the pinned component only exists on the board side that is currently
    // hidden, flip to that side so the highlight is actually visible.
    function revealOnBoard(id) {
      const spots = boardHotspots.filter(spot => spot.ids.includes(id));
      if (!spots.length) return;
      const visibleSide = boardFigures.find(figure => !figure.hidden)?.dataset.boardSide;
      if (spots.some(spot => spot.side === visibleSide)) return;
      showBoardSide(spots[0].side);
    }

    function setupPhysicalBoard() {
      const sides = PHYSICAL_BOARDS[diagram.id];
      if (!sides?.length) return;

      const matchIds = needles => {
        const ids = new Set();
        needles.map(normalize).filter(Boolean).forEach(needle => {
          diagram.nodes.forEach(node => {
            if (normalize(node.label).includes(needle)) ids.add(node.id);
          });
        });
        return [...ids];
      };

      const sideLabel = side => side === 'back' ? t.boardBack : t.boardFront;

      const section = document.createElement('section');
      section.className = 'fri3d-physical';
      section.setAttribute('aria-label', t.physicalBoard);
      section.innerHTML = `
        <div class="fri3d-physical__stage">
          ${sides.length > 1 ? `
            <div class="fri3d-physical__toggle" role="group" aria-label="${esc(t.boardSide)}">
              ${sides.map((side, index) => `
                <button type="button" data-board-side="${esc(side.side)}"
                  class="${index === 0 ? 'is-active' : ''}"
                  aria-pressed="${index === 0}">${esc(sideLabel(side.side))}</button>
              `).join('')}
            </div>` : ''}
        </div>
      `;

      const boardStage = section.querySelector('.fri3d-physical__stage');

      sides.forEach((side, index) => {
        const figure = document.createElement('figure');
        figure.className = 'fri3d-physical__board';
        figure.dataset.boardSide = side.side;
        figure.hidden = index > 0;
        figure.innerHTML = `
          <img src="${esc(new URL(side.image, ASSET_BASE).href)}"
            alt="${esc(`${sideLabel(side.side)} — ${t.physicalBoard}`)}"
            loading="lazy" decoding="async">
          <div class="fri3d-physical__overlay"></div>
        `;

        const overlay = figure.querySelector('.fri3d-physical__overlay');
        side.hotspots.forEach(def => {
          const ids = matchIds(def.match);
          // Unmatched definitions are dropped normally, but the editor shows
          // them (flagged red) so they can be fixed instead of vanishing.
          if (!ids.length && !EDIT_MODE) return;

          // A definition covers one rectangle (x/y/w/h) or several (`rects`),
          // e.g. six potentiometers that are one component in the diagram.
          // All regions of a definition highlight together.
          const rects = def.rects || [def];
          rects.forEach(rect => {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = 'fri3d-physical__hotspot';
            el.style.cssText = `left:${rect.x}%;top:${rect.y}%;width:${rect.w}%;height:${rect.h}%`;
            el.setAttribute('aria-label', def.label);
            el.innerHTML = `<span>${esc(def.label)}</span>`;
            if (!ids.length) el.classList.add('is-unmatched');

            if (!EDIT_MODE) {
              const enter = () => {
                hovered = ids[0];
                ensureItemVisible(ids[0]);
                updateFocus();
              };
              const leave = () => {
                hovered = null;
                updateFocus();
              };
              el.addEventListener('pointerenter', enter);
              el.addEventListener('pointerleave', leave);
              el.addEventListener('focus', enter);
              el.addEventListener('blur', leave);
              el.addEventListener('click', () => pin(ids[0]));
            }

            overlay.append(el);
            boardHotspots.push({el, ids, side: side.side, def, rect});
          });
        });

        boardStage.append(figure);
        boardFigures.push(figure);
      });

      section.querySelectorAll('.fri3d-physical__toggle button').forEach(button => {
        button.addEventListener('click', () => showBoardSide(button.dataset.boardSide));
        boardToggleButtons.push(button);
      });

      host.classList.add('fri3d-diagram--has-physical');
      main.append(section);

      // The sticky sidebar caps its height at min(component column, viewport).
      // The column height must be a real length (a percentage cannot resolve
      // against the size-contained sidebar cell), so measure it. Guarded:
      // the editor rebuilds this section and must not stack observers.
      if (!host.fri3dColumnObserved) {
        host.fri3dColumnObserved = true;
        new ResizeObserver(entries => {
          const height = entries[entries.length - 1]?.contentRect.height;
          if (height) host.style.setProperty('--fri3d-column-h', `${Math.round(height)}px`);
        }).observe(main);
      }

      if (EDIT_MODE) enableHotspotEditor(section);
    }

    // Tear the physical section down and build it again from the (mutated)
    // PHYSICAL_BOARDS data — used by the editor after structural changes.
    function rebuildPhysicalBoard() {
      const currentSide = boardFigures.find(figure => !figure.hidden)?.dataset.boardSide;
      main.querySelector('.fri3d-physical')?.remove();
      boardHotspots.length = 0;
      boardFigures.length = 0;
      boardToggleButtons.length = 0;
      setupPhysicalBoard();
      if (currentSide) showBoardSide(currentSide);
    }

    function enableHotspotEditor(section) {
      const sides = PHYSICAL_BOARDS[diagram.id];
      section.classList.add('is-editing');

      const round1 = value => Math.round(value * 10) / 10;
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      let editorSel = null;

      const bar = document.createElement('div');
      bar.className = 'fri3d-editor-bar';
      bar.innerHTML = `
        <strong>Hotspot editor</strong>
        <span>drag = move · corner = resize · arrows = nudge (shift ×10) ·
          double-click = label/match · Del = remove · red = no match</span>
        <button type="button" data-editor-add>+ Block</button>
        <button type="button" data-editor-copy>Copy config</button>
      `;
      section.prepend(bar);

      const output = document.createElement('textarea');
      output.className = 'fri3d-editor-output';
      output.readOnly = true;
      output.hidden = true;
      output.rows = 14;
      section.append(output);

      const selectSpot = spot => {
        editorSel = spot;
        boardHotspots.forEach(other =>
          other.el.classList.toggle('is-editor-selected', other === spot));
      };

      const applyRect = spot => {
        const {rect, el} = spot;
        rect.x = round1(rect.x); rect.y = round1(rect.y);
        rect.w = round1(rect.w); rect.h = round1(rect.h);
        el.style.left = `${rect.x}%`;
        el.style.top = `${rect.y}%`;
        el.style.width = `${rect.w}%`;
        el.style.height = `${rect.h}%`;
        el.querySelector('span').textContent =
          `${spot.def.label} · x:${rect.x} y:${rect.y} w:${rect.w} h:${rect.h}`;
      };

      const removeSpot = spot => {
        const side = sides.find(s => s.hotspots.includes(spot.def));
        if (!side) return;
        if (spot.def.rects) {
          spot.def.rects.splice(spot.def.rects.indexOf(spot.rect), 1);
          if (!spot.def.rects.length) side.hotspots.splice(side.hotspots.indexOf(spot.def), 1);
        } else {
          side.hotspots.splice(side.hotspots.indexOf(spot.def), 1);
        }
      };

      const editLabels = spot => {
        const label = prompt('Label:', spot.def.label);
        if (label === null) return;
        const match = prompt('Match substrings (comma separated, matched against component labels):',
          spot.def.match.join(', '));
        if (match === null) return;
        spot.def.label = label.trim() || spot.def.label;
        spot.def.match = match.split(',').map(s => s.trim()).filter(Boolean);
        rebuildPhysicalBoard();
      };

      boardHotspots.forEach(spot => {
        const el = spot.el;
        const handle = document.createElement('i');
        handle.className = 'fri3d-physical__handle';
        el.append(handle);
        applyRect(spot);

        el.addEventListener('click', ev => ev.preventDefault());
        el.addEventListener('dblclick', () => editLabels(spot));

        el.addEventListener('pointerdown', ev => {
          ev.preventDefault();
          selectSpot(spot);
          const overlayRect = el.parentElement.getBoundingClientRect();
          const resizing = ev.target === handle;
          const start = {
            x: ev.clientX, y: ev.clientY,
            rx: spot.rect.x, ry: spot.rect.y, rw: spot.rect.w, rh: spot.rect.h
          };
          const move = e => {
            const dx = (e.clientX - start.x) / overlayRect.width * 100;
            const dy = (e.clientY - start.y) / overlayRect.height * 100;
            if (resizing) {
              spot.rect.w = clamp(start.rw + dx, 1, 100 - spot.rect.x);
              spot.rect.h = clamp(start.rh + dy, 1, 100 - spot.rect.y);
            } else {
              spot.rect.x = clamp(start.rx + dx, 0, 100 - spot.rect.w);
              spot.rect.y = clamp(start.ry + dy, 0, 100 - spot.rect.h);
            }
            applyRect(spot);
          };
          window.addEventListener('pointermove', move);
          window.addEventListener('pointerup', () =>
            window.removeEventListener('pointermove', move), {once: true});
        });
      });

      bar.querySelector('[data-editor-add]').addEventListener('click', () => {
        const visibleSide = boardFigures.find(figure => !figure.hidden)?.dataset.boardSide;
        const side = sides.find(s => s.side === visibleSide) || sides[0];
        const label = prompt('Label for the new block:', 'New block');
        if (label === null) return;
        const match = prompt('Match substrings (comma separated, matched against component labels):', label);
        if (match === null) return;
        side.hotspots.push({
          label: label.trim() || 'New block',
          match: match.split(',').map(s => s.trim()).filter(Boolean),
          x: 40, y: 40, w: 20, h: 12
        });
        rebuildPhysicalBoard();
      });

      bar.querySelector('[data-editor-copy]').addEventListener('click', async () => {
        const snippet = serializeBoard(diagram.id);
        output.value = snippet;
        output.hidden = false;
        console.log(snippet);
        try {
          await navigator.clipboard.writeText(snippet);
        } catch (_) {}
      });

      document.addEventListener('keydown', ev => {
        if (!editorSel || !section.isConnected) return;
        if (ev.target.closest('textarea, input')) return;

        if (ev.key === 'Delete' || ev.key === 'Backspace') {
          ev.preventDefault();
          removeSpot(editorSel);
          rebuildPhysicalBoard();
          return;
        }

        const step = ev.shiftKey ? 1 : 0.1;
        const rect = editorSel.rect;
        const nudge = {
          ArrowLeft:  () => rect.x = clamp(rect.x - step, 0, 100 - rect.w),
          ArrowRight: () => rect.x = clamp(rect.x + step, 0, 100 - rect.w),
          ArrowUp:    () => rect.y = clamp(rect.y - step, 0, 100 - rect.h),
          ArrowDown:  () => rect.y = clamp(rect.y + step, 0, 100 - rect.h)
        }[ev.key];
        if (nudge) {
          ev.preventDefault();
          nudge();
          applyRect(editorSel);
        }
      });
    }

    function clearSelection() {
      selected = null;
      previewed = null;
      detail.hidden = true;
      list.hidden = false;
      sidebar.classList.remove('is-showing-detail');
      clearComponentHash();
      updateFocus();
    }



    function renderList() {
      list.replaceChildren();

      diagram.nodes.forEach(node => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'fri3d-index__item';
        item.dataset.fri3dIndexId = node.id;
        item.innerHTML = `<span class="fri3d-index__name">${esc(node.label)}</span>`;

        // Hover only highlights the matching block. It never replaces the
        // sidebar contents, so the navigation remains stable and predictable.
        item.addEventListener('pointerenter', () => {
          hovered = node.id;
          ensureItemVisible(node.id);
          updateFocus();
        });
        item.addEventListener('pointerleave', () => {
          hovered = null;
          updateFocus();
        });
        item.addEventListener('focus', () => {
          hovered = node.id;
          updateFocus();
        });
        item.addEventListener('blur', () => {
          hovered = null;
          updateFocus();
        });

        // Click is the single action that opens/pins details.
        item.addEventListener('click', event => {
          event.preventDefault();
          pin(node.id);
        });

        list.append(item);
      });

      updateFocus();
    }

    renderList();
    realNodes.forEach(group => {
      const id = group.dataset.fri3dNodeId;
      const node = nodeById(diagram, id);
      if (!node) return;

      group.setAttribute('tabindex', '0');
      group.setAttribute('role', 'button');
      group.setAttribute('aria-label', node.label.replace(/\n/g, ' '));

      group.addEventListener('pointerenter', () => {
        if (pan) return;
        hovered = id;
        ensureItemVisible(id);
        updateFocus();
        tooltip.innerHTML = `
          <strong>${esc(node.label)}</strong>
          <span>${esc(shortDescription(node))}</span>
        `;
        tooltip.hidden = false;
      });

      group.addEventListener('pointermove', event => {
        if (tooltip.hidden) return;
        const rect = stage.getBoundingClientRect();
        const x = event.clientX - rect.left + 14;
        const y = event.clientY - rect.top + 14;
        tooltip.style.left = `${Math.min(rect.width - tooltip.offsetWidth - 10, Math.max(10, x))}px`;
        tooltip.style.top = `${Math.min(rect.height - tooltip.offsetHeight - 10, Math.max(10, y))}px`;
      });

      group.addEventListener('pointerleave', () => {
        tooltip.hidden = true;
        hovered = null;
        updateFocus();
      });

      group.addEventListener('click', event => {
        event.stopPropagation();
        pin(id);
      });

      group.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          pin(id);
        }
      });
    });

    stage.addEventListener('wheel', event => {
      event.preventDefault();
      zoomAt(event.deltaY < 0 ? 1.15 : 1 / 1.15, event.clientX, event.clientY);
    }, {passive: false});

    stage.addEventListener('pointerdown', event => {
      if (event.target.closest('[data-fri3d-node-id], .fri3d-toolbar')) return;
      stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
      if (pointers.size === 1) {
        pan = {x: event.clientX, y: event.clientY, vx: view.x, vy: view.y};
        stage.classList.add('is-panning');
      }
    });

    stage.addEventListener('pointermove', event => {
      if (!pointers.has(event.pointerId) || !pan || pointers.size !== 1) return;
      const rect = stage.getBoundingClientRect();
      view.x = pan.vx - (event.clientX - pan.x) / rect.width * view.w;
      view.y = pan.vy - (event.clientY - pan.y) / rect.height * view.h;
      applyView();
    });

    const endPan = event => {
      pointers.delete(event.pointerId);
      pan = null;
      stage.classList.remove('is-panning');
    };
    stage.addEventListener('pointerup', endPan);
    stage.addEventListener('pointercancel', endPan);

    async function toggleFullscreen() {
      if (document.fullscreenElement === shell) {
        await document.exitFullscreen();
        return;
      }
      if (shell.requestFullscreen) {
        try {
          await shell.requestFullscreen();
          return;
        } catch (_) {}
      }
      shell.classList.toggle('is-pseudo-fullscreen');
      document.documentElement.classList.toggle(
        'fri3d-no-scroll',
        shell.classList.contains('is-pseudo-fullscreen')
      );
      requestAnimationFrame(fit);
    }

    function syncFullscreenButton() {
      const button = toolbar.querySelector('[data-action="fullscreen"]');
      const active = document.fullscreenElement === shell;
      button.textContent = active ? '×' : '⛶';
      button.title = active ? t.exitFullscreen : t.fullscreen;
      button.setAttribute('aria-label', active ? t.exitFullscreen : t.fullscreen);
      if (active) requestAnimationFrame(fit);
    }

    document.addEventListener('fullscreenchange', syncFullscreenButton);

    toolbar.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      event.stopPropagation();
      if (button.dataset.action === 'zoom-in') zoomAt(1.4);
      if (button.dataset.action === 'zoom-out') zoomAt(1 / 1.4);
      if (button.dataset.action === 'fit') fit();
      if (button.dataset.action === 'fullscreen') toggleFullscreen();
    });

    const SIDEBAR_MIN = 220;
    const SIDEBAR_MAX = 520;
    let resizeState = null;

    function setSidebarWidth(px) {
      const shellWidth = shell.getBoundingClientRect().width;
      const maxByShell = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, shellWidth - 320));
      const width = Math.max(SIDEBAR_MIN, Math.min(maxByShell, px));
      shell.style.setProperty('--fri3d-sidebar-width', `${width}px`);
      try {
        sessionStorage.setItem(`fri3d-sidebar-width:${diagram.id}`, String(width));
      } catch (_) {}
    }

    try {
      const saved = parseFloat(sessionStorage.getItem(`fri3d-sidebar-width:${diagram.id}`));
      if (Number.isFinite(saved)) setSidebarWidth(saved);
    } catch (_) {}

    resizer.addEventListener('pointerdown', event => {
      if (matchMedia('(max-width: 760px)').matches) return;
      event.preventDefault();
      resizer.setPointerCapture(event.pointerId);
      resizeState = {
        x: event.clientX,
        width: sidebar.getBoundingClientRect().width
      };
      resizer.classList.add('is-resizing');
      document.documentElement.classList.add('fri3d-resizing');
    });

    resizer.addEventListener('pointermove', event => {
      if (!resizeState) return;
      setSidebarWidth(resizeState.width - (event.clientX - resizeState.x));
    });

    const endResize = () => {
      resizeState = null;
      resizer.classList.remove('is-resizing');
      document.documentElement.classList.remove('fri3d-resizing');
    };
    resizer.addEventListener('pointerup', endResize);
    resizer.addEventListener('pointercancel', endResize);

    resizer.addEventListener('keydown', event => {
      if (matchMedia('(max-width: 760px)').matches) return;
      const current = sidebar.getBoundingClientRect().width;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSidebarWidth(current + 20);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSidebarWidth(current - 20);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (shell.classList.contains('is-pseudo-fullscreen')) {
        shell.classList.remove('is-pseudo-fullscreen');
        document.documentElement.classList.remove('fri3d-no-scroll');
        requestAnimationFrame(fit);
      } else if (selected) {
        clearSelection();
      }
    });

    setupPhysicalBoard();

    const requestedSlug = location.hash.replace(/^#component-/, '');
    if (requestedSlug && location.hash.startsWith('#component-')) {
      const requested = diagram.nodes.find(node => slugify(node.label) === requestedSlug);
      if (requested) requestAnimationFrame(() => pin(requested.id, {updateHash: false}));
    }

    fit();
  }

  async function boot() {
    if (!dataPromise) {
      dataPromise = fetch(DATA_URL).then(response => {
        if (!response.ok) throw new Error('Could not load Fri3d diagram data');
        return response.json();
      });
    }

    const database = await dataPromise;
    document.querySelectorAll('[data-fri3d-diagram]').forEach(host => {
      const diagram = database.diagrams.find(item => item.id === host.dataset.fri3dDiagram);
      if (diagram) render(host, diagram);
    });
  }

  boot();
  document.addEventListener('DOMContentSwitch', boot);
  document.addEventListener('navigation', boot);
})();
