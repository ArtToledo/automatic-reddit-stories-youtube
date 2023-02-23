const formatterPathToBashFfmpeg = (path: string): string => {
  return path.replace(/\\/g, '/')
}

export {
  formatterPathToBashFfmpeg
}
