const columnsDecimalRules = {
  "liq_prod_rate_tn": 1,
  "oil_prod_rate_tn": 1,
  "wat_inje_rate_m3": 1,
  "liq_prod_month_tn": 1,
  "liq_prod_month_m3": 1,
  "oil_prod_month_tn": 1,
  "oil_prod_month_m3": 1,
  "wat_inje_month_m3": 1,
  "liq_prod_cumul_tn": 1,
  "liq_prod_cumul_hist_tn": 1,
  "oil_prod_cumul_tn": 1,
  "oil_prod_cumul_hist_tn": 1,
  "wat_inje_cumul_m3": 1,
  "wat_inje_cumul_hist_m3": 1,
  "png_prod_rate_m3": 1,
  "png_prod_month_m3": 1,
  "png_prod_cumul_m3": 1,
  "con_prod_rate_tn": 1,
  "con_prod_month_tn": 1,
  "con_prod_cumul_tn": 1,
  "wat_intake_rate_m3": 1,
  "wat_intake_month_m3": 1,
  "wat_intake_cumul_m3": 1,
  "wat_intake_cumul_hist_m3": 1,
  "eff": 3,
  "eff_prod": 3,
  "eff_inje": 3,
  "eff_intake": 3,
  "wct_tn": 3,
  "wct_m3": 3,
  "gor_tn_to_m3": 3,
  "liq_prod_daily_tn": 1,
  "oil_prod_daily_tn": 1,
  "png_prod_daily_m3": 1,
  "wat_inje_daily_m3": 1,
  "wat_intake_daily_m3": 1,
  "oil_prod_rate_tn_after_gtm": 1,
  "oil_prod_rate_tn_before_gtm": 1,
  "oil_prod_rate_tn_gtm_effect": 1,
  "niz_tn": 3,
  "oil_prod_rate_tn_avg": 1,
  "liq_prod_rate_tn_avg": 1,
  "oil_prod_rate_tn_decline": 3,
  "png_prod_rate_m3_avg": 1,
  "operation_time_prod": 1,
  "wct_tn_after_gtm": 2,
  "wct_tn_before_gtm": 2,
  "npv_gep": 1,
  "qn_cumul": 1,
}

const conversionRules = {
  "liq_prod_month_tn": {
      mode: "d",
      amount: 1000
  },
  "liq_prod_cumul_tn": {
      mode: "d",
      amount: 1000
  },
  "liq_prod_cumul_hist_tn": {
      mode: "d",
      amount: 1000
  },
  "oil_prod_month_tn": {
      mode: "d",
      amount: 1000
  },
  "oil_prod_cumul_tn": {
      mode: "d",
      amount: 1000
  },
  "oil_prod_cumul_hist_tn": {
      mode: "d",
      amount: 1000
  },
  "qn_cumul": {
      mode: 'd',
      amount: 1000,
  },
  "png_prod_rate_m3": {
      mode: "d",
      amount: 1000
  },
  "png_prod_month_m3": {
      mode: "d",
      amount: 1000
  },
  "png_prod_cumul_m3": {
      mode: "d",
      amount: 1000000
  },
  "png_prod_daily_m3": {
      mode: "d",
      amount: 1000
  },
  "wat_inje_month_m3": {
      mode: "d",
      amount: 1000
  },
  "wat_inje_cumul_m3": {
      mode: "d",
      amount: 1000
  },
  "wat_inje_cumul_hist_m3": {
      mode: "d",
      amount: 1000
  },
  "wat_intake_cumul_hist_m3": {
      mode: "d",
      amount: 1000
  },
  "wat_inje_daily_m3": {
      mode: "d",
      amount: 1,
  },
  "wat_inje_rate_m3": {
      mode: "d",
      amount: 1,
  },
  "operation_time_prod": {
      mode: "d",
      amount: 24,
  },
  "npv_gep": {
      mode: "d",
      amount: 1,
  },
}


export function formatNumber(_value: number, _field: string): string {
  const conversionRule = conversionRules[_field];

  if (conversionRule) {
      conversionRule.mode === 'd' ? _value = _value / conversionRule.amount : _value * conversionRule.amount;
  }

  return _value.toFixed(columnsDecimalRules[_field]);
}

export function formatNumberByRowId(_value: number, row: any): string {
  const conversionRule = conversionRules[row.id];

  if (conversionRule) {
      conversionRule.mode === 'd' ? _value = _value / conversionRule.amount : _value * conversionRule.amount;
  }

  return _value.toFixed(columnsDecimalRules[row.id]);
}