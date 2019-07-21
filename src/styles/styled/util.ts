export const center = (justify: string) => {
  return `
    display: flex;
    justify-content: ${justify};
    align-items: center;
  `
}

export const radius = (radius: number | string) => {
  if (typeof radius === 'string') {
    return `border-radius: ${radius};`
  }
  return `border-radius: ${radius}px;`
}
