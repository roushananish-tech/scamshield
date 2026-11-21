# ScamShield — Suspicious Message Detector

**PromptWars x Code1 Innovators · Vertical: Cybersecurity · PS01 ScamShield**

Paste an SMS, WhatsApp message or link. ScamShield tells you whether it looks like a scam, **shows exactly which phrases triggered it and why**, and, if you already clicked or paid, tells you what to do next. Everything runs in your browser. Nothing is uploaded.

## Why this is different
| Feature | What it does |
|---|---|
| Privacy by design | No server calls, no storage, no analytics. CSP sets `connect-src 'none'`, so the page *cannot* send your message anywhere. |
| Explainable | Every verdict lists weighted reasons, with the matching words highlighted in your own message. |
| Conversation mode | Paste a WhatsApp chat export. Detects scam-script stages (hook → authority → pressure → isolation → extraction) and predicts the next step. Catches "digital arrest" scams that no single message reveals. |
| India-specific | KYC/bank, UPI collect, parcel/customs fee, electricity cut-off, traffic challan, part-time task/APK, fake investment, digital arrest. Includes Hinglish and Devanagari patterns. |
| URL forensics, no fetching | Brand look-alikes, shorteners, punycode, `@` tricks, risky TLDs, `.apk`, fake `.gov`. Analysed from text only, so no SSRF and no tracking pixel. |
| "I already clicked / paid" | Recovery playbooks for clicked, replied, shared OTP, installed an app, or paid. Points to 1930, cybercrime.gov.in and Chakshu (sancharsaathi.gov.in). Never promises money back. |
| Honest metrics | Eval harness with dev / holdout sets and disclosed failures (below). |

## How it works
1. **Normalise** (`src/engine/normalize.js`): NFKC, lower-case, strip zero-width characters, fold Cyrillic/Greek look-alikes, undo leet (`h3llo`) only inside words. Each character keeps a map back to the raw text for highlighting.
2. **Rules** (`rules.js`): declarative catalogue, hand-set weight 0–1 per rule, grouped into categories (urgency, threat, credential ask, payment, APK, prize, job task…). Credential rules respect negation ("do **not** share your OTP" is not flagged).
3. **Links** (`urls.js`): each URL gets forensic flags that feed in as signals.
4. **Combine** (`analyze.js`): best weight per category, then noisy-OR: `risk = 1 − ∏(1 − w)`. Score 0–100. **<30 low · 30–59 suspicious · ≥60 scam.** Context (unknown sender, channel) nudges the score. A known sender with a scammy message triggers a "hacked account?" hint.
5. **Conversation** (`conversation.js`): parses WhatsApp exports, scores each message, marks which scam stages were reached and in what order.
6. **Explain** (`highlight.js`, `app.js`): numbered `<mark>` highlights plus a reasons list.

It is a deterministic rule engine, not an ML model, by choice: it is fast, auditable, testable and works offline. The weights are expert-set, not learned.

## Run
```bash
npm start        # http://127.0.0.1:8080  (zero dependencies, Node >= 20)
npm test         # 44 tests
npm run eval     # accuracy table on the labelled corpus
```

## Evaluation (read this honestly)
Corpus: `eval/corpus.json`, **hand-written synthetic** messages (not real scam data), 66 total. Positive = verdict is not "low".

| Set | Msgs | Scam recall | Strict recall (verdict = scam) | Precision | False-positive rate |
|---|---|---|---|---|---|
| dev (used to tune) | 40 | 100% | 95.8% | 100% | 0% |
| holdout | 18 | 90% | 80% | 100% | 0% |
| holdout2 | 8 | 100% | 100% | 100% | 0% |

Methodology and disclosures:
- `holdout` was written before the first run. On its **first run** it scored 90% recall / 80% strict recall / 90% precision / **12.5% false-positive rate**: a genuine bank OTP message was wrongly flagged by an over-broad urgency pattern (`expires in`). I fixed the pattern. Because that set then influenced the rules, it is no longer clean, so `holdout2` was written afterwards and never tuned against.
- **Known miss:** `H-S06`, a remote-access refund scam ("install AnyDesk"), is not detected. Documented limitation.
- 8 messages is far too few for a confidence interval. Treat these numbers as *indicative*, not a production accuracy claim.

## Security
- Strict CSP (`default-src 'none'; script-src 'self'; connect-src 'none'; form-action 'none'`), no inline script/style, no external resources. Verified by `tests/static.test.js`.
- No `innerHTML`/`eval`; all rendering via text nodes, so pasted HTML or script is shown as text.
- Input caps (5,000 chars per message, 200 messages, 2,000 chars each); bounded regexes; pathological-input tests (`tests/perf.test.js`).
- No cookies, `localStorage` or tracking. Static server serves an allow-list only, with path-traversal guard.

## Accessibility
Skip link, labelled controls, `fieldset/legend` radios, live status region, focus moved to results, verdict shown with icon **and** text (not colour only), `<progress>` with label, light/dark and reduced-motion support, visible focus, 44 px targets, optional read-aloud (feature-detected).

## Assumptions & limitations
- Scores are **risk indicators, not proof**. A "low" verdict is not a safety guarantee.
- Official-domain list is illustrative, not exhaustive.
- Hindi/Hinglish coverage is a starter set; other Indian languages are not covered.
- No live reputation lookups by design (privacy). A brand-new scam domain with no scam wording can score low.
- Rules are hand-tuned on a small synthetic corpus; real-world precision/recall will differ.
- Recovery guidance reflects public Indian reporting channels (1930, cybercrime.gov.in, Chakshu) and should be checked against current official pages.

## Layout
```
index.html  styles.css  src/app.js
src/engine/{normalize,urls,rules,analyze,highlight,playbook,conversation}.js
eval/{corpus.json,run.js}   tests/*.test.js   scripts/serve.js
```
MIT licensed.
