---
title: DJ Add-on
hide:
  - toc

---
# DJ Add-on

Om je DJ Add-on te doen werken, moet je deze nog assambleren alvorens je deze kan aansluiten op de badge.

## HARDWARE



### Interactief hardwareoverzicht

Beweeg over een component voor een korte uitleg en om de verbindingen te markeren. Klik op een component om de details vast te zetten.

<a href="/badge_2026/assets/uploads/dj-blockdiagram.png" target="_blank" rel="noopener">Open origineel PNG-diagram ↗</a>
<div data-fri3d-diagram="dj" data-lang="nl"></div>

### DJ add-on eigenschappen

De DJ addon bestaat uit:

* 6 potmeters
* 3 faders
* 8 knoppen (in een 3x3 matrix)
* 8 WS2812 RGB LEDs (1 onder elke knop)
* 2 connectors voor rotary encoders
* 2 connectors voor harde schijven (zie verder)

De ontwerp- en bronbestanden kan je terugvinden in de [GitHub repository](https://github.com/Fri3dCamp/dj_2026)

### Stap voor stap assemblage handleiding

#### Alle componenten netjes verpakt

Het pakje dat je ontvangen hebt bevat alles wat je nodig hebt om de DJ add-on te bouwen

* DJ add-on printplaat
* 6 potmeters
* 3 faders
* 8 siliconen knoppen
* 4 M3 schroeven
* een plaatje voor de knoppen
* 1 x 2x6 pinheader met extra lange pinnen

![Het pakje](/badge_2026/assets/uploads/DJ-Kit.jpeg)
![Inhoud van het pakje](/badge_2026/assets/uploads/DJ-inhoud_van_het_pakje.jpg)

#### Monteer de faders

Er zijn 3 faders om te solderen: 1 links, 1 rechts en 1 onderaan. 
Plooi de middelste 2 pinnetjes van de faders vlak, er is wat plaats tussen de fader en de pcb, ongeveer vlak is goed.
Zet ze in de voorziene gaten en soldeer ze vast langs de achterkant van de PCB.
![fader](/badge_2026/assets/uploads/DJ-Slider.jpeg)
![fader pootjes geplooid](/badge_2026/assets/uploads/DJ-Slider-Clipped.jpeg)
![faders gesoldeerd](/badge_2026/assets/uploads/DJ-Slider-Soldered.jpg)

#### Monteer de potentiometers

Doe hetzelfde voor de 6 potentiometers, 3 aan elke kant. Klik ze in de voorziene gaten en soldeer alle contactpunten aan de achterzijde van de PCB.
![potentiometers solderen](/badge_2026/assets/uploads/DJ-pots-soldering.jpg)
![potentiometers gesoldeerd](/badge_2026/assets/uploads/DJ-soldered.jpeg)

#### Soldeer de lange pinnen

Plaats de lange pinnen aan de zijde met alle componenten. Je kan een andere vrouwelijke connector (of zelfs de badge) gebruiken om de 2 losse pinnen stroken netjes op een rijtje te houden tijdens het solderen.
![pinnen gesoldeerd](/badge_2026/assets/uploads/DJ-lange-pinnen.jpg)

#### Monteer de siliconen toetsen

Leg de siliconen toetsen op de printplaat en schuif daarover het houten afdekplaatje.
Zorg dat de schroefgaten in elke hoek van de siliconen laag, de PCB en het plaatje mooi uitgelijnd zijn.
Monteer daarna de 4 schroeven in de gaten langs de onderzijde (de kant van de PCB), Plaats de moer aan de bovenzijde (de kant van de houten plaat).

![cover](/badge_2026/assets/uploads/DJ-Cover.jpeg)
![cover mounted 1](/badge_2026/assets/uploads/DJ-Cover-Mounted1.jpg)
![cover mounted 2](/badge_2026/assets/uploads/DJ-Cover-Mounted2.jpg)

#### Verbind 2 harde schijven of rotary encoders

In klassieke harde schijven voor computers zit steeds een ronde magnetische plaat die door een spindelmotor wordt rondgedraaid. Deze spindelmotor is (meestal) een 3-fasige brushless DC-motor zonder sensoren. Er zullen dus 4 contactpunten naar de motor gaan. De bedoeling is dat we deze spindelmotor als input device gaan gebruiken op de DJ add-on door 3 van deze 4 contactpunten te verbinden met 1 van de encoder inputs van de DJ add-on. Ook daarvoor is dus wat soldeerwerk nodig. Onze inspiratie hiervoor kwam van [deze instructable](https://www.instructables.com/HDDJ-Turning-an-old-hard-disk-drive-into-a-rotary/), waar je dus ook meer informatie kan vinden.

We sluiten dus 2 van de 3 fases van de motor aan op de DJ add-on. Deze geven elk een sinusoidaal signaal dat 120 graden in fase verschoven is. Intern op de DJ add-on zijn [comparators](https://en.wikipedia.org/wiki/Comparator) gemonteerd die deze 2 sinus golven omzet in 2 blokgolven die gemakkelijk door de encoder functie van de CH32X035 kunnen gemeten worden.

Je kan ook klassieke rotary encoders aansluiten op de DJ add-on. Deze zullen waarschijnlijk een preciezer signaal opleveren dan de HDDs.

In de App Store van [MicropythonOS](https://micropythonos.com) kan je een eenvoudige DJ Add-on app vinden die je kan gebruiken om te testen of je DJ Add-on helemaal goed werkt.

Je kan je DJ Add-on ook meteen uittesten in je browser met de [Fri3d Scratcher](https://fri3dcamp.github.io/fri3d-scratcher/): sluit de DJ Add-on via USB aan op je computer, open de website en klik op "Connect controller". Daarna kan je tracks laden en mixen met de potmeters, faders en knoppen van je DJ Add-on. In de eerste versie van de firmware is een foutje geslopen waardoor de draaiknoppen en sliders niet lijken te werken. Geen paniek! Je kan de firmware eenvoudig updaten via [de fri3d web flasher](https://fri3dcamp.github.io/fri3d-web-flasher/)

[![Fri3d Scratcher](/badge_2026/assets/uploads/dj-fri3d-scratcher.png)](https://fri3dcamp.github.io/fri3d-scratcher/)

### Gebruik

De DJ add-on doet zich voor als een [MIDI](https://midi.org/basic-of-usb) toestel. Je kan de DJ add-on via USB aansluiten op je computer, of via de expansion connector met je badge. De DJ Add-on kan zowel via UART als via I2C met de badge communiceren. De UART instellingen zijn 115200 8N1.

Wil je meteen aan de slag als DJ? Sluit de DJ Add-on via USB aan op je computer en open de [Fri3d Scratcher](https://fri3dcamp.github.io/fri3d-scratcher/) webapplicatie in je browser. Deze werkt via Web MIDI en laat je 2 decks mixen met je DJ Add-on als controller. Als je sliders of draaiknoppen niet lijken te werken, update dan even de firmware via [de fri3d web flasher](https://fri3dcamp.github.io/fri3d-web-flasher/)

Via USB en UART wordt het MIDI protocol gebruikt. Volgende MIDI signalen worden verstuurd door de DJ add-on:

| Input                  | MIDI | Note | bereik       |
| ---------------------- | ---- | ---- | ------------ |
| Potmeter links boven   | CC   | 0x40 | 0x00-0x7F    |
| Potmeter links midden  | CC   | 0x41 | 0x00-0x7F    |
| Potmeter links onder   | CC   | 0x42 | 0x00-0x7F    |
| Fader links            | CC   | 0x43 | 0x00-0x7F    |
| Potmeter rechts boven  | CC   | 0x50 | 0x00-0x7F    |
| Potmeter rechts midden | CC   | 0x51 | 0x00-0x7F    |
| Potmeter rechts onder  | CC   | 0x52 | 0x00-0x7F    |
| Fader rechts           | CC   | 0x53 | 0x00-0x7F    |
| Fader onder            | CC   | 0x59 | 0x00-0x7F    |
| Knop 1                 | CC   | 0x64 | 0x00 of 0x7F |
| Knop 2                 | CC   | 0x66 | 0x00 of 0x7F |
| Knop 3                 | CC   | 0x65 | 0x00 of 0x7F |
| Knop 4                 | CC   | 0x60 | 0x00 of 0x7F |
| Knop 5                 | CC   | 0x62 | 0x00 of 0x7F |
| Knop 6                 | CC   | 0x61 | 0x00 of 0x7F |
| Knop 7                 | CC   | 0x67 | 0x00 of 0x7F |
| Knop 8                 | CC   | 0x63 | 0x00 of 0x7F |
| Encoder links          | CC   | 0x44 | 0x00-0x7F    |
| Encoder rechts         | CC   | 0x54 | 0x00-0x7F    |

De LEDs onder de knoppen kunnen aangestuurd worden door volgende MIDI signalen naar de DJ add-on te sturen:

| LED   | MIDI | Note | bereik    |
| ----- | ---- | ---- | --------- |
| LED 1 | CC   | 0x20 | 0x00-0x09 |
| LED 2 | CC   | 0x21 | 0x00-0x09 |
| LED 3 | CC   | 0x22 | 0x00-0x09 |
| LED 4 | CC   | 0x23 | 0x00-0x09 |
| LED 5 | CC   | 0x24 | 0x00-0x09 |
| LED 6 | CC   | 0x25 | 0x00-0x09 |
| LED 7 | CC   | 0x26 | 0x00-0x09 |
| LED 8 | CC   | 0x27 | 0x00-0x09 |

De volgende tabel geeft de mapping weer tussen de MIDI waarden en de ingestelde kleur op de LED:

| Waarde | Rood | Groen | Blauw | Naam         |
| ------ | ---- | ----- | ----- | ------------ |
| 0x00   | 0x00 | 0x00  | 0x00  | LED uit      |
| 0x01   | 0xc5 | 0x0a  | 0x08  | orange-red   |
| 0x02   | 0x32 | 0xbe  | 0x44  | teal         |
| 0x03   | 0x42 | 0xd4  | 0xf4  | yellow-green |
| 0x04   | 0xf8 | 0xd2  | 0x00  | warm white   |
| 0x05   | 0x00 | 0x44  | 0xff  | blue         |
| 0x06   | 0xaf | 0x00  | 0xcc  | cyan         |
| 0x07   | 0xfc | 0xa6  | 0xd7  | white        |
| 0x08   | 0xf2 | 0xf2  | 0xff  | bright white |
| 0x09   | 0xff | 0x80  | 0x00  | green        |

Via I2C wordt niet het MIDI protocol gebruikt, maar klassieke register read/write operaties, zoals gebruikelijk bij I2C devices. Onderstaande tabel geeft de registers weer met hun functies en permissies alsook de lengte en bereik van de data:

| Register | Naam                   | Permissies | Bytes | omschrijving                          |
| -------- | ---------------------- | ---------- | ----- | ------------------------------------- |
| 0x00     | Versienummer           | R          | 3     | De versie van de firmware (bvb 1.0.0) |
| 0x03     | Knoppen                | R          | 8     | elke bit geeft de status van een knop |
| 0x04     | Potmeter links boven   | R          | 2     | waarde 0-4095                         |
| 0x06     | Potmeter links midden  | R          | 2     | waarde 0-4095                         |
| 0x08     | Potmeter links boven   | R          | 2     | waarde 0-4095                         |
| 0x0a     | Fader links            | R          | 2     | waarde 0-4095                         |
| 0x0c     | Potmeter rechts onder  | R          | 2     | waarde 0-4095                         |
| 0x0e     | Potmeter rechts midden | R          | 2     | waarde 0-4095                         |
| 0x10     | Potmeter rechts boven  | R          | 2     | waarde 0-4095                         |
| 0x12     | Fader rechts           | R          | 2     | waarde 0-4095                         |
| 0x14     | Fader onder            | R          | 2     | waarde 0-4095                         |
| 0x16     | Encoder links          | R          | 2     | waarde 0-127                          |
| 0x18     | Encoder rechts         | R          | 2     | waarde 0-127                          |
| 0x1a     | LED 1 rood             | R/W        | 1     | waarde 0-255                          |
| 0x1b     | LED 1 groen            | R/W        | 1     | waarde 0-255                          |
| 0x1c     | LED 1 blauw            | R/W        | 1     | waarde 0-255                          |
| 0x1d     | LED 2 rood             | R/W        | 1     | waarde 0-255                          |
| 0x1e     | LED 2 groen            | R/W        | 1     | waarde 0-255                          |
| 0x1f     | LED 2 blauw            | R/W        | 1     | waarde 0-255                          |
| 0x20     | LED 3 rood             | R/W        | 1     | waarde 0-255                          |
| 0x21     | LED 3 groen            | R/W        | 1     | waarde 0-255                          |
| 0x22     | LED 3 blauw            | R/W        | 1     | waarde 0-255                          |
| 0x23     | LED 4 rood             | R/W        | 1     | waarde 0-255                          |
| 0x24     | LED 4 groen            | R/W        | 1     | waarde 0-255                          |
| 0x25     | LED 4 blauw            | R/W        | 1     | waarde 0-255                          |
| 0x26     | LED 5 rood             | R/W        | 1     | waarde 0-255                          |
| 0x27     | LED 5 groen            | R/W        | 1     | waarde 0-255                          |
| 0x28     | LED 5 blauw            | R/W        | 1     | waarde 0-255                          |
| 0x29     | LED 6 rood             | R/W        | 1     | waarde 0-255                          |
| 0x2a     | LED 6 groen            | R/W        | 1     | waarde 0-255                          |
| 0x2b     | LED 6 blauw            | R/W        | 1     | waarde 0-255                          |
| 0x2c     | LED 7 rood             | R/W        | 1     | waarde 0-255                          |
| 0x2d     | LED 7 groen            | R/W        | 1     | waarde 0-255                          |
| 0x2e     | LED 7 blauw            | R/W        | 1     | waarde 0-255                          |
| 0x2f     | LED 8 rood             | R/W        | 1     | waarde 0-255                          |
| 0x30     | LED 8 groen            | R/W        | 1     | waarde 0-255                          |
| 0x31     | LED 8 blauw            | R/W        | 1     | waarde 0-255                          |

Kijk vooral even naar de [driver](https://github.com/MicroPythonOS/MicroPythonOS/blob/main/internal_filesystem/lib/drivers/fri3d/dj.py) en [app](https://github.com/MicroPythonOS/MicroPythonOS/tree/main/internal_filesystem/apps/com.micropythonos.dj_addon) code in MicropythonOS om te weten hoe je de DJ Add-on kan aanspreken vanuit Micropython via I2C.

## SOFTWARE (FIRMWARE)

### Programmeren

De firmware zal op je microcontroller geflashed zijn. Echter, als het niet zou werken, kan je de firmware opnieuw flashen aan het `flash station` in de soldeer area of met de webbrowser via [de fri3d web flasher](https://fri3dcamp.github.io/fri3d-web-flasher/).

Als je wil, kan je de firmware ook zelf flashen met je eigen laptop. Bijvoorbeeld mocht je de firmware willen updaten of zelf aanpassingen willen maken. De bronbestanden kan je terugvinden in de [GitHub repository](https://github.com/Fri3dCamp/dj_2026) in de `firmware` subfolder. Lees zeker ook de `README.md` voor meer informatie.

### Compileren

De firmware gebruikt [platformio](https://platformio.org) om de code te compileren. Installeer ook zeker de [ch32v platform package](https://github.com/Community-PIO-CH32V/platform-ch32v). Om de debug versie van de firmware te compileren a.d.h.v de command line, typ dan:

```
pio run -e debug
```

Daarna kan je de firmware terugvinden op deze plaats: `.pio/build/debug/firmware.bin`.

Om de firmware te flashen naar je DJ Add-on, hou de knop dan ingedrukt waarna je de USB kabel naar je computer insteekt. Daarna run je:

```
pio run -e debug -t upload
```

Als alles goed loopt, is je DJ Add-on nu geherflasht met je eigen versie van de firmware.
