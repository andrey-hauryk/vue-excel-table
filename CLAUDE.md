# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the playground (development)
npm run dev:play

# Build the library (outputs to dist/)
npm run build

# Build and pack as .tgz
npm run build:tgz
```

There is no test suite configured.

## Architecture

This is a Vue 3 component library that provides Excel-like table functionality, built with Vite + TypeScript. It outputs ESM and UMD bundles to `dist/`.

### Public API

`src/index.ts` exports two components:
- **`ExcelTable`** — the main spreadsheet table component
- **`NestedTable`** — renders multiple `ExcelTable` instances inside collapsible `ExpansionPanel`s

### Component Layers

```
src/components/ui/ExcelTable.vue        — thin wrapper; handles selection state, exposes slots
src/components/ui/NestedTable.vue       — iterates tableData, renders ExcelTable per panel

src/components/table/VueExcelEditor.vue — core table engine (sorting, paging, filtering, editing, copy/paste)
src/components/table/VueExcelColumn.vue — column slot/definition component consumed by VueExcelEditor
```

`ExcelTable` passes most props through to `VueExcelEditor` via `v-bind="editorProps"`, and manages row selection state (`allSelectedIds`) before emitting the `selected` event.

`NestedTable` manages a shared `allSelectedIds` Set across all panels, merging selections from each inner `ExcelTable`.

### Types

- `src/components/table/types.ts` — `TableProps` (props for `ExcelTable`/`VueExcelEditor`) and a `ColumnProps` definition
- `src/components/table/types/column.ts` — canonical `ColumnProps` interface (slightly more complete than the one in `types.ts`)

Both `ColumnProps` definitions exist; prefer `types/column.ts` as the source of truth for column shape.

### Key Composables & Utilities

- `composables/useExportTable.ts` — uses `exceljs` + `file-saver` to export visible table data to `.xlsx`, reading styles directly from the DOM via `styleUtils`
- `composables/useImportTable.ts` — handles `.xlsx` import
- `utils/styleUtils.ts` — extracts CSS styles from rendered DOM elements for faithful Excel export
- `utils/dataUtils.ts` — data transformation helpers

### Playground

`playground/` is a standalone Vite app (separate `vite.config.ts`) that aliases `vue-excel-table` to `../src`, so it always reflects the live source. Run with `npm run dev:play`.

Mock data lives in `playground/mock/`.

### Styles

All component styles are in `src/components/table/styles/styles.scss` and scoped SCSS within each `.vue` file. The library uses the Montserrat font and a green (`#009639`) header theme.
