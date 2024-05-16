interface formatValueOptions {
  decimalPlace?: number;
}

export function formatValue(
  value: number,
  { decimalPlace }: formatValueOptions = { decimalPlace: 0 }
) {
  if (!Number.isFinite(value)) {
    value = 0;
  }
  const decimalPlaceOptions = {
    minimumFractionDigits: decimalPlace ?? 0,
    maximumFractionDigits: decimalPlace ?? 0,
  };

  return value.toLocaleString("pt-br", decimalPlaceOptions);
}
