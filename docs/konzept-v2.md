# Entwickle das Browser-Spiel „NOCH 1 METER“ (Konzept v2)

Ich möchte ein modernes, extrem einfaches und süchtig machendes Singleplayer-Browser-Spiel entwickeln.

Das Spiel basiert auf einer einzigen Kernmechanik:

Der Spieler muss eine unbekannte Größe möglichst genau einschätzen.

Der Spieler zieht einen Marker auf einer Skala, bestätigt seine Schätzung und bekommt anschließend angezeigt, wie weit er von der tatsächlichen Antwort entfernt war.

Das Spiel soll sich nicht wie ein klassisches Quiz anfühlen. Es geht um Intuition, visuelle Vorstellungskraft und überraschende Fakten.

Der wichtigste Maßstab ist:

Macht es Spaß, eine weitere Runde zu spielen?

---

## 1. Eindeutige MVP-Umgebung

Verwende diesen Stack:

* Node.js 22 LTS
* npm
* React
* TypeScript (strict mode)
* Vite
* Tailwind CSS
* Framer Motion für Animationen
* Lucide React für Icons
* Vitest (nur als Dev-Dependency, für Logik-Tests)

Keine Datenbank.
Kein Backend.
Keine Benutzerkonten.
Keine Authentifizierung.
Keine Multiplayer-Funktion.

Der komplette Spielstand wird über localStorage im Browser gespeichert.

Das Projekt muss lokal mit

```
npm install
npm run dev
```

startbar sein.

Zusätzlich müssen fehlerfrei laufen:

```
npm run build
npm run test
npm run validate-questions
```

---

## 2. Zielplattform

* Desktop-Browser
* Mobile Browser

Vollständig responsive.

Auf Desktop soll es auch auf einem Stream bzw. großen Bildschirm gut aussehen.

Auf dem Smartphone muss die Bedienung mit einem Finger problemlos funktionieren.

Sprache: Deutsch.

Zahlenformat: de-DE über Intl.NumberFormat (z. B. 384.400 km, 7,3 %).
Währung: Euro (€).
Das Locale wird an einer zentralen Stelle definiert, damit es später änderbar ist.

---

## 3. Kern-Gameplay

Eine Runde:

1. Eine Aufgabe erscheint.

   Beispiel: *Wie schwer ist ein ausgewachsener afrikanischer Elefant?*

2. Darunter erscheint eine große Skala mit Min- und Max-Beschriftung.

3. Zu Beginn ist KEIN Marker gesetzt.
   Grund: Ein Marker in der Mitte wirkt als Anker und beeinflusst die Schätzung.
   Der Marker erscheint beim ersten Tippen/Klicken auf die Skala.

4. Der Spieler zieht den Marker. Der aktuelle Wert wird groß angezeigt.

5. Der Button LOCK IN ist deaktiviert, bis ein Wert gesetzt wurde.

6. Nach LOCK IN kann die Antwort nicht mehr verändert werden.

---

## 4. Fehlerberechnung (geändert)

Die reine Prozentabweichung ist unfair:

* 10× zu hoch geschätzt = 900 % Abweichung
* 10× zu tief geschätzt = 90 % Abweichung

Wer immer tief schätzt, würde belohnt.

Deshalb wird intern mit dem Faktor gerechnet:

```
ratio = playerGuess / correctValue
errorFactor = max(ratio, 1 / ratio)
```

Beispiele:

* Schätzung 4.200, richtig 5.000 → errorFactor 1,19
* Schätzung 50.000, richtig 5.000 → errorFactor 10
* Schätzung 500, richtig 5.000 → errorFactor 10

Beide Richtungen werden gleich behandelt.

Zusätzlich wird gespeichert:

```
direction = "over" | "under" | "exact"
signedLogError = log10(playerGuess / correctValue)
```

(signedLogError wird für die Analyse „Dein Gehirn ist komisch“ benötigt.)

Anzeige für den Spieler:

