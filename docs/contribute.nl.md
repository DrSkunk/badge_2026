---
title: Bijdragen aan documentatie
---
# Help je mee aan deze documentatie?

Wat fijn dat je wil meehelpen, dankjewel! Elke bijdrage, groot of klein, maakt deze documentatie beter voor iedereen. Er is geen technische kennis of speciale software nodig om mee te helpen.

## Inloggen op het documentatie portaal

Ga naar <https://fri3d2026.netlify.app/badge_2026/admin/> , daar staat de editor.

![Loginpagina](/badge_2026/assets/uploads/docs_splash.png)

Klik op **Login with Netlify Identity**

![Identity Providers](/badge_2026/assets/uploads/docs_login.png)

Meld je aan met een account naar keuze (zoals Google of GitHub), of gewoon met je e-mailadres en een wachtwoord. Indien je een e-mailadres kiest zal je eerst een mail ontvangen om je account te activeren.

Wanneer je dan ingelogd bent, zie je het overzicht van alle huidige pagina's.

![Overzicht van pagina's](/badge_2026/assets/uploads/docs_overview.png)

Nu heb je de keuze tussen ofwel een nieuwe pagina toevoegen, ofwel een pagina aanpassen.

## Nieuwe pagina toevoegen

Klik op de overzichtspagina op de zwarte knop **+Page**. Dit opent een nieuw scherm met een lege pagina.

![](/badge_2026/assets/uploads/docs_newpage.png)

Je krijgt standaard een gespleten view. Links de tekst in het **Nederlands** en rechts de tekst in het **Engels**. Liefst hebben we de teksten in beide talen.

Wat er in het veld **Title** staat wordt automatisch toegevoegd aan de inhoudsopgave aan de linkerkant van de documentatiewebsite.

Aan de rechterkant in dit scherm heb je een paar knoppen om het beeld aan te passen.

<img src="/badge_2026/assets/uploads/docs_lang.png" alt="Taalknop" width="32"> **Taalknop:** toont of verbergt het taalveld aan de rechterkant.
<img src="/badge_2026/assets/uploads/docs_preview.png" alt="Voorbeeldknop" width="32"> **Voorbeeldknop:** toont of verbergt een voorbeeld van hoe de tekst er op de website zal uitzien. **Hiervoor moet de Taalknop uitgeschakeld zijn!**
<img src="/badge_2026/assets/uploads/docs_scroll.png" alt="Scrolknop" width="32"> **Scrolknop:** wanneer deze ingeschakeld is, scrolt het voorbeeldvenster mee terwijl je typt.

Je kan nu de gegevens invullen die je wilt. Je moet niet alles van de eerste keer juist doen en tussendoor opslaan en later verder werken.

Als je klaar bent, of later wilt verderdoen, klik je vanboven op **Save**.

**Je hoeft niet bang te zijn om iets kapot te maken**, je wijzigingen komen niet meteen online en worden nagekeken vooraleer ze op de documentatiewebsite komen.

## Pagina aanpassen

In de overzichtspagina klik je op de pagina die je wilt wijzigen. Je krijgt dan hetzelfde scherm als bij het aanmaken van een nieuwe pagina.

Wijzig wat je wilt in het Nederlands en het Engels. Druk daarna op **Save**.

**Opgelet, als je afbeeldingen toevoegt of wijzigt worden ze op dit moment niet getoond in de preview. Dit is een probleem dat onze provider moet oplossen.**

## Wat gebeurt er met je wijzigingen?

Wanneer je klaar bent stuur je best een berichtje op het [Badge 2026 kanaal op Discord](https://discord.com/channels/929462354415087736/1437876462874267740) of spreek je een Fri3d Camp medewerker aan. Zij kunnen dan je bewerkingen nakijken en publiceren op de website.

## Ben je toch eerder technisch aangelegd?

Ook goed! Je kan altijd rechtstreeks bijdragen via [GitHub](https://github.com/Fri3dCamp/badge_2026): fork de repository, pas de Markdown-bestanden in de map `docs/` aan en open een Pull Request. In de [README](https://github.com/Fri3dCamp/badge_2026/blob/main/README.md) vind je alle info die je nodig hebt.

### Een pagina toevoegen aan het menu

Het menu aan de linkerkant wordt bepaald door het `nav:`-blok in [`mkdocs.yml`](https://github.com/Fri3dCamp/badge_2026/blob/main/mkdocs.yml). Maak je een nieuwe pagina, voeg dan één regel toe op de juiste plaats in dat blok, met de Nederlandse titel en de bestandsnaam **zonder** taalsuffix (dus `mijn-pagina.md`, niet `mijn-pagina.nl.md`). Zet de Engelse titel erbij onder `nav_translations` in hetzelfde bestand. De volgorde van het menu is gewoon de volgorde van de regels.

Nogmaals bedankt om mee te helpen! 💚
