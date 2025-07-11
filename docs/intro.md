# Introduction

Aloma enables end-to-end, vast and complex, variable and continous business process automation.

It has the following benefits:

* ✅ Developer first
* ✅ Agile/iterative/continous
* ✅ Context aware

## Before you start

A note on concepts:

1. A workspace contains all necessary steps, tasks, integrations, ... Use it to separate unrelated business logic.
1. A task is any data in form of `JSON`. Normally tasks are created by integrations added to the workspace.
1. A step is self-contained match and code. The match specifies in which context the step is applicable, the code specifies what will be executed in that context
1. Aloma is aware of the context and repeatedly applies steps to a task until it is resolved.



