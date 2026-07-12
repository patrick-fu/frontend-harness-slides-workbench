---
status: accepted
date: 2026-07-11
---

# Address Topics by semantic identity

Use a globally unique semantic Topic ID as the stable lookup identity while
retaining the Topic's current Style ID in public URLs. Moving a Topic between
Styles therefore preserves its ID and assets; a stale Style query is replaced
without adding History, while an unknown Topic ID produces Not Found.

Navigation State stores the selected Topic, presentation position, filters,
language, and display state in query parameters so links remain shareable and
History can restore meaningful viewing contexts.
