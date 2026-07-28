---
title: Programma's schrijven voor de badge
---

# Programma's schrijven voor de badge

De Fri3d Camp-badge draait **MicroPythonOS**. Dat is een licht besturingssysteem voor microcontrollers waarbij toepassingen in MicroPython worden geschreven.

Met de webgebaseerde [Fri3d-IDE](https://fri3dcamp.github.io/Fri3d-IDE/) kun je vanuit je browser code schrijven, bestanden op de badge beheren en programma's uitvoeren.

!!! tip "Python-ervaring is handig, maar niet verplicht"

    MicroPython lijkt sterk op gewone Python. Heb je nog nooit geprogrammeerd,
    begin dan met kleine aanpassingen aan een bestaand voorbeeld.

## Wat is MicroPythonOS?

MicroPythonOS is een appgericht besturingssysteem dat rond MicroPython is opgebouwd. Functies zoals instellingen, wifi, updates en de App Store worden als toepassingen aangeboden.

Een toepassing kan onder andere:

- tekst, knoppen en afbeeldingen op het scherm tonen;
- reageren op aanrakingen;
- sensoren en uitbreidingsborden uitlezen;
- gegevens bewaren;
- verbinding maken met een netwerk;
- samenwerken met andere onderdelen van MicroPythonOS.

Meer informatie:

- [MicroPythonOS-documentatie](https://docs.micropythonos.com/)
- [Overzicht van toepassingen](https://docs.micropythonos.com/apps/)
- [Een toepassing maken](https://docs.micropythonos.com/apps/creating-apps/)
- [Ingebouwde toepassingen](https://docs.micropythonos.com/apps/built-in-apps/)
- [MicroPythonOS App Store](https://docs.micropythonos.com/apps/appstore/)

## Wat heb je nodig?

- een Fri3d Camp-badge met MicroPythonOS;
- een USB-kabel die gegevens kan overdragen;
- een computer met een ondersteunde webbrowser;
- de [Fri3d-IDE](https://fri3dcamp.github.io/Fri3d-IDE/).

!!! warning "Niet elke USB-kabel kan gegevens versturen"

    Sommige kabels zijn alleen geschikt om apparaten op te laden. Gebruik een
    andere kabel wanneer de badge niet wordt gevonden.

## De badge verbinden

1. Verbind de badge via USB met je computer.
2. Open de [Fri3d-IDE](https://fri3dcamp.github.io/Fri3d-IDE/).
3. Klik op de knop om een apparaat te verbinden.
4. Kies de seriële poort die bij de badge hoort.
5. Geef de browser toestemming om verbinding te maken.

Na het verbinden kun je bestanden op de badge bekijken en MicroPython-code uitvoeren.

!!! note

    Sluit andere programma's die dezelfde seriële verbinding gebruiken. Een
    seriële poort kan doorgaans maar door één programma tegelijk worden geopend.

## Losse MicroPython-code uitvoeren

Voor een snelle test kun je een eenvoudig Python-bestand maken en uitvoeren:

```python
print("Hallo vanaf de Fri3d-badge!")
```

Dit is handig om:

- Python-syntax te leren;
- kleine stukken code te testen;
- hardware en sensoren uit te proberen;
- foutmeldingen te onderzoeken.

Een los script verschijnt niet automatisch als toepassing in de launcher van MicroPythonOS.

## Een MicroPythonOS-toepassing maken

Een echte MicroPythonOS-toepassing heeft een vaste mappenstructuur en metadata. De toepassing wordt in de map `/apps/` op de badge geplaatst.

Een minimale toepassing ziet er ongeveer zo uit:

```text
com.fri3d.helloworld/
├── MANIFEST.JSON
├── icon_64x64.png
└── hello.py
```

De mapnaam is de unieke identificatie van je toepassing. Gebruik bij voorkeur kleine letters en punten, bijvoorbeeld:

```text
be.fri3d.lichtspel
com.jouwnaam.eersteapp
```

Bekijk de actuele structuur en manifestvelden in de handleiding:

[Een MicroPythonOS-toepassing maken](https://docs.micropythonos.com/apps/creating-apps/)

## Een nieuwe toepassing maken in de Fri3d-IDE

Open de [Fri3d-IDE](https://fri3dcamp.github.io/Fri3d-IDE/), verbind je badge
en zoek in het app-overzicht naar **Nieuwe app maken**.

![De knop Nieuwe app maken in het app-overzicht van de Fri3d-IDE](assets/uploads/fri3d-ide-new-app-button-nl.webp)

Klik op **Nieuwe app maken**. Er verschijnt een formulier waarin je de
basisgegevens van je toepassing invult.

![Het formulier Nieuwe app maken in de Fri3d-IDE](assets/uploads/fri3d-ide-new-app-dialog-nl.webp)

Vul minstens deze velden in:

- **App-ID**: een unieke technische naam, bijvoorbeeld `be.fri3d.lichtspel`;
- **Weergavenaam**: de naam die gebruikers in de launcher zien;
- **Versie**: begin bijvoorbeeld met `0.1.0`;
- **Uitgever**: je naam, groep of organisatie;
- **Beschrijving**: een korte uitleg van wat de toepassing doet;
- **Sjabloon**: kies voor een eerste project **Hello World**;
- **Icoon**: upload een eigen pictogram of gebruik het gegenereerde pictogram.

Bij **Sjabloon** kun je kiezen tussen een voorbeeldtoepassing en een leeg
project. **Hello World** is de beste keuze voor een eerste toepassing, omdat
de noodzakelijke structuur en voorbeeldcode al aanwezig zijn.

![De sjabloonkeuze met Hello World en Leeg](assets/uploads/fri3d-ide-template-choice-nl.webp)

Klik daarna op **Maken**. De Fri3d-IDE maakt de projectbestanden en opent ze
zodat je meteen kunt beginnen programmeren.

!!! tip "Gebruik een blijvend App-ID"

    Het App-ID identificeert je toepassing op de badge en in appstores.
    Verander het daarom niet meer nadat je de toepassing hebt gedeeld.


## Het programma testen

Een handige ontwikkelcyclus is:

1. pas de code aan in de Fri3d-IDE;
2. sla het bestand op;
3. kopieer of synchroniseer het bestand met de badge;
4. voer het programma uit;
5. bekijk de uitvoer en eventuele foutmeldingen;
6. verbeter de code en probeer opnieuw.

Werk telkens in kleine stappen. Wanneer je meerdere wijzigingen tegelijk uitvoert, is het moeilijker om te vinden welke wijziging een probleem veroorzaakt.

## De toepassing installeren

MicroPythonOS zoekt geïnstalleerde toepassingen in:

```text
/apps/
```

Kopieer daarom de volledige projectmap naar:

```text
/apps/com.fri3d.helloworld/
```

De badge bevat daarna:

```text
/apps/
└── com.fri3d.helloworld/
    ├── MANIFEST.JSON
    ├── icon_64x64.png
    └── hello.py
```

Start de toepassing daarna vanuit de launcher. Verschijnt ze niet meteen, herstart dan de launcher of de badge.

## Een pictogram toevoegen

Een toepassing gebruikt normaal een pictogram met de naam:

```text
icon_64x64.png
```

Gebruik bij voorkeur:

- een PNG-afbeelding;
- een vierkante afbeelding;
- een resolutie van minstens 64 bij 64 pixels;
- een eenvoudig ontwerp dat ook op klein formaat herkenbaar blijft;
- een zo klein mogelijk bestand.

## Foutmeldingen begrijpen

Wanneer een programma niet werkt, kijk dan eerst naar de console van de Fri3d-IDE.

Een foutmelding bevat meestal:

- het bestand waarin de fout gebeurde;
- het regelnummer;
- het soort fout;
- een korte beschrijving.

Bijvoorbeeld:

```text
NameError: name 'bericht' isn't defined
```

Dit betekent dat de naam `bericht` wordt gebruikt voordat ze is aangemaakt, of dat er een typefout in de naam staat.

### Inspringing

Python gebruikt inspringing om codeblokken aan te duiden.

Fout:

```python
if True:
print("Hallo")
```

Correct:

```python
if True:
    print("Hallo")
```

### Verkeerde bestandsnaam

Wanneer het manifest `hello.py` probeert te starten, moet dat bestand exact zo heten. `Hello.py` en `hello.py` kunnen als verschillende bestandsnamen worden behandeld.

### Ongeldige JSON

Ongeldig:

```json
{
  "name": "Mijn app",
}
```

Geldig:

```json
{
  "name": "Mijn app"
}
```

### Te weinig geheugen

Microcontrollers hebben minder geheugen dan een gewone computer. Grote afbeeldingen, lange lijsten en veel tegelijk geopende schermen kunnen problemen veroorzaken.

Probeer dan:

- kleinere afbeeldingen te gebruiken;
- ongebruikte objecten te verwijderen;
- bestanden pas te laden wanneer ze nodig zijn;
- de badge opnieuw op te starten;
- het programma in kleinere delen te testen.

## Een toepassing delen

Wanneer je toepassing klaar is, kun je ze bundelen en publiceren.

Lees hiervoor:

- [Toepassingen bundelen](https://docs.micropythonos.com/apps/bundling-apps/)
- [Toepassingen publiceren via BadgeHub](https://docs.micropythonos.com/apps/badgehub/)
- [De MicroPythonOS App Store](https://docs.micropythonos.com/apps/appstore/)

Controleer vóór publicatie minstens het volgende:

- de toepassing heeft een unieke identificatie;
- `MANIFEST.JSON` is geldig;
- het versienummer is aangepast;
- het pictogram wordt correct weergegeven;
- de toepassing start zonder foutmelding;
- tijdelijke testbestanden zijn verwijderd;
- er staan geen wachtwoorden of geheime sleutels in de broncode;
- de toepassing kan netjes worden afgesloten.

## Je toepassing delen via BadgeHub

Je kunt een toepassing rechtstreeks vanuit de Fri3d-IDE naar
[BadgeHub](https://badgehub.eu/) publiceren. Je hoeft daarvoor niet eerst
handmatig een `.mpk`-bestand te uploaden via de BadgeHub-website.

Open je toepassing in de Fri3d-IDE en klik bovenaan op het wolkicoon
**Publiceren naar BadgeHub**.

![De knop Publiceren naar BadgeHub in de Fri3d-IDE](assets/uploads/fri3d-ide-badgehub-publish-button-nl.webp)

Wanneer je nog niet bent aangemeld, vraagt de Fri3d-IDE om in te loggen met je
BadgeHub-account.

![Het aanmeldvenster voor BadgeHub in de Fri3d-IDE](assets/uploads/fri3d-ide-badgehub-login-nl.webp)

Klik op **Inloggen bij BadgeHub** en rond de aanmelding af. Daarna opent het
publicatieformulier in de Fri3d-IDE.

![Het publicatieformulier voor BadgeHub in de Fri3d-IDE](assets/uploads/fri3d-ide-badgehub-publish-form-nl.webp)

Controleer of vul deze gegevens aan:

- **Weergavenaam**: de naam die gebruikers in BadgeHub en de App Store zien;
- **Versie**: verhoog dit nummer bij iedere nieuwe publicatie;
- **Auteur**: je naam, groep of organisatie;
- **Korte beschrijving**: een bondige uitleg van de toepassing;
- **Lange beschrijving**: meer informatie over functies en gebruik;
- **Categorie**: kies de categorie die het beste bij je toepassing past;
- **Licentie**: vermeld onder welke licentie je code wordt gedeeld;
- **Git-URL**: voeg indien mogelijk een link naar de broncode toe;
- **Verborgen**: gebruik dit om de toepassing nog niet in het openbare
  BadgeHub-overzicht te tonen;
- **Ontwikkelstatus**: geef aan of de toepassing nog in ontwikkeling is of
  klaar is voor gebruik.

Klik daarna op **Publiceren**. De Fri3d-IDE maakt het pakket aan en verstuurt
het samen met de metadata naar BadgeHub.

!!! tip "Eerst verborgen publiceren"

    Publiceer een eerste testversie als verborgen en met de status
    **In ontwikkeling**. Controleer daarna of installatie en opstarten correct
    werken voordat je de toepassing openbaar maakt.

!!! warning "Verhoog altijd het versienummer"

    BadgeHub en de MicroPythonOS App Store herkennen een update alleen wanneer
    de nieuwe publicatie een hoger versienummer heeft.

Meer informatie:

- [BadgeHub](https://badgehub.eu/)
- [MicroPythonOS-handleiding voor BadgeHub](https://docs.micropythonos.com/apps/badgehub/)
- [MicroPythonOS App Store](https://docs.micropythonos.com/apps/appstore/)


## Goede gewoontes

### Bewaar een kopie op je computer

De badge is geen veilige plaats voor de enige kopie van je project. Bewaar de broncode ook lokaal of in een Git-repository. Je kan hem exporteren.

![Exporteer App als MPK](assets/uploads/fri3d-ide-export-mpk-button-nl.webp)

### Gebruik versienummers

Gebruik bijvoorbeeld:

```text
1.0.0
1.1.0
1.1.1
```

Een gebruikelijke indeling is:

```text
hoofdversie.nieuwe-functies.foutoplossingen
```

### Test zonder netwerk

Een toepassing moet duidelijk reageren wanneer wifi of een internetdienst niet beschikbaar is.

### Hou rekening met beperkte hardware

Vermijd onnodige achtergrondprocessen en lange blokkerende lussen.

### Maak fouten zichtbaar

Toon een begrijpelijke melding wanneer iets mislukt. Alleen een foutmelding in de seriële console is voor gewone gebruikers vaak onvoldoende.

## Verder lezen

- [Fri3d-IDE](https://fri3dcamp.github.io/Fri3d-IDE/)
- [Broncode van de Fri3d-IDE](https://github.com/Fri3dCamp/Fri3d-IDE)
- [MicroPythonOS-documentatie](https://docs.micropythonos.com/)
- [MicroPythonOS-toepassingen](https://docs.micropythonos.com/apps/)
- [Een toepassing maken](https://docs.micropythonos.com/apps/creating-apps/)
- [Toepassingen bundelen](https://docs.micropythonos.com/apps/bundling-apps/)
- [BadgeHub](https://docs.micropythonos.com/apps/badgehub/)
- [MicroPythonOS App Store](https://docs.micropythonos.com/apps/appstore/)
- [MicroPythonOS-broncode](https://github.com/Fri3dCamp/badge_firmware_MicroPythonOS)
