(() => {
  'use strict';

  const scriptUrl = new URL(document.currentScript?.src || location.href, location.href);
  const DATA_URL = new URL('../diagrams/fri3d-2026-diagrams.json', scriptUrl).href;
  const ASSET_BASE = new URL('../../', scriptUrl);
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
          {label:'LCD / touch', match:['ST7789v','Backlight','Touch'], x:26.8,y:4.0,w:46.5,h:67.0},
          {label:'IR receiver', match:['IR Receiver'], x:20.8,y:15.6,w:5.0,h:11.0},
          {label:'WS2812 NeoPixels', match:['WS2812'], x:30.2,y:70.5,w:38.7,h:13.0},
          {label:'Menu', match:['Menu Button'], x:36.2,y:80.0,w:5.8,h:11.0},
          {label:'Start', match:['Start Button'], x:58.0,y:80.0,w:6.1,h:11.0},
          {label:'Joystick', match:['Joystick'], x:8.0,y:34.0,w:14.4,h:30},
          {label:'X', match:['X Button'], x:84.3,y:58.8,w:7.5,h:12.5},
          {label:'Y', match:['Y Button'], x:76.0,y:44.5,w:7.6,h:12.7},
          {label:'A', match:['A Button'], x:91.6,y:44.2,w:7.0,h:12.7},
          {label:'B', match:['B Button'], x:84.3,y:63.3,w:7.6,h:12.5}
        ]
      },
      {
        side: 'back',
        image: 'assets/images/badge-back.png',
        hotspots: [
          {label:'ESP32-S3', match:['ESP32-S3 based'], x:42.0,y:5.0,w:16.2,h:46.0},
          {label:'USB-C', match:['USB C'], x:23.5,y:2.1,w:8.7,h:16.4},
          {label:'Reset', match:['Reset Button'], x:8.6,y:51.0,w:5.2,h:13.7},
          {label:'MicroSD', match:['MicroSD Card'], x:26.4,y:64.0,w:14.2,h:29.7},
          {label:'CH32X035', match:['WCH CH32X035'], x:64.3,y:31.3,w:7.4,h:13.5},
          {label:'Accelerometer', match:['Accelerometer'], x:86.9,y:38.3,w:6.5,h:13.5},
          {label:'Buzzer', match:['Buzzer'], x:44.2,y:55.1,w:11.3,h:23.0},
          {label:'Expansion', match:['Expansion Connector'], x:43.7,y:78.0,w:13.6,h:13.5},
          {label:'Power switch', match:['Power Switch'], x:72.1,y:87.2,w:5.1,h:10.4},
          {label:'LoRa', match:['LoRa Module'], x:3.8,y:21.0,w:11.2,h:27.0},
          {label:'SAO', match:['SAO v1.69 Bis'], x:85.8,y:4.5,w:8.6,h:16.0},
          {label:'Debug LED', match:['Debug LED'], x:93.4,y:55.5,w:6.3,h:17.0},
          {label:'Multimeter', match:['Multimeter'], x:89.8,y:71.5,w:7.8,h:23.0},
          {label:'STEMMA QT', match:['Stemma QT connector'], x:93.4,y:24.3,w:5.6,h:13.8},
          {label:'Headset', match:['Headset TRRS Connector'], x:80.7,y:1.0,w:5.6,h:21.5},
          {label:'I²S DAC', match:['I2S DAC'], x:70.0,y:66.0,w:8.2,h:13.0},
          {label:'Mic amplifier', match:['Microphone Amplifier','Microphone'], x:75.2,y:63.0,w:5.8,h:13.0},
          {label:'Battery charger', match:['Battery Charger'], x:20.0,y:31.0,w:5.8,h:8.5},
          {label:'3.3V rails', match:['3.3V Power rails'], x:33.2,y:19.0,w:8.7,h:13.5},
          {label:'Badge Link', match:['Badge Link'], x:0.8,y:68.0,w:6.4,h:24.0}
        ]
      }
    ],

    dj: [
      {
        side: 'front',
        image: 'assets/images/dj-front.png',
        hotspots: [
          {label:'USB-C', match:['USB C'], x:75.3,y:3,w:7.0,h:12},
          {label:'CH32X035', match:['CH32X035'], x:59.5,y:9.0,w:6.5,h:8.5},
          {label:'Badge expansion connector', match:['Expansion Connector'], x:46.3,y:9.0,w:9.2,h:8.5},
          {label:'Encoder input', match:['2Ch encoder input'], rects:[
            {x:10,y:4.0,w:8.0,h:20.0},
            {x:83.0,y:4.0,w:8.0,h:20.0}
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
      <div class="fri3d-index__header">
        <strong>${esc(t.components)}</strong>
        <span>${esc(t.sidebarHint)}</span>
      </div>
      <div class="fri3d-index__body">
        <div class="fri3d-index__list"></div>
        <div class="fri3d-index__detail" hidden aria-live="polite"></div>
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
          if (!ids.length) return;

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

            overlay.append(el);
            boardHotspots.push({el, ids, side: side.side});
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
