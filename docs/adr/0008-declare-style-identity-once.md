---
status: accepted
date: 2026-07-12
---

# Declare Style identity once

Store each Style's canonical ID, bilingual name, and Band in one unordered
definition map; Topics reference that identity through `styleId`. This prevents
repeated Topic metadata or model-specific wording from creating conflicting
public Style identities while leaving order to the Topic Registry.
