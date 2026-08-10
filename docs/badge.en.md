---
title: "Badge 2026"
hide:
  - toc

---

# Badge 2026 documentation

## Connections

When you hold the badge, you will notice there are quite a few connection options. Below is a short summary of the standard and optional connections on the badge.

### Included by default
- USB-C (max power draw?)
- Headset (TRRS: stereo audio + mic input)
- Badge expansion connector (12 pins available, IO and various power supplies)
- MicroSD card

### Optional connectivity
- **[SAO](https://hackaday.io/project/175182-simple-add-ons-sao) connector**, ideal for add-ons such as the [ToF addon](/badge_2026/tof/)
- A **"multimeter" connection** that gives you +3.3V, GND and an analog input pin of the [WCH CH32X035](https://www.wch-ic.com/products/CH32X035.html) microcontroller. With some clever calculations and a bit of code you can measure voltages up to 15V or check resistance values with it. Be careful though: there is no protection whatsoever on this pin, something a regular multimeter obviously does have. So use it with caution.
- For those who bought the LoRa kit there is also a **LoRa antenna connection**. You can solder the included spiral antenna onto it, or fit the optionally available SMA connector. The advantage of the SMA connector is that you can easily swap antennas. Think of a directional antenna when you are doing [foxhunting](https://en.wikipedia.org/wiki/Transmitter_hunting), and an omnidirectional antenna for normal use.
- The **Badge Link / Blaster connector** is once again present on the badge. It is compatible with the <a href="/badge_2024/blaster-2022/">Time Blaster from 2022</a> and <a href="/badge_2024/flamingo">the BFG 9000 from 2024</a>.

## Hardware

### Interactive hardware overview

Hover over a component for a short explanation and to highlight its connections. Click a component to pin its details.

<a href="/badge_2026/assets/uploads/badge-badge_2026_blockdiagram.png" target="_blank" rel="noopener">Open the original PNG diagram ↗</a>

<div data-fri3d-diagram="badge" data-lang="en"></div>

This edition, the badge does not have 1 but **2** microcontrollers! Next to the familiar [ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3) Wi-Fi microcontroller from Espressif, you will also find a small [CH32X035](https://www.wch-ic.com/products/CH32X035.html) chip from WCH. We use this compact, and above all cheap, microcontroller to make up for the ESP32-S3's shortage of IO pins. We do this by gathering a number of functions that are slow or very board-specific on this microcontroller and passing them on to the [ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3) chip over an [I²C connection](https://en.wikipedia.org/wiki/I2C). In the block diagram you can quickly see which functions are connected to the [CH32X035](https://www.wch-ic.com/products/CH32X035.html) chip: those pin numbers start with **PA**, **PB** or **PC** followed by a number. The remaining connections to the [ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3) are also shown in this block diagram; they start with **IO** followed by a number.

## Software
The [ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3) runs a [custom-built](https://github.com/Fri3dCamp/badge_firmware_MicroPythonOS) version of [MicroPythonOS](https://micropythonos.com/)

The extra [CH32X035](https://www.wch-ic.com/products/CH32X035.html) microcontroller found on the badge runs [standard firmware](https://github.com/Fri3dCamp/badge_2026_fw) that makes it work as an IO expander chip over an I²C interface.
