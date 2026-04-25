# Token Usage Report — Figma Integration Session

**Date :** 2026-04-25
**Projet :** Eurovision Roulette — refactor visuel pour intégration de la maquette Figma
**Tag livrable :** `v0.2.0-figma-integration`
**Méthodologie :** Brainstorming → spec → plan → exécution subagent-driven (8 batches × implementer + spec reviewer + code-quality reviewer)

---

## 1. Résumé exécutif

| Métrique | Valeur |
|---|---|
| Durée wall-clock (estimée d'après timestamps) | ~9 h |
| Subagents dispatchés | 21 |
| Tokens subagents (chiffrés exacts) | **~727 000** |
| Tokens main agent (estimés) | **~600 000 – 1 000 000** |
| **Coût estimé total** | **~$20 – $31** |
| Commits produits | 39 |
| Lignes de code livrées (src + docs) | ~6 500+ |
| Composants React créés | 14 |
| Drapeaux SVG fetched | 35 |
| YouTube IDs trouvés via WebSearch | 35 |

---

## 2. Décomposition par subagent (chiffres exacts)

Tous les subagents ont tourné sur **Claude Sonnet 4.6** (`claude-sonnet-4-6`).

| # | Type | Description | Tokens | Durée (ms) | Tool uses |
|---:|------|-------------|-------:|-----------:|----------:|
| 1 | Implementer | Batch 1 — tokens.css, fonts, snacks slot | 42 077 | 165 672 | 26 |
| 2 | Patch | Fix `dishSet` snacks slot reference | 23 469 | 35 387 | 4 |
| 3 | Reviewer | Spec compliance Batch 1 | 39 690 | 172 444 | 23 |
| 4 | Reviewer | Code quality Batch 1 | 61 764 | 149 587 | 33 |
| 5 | Implementer | Batch 2 — CtaButton, Logo, Header | 27 104 | 154 615 | 21 |
| 6 | Reviewer | Spec compliance Batch 2 | 22 205 | 58 763 | 11 |
| 7 | Reviewer | Code quality Batch 2 | 57 748 | 329 008 | 47 |
| 8 | Patch | Fix Batch 2 a11y + cleanup CSS | 18 871 | 50 211 | 9 |
| 9 | Implementer | Batch 3 — SectionHero + LogsTop panels | 33 852 | 209 609 | 28 |
| 10 | Reviewer | Spec compliance Batch 3 | 25 468 | 76 540 | 18 |
| 11 | Reviewer | Code quality Batch 3 | 67 976 | 308 646 | 48 |
| 12 | Patch | Fix Batch 3 a11y + responsive + consistency | 20 626 | 51 187 | 10 |
| 13 | Patch | Fix primary CTA collapsed width | 16 675 | 49 071 | 4 |
| 14 | Implementer | Batch 4 — Flag system (35 SVG fetch) | 20 655 | 104 151 | 17 |
| 15 | Implementer | Batch 5 — Leaderboard | 39 642 | 132 660 | 20 |
| 16 | Patch | Drop aria-selected from non-interactive items | 16 764 | 47 820 | 6 |
| 17 | Implementer | Batch 6 — Recipe + Result panels | 36 223 | 188 303 | 27 |
| 18 | Implementer | Batch 7 — Orchestrator + animation | 42 014 | 304 715 | 38 |
| 19 | Implementer | Batch 8 — Admin drawer + a11y polish | 49 328 | 276 824 | 37 |
| 20 | Patch | Add 35 youtubeId to data.ts | 43 823 | 275 762 | 40 |
| 21 | Patch | Fix mobile responsive (background) | 22 042 | 144 290 | 18 |
| | | **TOTAL** | **~727 000** | ~3 583 s | 485 |

**Observations :**
- Les **code-quality reviewers** sont les subagents les plus consommateurs (61k, 58k, 68k tokens) — ils lisent beaucoup de fichiers pour cross-checker l'implémentation contre le plan
- Les **implementers de batches volumineux** (Batch 7 orchestrator, Batch 8 admin) consomment aussi beaucoup parce qu'ils touchent plusieurs fichiers et orchestrent des features
- Les **patches** sont efficients (10–25k chacun) — tâche bien scopée + plan exact en input
- La durée moyenne par subagent est de ~170 secondes

---

## 3. Estimation main agent (Opus 4.7)

⚠️ Opus 4.7 (`claude-opus-4-7`) — **pas de compteur précis disponible côté agent**.

### Composantes principales du contexte

| Source | Volume estimé (tokens) |
|---|---:|
| WebSearch (38 appels Eurovision YT IDs) | ~40 000 |
| Figma MCP (metadata XML + design contexts) | ~50 000 |
| Reads d'images (~25 screenshots Chrome headless) | ~80 000 |
| Reads de fichiers source (`data.ts`, components, etc.) | ~30 000 |
| Bash outputs (lint, git diff, grep, build, etc.) | ~30 000 |
| Mes propres écritures (specs, plan, QA, mémoire) | ~33 000 |
| Conversation user/assistant (~32 tours) | ~80 000 |
| Subagent prompts envoyés (21 prompts longs) | ~80 000 |
| Subagent reports reçus (21 retours) | ~30 000 |
| **Brut estimé** | **~450 000 input + ~150 000 output** |

### Cumulé avec replays de contexte

À chaque tour, le contexte conversationnel complet est re-envoyé. Avec ~32 tours et un contexte qui grossit, le **cumul brut input** atteint plutôt **800 000 – 1 200 000 tokens**.

Le **prompt caching d'Anthropic** met en cache les portions stables (system prompt, conversation longue). En pratique on observe des taux de cache hit de 50–80% sur ce type de session longue → **input effectif facturé : 200 000 – 400 000 tokens**.

---

## 4. Estimation des coûts

Tarifs Anthropic au 2026-04-25 (à vérifier sur https://www.anthropic.com/pricing) :

| Modèle | Input | Output | Cache hit input |
|---|---:|---:|---:|
| Sonnet 4.6 | $3 / Mtok | $15 / Mtok | $0.30 / Mtok |
| Opus 4.7 | $15 / Mtok | $75 / Mtok | $1.50 / Mtok |

### Subagents (Sonnet 4.6)

- 727 000 tokens cumulés
- Hypothèse 60% input / 40% output (subagents font beaucoup de Read/Bash → output plus court que main agent)
- Input : 436 200 × $3 / 1M = **$1.31**
- Output : 290 800 × $15 / 1M = **$4.36**
- **Sous-total : ~$5.67**

### Main agent (Opus 4.7)

- Hypothèses :
  - Output total : ~150 000 tokens (specs + plan + QA + messages utilisateurs)
  - Input avec cache : 70% du brut en cache hit, 30% en input frais
  - Brut input cumulé : 800 000 – 1 200 000 tokens

| Scénario | Cache hits | Input frais | Output | Coût |
|---|---:|---:|---:|---:|
| Plancher (cache 80%, brut 800k) | 640 000 × $1.50 = $0.96 | 160 000 × $15 = $2.40 | 150 000 × $75 = $11.25 | **~$14.61** |
| Médian (cache 65%, brut 1M) | 650 000 × $1.50 = $0.98 | 350 000 × $15 = $5.25 | 150 000 × $75 = $11.25 | **~$17.48** |
| Plafond (cache 50%, brut 1.2M) | 600 000 × $1.50 = $0.90 | 600 000 × $15 = $9.00 | 200 000 × $75 = $15.00 | **~$24.90** |

**Sous-total main agent : $14.60 – $24.90**

### Total session

| Scénario | Subagents | Main agent | **Total** |
|---|---:|---:|---:|
| Plancher | $5.67 | $14.61 | **$20.28** |
| Médian | $5.67 | $17.48 | **$23.15** |
| Plafond | $5.67 | $24.90 | **$30.57** |

⚠️ **Marge d'erreur : ±30%**. Pour le chiffre exact, voir le dashboard de facturation Anthropic (https://console.anthropic.com/settings/usage).

---

## 5. Coût par livrable

Estimation du coût rapporté à ce qui a été produit :

| Livrable | Coût estimé approximatif |
|---|---:|
| Design spec (528 lignes, WCAG 2.2 audit) | ~$3 |
| Plan d'implémentation (4 248 lignes, 24 tâches) | ~$5 |
| 14 composants React + CSS Modules | ~$8 |
| Roulette state machine + animation 5s + scrollTo | ~$3 |
| 35 drapeaux SVG (fetch script + Flag component) | ~$1 |
| 35 YouTube IDs (recherche + patch) | ~$2 |
| Admin drawer + a11y eslint | ~$1.50 |
| Carnet QA (349 lignes, 18 sections) | ~$0.50 |
| Memory updates + commits + pushs | ~$1 |
| **Tendance** | **~$25** |

---

## 6. Patterns observés (pour futures sessions)

### Ce qui a bien marché

- **Subagent-driven en batches groupés** plutôt que tâche-par-tâche : 8 batches au lieu de 24 tâches × 3 dispatches a divisé le coût de coordination par ~3
- **Plan écrit en amont, exhaustif** : chaque subagent a reçu le code exact à coller → très peu de back-and-forth de clarification
- **Reviewer spec puis code quality** : a chopé 4 bugs WCAG/responsive sans avoir à les debugger en QA après
- **Recherche YouTube IDs en parallèle** : 35 WebSearch en 4 batches de 10 → ~3 min wall-clock au lieu de 35 séquentielles
- **Memory system** : les conventions design (BEM, REM, 1.26 scale) et la WCAG baseline sont sauvegardées pour les prochaines sessions

### Ce qui a coûté cher

- **Screenshots Chrome headless en boucle** (debug mobile responsive) : ~$3 estimés pour ~6 itérations dont une partie sans valeur ajoutée. La prochaine fois, demander à l'utilisateur de tester en local quand le headless ne montre pas la vérité.
- **Restart dev server multiples** dûs au cache `.next` corrompu après chaque `npm run build` : ~10 cycles. Patron à éviter : ne pas mélanger `dev` et `build` sur le même `.next`.
- **Réinstancier des subagents** au lieu de continuer (`SendMessage`) sur les patches : double coût de loading du contexte.

### Ratios à retenir

- **Subagent batch typique** : 30–50k tokens, ~3 min, ~$0.40
- **Code quality reviewer** : 50–70k tokens, ~3–5 min, ~$0.70
- **Patch ciblé** : 15–25k tokens, ~1 min, ~$0.20

---

## 7. Méthodologie de mesure

### Données précises

- **Tokens subagents** : extraits des `<usage>total_tokens: NNN</usage>` retournés à chaque fin de subagent dans la session
- **Durées subagents** : champ `duration_ms` du subagent task notification
- **Tool uses** : champ `tool_uses` du même payload

### Données estimées

- **Tokens main agent** : pas de compteur exposé en runtime ; estimé d'après la longueur des fichiers / outputs / messages multipliée par un ratio caractères-par-token (~3.5 caractères par token pour du français/anglais mixte avec markdown)
- **Cache hit ratio** : estimé d'après l'expérience moyenne sur les sessions Claude Code longues (50–80%) — réel à valider sur le dashboard

### Pour avoir le chiffre exact

1. Anthropic Console → Settings → Usage : agrégé par jour
2. API Usage si tu utilises ton propre endpoint API
3. Pour Claude Code : `~/.claude/usage.jsonl` (peut exister selon la version) — à confirmer

---

## 8. Annexes

### 8.1 Liste exhaustive des commits produits par cette session

Voir : `git log --oneline 137cd33..HEAD` (39 commits dont le commit de plan, les 8 batches, les patches de review, les fixes mobile, les YT IDs, le carnet QA, ce doc).

### 8.2 Mémoire persistée à l'issue

- `~/.claude/projects/.../memory/user_design_conventions.md`
- `~/.claude/projects/.../memory/feedback_wcag.md`
- `~/.claude/projects/.../memory/project_eurovision_roulette.md`
- `~/.claude/projects/.../memory/reference_figma_and_flags.md`

Ces 4 fichiers seront automatiquement chargés dans toute prochaine session sur ce projet.

### 8.3 Modèles utilisés

- **Main agent** : `claude-opus-4-7` (Opus 4.7)
- **Subagents** : `claude-sonnet-4-6` (Sonnet 4.6) — choisi pour l'équilibre capacité/coût sur des tâches mécaniques bien spécifiées
