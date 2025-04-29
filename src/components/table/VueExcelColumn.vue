<template>
  <div />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ColumnProps } from "./types";

export default defineComponent({
  props: {
    field: { type: String, default: "dummy" },
    label: { type: String, default: null },
    type: { type: String as PropType<ColumnProps["type"]>, default: "string" },
    initStyle: { type: [Object, Function] as PropType<ColumnProps["initStyle"]>, default: null },
    width: { type: String, default: "100px" },
    invisible: { type: Boolean, default: false },
    readonly: { type: Boolean, default: null },
    textTransform: { type: String as PropType<ColumnProps["textTransform"]>, default: null },
    textAlign: { type: String as PropType<ColumnProps["textAlign"]>, default: null },
    keyField: { type: Boolean, default: false },
    sticky: { type: Boolean, default: false },
    listByClick: { type: Boolean, default: null },
    validate: { type: Function as PropType<ColumnProps["validate"]>, default: null },
    change: { type: Function as PropType<ColumnProps["change"]>, default: null },
    link: { type: Function as PropType<ColumnProps["link"]>, default: null },
    isLink: { type: Function as PropType<ColumnProps["isLink"]>, default: null },
    format: { type: String, default: "text" },
    cellClick: { type: Function as PropType<ColumnProps["cellClick"]>, default: null },
    autoFillWidth: { type: Boolean, default: false },
    hideDuplicate: { type: Boolean, default: false },
    grouping: { type: String, default: null },
    allowKeys: {
      type: [Array, Function] as PropType<ColumnProps["allowKeys"]>,
      default: null,
    },
    mandatory: { type: String, default: "" },
    lengthLimit: { type: Number, default: 0 },
    autocomplete: { type: Boolean, default: null },
    pos: { type: Number, default: 0 },
    options: {
      type: [Array, Object, Function] as PropType<ColumnProps["options"]>,
      default: null,
    },
    summary: { type: String, default: null },
    sort: { type: Function as PropType<ColumnProps["sort"]>, default: null },
    sorting: {
      type: Function as PropType<ColumnProps["sorting"]>,
      default: null,
    },
    noSorting: { type: Boolean, default: null },
    masking: { type: String, default: "•" },
    placeholder: { type: String, default: "" },
    valueFormatter: {
      type: Function as PropType<ColumnProps["valueFormatter"]>,
      default: null,
    },
    render: {
      type: Function as PropType<ColumnProps["render"]>,
      default: null,
    },
    toValue: {
      type: Function as PropType<(text: string) => any>,
      default(text: string): any {
        if (this.textTransform === "uppercase") text = text.toUpperCase();
        if (this.textTransform === "lowercase") text = text.toLowerCase();
        if (
          ["datetick"].includes(this.type)
        ) {
          return new Date(text + " GMT+0").getTime();
        }

        if (this.type === "map" && typeof this.options === "function") {
          const list = this.options(text);
          return Object.keys(list).find((k) => list[k] === text);
        }
        return text;
      },
    },
    toText: {
      type: Function as PropType<(val: any) => string>,
      default(val: any, record: any): string {
        if (this.keyField && val?.toString().startsWith("§")) return "";
        if (val == null) return "";
        const offset = new Date().getTimezoneOffset() * 60 * 1000;
        let d: number;
        switch (this.type) {
          case "number":
            return this.valueFormatter ? this.valueFormatter(val, record) : String(val);
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
            return typeof this.options === "function"
              ? this.options(val)?.[val]
              : this.options?.[val] ?? "";
          case "password":
            return this.masking.repeat(val?.length || 0);
          case "action":
            return "";
          case "list":
            return val[0] ? val[0].slice(0, 19) : "";
          default:
            return String(val);
        }
      },
    },
    register: {
      type: Function as PropType<ColumnProps["register"]>,
      default: null,
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const defaultAllowKeys: Record<string, string[]> = {
        number: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "-"],
        date: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-"],
        datetick: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", " ", ":"],
      };

      if (
        this.type === "map" &&
        this.options.constructor.name === "AsyncFunction"
      ) {
        throw new Error("VueExcelColumn: Map does not support Async Function");
      }
      if (
        !["string", "boolean", "password", "list", "action"].includes(
          this.type
        ) &&
        !defaultAllowKeys[this.type]
      ) {
        throw new Error("VueExcelColumn: Not supported type: " + this.type);
      }
      const style = { ...this.initStyle };
      if (this.textTransform) style.textTransform = this.textTransform;
      if (this.textAlign) style.textAlign = this.textAlign;
      this._autocomplete = this.autocomplete ?? this.type === "action";
      this._readonly = this.readonly;
      this._listByClick = this.type === "action";

      this.$parent.registerColumn({
        name: this.field,
        label: this.label ?? this.field,
        type: this.type,
        width: this.width,
        origWidth: this.width,
        autoFillWidth: this.autoFillWidth,
        validate: this.validate,
        change: this.change,
        link: this.link,
        isLink: this.isLink ?? (this.link ? () => true : null),
        sort: this.sort,
        sorting: this.sorting,
        noSorting: this.noSorting !== null ?? this.$parent.noSorting,
        keyField: this.keyField,
        sticky: this.sticky,
        allowKeys: this.allowKeys ?? defaultAllowKeys[this.type],
        mandatory: this.mandatory,
        lengthLimit: Number(this.lengthLimit),
        textTransform: this.textTransform,
        autocomplete: this._autocomplete ?? this.$parent.autocomplete,
        initStyle: style,
        invisible: this.invisible,
        readonly: this._readonly ?? this.$parent.readonly,
        pos: Number(this.pos),
        options: this.options,
        summary: this.summary,
        masking: this.masking,
        format: this.format,
        toValue: this.toValue,
        toText: (...arg) => this.toText(...arg) || this.placeholder || "",
        register: this.register,
        placeholder: this.placeholder,
        cellClick: this.cellClick,
        listByClick: this.listByClick ?? this._listByClick,
        hideDuplicate: this.hideDuplicate ?? this.grouping,
        grouping: this.grouping,
        render: this.render,
      });
    },
  },
});
</script>