* Bis errorFactor 2: als Prozent, z. B. „DU LAGST 16 % ZU TIEF“  
  Prozent = (errorFactor − 1) × 100
* Ab errorFactor 2: als Faktor, z. B. „DU LAGST 3,4× ZU HOCH“

Werte ≤ 0 sind nicht möglich, weil die Skala nie bei 0 beginnt (siehe Abschnitt 8).

---

## 5. Punktesystem (angepasst an errorFactor)

- errorFactor ≤ 1,01 → 1000 Punkte
- errorFactor ≤ 1,03 → 800 Punkte
- errorFactor ≤ 1,05 → 650 Punkte
- errorFactor ≤ 1,10 → 500 Punkte
- errorFactor ≤ 1,20 → 350 Punkte
- errorFactor ≤ 1,35 → 200 Punkte
- errorFactor ≤ 1,50 → 100 Punkte
- errorFactor ≤ 2,00 → 50 Punkte
- darüber → 10 Punkte

Die Grenzen werden als Konfiguration in einer eigenen Datei gespeichert (src/config/scoring.ts), nicht in Komponenten.

Maximal mögliche Punktzahl: 10.000.

---

## 6. Bewertung beim Reveal

- errorFactor ≤ 1,02 → PERFEKT!
- errorFactor ≤ 1,05 → FAST PERFEKT
- errorFactor ≤ 1,10 → STARK
- errorFactor ≤ 1,20 → GAR NICHT SCHLECHT
- errorFactor ≤ 1,50 → MUTIG
- errorFactor ≤ 3,00 → AUA.
- darüber → WAS HAST DU GEDACHT?

Pro Stufe gibt es 2–4 alternative humorvolle Texte, die zufällig gewählt werden, damit es nicht repetitiv wird.

Beispiel „WAS HAST DU GEDACHT?“:
* „Mutig. Falsch, aber mutig.“
* „Das war eine Schätzung? Okay.“

---

## 7. Wichtige Designentscheidung

Die Antwort darf während der Schätzung nicht sichtbar sein – auch nicht indirekt.

Das bedeutet auch:
Die Skala darf die Antwort nicht verraten (siehe Abschnitt 8).

Das Spiel soll bewusst das Gefühl erzeugen:

„Ich HABE eigentlich keine Ahnung, aber ich glaube, dass es ungefähr hier sein muss.“

---

## 8. Skalen und Bereiche (geändert)

### 8.1 Logarithmische Skala bereits im MVP

Bei Fragen wie „Erde–Mond“ (384.400 km) ist auf einer linearen Skala keine sinnvolle Genauigkeit möglich, besonders auf dem Handy.

Deshalb unterstützt das MVP beide Skalentypen:

```
scaleType: "linear" | "log"
```

Regel:
* Wenn max / min > 50 → log
* Sonst → linear

Die Regel wird automatisch angewendet, kann aber pro Frage überschrieben werden.

Die Umrechnung Position ↔ Wert steckt in reinen Funktionen (src/lib/scale.ts) und wird getestet.

### 8.2 Die Bereiche dürfen die Antwort nicht verraten

Problem: Wenn die richtige Antwort immer ungefähr in der Mitte der Skala liegt, merkt der Spieler das sehr schnell und schätzt einfach die Mitte.

Lösung: Zwei Modi pro Frage.

```
range:
  | { mode: "fixed"; min: number; max: number }
  | { mode: "auto"; span: number }
```

fixed:
Für Fragen mit natürlichen Grenzen.
Beispiel: Schlafstunden pro Tag (1–24 h), Knochen im Körper.

auto:
Der Bereich wird bei jeder Runde neu erzeugt.
* span = Verhältnis max / min (z. B. 100)
* Die richtige Antwort wird zufällig zwischen 10 % und 90 % der Skala platziert (im Log-Raum gemessen)
* min und max werden auf „schöne“ Zahlen gerundet (1, 2, 5, 10, 20, 50 …)
* Nach dem Runden muss die Antwort weiterhin innerhalb des Bereichs liegen

Standard für neue Fragen: auto.

