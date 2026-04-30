# Eurovision Roulette — Instructions Claude

## Agentation watch mode

Quand je dis "watch mode" (ou "watch", "lance le watch") :
- Appelle `agentation_watch_annotations` en boucle avec `timeoutSeconds: 30` et `batchWindowSeconds: 10` (mode groupé, court timeout pour rester réactif aux "stop").
- Pour chaque annotation reçue, dans cet ordre :
  1. `reply("✓ reçu, j'attaque.")` — accusé de réception visible côté Agentation.
  2. `acknowledge`.
  3. Applique le fix.
  4. `resolve` avec un summary.
- Les appels `reply`/`acknowledge`/`resolve` peuvent retourner "Annotation not found" si l'utilisateur a recréé une annotation sur le même élément entre-temps : ne pas bloquer dessus, continuer. Le fix reste prioritaire.
- Si l'utilisateur rejette le fix, ne `resolve` pas — laisse l'annotation ouverte.
- Sur `timeout: true` sans annotations, relance immédiatement un nouveau watch (boucle infinie tant que pas de "stop").
- Si je dis "stop", arrête la boucle et fais un récap.

## Agentation webhook receiver

L'icône "avion" d'Agentation (envoi manuel) n'apparaît que si une URL Webhook est configurée. Pour éviter le 404 quand on pointe sur le serveur MCP (`localhost:4747`), une route locale absorbe les POST :

- Endpoint : `http://localhost:3000/api/agentation-webhook`
- Fichier : `src/app/api/agentation-webhook/route.ts`
- Comportement : renvoie `{ ok: true }` et log le payload dans la console du `next dev`.

À coller dans **Manage MCP & Webhooks → Webhook URL** côté extension. Auto-Send peut rester off : c'est le clic manuel sur l'avion qui POST.
