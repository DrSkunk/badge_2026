---
title: "ToF Sensor"
---

# ToF Sensor

The [Time-of-flight](https://en.wikipedia.org/wiki/Time-of-flight_camera) sensor add-on contains a[VL53L7CH](https://www.st.com/en/imaging-and-photonics-solutions/vl53l7ch.html) 8x8 multizone ToF sensor and was made possible with the support of [EBV Elektronik](https://my.avnet.com/ebv/) and [STMicroelectronics](https://www.st.com/).

## HARDWARE
The PCB contains, besides the [VL53L7CH](https://www.st.com/en/imaging-and-photonics-solutions/vl53l7ch.html) sensor, also 8 adressable RGB LEDs that are connected to the output of the 5 onboard RGB LEDs of the badge. The addon click into the [SAO](https://hackaday.io/project/175182-simple-add-ons-sao) connector of the badge and can optionally be used with the [SaO mirror](https://fri3dcamp.github.io/badge_2026/mirror/). You can access the sensor via I²C at the address 0x52. The [VL53L7CH](https://www.st.com/en/imaging-and-photonics-solutions/vl53l7ch.html) sensor has a measuring range from 2 till 350cm at a maximal frequency of 60Hz (30Hz when using the I²C interface) and uses a class I laser with a wavelenght of 940nm to achieve this.  

![ToF Overview](/badge_2026/assets/uploads/ToF-Overview.jpeg)
![ToF SAO1](/badge_2026/assets/uploads/ToF-SAO1.jpeg)
![ToF Ready](/badge_2026/assets/uploads/ToF-Ready.jpeg)
![ToF SAO Solder](/badge_2026/assets/uploads/ToF-SAO_Solder.jpeg)
![ToF SAO2](/badge_2026/assets/uploads/ToF-SAO2.jpeg)
![ToF Mounted](/badge_2026/assets/uploads/ToF-Mounted.jpeg)

## SOFTWARE
There is an example app available in the [appstore](https://docs.micropythonos.com/apps/appstore/) of [MicroPythonOS](https://micropythonos.com/). Of course [STMicroelectronics](https://www.st.com/) also offers code examples on the [product page of the sensor](https://www.st.com/en/embedded-software/stsw-img043.html#section-get-software-table) to get you started with your own projects.  

![ToF App Loading](/badge_2026/assets/uploads/ToF-App-loading.jpeg)
![ToF App Working](/badge_2026/assets/uploads/ToF-App-working.jpeg)
