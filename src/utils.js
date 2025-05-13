utils.getContributionCountColor = (count) => {
  let paletteIndex = Math.floor(count / 2);
  if (paletteIndex >= data.palette.length) {
    return data.palette[data.palette.length - 1];
  }
  return data.palette[paletteIndex];
}
