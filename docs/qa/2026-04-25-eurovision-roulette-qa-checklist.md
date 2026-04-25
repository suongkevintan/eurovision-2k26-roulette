# Eurovision Roulette — Carnet de QA

> Checklist manuelle à dérouler avant le dîner du 16 mai 2026.
> Coche ce qui passe, note les bugs en commentaire, ouvre une issue ou ping-moi pour corriger.

**Dernière mise à jour :** 2026-04-25
**Branche / tag :** `main` / `v0.2.0-figma-integration` (+ corrections ultérieures)
**URL locale :** http://localhost:3000 (`npm run dev`)

---

## Comment exécuter cette QA

1. `npm install` (si jamais)
2. `rm -rf .next && npm run dev` (clean restart pour éviter les caches HMR)
3. Ouvre `http://localhost:3000` dans un navigateur
4. Avant chaque scénario : **vide le localStorage** via DevTools → Application → Local Storage → `eurovision-roulette-state-v1` → clic droit → Delete (ou DevTools console : `localStorage.clear()` puis reload)
5. Si Supabase est configuré (variables `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`), pense à vider aussi les tables `roulette_guests` et `roulette_events` entre les sessions

**Critère d'acceptation global :** chaque case cochée passe sans warning console critique, sans crash, sans freeze > 1s, sans flash de contenu non stylé > 200ms.

---

## 1. Smoke test (< 2 min)

| # | Test | Attendu | OK |
|---|------|---------|----|
| 1.1 | Ouvrir `http://localhost:3000` | La page se charge en < 3s sur connexion locale, sans erreur runtime ni 500 | ☐ |
| 1.2 | Inspecter la console DevTools | Aucune erreur rouge, aucune warning a11y, aucun warning Next.js bloquant. (Le warning `no-img-element` sur le logo Eurovision est attendu et OK.) | ☐ |
| 1.3 | Vue d'ensemble | 4 sections empilées : Hero, Logs-top (Inscription / Retrouver), Leaderboard 35 pays, Logs-bottom (Result / Recipes) | ☐ |
| 1.4 | Pas de flash de contenu | Le fond reste navy en permanence, les fonts Inter et IBM Plex Mono apparaissent immédiatement (pas de Times New Roman temporaire) | ☐ |
| 1.5 | Reload (Cmd+R) | Tout reste en place, pas de glitch visuel | ☐ |

---

## 2. Hero

| # | Test | Attendu | OK |
|---|------|---------|----|
| 2.1 | Logo Eurovision (coin haut-gauche) | Coeur multicolore (gradient pink → orange → blue), aria-label "Eurovision Roulette" | ☐ |
| 2.2 | Pill participants | Compte initial : "0 participant·es en lice" en cyan sur fond cyan transparent | ☐ |
| 2.3 | Bouton settings (coin haut-droit) | Petit bouton blanc 48×48 avec icône engrenage | ☐ |
| 2.4 | Titre H1 | "Ce soir, l'Eurovision s'invite à notre table." centré, blanc, large (80px desktop) | ☐ |
| 2.5 | Body | Paragraphe de 3 lignes max, blanc, centré, lisible (contraste OK) | ☐ |
| 2.6 | CTA "↓ Lancer la roulette" | Pill blanc avec icône flèche vers le bas + texte gras noir, ombre subtile | ☐ |
| 2.7 | Gradient + noise | Halo pink+blue en bas-droite, texture grain visible sur les zones plates | ☐ |
| 2.8 | Ligne de flottaison | Le bas du hero s'arrête à ~928px : sur un viewport 1920×928 (laptop standard), les panels Inscription/Retrouver amorcent juste sous le pli | ☐ |
| 2.9 | Hover sur "Lancer la roulette" | Cursor pointer, l'effet bevel reste lisible | ☐ |
| 2.10 | Active sur "Lancer la roulette" | Légère réduction (scale 0.98) à l'enfoncement | ☐ |

---

## 3. Logs-top — Panel Inscription

