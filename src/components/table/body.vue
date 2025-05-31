<template>
<tbody @mousedown="mouseDown" @mouseup="mouseUp">
            <tr v-if="localizedLabel.noRecordIndicator && pagingTable.length == 0">
              <td colspan="100%" style="height:40px; vertical-align: middle; text-align: center"></td>
            </tr>
            <tr v-else v-for="(record, rowPos) in pagingTable" :key="rowPos"
              :class="{ select: typeof selected[pageTop + rowPos] !== 'undefined' }" :style="rowStyle(record)">

              <td v-if="selectable" class="center-text first-col-selectable" :id="`rid-${record.id}`" :class="{
                hide: noNumCol,
                error: rowerr[`rid-${record.id}`],
              }" :pos="rowPos">
                <input class="table__checkbox" type="checkbox" :checked="selected[rowPos] === record.id"
                  :class="{ 'table__checkbox--disabled': disableSelection }" @click="rowLabelClick" />
              </td>

              <td v-else class="center-text first-col" :id="`rid-${record.id}`" :class="{
                hide: noNumCol,
                error: rowerr[`rid-${record.id}`]
              }" :pos="rowPos" @mouseover="numcolMouseOver" @click="rowLabelClick">
                <span v-html="recordLabel(pageTop + rowPos + 1, record)"></span>
              </td>


              <td v-for="(item, p) in fields" v-show="!item.invisible" :id="`id-${record.id}-${item.name}`"
                :cell-RC="`${rowPos}-${item.name}`" :class="{
                  'cell-selected': record[item.name]?.isSelected,
                  readonly: item.readonly,
                  error: errmsg[`id-${record.id}-${item.name}`],
                  link: item.link && item.isLink && item.isLink(record),
                  select: item.options,
                  grouping: item.grouping,
                  anomaly: record[item.name]?.anomaly,
                  expand: item.grouping && ungroup[item.name + record[item.name]?.value],
                  datepick: item.type == 'date',
                  'sticky-column': item.sticky,
                  hideDuplicate: item.hideDuplicate && rowPos > 0 && isSameSinceLeft(p, record, pagingTable[rowPos - 1]),
                }" :key="p" :style="Object.assign(cellStyle(record, item), renderColumnCellStyle(item, record))"
                @mouseover="cellMouseOver" @mousemove="cellMouseMove">
                <!--if slot exist render slot-->
                <template v-if="$slots[`cell-${item.name}`]">
                  <slot :name="`cell-${item.name}`" :record="record" />
                </template>
                <!-- if render function exist render render fn-->
                <template v-else-if="typeof item.render === 'function'">
                  <component :is="item.render(record)" />
                </template>
                <!-- default standart text -->
                <template v-else>
                  <cell-tooltip v-if="record[item.name]?.anomaly" :content="record[item.name].anomaly">
                    {{ item.toText(record[item.name].value) }}
                  </cell-tooltip>
                  <template v-else>{{ item.toText(record[item.name]?.value, record) }}</template>
                </template>
              </td>
              <td v-if="vScroller.buttonHeight < vScroller.height" class="last-col"></td>
            </tr>
          </tbody>


</template>