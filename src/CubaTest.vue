<template>
<ExcelTable
  v-model="monthTableData"
  :columns="columns"
  :loading="loading"
  no-header-edit
  no-paging
></ExcelTable>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import ExcelTable from './components/ui/ExcelTable.vue';
import cubaDataMock from './mock/cuba.ts';

const fieldLabels = {
  kinematic_viscosity: "Кинематическая вязкость",
  downhole_pressure_tm: "Давление забойное ТМ",
  period: "Период (режим работы: закачка пара/пропитка/фонтан/ушвн)",
  cycle_number: "Номер цикла",
  connector_diameter: "Диаметр штуцера",
  liquid_debit: "Дебит жидкости",
  oil_debit: "Дебит нефти",
  water_cut: "Обводненность",
  gas_debit: "Дебит газа",
  gas_factor: "Газовый фактор",
  liquid_production: "Добыча жидкости",
  oil_production: "Добыча нефти",
  water_percent: "% воды",
  gas_production: "Добыча газа",
  steam_pumping: "Закачка пара",
  steam_dryness: "Сухость пара",
  loading_temperature: "Температура закачки",
  injection_pressure: "Давление закачки",
  buffer_pressure: "Давление буферное",
  borehole_pressure: "Давление затрубное",
  linear_pressure: "Линейное давление",
  linear_fluid_temperature: "Температура жидкости (в линии)",
  buffer_fluid_temperature: "Температура жидкости (в буфере)",
  salt_concentration: "Концентрация солей",
  dynamic_level: "Динамический уровень",
  static_level: "Статический уровень",
  ushvn_frequency: "Частота УШВН",
  amperage: "Сила тока",
  loading: "Загрузка",
  suspended_particle_count: "К-т взвешенных частиц",
  reservoir_pressure: "Давление пластовое",
  downhole_pressure: "Давление забойное",
  sleep_time: "Время простоя",
  sleep_code: "Код простоя",
  work_time: "Время работы",
  torque: "Крутящий момент",
  frequency: "Частота",
  feed_rate: "Коэффициент подачи",
  theoretical_debit: "Дебит теоретический",
  power_consumption: "Потребляемая мощность",
  energy_consumption: "Удельный расход энергии",
  inflow_volume: "Объем притока",
  oily_fluid_sampled: "Отобранная нефтесодержащая жидкость",
  fluid_sampled: "Отобранная жидкость"
}

const tableData = ref(cubaDataMock);

const monthTableData = ref([]);

const loading = ref(false);

const columns = ref([]);


const fetchData = (tableData: any, month: string) => {
  loading.value = true;

  const monthData = tableData.value[month];
  const days = monthData.days;
  const dayKeys = Object.keys(days);

  // Формируем колонки
  columns.value = [
    { field: "param", label: "Инфо", type: "string" },
    ...dayKeys.map((_, i) => ({
      field: `day${i + 1}`,
      label: `${i + 1}`,
      type: "number",
      valueFormatter: (val: number) => typeof val === 'number' ? + val.toFixed(2) : val,
    })),
    { field: "average", label: "Средняя мес", type: "string" },
    { field: "total", label: "Итог месяц", type: "string" },
  ];

  // Формируем строки
  const result: any[] = [];

  for (const [field, label] of Object.entries(fieldLabels)) {
    const row: Record<string, any> = {
      param: { value: label }
    };

    const values: number[] = [];

    dayKeys.forEach((dayKey, index) => {
      const dayData = days[dayKey];
      const raw = dayData[field];
      const num = Number(raw);
      const val = isNaN(num) ? null : num;
      row[`day${index + 1}`] = { value: raw };

      if (val !== null) {
        values.push(val);
      }
    });

    // Добавляем среднее и итог
    const total = values.reduce((sum, n) => sum + n, 0);
    const average = values.length ? total / values.length : null;

    row.average = { value: average?.toFixed(2) ?? "" };
    row.total = { value: total?.toFixed(2) ?? "" };

    result.push(row);
  }

  monthTableData.value = result;

  loading.value = false;
};


fetchData(tableData, '2025-04');
</script>

<style scoped lang="scss"></style>