| # | Test | Attendu | OK |
|---|------|---------|----|
| 3.1 | Header "Inscription" | Icône utilisateur+ + titre "Inscription" en gras 20px noir | ☐ |
| 3.2 | Champ "Prénom" vide | Placeholder "John Doe" en gris muted, bordure 1px gris | ☐ |
| 3.3 | Zone "Code" vide | Bandeau navy (#011753) avec "— — —" en blanc IBM Plex Mono | ☐ |
| 3.4 | Texte d'aide italique | "Ce code permet de retrouver le résultat et le profil." | ☐ |
| 3.5 | CTA "Lancer la roulette" disabled | Bouton grisé, cursor not-allowed quand le prénom est vide | ☐ |
| 3.6 | Tape "Alice" dans Prénom | CTA s'active (opacity 1, cursor pointer) | ☐ |
| 3.7 | Submit (clic ou Enter) | La roulette démarre (cf. §6 Animation) | ☐ |
| 3.8 | Code affiché après tirage | Le bandeau navy montre maintenant le vrai code généré, ex: `ALI-K7G2` | ☐ |
| 3.9 | aria-live | Avec un screen reader actif : le code est annoncé "Votre code est ALI K7G2" | ☐ |

---

## 4. Logs-top — Panel Retrouver

| # | Test | Attendu | OK |
|---|------|---------|----|
| 4.1 | Header "Retrouver ses informations" | Icône clé + titre en gras 20px noir | ☐ |
| 4.2 | Champ Code vide | Placeholder "MAR-A1B2" en gris muted, fond gris clair (#eaeaea), texte mono | ☐ |
| 4.3 | Tape un code en minuscules ex: "alice-x1y2" | Le texte s'affiche en majuscules dans le champ (text-transform: uppercase) | ☐ |
| 4.4 | CTA "Retrouver ses informations" disabled | Quand le champ est vide | ☐ |
| 4.5 | Code valide existant | Submit → state du candidat correspondant chargé : leaderboard surligne son pays + son slot, panels result/recipes peuplés | ☐ |
| 4.6 | Code invalide / inexistant | Aucun crash. (Comportement actuel : silencieux. Si tu veux un message d'erreur, à ajouter en passe 2.) | ☐ |
| 4.7 | Code avec caractères diacritiques ex: "élO" | Le code passe en majuscules ASCII (E L O) au submit | ☐ |

---

## 5. Leaderboard

| # | Test | Attendu | OK |
|---|------|---------|----|
| 5.1 | 35 pays en grille | 3 colonnes × 12 lignes (12 cells, dont 35 pays + 1 cellule vide en bas) | ☐ |
| 5.2 | Drapeau + nom | Chaque cellule : drapeau 80×56 à gauche + nom du pays en blanc Inter Medium 20px sur fond eurovision-blue | ☐ |
| 5.3 | Drapeaux corrects | France = bleu/blanc/rouge, UK = Union Jack, Israël = bleu/blanc avec étoile, etc. (vérifier 5 au pif) | ☐ |
| 5.4 | Sidebar 5 moments | Apéro, Entrée, Plat principal, Dessert, Snacks — chacun en pill avec icône (Croissant, Soup, UtensilsCrossed, IceCream, Pizza) | ☐ |
| 5.5 | Tous moments en idle | Fond eurovision-blue, texte blanc, icônes blanches | ☐ |
| 5.6 | Après tirage : pays gagnant | Cellule du pays tiré : fond blanc + nom noir + carré bleu à droite avec icône check | ☐ |
| 5.7 | Après tirage : moment gagnant | Pill du moment tiré : fond blanc + texte noir + check à droite | ☐ |
| 5.8 | Pays "used" (déjà tiré par un autre) | Quand un 2e participant s'inscrit et tombe ailleurs, le 1er pays reste à 40% d'opacité | ☐ |

---

## 6. Animation roulette (5 secondes)

| # | Test | Attendu | OK |
|---|------|---------|----|
| 6.1 | Submit "Alice" → spin démarre | Pendant 5s : un cercle cyan + scale 1.04 saute aléatoirement de pays en pays dans la grille (et en parallèle de moment en moment dans la sidebar) | ☐ |
| 6.2 | Décélération | Au début ticks rapides (60ms), puis ralentissement progressif (120ms → 240ms → 480ms vers la fin) | ☐ |
| 6.3 | Fin du spin | À 5s pile, le pays final est sélectionné (white bg + check) et le moment final aussi | ☐ |
| 6.4 | ScrollTo automatique | La page scroll en douceur pour centrer le leaderboard. Les amorces des sections au-dessus (Logs-top) et en-dessous (Logs-bottom) sont visibles | ☐ |
| 6.5 | Result panel populé | Au scroll, le panel résultat affiche : logo + "Alice / 2026", "Nouvelle commande Chef !", "Pour le dîner ce sera **<slot>** à réaliser ce soir.", "Et pour le pays de référence ce sera : **<Pays>**", drapeau, "<Artiste> — \"<Chanson>\"" | ☐ |
| 6.6 | YouTube embed | Lecteur YouTube intégré avec la vidéo officielle 2026 du pays. Le titre du player montre l'artiste + chanson | ☐ |
| 6.7 | Recipes panel populé | "Trois recettes pour <Pays>" + 3 niveaux (Facile / Moyen / Challenge) chacun avec 3 cartes recettes | ☐ |
| 6.8 | aria-live au début | "Tirage en cours, sélection aléatoire pendant 5 secondes." (testable au screen reader ou DevTools → Accessibility tree) | ☐ |
| 6.9 | aria-live à la fin | "Résultat : <Pays>, <slot>." | ☐ |
| 6.10 | Re-clic du CTA pendant le spin | Le clic est ignoré, pas de double-tirage | ☐ |
| 6.11 | Reduced-motion (DevTools → Rendering → "Emulate prefers-reduced-motion: reduce") | Pas de flicker des items pendant 5s, juste 800ms d'attente puis result direct. Le scroll est instantané (pas smooth). aria-live annonce toujours. | ☐ |

---

## 7. Result panel — interactions

| # | Test | Attendu | OK |
|---|------|---------|----|
| 7.1 | CTA "Marquer les courses" | Clic → label devient "Courses prêtes" (toggle) | ☐ |
| 7.2 | Toggle persiste après reload | Le state localStorage / Supabase garde le `shoppingDone: true` | ☐ |
| 7.3 | Sans admin actif | Le 2e CTA "Cacher / Révéler" n'est pas visible (seul "Marquer les courses" apparaît) | ☐ |
| 7.4 | YouTube player — hors interaction | La vignette s'affiche, le titre apparaît, pas d'autoplay | ☐ |
| 7.5 | YouTube player — clic play | La vidéo se lance dans le lecteur intégré (pas d'ouverture YouTube externe) | ☐ |
| 7.6 | YouTube — pays sans youtubeId | Aucun pays actuel n'est dans ce cas, mais si tu retires un youtubeId du data.ts, le panel doit montrer le drapeau en grand à la place du player (fallback gracieux) | ☐ |

---

## 8. Recipes panel

| # | Test | Attendu | OK |
|---|------|---------|----|
| 8.1 | Header | Icône chef + "Trois recettes pour <Pays>" | ☐ |
| 8.2 | 3 niveaux | "Facile" (1 cercle bleu / 2 gris) / "Moyen" (2 / 1) / "Challenge" (3 / 0) avec compteur "3 recettes" | ☐ |
| 8.3 | 3 cartes par niveau | Chaque carte : "Recette #1/2/3" en eyebrow, titre du plat en gras + icône lien externe, description (story), CTA "Voir la recette" | ☐ |
| 8.4 | CTA "Voir la recette" | Clic → ouvre l'URL marmiton/750g/cuisineaz dans un nouvel onglet (`target="_blank" rel="noreferrer"`) | ☐ |
| 8.5 | Recettes spécifiques au pays/slot | Vérifier que les noms de plats sont cohérents avec le pays tiré (ex: France → Gougères/Quiche, Italie → Bruschette/Lasagne) | ☐ |

---

## 9. Header — bouton settings (admin)

| # | Test | Attendu | OK |
|---|------|---------|----|
| 9.1 | Clic sur l'icône engrenage | Le drawer admin s'ouvre depuis la droite (slide-over), backdrop sombre + flou | ☐ |
| 9.2 | Focus auto | Le bouton X (close) reçoit le focus par défaut | ☐ |
| 9.3 | Échap pour fermer | La touche Escape ferme le drawer | ☐ |
| 9.4 | Clic sur le backdrop | Ferme aussi le drawer | ☐ |
| 9.5 | Champ PIN | Type `password`, autoFocus | ☐ |
| 9.6 | PIN incorrect (ex: 1234) | Le champ se vide après submit, on reste sur le formulaire PIN | ☐ |
| 9.7 | PIN correct (1974) | Le formulaire disparaît, les actions admin apparaissent | ☐ |
| 9.8 | Action "Révéler tirages" | Toggle l'état `revealDraws` (utile si tu veux pré-révéler les codes pour les invités) | ☐ |
| 9.9 | Action "Copier codes" | Copie tous les codes au format `Nom: CODE\nNom2: CODE2...` dans le presse-papier (ouvre un éditeur, colle, vérifie) | ☐ |
| 9.10 | Liste des participants | Chaque participant : nom, code, pays, slot + bouton reroll + bouton supprimer | ☐ |
| 9.11 | Bouton reroll | Clic → le pays et le slot du participant changent, le panel résultat se met à jour si c'est le candidat actif | ☐ |
| 9.12 | Bouton supprimer | Confirm dialog → si OK : participant retiré, son code ne marche plus en retrieve | ☐ |
| 9.13 | Re-fermeture / réouverture | Re-cliquer settings → le PIN est re-demandé (pas de session admin persistante) | ☐ |

---

## 10. Persistance state

| # | Test | Attendu | OK |
|---|------|---------|----|
| 10.1 | Mode localStorage uniquement (pas de .env Supabase) | Inscription → reload → l'état est restauré depuis localStorage | ☐ |
| 10.2 | Mode Supabase (avec .env) | Inscription → vérifier dans Supabase que la row apparaît dans `roulette_guests`. Reload depuis un autre navigateur → l'état est partagé | ☐ |
| 10.3 | Inscription d'un 2e participant | Le compteur passe à 2, la grille montre 2 pays "selected" ou "used" | ☐ |
| 10.4 | Distribution des slots | Inscrire 9 participants → vérifier que la distribution est `{ apero: 2, entree: 2, plat: 3, dessert: 1, snacks: 1 }` (ouvre l'admin pour voir tous les slots) | ☐ |
| 10.5 | Suppression depuis l'admin | Le participant disparaît du localStorage / Supabase ; son slot redevient disponible pour le suivant | ☐ |
| 10.6 | Reroll depuis l'admin | Le pays change, ne tombe pas sur un pays déjà tiré par un autre | ☐ |

---

## 11. Accessibilité

| # | Test | Attendu | OK |
|---|------|---------|----|
| 11.1 | Tab navigation | Tab parcourt dans cet ordre : (logo, skip), settings, "Lancer la roulette" hero, input prénom, "Lancer la roulette" panel, input code, "Retrouver ses informations", (après tirage) "Marquer les courses", liens "Voir la recette" | ☐ |
| 11.2 | Focus visible | Anneau bleu eurovision-blue (3px solid, 2px offset) sur tous les inputs, boutons, liens | ☐ |
| 11.3 | Focus sur surface sombre | Le CTA hero "Lancer la roulette" doit avoir un anneau cyan eurovision-cyan au lieu de bleu | ☐ |
| 11.4 | Enter sur "Lancer la roulette" hero | Active le scroll vers le champ prénom | ☐ |
| 11.5 | Enter dans un input | Soumet le formulaire correspondant | ☐ |
| 11.6 | Escape dans le drawer admin | Ferme le drawer | ☐ |
| 11.7 | Screen reader (VoiceOver Cmd+F5 / NVDA) — page chargée | Annonce "Eurovision Roulette" en titre, lit la pill participants ("0 participants en lice"), parcourt les sections par titre | ☐ |
| 11.8 | Screen reader pendant le spin | Annonce "Tirage en cours, sélection aléatoire pendant 5 secondes." | ☐ |
| 11.9 | Screen reader à la fin du spin | Annonce "Résultat : <Pays>, <slot>." | ☐ |
| 11.10 | Lighthouse Accessibility | Score ≥ 95. Pas d'erreur rouge bloquante | ☐ |
| 11.11 | axe DevTools (extension) | Aucune issue Critical / Serious | ☐ |
| 11.12 | Contraste texte/fond — outil DevTools | Tous les couples > 4.5:1 (texte normal) ou > 3:1 (texte large / UI) | ☐ |

---

## 12. Responsive

> Test à faire dans DevTools → Toggle device toolbar (Cmd+Shift+M) ou en redimensionnant la fenêtre.

### 12.1 Desktop (≥ 1280px)

| # | Test | Attendu | OK |
|---|------|---------|----|
| 12.1.1 | 1920×1080 | Layout 2 colonnes pour tous les panels, hero plein viewport, leaderboard 3 cols + sidebar 328px | ☐ |
| 12.1.2 | 1440×900 | Idem, peut-être un peu plus serré sur les recettes | ☐ |
| 12.1.3 | 1280×720 | Toujours en layout desktop | ☐ |

### 12.2 Tablet (768px – 1280px)

| # | Test | Attendu | OK |
|---|------|---------|----|
| 12.2.1 | 1024×768 | Logs-top et logs-bottom passent en column. Leaderboard reste 3 cols. La sidebar moments passe en bande horizontale scrollable au-dessus de la grille | ☐ |
| 12.2.2 | 834×1112 (iPad portrait) | Idem | ☐ |

### 12.3 Mobile (≤ 768px)

| # | Test | Attendu | OK |
|---|------|---------|----|
| 12.3.1 | 768×1024 | Country grid passe à 2 cols. Hero titre passe à --font-size-3xl (51px) | ☐ |
| 12.3.2 | 414×896 (iPhone XR) | Country grid reste 2 cols. Hero titre 2xl (40px). Header garde la pill participants. | ☐ |
| 12.3.3 | 375×812 (iPhone SE) | Country grid passe à 1 col. Hero titre xl (32px). Header pill participants masquée (juste logo + settings). | ☐ |
| 12.3.4 | 375×812 — pas d'overflow horizontal | Aucune barre de scroll horizontale, tout le contenu tient dans 375px | ☐ |
| 12.3.5 | 360×640 (Android petit) | Idem | ☐ |
| 12.3.6 | Result panel sur mobile | Le drapeau passe sous le texte de la commande Chef au lieu d'être en absolute top-right | ☐ |

### 12.4 Orientation

| # | Test | Attendu | OK |
|---|------|---------|----|
| 12.4.1 | iPhone landscape 812×375 | La pill participants peut réapparaître si on dépasse 480px de largeur. Pas d'overflow vertical bizarre | ☐ |

---

## 13. Cross-browser

> Cocher à minima Chrome + Safari + Firefox sur Mac. iPhone (Safari iOS) et un Android (Chrome) si tu peux.

| # | Test | Chrome | Safari | Firefox | iOS | Android |
|---|------|--------|--------|---------|-----|---------|
| 13.1 | Page se charge | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13.2 | Fonts Inter + IBM Plex Mono OK | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13.3 | Gradient hero rendu | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13.4 | Animation spin fluide à 60fps | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13.5 | ScrollTo smooth | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13.6 | YouTube embed | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13.7 | Drawer admin Escape ferme | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13.8 | Backdrop-filter blur (drawer) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13.9 | localStorage persist | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## 14. Edge cases & robustesse

| # | Test | Attendu | OK |
|---|------|---------|----|
| 14.1 | Inscription avec espaces en début/fin ("  Alice  ") | Le nom est trimmé, le code généré est "ALI-XXXX" | ☐ |
| 14.2 | Inscription avec accents ("Élodie") | Le code est ASCII : "ELO-XXXX" | ☐ |
| 14.3 | Inscription d'un seul caractère ("X") | Code "XXX-XXXX" (padded avec X) | ☐ |
| 14.4 | Inscription avec caractères spéciaux (",@!") | Filtrés, code padding "XXX-XXXX" | ☐ |
| 14.5 | Inscription de 35 participants | Tous les pays sont tirés, plus aucun "default" dans la grille (tous selected ou used) | ☐ |
| 14.6 | Inscription d'un 36e participant | Le pickCountry tombe sur le pool complet (réutilise un pays déjà tiré). Ce n'est pas un crash mais à noter. | ☐ |
| 14.7 | 2 participants même prénom | Codes différents (suffixes random), aucun conflit | ☐ |
| 14.8 | Reload pendant le spin (refresh F5) | Le state n'est pas corrompu, le participant est inscrit OU pas selon le timing du write Supabase. Pas de "ghost guest". | ☐ |
| 14.9 | Réseau offline pendant inscription | Mode localStorage : marche. Mode Supabase : fallback gracieux sur localStorage (vérifier dans console le warning "Sauvegarde locale active") | ☐ |
| 14.10 | URL avec hash (`#section-leaderboard`) | Scroll vers le leaderboard au load | ☐ |
| 14.11 | Multi-onglets ouverts | Chaque onglet a son state de phase mais le state des invités est partagé via Supabase (sync à reload) | ☐ |

---

## 15. Performance

| # | Test | Attendu | OK |
|---|------|---------|----|
| 15.1 | Lighthouse — Performance | Score ≥ 85 | ☐ |
| 15.2 | Lighthouse — Best Practices | Score ≥ 95 | ☐ |
| 15.3 | Lighthouse — SEO | Score ≥ 90 | ☐ |
| 15.4 | First Contentful Paint | < 1.5s sur 3G simulé (DevTools → Network → Slow 3G) | ☐ |
| 15.5 | Largest Contentful Paint | < 2.5s | ☐ |
| 15.6 | Cumulative Layout Shift | < 0.05 (les fonts arrivent vite via next/font, pas de FOUT) | ☐ |
| 15.7 | Total Blocking Time | < 200ms | ☐ |
| 15.8 | Bundle size (`npm run build`) | First Load JS ≈ 174kB (raisonnable pour Next.js 15 + React 19) | ☐ |
| 15.9 | Spin animation à 60fps | DevTools → Performance → Record → click "Lancer la roulette" → vérifier qu'il y a très peu de frames > 16ms | ☐ |

---

## 16. Production build

| # | Test | Attendu | OK |
|---|------|---------|----|
| 16.1 | `npm run build` | Termine sans erreur, 4 pages statiques générées | ☐ |
| 16.2 | `npm run start` après build | Le serveur prod tourne sur http://localhost:3000 | ☐ |
| 16.3 | Test minimal en prod | Toutes les fonctionnalités du §1-§14 marchent en prod | ☐ |
| 16.4 | Pas de fichier source dans le bundle (devtools open, sources tab) | Le code est minifié, pas de `data.ts` lisible en clair | ☐ |
| 16.5 | Cache headers sur les flags SVG | Les fichiers `/flags/4x3/*.svg` ont un Cache-Control immutable | ☐ |
| 16.6 | Variables d'env Supabase | Si `.env.local` est manquant, le mode localStorage prend le relais sans crasher | ☐ |

---

## 17. Visual regression — comparaison avec la maquette Figma

> Compare visuellement avec la maquette Figma `01. Start` (`fileKey 3wN1dlbNC0ftKGOFWFOoA2`). Les écarts ≤ 5% sont acceptables.

| # | Élément | Attendu (Figma) | Implémentation | OK |
|---|---------|-----------------|----------------|----|
| 17.1 | Couleur fond hero | Navy profond (#050b30 estimé) avec gradient pink/blue bottom-right | ☐ | ☐ |
| 17.2 | Eurovision-blue items | #0a23be exact | ☐ | ☐ |
| 17.3 | Eurovision-cyan pill participants | #00c7f1 exact, border 1px, bg @15% | ☐ | ☐ |
| 17.4 | Hero title | Inter Medium 80px, line-height 92px (1.15), letter-spacing -2.4px (-0.03em) | ☐ | ☐ |
| 17.5 | Body | Inter Regular 20px, line-height 30px (1.5), letter-spacing -0.4px (-0.02em) | ☐ | ☐ |
| 17.6 | CTA primaire bevel | Outer #ebebeb, inner blanc 4px inset, ombre subtile | ☐ | ☐ |
| 17.7 | Country/Item | Largeur 464px (sur 3 cols × 8 gutter dans 1408px), hauteur 56px, drapeau 80×56 | ☐ | ☐ |
| 17.8 | FoodMoment/Item | Pill arrondi (radius 48), hauteur 48px, icon 56×48, label Inter Medium 18px | ☐ | ☐ |
| 17.9 | Recipie/Item | Carte 258×228, padding 16, border 1px #ebebeb | ☐ | ☐ |
| 17.10 | Stars (RecipeLevel) | 3 cercles 12×12, filled = #0a23be, empty = #eaeaea | ☐ | ☐ |
| 17.11 | Logo Eurovision | Coeur multicolore (gradient pink → orange → blue) — version actuelle est un placeholder, à remplacer par export Figma propre quand dispo | ☐ | ☐ |

---

## 18. Pre-flight avant le 16 mai 2026

À faire dans la semaine du dîner.

| # | Test | OK |
|---|------|----|
| 18.1 | Tous les `youtubeId` pointent vers une vidéo non-supprimée (test rapide : ouvrir 5 vidéos au hasard) | ☐ |
| 18.2 | Tester le full flow avec 5-6 vrais invités la semaine d'avant | ☐ |
| 18.3 | Préparer un fallback : un Google Sheet avec les codes en cas de souci Supabase le jour J | ☐ |
| 18.4 | Mettre l'app derrière un nom de domaine simple à dicter ("eurovision-roulette.<toi>.dev" ou similaire) si tu héberges en prod | ☐ |
| 18.5 | Vider la base avant l'événement (delete des fake guests des tests) | ☐ |
| 18.6 | Test final sur le téléphone des invités (différents OS / nav) | ☐ |
| 18.7 | Print-out papier du PIN admin (1974) au cas où | ☐ |
| 18.8 | Backup imprimé : la liste des 35 pays + les recettes Facile (au cas où l'app crash le jour J) | ☐ |

---

## Bugs connus à la date de rédaction (2026-04-25)

- ⚠️ **Logo Eurovision** : SVG placeholder coeur générique. À remplacer par export Figma propre.
- ⚠️ **YouTube IDs Danemark / Lettonie / Luxembourg / Saint-Marin** : la chaîne officielle Eurovision n'a publié que la "National Final Performance" (pas de vrai music video). L'embed marche mais c'est un live de national final, pas un MV studio.
- ⚠️ **Hero titre mobile (≤ 480px)** : tentative de fix appliquée (`align-self: stretch; min-width: 0; max-width; margin-inline: auto`) mais headless Chrome a continué à montrer le titre tronqué dans mes screenshots. Ce *peut* être un quirk de headless Chrome (font metrics qui diffèrent du vrai navigateur). À **vérifier en QA mobile réel** : si le titre wrap proprement sur un vrai iPhone SE / Android compact, le fix est OK ; sinon, basculer `.section-hero__content` de `display: flex` à `display: block` au breakpoint 30rem pour contourner le comportement de flex+align-items.
- 📝 **Code retrieve "non trouvé"** : actuellement silencieux (pas de message d'erreur affiché). À ajouter si confusion en QA.
- 📝 **Multi-onglets Supabase** : pas de sync temps réel (channel realtime) — il faut reload manuel pour voir les nouveaux invités.
- 📝 **Pas de tests automatisés** : tout est testé à la main avec ce carnet.

## QA prod — bugs trouvés en review (2026-04-25)

> Capturé après revue de la build prod par Suong Kevin. À fixer avant le 16 mai 2026.

- ☐ _(à compléter — décris ici ce que tu as vu en prod)_

---

## Résumé d'exécution

À remplir après chaque passe :

| Date | Branche | Sections passées | Bugs trouvés | Bugs résolus |
|------|---------|------------------|--------------|--------------|
| | | | | |
