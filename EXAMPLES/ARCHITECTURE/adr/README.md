*English · [Deutsch](README.de.md)*

# Architecture Decision Records

The code shows what was built. An ADR records why. It is short, sits numbered next to the code, and is reviewed in the pull request.

You never change an accepted ADR. If your team decides differently, you write a new ADR and set the old one to `Superseded`.

```
docs/adr/
  0000-template.md                                       # template to copy
  0001-crud-mit-postgresql-fuer-den-bestell-context.md   # Superseded by 0002
  0002-event-sourcing-nur-fuer-orders.md                 # Accepted, supersedes 0001
src/
  check-adr.ts                                           # check rules for structure and status
  draft/0003-projektionen.md                             # a draft that is not an ADR yet
```

The examples belong to the exercise [Event Sourcing and CQRS](../event-sourcing/README.md): 0001 describes the CRUD state from `src/`, 0002 the decision for `solution/`.

The ADR files themselves are written in German. `check-adr.ts` expects the file name pattern `0001-….md` and the German phrases “Wir werden …” (“We will …”) in Decision and “Gut:”, “Schlecht:”, and “Neu entscheiden, wenn” (“Good:”, “Bad:”, “Decide again when”) in Consequences.

You need Node.js 26 or newer.

```bash
npm install
npm start            # checks docs/adr
npm start -- <path>  # checks the ADRs in another folder, for example in your repository
npm test
npm run typecheck
```

## Structure

- Title: the decision, not the topic
- Date: when the decision was made
- Status: Proposed, Accepted, Deprecated, or Superseded by …
- Context: load, team, and constraints at the time of the decision
- Decision: one sentence with “Wir werden …” (“We will …”)
- Consequences: good, bad, and when you decide again

## Exercise

1. Read 0001 and 0002. What changed in the context so that 0001 no longer applies? Why is 0001 still in the repository?
2. Read the draft `src/draft/0003-projektionen.md` and the findings in `src/adr.test.ts`. Turn them into a complete ADR 0003: What was the situation, what did you reject, what does the decision cost?
3. Pick an open architecture decision in your team. Is an ADR worth it? Yes, if the decision is hard to reverse, affects several teams, or rejects an obvious alternative.
4. Copy `0000-template.md` as the next number into `docs/adr/` in your repository and fill it in. Name the bad consequences too, and the condition under which you decide again. Check it with `npm start -- <path>`.
5. Open a pull request and have the ADR reviewed. With the merge it becomes `Accepted`.

One possible solution for ADR 0003 is in `solution/` (`npm run start:solution`).

Next: [When CQRS and Event Sourcing are too much](../when-too-much/README.md)
