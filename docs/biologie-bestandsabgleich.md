# Biologie · Bestandsabgleich vor der Academy-Übernahme

Geprüft am 21. Oktober 2026 gegen den aktuellen LehrplanPLUS und den ZAM-Hauptstand `6c18573d` einschließlich Geschichte und Geographie. Thomas hat **Biologie 10 und die Bereinigung des Altbestands** als nächsten Umfang gewählt.

## Jahrgang und Lernbereiche

- [RSO Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayRSO-ANL_1) sieht Biologie regulär in 5, 6, 7, 8 und 10 vor; in 9 in keiner Wahlpflichtfächergruppe.
- [Biologie 10](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/biologie) enthält prozessbezogene Kompetenzen, Genetik, menschliche Eingriffe in Ökosysteme und verantwortungsvolle Elternschaft. Ein gemeinsamer Lehrplan gilt für alle Zweige.
- Nervensystem und Sinnesorgane stehen im Lernbereich 4 von [Biologie 7](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/biologie), Evolution im Lernbereich 5 von [Biologie 8](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/biologie).

## Die drei Quellen des Biologie-10-Mappings

| Alte ZAM-Zelle | Alte Karten | Korrekte Behandlung im Academy-Paket |
| --- | ---: | --- |
| `de-by:realschule-9-biologie-genetik-vererbung` | 10 | Genetik unter Biologie 10, Lernbereich 2; 5 A, 1 B, 4 C |
| `de-by:realschule-9-biologie-nervensystem-sinne` | 8 | Getrenntes Vorwissen aus Biologie 7; 2 A, 6 C; keine neue offizielle Klasse-9- oder -10-Bindung |
| `de-by:realschule-10-biologie-evolution-abstammung` | 8 | Getrenntes Vorwissen aus Biologie 8; 3 A, 5 C; keine neue offizielle Klasse-10-Bindung |

Die bisherigen Namen sind zur Auditierbarkeit in den bytegleichen Fixtures erhalten. Sie werden nicht als Beleg für einen gültigen heutigen Lehrplan verwendet. Für die Auffrischungen wird keine offizielle Klasse-7-/8-Bindung an eine unvollständige Zelle vergeben: Das Paket deckt nicht diese ganzen Jahrgänge ab und soll deren generischen Import nicht verdrängen.

Zu den nötigen inhaltlichen Korrekturen gehören insbesondere die Verwechslung von Eigen- und Fremdreflex, zu allgemeine Aussagen über Mitose/Meiose und Synapsen, kategorische Stammbaumregeln sowie lineare Evolutionsdarstellungen. Es wird keine neue Teilfrage durch den Lernstand einer unsicheren Gesamtfrage als beherrscht markiert.

Die [Mappingdatei](../biologie-realschule-10/replaces-de-by.json) dokumentiert alle 26 Zeilen mit Originalfrage, Kategorie und Begründung. Die beantragte Freigabe ist paketbezogen. Persönliche Karten und Reviewdaten bleiben auch bei Kategorie C erhalten.

## Reihenfolge bis zur nächsten ZAM-Veröffentlichung

1. Academy-App, Zelle, Abdeckungsmatrix und Migrationstests gemeinsam reviewen; ausdrückliche Mapping-Freigabe einholen.
2. Academy mergen und die Veröffentlichung der exakten Zelle im Katalog prüfen.
3. In einem eigenen ZAM-PR gezielt `biologie-realschule-10` synchronisieren, die drei oben genannten alten aktiven Zellen durch Legacy-Fixtures ersetzen und die Lehrplanzuordnung samt Reviewhistorien testen. Andere Biologie-Jahrgänge sind damit nicht als vollständig migriert ausgewiesen.
4. ZAM erst nach diesem Integrationsschritt veröffentlichen. Die Academy-App überträgt keine lokalen Browserfortschritte auf ZAM-Karten.
