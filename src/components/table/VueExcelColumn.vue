<template>
  <div />
</template>

<script setup lang="ts">
import { onBeforeMount, getCurrentInstance } from "vue";
import type { ColumnProps } from "./types";

const props = withDefaults(defineProps<{
  field: string;
  label: string | null;
  type: ColumnProps["type"];
  width: string;
  invisible: boolean;
  readonly: boolean | null;
  keyField: boolean;
  sticky: boolean;
  listByClick: boolean | null;
  autoFillWidth: boolean;
  hideDuplicate: boolean;
  grouping: string | null;
  mandatory: string;
  lengthLimit: number;
  autocomplete: boolean | null;
  pos: number;
  summary: string | null;
  noSorting: boolean | null;
  options: ColumnProps["options"];
  allowKeys: ColumnProps["allowKeys"];
  initStyle: ColumnProps["initStyle"];
  validate: ColumnProps["validate"];
  link: ColumnProps["link"];
  isLink: ColumnProps["isLink"];
  valueFormatter: ColumnProps["valueFormatter"];
  render: ColumnProps["render"];
  toValue: (text: string) => any;
  toText: (val: any, record: any) => string;
  register: ColumnProps["register"];
}>(), {
  field: "dummy",
  label: null,
  type: "string",
  width: "100px",
  invisible: false,
  readonly: null,
  keyField: false,
  sticky: false,
  listByClick: null,
  autoFillWidth: false,
  hideDuplicate: false,
  grouping: null,
  mandatory: "",
  lengthLimit: 0,
  autocomplete: null,
  pos: 0,
  summary: null,
  noSorting: null,
  options: null,
  allowKeys: null,
  initStyle: null,
  validate: null,
  link: null,
  isLink: null,
  valueFormatter: null,
  render: null,
  toValue: undefined,
  toText: undefined,
  register: null,
});

const instance = getCurrentInstance();
const parent = instance?.proxy?.$parent;

const init = () => {
  const defaultAllowKeys: Record<string, string[]> = {
    number: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "-"],
    date: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-"],
    datetick: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", " ", ":"],
  };

  if (props.type === "map" && props.options?.constructor?.name === "AsyncFunction") {
    throw new Error("VueExcelColumn: Map does not support Async Function");
  }

  if (
    !["string", "boolean", "password", "list", "action"].includes(props.type) &&
    !defaultAllowKeys[props.type]
  ) {
    throw new Error("VueExcelColumn: Not supported type: " + props.type);
  }

  const style = { ...(typeof props.initStyle === 'function' ? props.initStyle() : props.initStyle) };
  const _autocomplete = props.autocomplete ?? (props.type === "action");
  const _readonly = props.readonly;
  const _listByClick = props.type === "action";

  const finalToValue = props.toValue ?? ((text: string) => {
    if (["datetick"].includes(props.type)) {
      return new Date(text + " GMT+0").getTime();
    }
    if (props.type === "map" && typeof props.options === "function") {
      const list = props.options(text);
      return Object.keys(list).find((k) => list[k] === text);
    }
    return text;
  });

  const finalToText = props.toText ?? ((val: any, record: any): string => {
    if (props.keyField && val?.toString().startsWith("§")) return "";
    if (val == null) return "";
    const offset = new Date().getTimezoneOffset() * 60 * 1000;
    let d: number;
    switch (props.type) {
      case "number":
        return props.valueFormatter ? props.valueFormatter(val, record) : String(val);
      case "boolean":
        return val ? "Да" : "Нет";
      case "date":
        d = new Date(val).getTime();
        if (!d) return "";
        return new Date(d - offset).toISOString().slice(0, 10);
      case "datetick":
        d = new Date(val * 1 ? val * 1 : val).getTime();
        if (!d) return "";
        return new Date(d - offset).toISOString().slice(0, 10);
      case "map":
        return typeof props.options === "function"
          ? props.options(val)?.[val]
          : props.options?.[val] ?? "";
      case "action":
        return "";
      case "list":
        return val[0] ? val[0].slice(0, 19) : "";
      default:
        return String(val);
    }
  });

  parent?.registerColumn?.({
    name: props.field,
    label: props.label ?? props.field,
    type: props.type,
    width: props.width,
    origWidth: props.width,
    autoFillWidth: props.autoFillWidth,
    validate: props.validate,
    link: props.link,
    isLink: props.isLink ?? (props.link ? () => true : null),
    noSorting: props.noSorting !== null ?? parent?.noSorting,
    keyField: props.keyField,
    sticky: props.sticky,
    allowKeys: props.allowKeys ?? defaultAllowKeys[props.type],
    mandatory: props.mandatory,
    lengthLimit: Number(props.lengthLimit),
    autocomplete: _autocomplete ?? parent?.autocomplete,
    initStyle: style,
    invisible: props.invisible,
    readonly: _readonly ?? parent?.readonly,
    pos: Number(props.pos),
    options: props.options,
    summary: props.summary,
    toValue: finalToValue,
    toText: (...args) => finalToText(...args) || "",
    valueFormatter: props.valueFormatter || null,
    register: props.register,
    listByClick: props.listByClick ?? _listByClick,
    hideDuplicate: props.hideDuplicate ?? props.grouping,
    grouping: props.grouping,
    render: props.render,
  });
};

onBeforeMount(init);
</script>
