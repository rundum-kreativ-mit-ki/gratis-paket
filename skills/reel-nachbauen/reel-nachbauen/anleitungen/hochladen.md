# Bilder zu Higgsfield hochladen

Higgsfield braucht eigene Bilder (Fotos, Einzelbilder, Startbilder) als Upload, bevor sie als Referenz
dienen können. Drei Schritte:

1. `media_upload` mit `files: [{filename: "figur-hund.jpg"}, ...]` (bis zu 20 auf einmal). Die Antwort
   enthält je Datei eine `upload_url` und eine `media_id`.
2. Jede Datei mit **curl** hochladen (Python-Uploads bekommen oft Fehler 403):
   `curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Content-Type: image/jpeg" --data-binary @"<pfad>" "<upload_url>"`
   Erwartet: `200`. Die Adresse ist sehr lang: am sichersten in eine kleine Skriptdatei schreiben und die
   ausführen, statt sie in eine Befehlszeile zu quetschen.
3. `media_confirm` mit `type: "image"` und allen `media_ids`.

Danach die `media_id`s in `generate_image` oder `generate_video` unter `medias` verwenden.

Fertige Higgsfield-Ergebnisse (Bilder, Videos) können direkt über ihre `job_id` als Referenz dienen, ohne
erneuten Upload. Heruntergeladen werden sie mit `curl -s -o "<ziel>" "<result_url>"`.
