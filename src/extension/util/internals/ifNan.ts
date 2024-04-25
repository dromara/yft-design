export const ifNaN = (value: number, valueIfNaN?: number) => {
  return isNaN(value) && typeof valueIfNaN === 'number' ? valueIfNaN : value;
};
  