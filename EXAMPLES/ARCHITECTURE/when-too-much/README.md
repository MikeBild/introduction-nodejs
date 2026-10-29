# Wann CQRS und Event Sourcing zu viel sind

Für die meisten Contexts reicht CRUD. CQRS und Event Sourcing lohnen sich nur unter klaren Bedingungen, und die prüfst du pro Bounded Context, nicht für das ganze System.

`src/contexts.ts` beschreibt fünf Contexts des Werkstatt-Shops: Katalog, Kunden, Lager, Bestellungen und Retouren. Heute empfiehlt `recommend` für alle dasselbe, weil es im letzten Konferenzvortrag gut klang. Die Tests in `src/contexts.test.ts` zeigen das.

Du brauchst Node.js >= 26.

```bash
npm install
npm start
npm test
npm run typecheck
```

## Übung

1. Lies die Profile in `src/contexts.ts`. Welcher Context hat Regeln, die sich gegenseitig stören? Wo ist die Historie fachlich gefordert?
2. Schreib den Entscheidungsfluss in `decide.ts`, in dieser Reihenfolge:
   - Keine kollidierenden Regeln: CRUD.
   - Weder starke Asymmetrie zwischen Lesen und Schreiben noch geforderte Historie: Commands und Queries trennen, ein Store.
   - Das Team trägt Eventual Consistency und Versionierung noch nicht: Kompromiss, etwa CRUD mit Audit-Tabelle.
   - Sonst CQRS, mit Event Sourcing nur, wenn die Historie zählt.
3. Prüf per Test: Im Werkstatt-Shop landet genau ein Context bei Event Sourcing.
4. Erzeuge mit `decisionLine` den Satz für den Abschnitt Decision eines ADR und halte die Entscheidung für einen eurer Contexts fest, siehe [../adr](../adr/README.md).

Eine mögliche Lösung liegt in `solution/` (`npm run start:solution`).