### 8.3 Die Skala beginnt nie bei 0

Grund: Log-Skalen funktionieren nicht mit 0, und Schätzungen von 0 sind nie sinnvoll.

### 8.4 Werte runden

Der Wert unter dem Marker wird auf 2–3 signifikante Stellen gerundet.
Beispiel: 384.127 → 384.000.

Es wird nie ein Wert mit krummen Nachkommastellen angezeigt.

### 8.5 Feinjustierung

Mit dem Finger ist exaktes Treffen schwer. Deshalb:

* Pfeiltasten (Desktop): kleiner Schritt
* Shift + Pfeiltaste: großer Schritt
* Auf Mobile: zwei große Buttons „−“ und „+“ neben dem Wert für Feinschritte

Schritte richten sich nach dem Skalentyp (bei log: multiplikativ, z. B. ±1 %).

---

## 9. Die Skala als UI-Element

Die Skala ist das wichtigste UI-Element.

* sehr groß, fast volle Breite
* Touch-Fläche mindestens 48 px hoch, besser größer
* Ziehen funktioniert über Pointer Events (Maus, Touch und Stift mit einem Code)
* Während des Ziehens darf die Seite NICHT scrollen (touch-action: none auf der Skala)
* Tippen irgendwo auf die Skala setzt den Marker direkt dorthin
* Der aktuelle Wert steht groß über der Skala
* Bei log-Skalen werden Zwischenmarkierungen angezeigt (z. B. 1.000 / 10.000 / 100.000), damit der Spieler die Verzerrung versteht
* Die Skala ist per Tastatur bedienbar und hat sinnvolle ARIA-Attribute (role="slider", aria-valuenow, aria-valuetext mit Einheit)

---

## 10. Kategorien und Tags

Kategorien (genau eine pro Frage):

* Größe
* Gewicht
* Entfernung
* Zeit
* Geschwindigkeit
* Anzahl
* Preis

Tags (mehrere pro Frage, für die Analyse):

Beispiele: tiere, mensch, körper, weltall, geografie, technik, essen, geschichte, sport, dach, alltag

Grund: „Deine Nemesis: GROSSE TIERE“ funktioniert nur mit Tags, nicht mit Kategorien.

Kategorien und Tags werden als TypeScript-Union-Typen definiert, damit Tippfehler beim Build auffallen.

---

## 11. Einheiten und Formatierung

Jede Frage speichert den Wert in einer Basiseinheit.

Für die Anzeige gibt es Formatter:

```
format?: "number" | "duration" | "currency"
```

* number: Wert + Einheit, z. B. „5.000 kg“
* duration: Wert intern in Sekunden, Anzeige z. B. „8 min 20 s“ oder „1,9 Jahre“
* currency: z. B. „45.000 €“

Einheiten-Wechsel innerhalb einer Frage (z. B. m → km beim Ziehen) gibt es im MVP NICHT. Jede Frage hat eine feste Anzeigeeinheit. Das hält die Bedienung ruhig.

---

## 12. Aufgaben-Datenmodell

