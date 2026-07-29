---
title: "ToF Sensor"
---

# ToF Sensor

De [Time-of-flight](https://nl.wikipedia.org/wiki/Time-of-flightcamera) sensor add-on bevat een [VL53L7CH](https://www.st.com/en/imaging-and-photonics-solutions/vl53l7ch.html) 8x8 multizone ToF sensor en kwam tot stand met steun van [EBV Elektronik](https://my.avnet.com/ebv/) en [STMicroelectronics](https://www.st.com/).

## HARDWARE
De printplaat bevat, naast de [VL53L7CH](https://www.st.com/en/imaging-and-photonics-solutions/vl53l7ch.html) sensor, ook nog 8 addreseerbare RGB LEDs die aangesloten zijn op de uitgang van de 5 interne RGB LEDs van de badge. De addon klikt op de [SAO](https://hackaday.io/project/175182-simple-add-ons-sao) connector van de badge en kan optioneel gebruikt worden met de [SaO mirror](https://fri3dcamp.github.io/badge_2026/mirror/). Via I²C kan je de sensor benaderen op het 0x52 adres. De [VL53L7CH](https://www.st.com/en/imaging-and-photonics-solutions/vl53l7ch.html) sensor heeft een meetbereik van 2 tot 350cm tegen maximaal 60Hz (30Hz in geval van I²C interface) en gebruikt hiervoor een klasse I laser met een golflengte van 940nm.  

![ToF Overview](/badge_2026/assets/uploads/ToF-Overview.jpeg)
![ToF SAO1](/badge_2026/assets/uploads/ToF-SAO1.jpeg)
![ToF Ready](/badge_2026/assets/uploads/ToF-Ready.jpeg)
![ToF SAO Solder](/badge_2026/assets/uploads/ToF-SAO_Solder.jpeg)
![ToF SAO2](/badge_2026/assets/uploads/ToF-SAO2.jpeg)
![ToF Mounted](/badge_2026/assets/uploads/ToF-Mounted.jpeg)

## SOFTWARE
Er is een voorbeeld programma beschikbaar in de [appstore](https://docs.micropythonos.com/apps/appstore/) van [MicroPythonOS](https://micropythonos.com/). Tevens biedt [STMicroelectronics](https://www.st.com/) ook voorbeeldcode aan op de [productpagina van de sensor](https://www.st.com/en/embedded-software/stsw-img043.html#section-get-software-table) waarmee je aan de slag kan voor je eigen project.  
![ToF App Loading](/badge_2026/assets/uploads/ToF-App-loading.jpeg)
![ToF App Working](/badge_2026/assets/uploads/ToF-App-working.jpeg)
