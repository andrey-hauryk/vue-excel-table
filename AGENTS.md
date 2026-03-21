# AGENTS.md

This document explains how to work in this repository and how the project should evolve architecturally.
It is written for coding agents and teammates who need a fast, practical mental model of the codebase.

## Project Intent

`vue-excel-table` is a Vue 3 library for rendering and editing Excel-like tabular data.
The project already has a strong core editor, but its long-term maintainability depends on keeping a clear split between:

- public library API
- table engine internals
- feature modules around the engine
- preview/demo code

The current codebase is close to that shape, and future work should reinforce it rather than mixing concerns.

## Architectural Direction

The library should be treated as a layered system:

1. `Public API layer`
   `src/index.ts`
   Exports installable library entrypoints and the stable components consumers are expected to import.

2. `Adapter layer`
   `src/components/ui/`
   Thin, consumer-facing wrappers such as `ExcelTable.vue` and `NestedTable.vue`.
   Their job is to provide ergonomic props, slots, events, and compatibility behavior.
   They should avoid owning heavy business logic.

3. `Core table engine`
   `src/components/table/VueExcelEditor.vue`
   This is the main runtime engine: selection, navigation, paging, filtering, copy/paste, editing, import/export orchestration.
   It should remain the single source of truth for spreadsheet behavior.

4. `Declarative column definition layer`
   `src/components/table/VueExcelColumn.vue`
   Responsible for translating a consumer column definition into the internal field model used by the editor.

5. `Feature modules`
   `src/components/table/components/`
   UI pieces for filtering, finding, loading, settings, modals, SVG icons, and controls.
   These should stay composable and dumb where possible.

6. `Composable and utility layer`
   `src/components/table/composables/`
   `src/components/table/utils/`
   Export/import logic, data transforms, style extraction, and pure helpers belong here.
   These modules should be preferred over embedding side logic directly into `.vue` files.

7. `Preview sandbox`
   `preview/`
   Demo-only code. It should showcase usage patterns, but must not define library architecture.

## Recommended Boundaries

### 1. `src/index.ts` stays minimal

Keep the library entrypoint focused on exports and plugin install behavior only.
Do not move implementation logic here.

Good responsibilities:

- export components
- export shared types
- register global components for plugin install

Avoid:

- feature configuration logic
- runtime state
- utility code

### 2. `ui/` should be wrappers, not engines

`src/components/ui/ExcelTable.vue` should remain a stable adapter around `VueExcelEditor`.
This is where we should normalize props, compose slots, and expose events in a clean API shape.

Good responsibilities:

- map user props to editor props
- translate editor events into public events
- expose slot contracts
- keep backward compatibility

Avoid:

- deep table algorithms
- export/import implementation
- DOM measurement logic
- duplicated selection engine logic that belongs in the editor

### 3. `VueExcelEditor.vue` is the behavioral core

All spreadsheet-like behavior should converge here.
If a feature changes how rows, cells, navigation, selection, filtering, or editing behave, it likely belongs in the editor or in a composable called by the editor.

Good responsibilities:

- editing lifecycle
- keyboard and mouse interactions
- focus management
- filter/sort/page orchestration
- exposing imperative API like `exportTable`

Avoid:

- demo-only assumptions
- consumer-specific styling choices
- dead experimental branches

### 4. Column definition should become a true source of truth

Right now there are overlapping column types in:

- `src/components/table/types.ts`
- `src/components/table/types/column.ts`

This should converge to one canonical type module.
Recommended direction:

- keep public types in `src/components/table/types/`
- re-export them from a single barrel
- let wrappers and core import from the same source

This will reduce drift between runtime behavior and TypeScript contracts.

### 5. Import/export should be isolated features

Import/export is valuable, but it should not sprawl across the editor.
Recommended split:

- `useExportTable.ts` handles workbook generation only
- `useImportTable.ts` handles parsing and validation pipeline only
- `VueExcelEditor.vue` only orchestrates UI events and invokes these modules

Longer term, import should have explicit phases:

1. parse file
2. map headers to fields
3. validate rows
4. produce mutation plan
5. apply changes to the table
6. emit summary and errors

That separation will make the feature testable and easier to recover from partial failures.

## Suggested Folder Strategy

If the project continues to grow, this is the structure I would aim for:

```text
src/
  index.ts
  components/
    ui/
      ExcelTable.vue
      NestedTable.vue
    table/
      core/
        editorState.ts
        selection.ts
        navigation.ts
        filtering.ts
        sorting.ts
      composables/
        useExportTable.ts
        useImportTable.ts
      components/
        filter/
        find/
        loading/
        settings/
        tooltip/
        ui/
      types/
        index.ts
        column.ts
        table.ts
        export.ts
      utils/
        dataUtils.ts
        styleUtils.ts
      VueExcelEditor.vue
      VueExcelColumn.vue
```

This does not need to happen all at once.
The important idea is to gradually extract editor behavior into focused modules without breaking the public component API.

## Rules For Future Changes

When adding or changing code in this repo, prefer these rules:

1. Public API changes belong in `ui/` and `src/index.ts`.
2. Spreadsheet behavior changes belong in `VueExcelEditor.vue` or editor-focused composables.
3. Pure logic should move to `utils/` or `core/`, not stay inline in templates.
4. Demo-specific work belongs only in `preview/`.
5. Types should be defined once and re-exported, not duplicated.
6. New features should expose a stable event/prop contract before adding more UI surface.

## Recommended Refactor Priorities

These are the highest-value architectural improvements for this codebase:

### Priority 1: stabilize the package surface

- ensure generated `.d.ts` files exist in `dist/`
- export shared types from the package entrypoint
- document the supported data shape and slot API

### Priority 2: unify type definitions

- remove duplicate `ColumnProps` definitions
- add a canonical `table.ts` and `column.ts`
- let `ExcelTable`, `VueExcelColumn`, and composables consume the same types

### Priority 3: extract editor subsystems

The editor is already powerful, but large.
The first extractions I would make are:

- selection state and selected row bookkeeping
- export/import orchestration
- filter state
- keyboard navigation

This makes the core easier to reason about without rewriting it.

### Priority 4: separate library code from preview assumptions

The preview should remain a proving ground for examples.
It should not be the place where library API decisions are encoded implicitly.

## Testing Direction

There is currently no test suite configured.
Architecturally, the safest path is:

1. add unit coverage for pure utility and import/export modules
2. add component tests for `ExcelTable` public API
3. add a few integration tests for editor behaviors that are easy to regress

The more logic moves out of the monolithic editor component into pure modules, the cheaper testing becomes.

## Documentation Expectations

Agents working in this repo should keep documentation aligned with implementation.
At minimum, when public behavior changes, update:

- `README.md` for consumer-facing usage
- `CHANGELOG.md` for release notes
- `AGENTS.md` if architectural expectations changed

## Short Working Summary

If you need the shortest possible architectural guidance for this repository, use this:

- treat `ExcelTable` as the stable public adapter
- treat `VueExcelEditor` as the spreadsheet engine
- keep import/export and helpers in composables and utils
- keep preview isolated from library internals
- converge duplicated types into one source of truth
