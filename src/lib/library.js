const LIBRARY_KEY = 'drumMachineLibrary'

export function libraryLoad() {
  try { return JSON.parse(localStorage.getItem(LIBRARY_KEY)) || [] }
  catch { return [] }
}

export function librarySave(slots) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(slots))
}