Alle Fragen liegen in src/data/questions.ts (bei Bedarf aufgeteilt pro Kategorie in src/data/questions/*.ts).

```
type Category =
  | "Größe" | "Gewicht" | "Entfernung" | "Zeit"
  | "Geschwindigkeit" | "Anzahl" | "Preis";

type Tag = "tiere" | "mensch" | "körper" | "weltall" | ... ;

type QuestionRange =
  | { mode: "fixed"; min: number; max: number }
  | { mode: "auto"; span: number };

type Question = {
  id: string;
  category: Category;
  tags: Tag[];
  question: string;
  correctValue: number;
  unit: string;
  format?: "number" | "duration" | "currency";
  range: QuestionRange;
  scaleType?: "linear" | "log";   // optional, sonst automatisch
  difficulty: 1 | 2 | 3 | 4 | 5;
  explanation: string;            // 1–2 Sätze, der „WAS?!“-Fakt
  source: string;                 // Quelle, z. B. Wikipedia-Artikel oder Behörde
  referenceYear?: number;         // Pflicht bei Preisen und Bevölkerungszahlen
  hint?: string;                  // optionaler Hinweis vor dem Lock-In
  comparison?: {
    type: "person" | "car" | "house" | "football-field";
    value: number;
  };
};
```

Beispiel:

```
{
  id: "elephant-weight",
  category: "Gewicht",
  tags: ["tiere"],
  question: "Wie schwer ist ein ausgewachsener afrikanischer Elefantenbulle?",
  correctValue: 6000,
  unit: "kg",
  range: { mode: "auto", span: 100 },
  difficulty: 2,
  explanation: "Etwa so viel wie vier Autos – und das Herz allein wiegt rund 20 kg.",
  source: "Wikipedia: Afrikanischer Elefant"
}
```

hint und comparison werden im MVP angezeigt, wenn sie vorhanden sind (einfache Textzeile bzw. Emoji + Wert). Illustrationen kommen später.

---

## 13. Fakten und Qualität der Fragen

Die Fakten sind der größte Aufwand und das größte Risiko. Ein falscher Wert fällt beim Reveal sofort auf und zerstört das Vertrauen.

Regeln:

* Keine erfundenen Fakten.
* Jede Frage hat eine Quelle (source).
* Werte dürfen sinnvoll gerundet sein.
* Bei Werten mit großer natürlicher Streuung (Tiergewicht, Lebensdauer) wird die Frage präzise formuliert:
  nicht „Wie schwer ist ein Elefant?“, sondern „Wie schwer ist ein ausgewachsener afrikanischer Elefantenbulle?“
* Die explanation darf die Streuung erwähnen („meist zwischen X und Y“).
* Preise: nur wenige Preisfragen, immer mit referenceYear, und die Frage nennt das Jahr („… im Jahr 2025?“). Stark schwankende Preise (Gold, Bitcoin) vermeiden.
* Bevölkerungszahlen: mit referenceYear.
* Regionale Fragen: Schwerpunkt Welt und DACH (vor allem Deutschland und Österreich). Schweiz-Fragen nur vereinzelt. Zielgruppe ist der deutschsprachige Raum, die meisten Spieler sind keine Schweizer.

Gute Fragen erzeugen einen „WAS?!“-Moment. Schlechte Fragen sind:
* trivial („Wie viele Tage hat ein Jahr?“)
* reine Wissensfragen ohne Vorstellungsbezug („In welchem Jahr …“)
* so unscharf, dass jede Antwort „irgendwie stimmt“

---

## 14. Fragen-Validierung

Ein Skript npm run validate-questions prüft automatisch:

* alle IDs eindeutig
* correctValue > 0
* bei fixed: min < correctValue < max, und die Antwort liegt nicht in der mittleren 10 % der Skala
* bei auto: span ≥ 5
* Preise und Bevölkerung haben referenceYear
* source ist nicht leer
* Anzahl Fragen pro Schwierigkeitsstufe reicht für die Partie-Mischung (siehe Abschnitt 16)
* Anzahl Fragen pro Kategorie wird ausgegeben

Das Skript bricht mit Fehler ab, wenn eine Regel verletzt wird.

---

## 15. MVP-Fragen

Mindestens 100 Fragen.

Verteilung (Richtwert):
* jede Kategorie mindestens 10 Fragen
* Preis maximal 10 Fragen (wegen Aktualität)

Schwierigkeit pro Pool mindestens:
* Stufe 1: 15
* Stufe 2 + 3 zusammen: 35
* Stufe 4: 25
* Stufe 5: 10

Beispiele für gute Fragen:
* Wie viele Liter Blut befinden sich ungefähr im menschlichen Körper?
* Wie schnell kann ein Wanderfalke im Sturzflug werden?
* Wie weit müsste man laufen, um einmal um den Mond zu gehen?
* Wie lange braucht Licht von der Sonne zur Erde?

---

## 16. Partie-Zusammenstellung

Eine Partie hat 10 Runden.

Zuordnung der Schwierigkeitsstufen:
* einfach = 1
* mittel = 2 oder 3
* schwer = 4
* sehr schwer = 5

Mischung pro Partie:
* 2 einfach
* 4 mittel
* 3 schwer
* 1 sehr schwer

Reihenfolge:
Leicht ansteigende Kurve mit Zufall. Die sehr schwere Frage kommt in Runde 8–10. Runde 1 ist immer einfach (guter Einstieg, auch für Zuschauer).

Regeln:
* keine Frage doppelt in einer Partie
* dieselbe Kategorie nie dreimal direkt hintereinander
* Fragen der letzten 3 Partien werden nach Möglichkeit vermieden (IDs in localStorage)
* Falls der Pool für eine Bedingung nicht reicht, werden die Regeln schrittweise gelockert statt abzustürzen

Zufall:
Alle Zufallsfunktionen verwenden einen seed-baren Zufallsgenerator (z. B. mulberry32), der als Parameter übergeben wird.
Grund: Eine spätere „tägliche Challenge“ braucht für alle Spieler dieselben Fragen und dieselben Bereiche. Das ist dann nur ein anderer Seed.

---

## 17. Reveal

Ablauf (gesamt ca. 2,5 Sekunden):

1. DEINE SCHÄTZUNG – Wert erscheint
2. VS
3. TATSÄCHLICH – Wert zählt kurz hoch
4. Auf der Skala erscheinen beide Marker, dazwischen eine Linie, die die Abweichung zeigt
5. Abweichung („DU LAGST 16 % ZU TIEF“) + Bewertung + Punkte (+350)
6. Erklärung (der „WAS?!“-Fakt)
7. Button NÄCHSTE RUNDE

Wichtig:
* Ein Tippen bzw. Leertaste überspringt die Animation und zeigt sofort alles. Wiederholte Animationen nerven sonst nach ein paar Runden.
* Die Stärke der Animation hängt von der Bewertung ab: PERFEKT bekommt einen kurzen auffälligen Effekt (Glow, leichte Skalierung), AUA ein kurzes Wackeln. Nicht übertreiben.
* prefers-reduced-motion wird respektiert (dann nur Fades).

Tastatur (wichtig für Streamer):
* Enter = LOCK IN bzw. NÄCHSTE RUNDE
* Leertaste = Animation überspringen

---

## 18. Startscreen

* Logo: NOCH 1 METER
* Untertitel: „Wie gut kannst du Dinge einschätzen?“
* Button: SPIEL STARTEN
* „Dein Rekord: X.XXX“ (nur wenn vorhanden)
* Kleiner Link „Statistik“ (zeigt die gespeicherten Gesamtstatistiken)

---

## 19. Spielscreen

* Runde X / 10 + Fortschrittsbalken
* aktuelle Punktzahl
* Kategorie
* Frage
* optional: Hinweis / Vergleichsobjekt
* großer aktueller Wert
* Skala
* Lock-In-Button

---

## 20. Endscreen

* Gesamtpunkte (zählen animiert hoch)
* „NEUER REKORD!“, falls zutreffend
* durchschnittliche Abweichung
* perfekte Schätzungen: X / 10
* beste und schlechteste Kategorie
* „Dein Gehirn ist komisch“-Analyse
* Kurze Liste aller 10 Runden (Frage kurz, Schätzung vs. richtig, Punkte) als Karten, keine Tabelle
* Button: NOCHMAL SPIELEN
* Button: ERGEBNIS TEILEN (siehe Abschnitt 22)

---

## 21. „Dein Gehirn ist komisch“

Berechnet aus den tatsächlichen Runden.

Durchschnittliche Abweichung:
Geometrisches Mittel der errorFactor-Werte (nicht arithmetisches Mittel der Prozente), angezeigt als Prozent bzw. Faktor wie in Abschnitt 4.

Über-/Unterschätzung:
Pro Kategorie und pro Tag der Durchschnitt von signedLogError.
* positiv → „Du überschätzt …“
* negativ → „Du unterschätzt …“
* Nur aussagen, wenn mindestens 2 Fragen dieser Gruppe gespielt wurden
* Nur aussagen, wenn die Tendenz deutlich ist (z. B. Faktor > 1,15)

Superkraft / Nemesis:
Kategorie oder Tag mit der besten bzw. schlechtesten durchschnittlichen Abweichung (mindestens 2 Fragen).

Fallback:
Wenn keine deutliche Aussage möglich ist, ein humorvoller Standardtext („Dein Gehirn ist erstaunlich ausgeglichen. Verdächtig.“).

Zusätzlich über alle Partien (aus localStorage):
Wenn genug Daten vorhanden sind, darf die Analyse auch Langzeit-Tendenzen nennen („Seit 5 Partien unterschätzt du Entfernungen“).

Die Texte liegen in einer eigenen Datei (src/data/analysisTexts.ts).

---

## 22. Ergebnis teilen

Ein Button kopiert eine kurze Textzusammenfassung in die Zwischenablage, ähnlich wie bei Wordle:

```
NOCH 1 METER – 6.850 Punkte
🟩🟩🟨🟥🟩🟨🟨🟩🟥🟩
Ø 8,4 % daneben
```

Farbe pro Runde nach Bewertung.

Auf Mobile wird, falls verfügbar, navigator.share verwendet.

Grund: kostet wenig Aufwand, ist aber der wichtigste Weg, wie sich das Spiel verbreiten kann.

---

## 23. Persönliches Profil (localStorage)

Gespeichert werden:

* Spiele gespielt
* Fragen beantwortet
* Gesamtpunkte
* beste Punktzahl
* Summe der log-Fehler (für durchschnittliche Abweichung)
* pro Kategorie und pro Tag: Anzahl, Summe log-Fehler, Summe signedLogError
* Anzahl perfekter Schätzungen
* IDs der Fragen der letzten 3 Partien

Technisch:
* ein einziger Key, z. B. "noch1meter:v1"
* Feld schemaVersion für spätere Migrationen
* Lesen und Schreiben immer in try/catch (private Tabs, volle Speicher, kaputtes JSON)
* Bei kaputten Daten: sauber neu starten statt abstürzen
* Das Spiel funktioniert vollständig auch ohne localStorage
* Button „Statistik zurücksetzen“ mit Bestätigung

Eine laufende Partie wird im MVP NICHT gespeichert. Ein Neuladen startet neu.

---

## 24. Game State

Zustand mit useReducer und klaren Actions, keine verstreuten useState-Aufrufe für Spiellogik.

```
type GamePhase = "start" | "question" | "reveal" | "finished";
```

(„locked“ ist kein eigener Screen, sondern der Übergang zwischen question und reveal.)

```
type RoundResult = {
  questionId: string;
  category: Category;
  tags: Tag[];
  guess: number;
  correctValue: number;
  errorFactor: number;
  signedLogError: number;
  points: number;
  rating: Rating;
};

type GameState = {
  phase: GamePhase;
  seed: number;
  rounds: PreparedRound[];   // Frage + fertig berechneter Bereich + Skalentyp
  currentRound: number;
  guess: number | null;
  score: number;
  results: RoundResult[];
};
```

Die Spiellogik (Auswahl, Bereich, Punkte, Analyse) besteht aus reinen Funktionen ohne React und wird mit Vitest getestet.

---

## 25. Ordnerstruktur (Vorschlag)

```
src/
  components/      Scale, Button, Card, ...
  screens/         StartScreen, GameScreen, RevealScreen, EndScreen, StatsScreen
  game/            reducer, actions, selectQuestions, buildRange
  lib/             scale, scoring, format, random, storage, analysis
  config/          scoring.ts, game.ts (Rundenanzahl, Mischung)
  data/            questions/, ratingTexts.ts, analysisTexts.ts
  types/
scripts/
  validate-questions.ts
```

Keine riesige App.tsx.

---

## 26. UI

Modern und hochwertig, nicht wie eine Quiz-App.

* große Typografie
* minimalistische Oberfläche
* viel Whitespace
* große Interaktionselemente
* abgerundete Karten
* dezente Schatten
* flüssige Animationen
* klare visuelle Hierarchie
* dunkles Design als Standard (wirkt auf Stream besser), hoher Kontrast

Vermeide:
* überladene Dashboards
* kleine Texte
* unnötige Menüs
* Tabellen
* Multiple-Choice-Optik

---

## 27. Responsive Verhalten

Desktop:
* zentrale Spielfläche, max. ca. 1100 px breit
* Skala sehr breit
* Ergebnis prominent

Mobile:
* Skala fast volle Breite
* Frage oben, Wert direkt über der Skala, Buttons unten (Daumen-Bereich)
* funktioniert ab 360 px Breite
* keine horizontale Scrollbar
* Safe-Area beachten (iPhone-Notch / Home-Leiste)

---

## 28. Fehlerzustände

* Fragenpool zu klein → Regeln lockern, notfalls weniger Runden, nie abstürzen
* localStorage nicht verfügbar → Spiel läuft ohne Speicherung
* kaputte gespeicherte Daten → zurücksetzen
* Error Boundary um die App mit „Neu starten“-Button

---

## 29. Erweiterbarkeit (jetzt NICHT implementieren)

Die Architektur soll später erlauben:

* tägliche Challenge (über Seed bereits vorbereitet)
* globale Rangliste
* Freunde, Accounts
* Community-Fragen
* Twitch-Integration, Chat-Abstimmungen, „Chat gegen Streamer“
* Achievements
* weitere Spielmodi (z. B. nur eine Kategorie, Zeitdruck)
* Illustrationen für Vergleichsobjekte
* Mehrsprachigkeit

---

## 30. Nicht im MVP

* Backend, Login, Datenbank
* Multiplayer, Chat, Accounts
* Cloud-Speicherung
* Werbung, Bezahlsystem
* Admin-Panel
* Sound (später, mit Stumm-Schalter)
* Speichern einer laufenden Partie

---

## 31. Entwicklungsreihenfolge

- Phase 1: Projekt aufsetzen (Vite, Tailwind, Vitest, Ordnerstruktur)
- Phase 2: Reine Logik + Tests: scale, scoring, random, buildRange, selectQuestions
- Phase 3: Datenmodell, Validierungs-Skript, zuerst ca. 30 Fragen
- Phase 4: Skalen-Komponente (Touch, Maus, Tastatur, linear + log)
- Phase 5: Spielablauf mit Reducer, Start- und Spielscreen
- Phase 6: Reveal und Punkte
- Phase 7: Endscreen, Analyse, Teilen
- Phase 8: localStorage
- Phase 9: auf 100+ Fragen erweitern, Validierung muss grün sein
- Phase 10: Animationen
- Phase 11: Responsive-Feinschliff, Test auf echtem Handy

Grund für die Reihenfolge:
Mit 30 Fragen kann die Kernmechanik schon getestet werden. Ob die Skala sich gut anfühlt, ist wichtiger als die 100. Frage.

---

## 32. Akzeptanzkriterien

Das MVP ist fertig, wenn:

1. npm install und npm run dev funktionieren
2. npm run build, npm run test und npm run validate-questions fehlerfrei laufen
3. eine komplette 10-Runden-Partie ohne manuelle Eingriffe spielbar ist
4. die Skala mit Maus, Touch und Tastatur funktioniert
5. die Seite beim Ziehen auf dem Handy nicht scrollt
6. der Endscreen Statistik und Analyse aus echten Daten zeigt
7. Rekord und Statistik nach Neuladen noch da sind
8. eine neue Partie andere Fragen und andere Skalenbereiche bringt
9. keine Platzhalterfunktion für den normalen Spielablauf nötig ist

Der wichtigste Maßstab bleibt:

Macht es Spaß, eine weitere Runde zu spielen?
