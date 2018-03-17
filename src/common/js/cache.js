import storage from 'good-storage'

export const STORAGE_KEY = (() => {
  return {
    SEARCH: {KEY: '__search__', LEN: 15},
    PLAY: {KEY: '__play__', LEN: 200},
    FAVORITE: {KEY: '__favorite__', LEN: 200}
  }
})()

export function saveStorage ({KEY, LEN}, data) {
  let ret = storage.get(KEY, [])
  insertArray(ret, data, (item) => {
    if (data.id) {
      return item.id === data.id
    } else {
      return item === data
    }
  }, LEN)
  storage.set(KEY, ret)
  return ret
}

export function loadStorage (KEY) {
  return storage.get(KEY, [])
}

export function deleteOneStorage (KEY, data) {
  let ret = storage.get(KEY, [])
  delArray(ret, item => {
    if (data.id) {
      return item.id === data.id
    } else {
      return item === data
    }
  })
  storage.set(KEY, ret)
  return ret
}

export function clearStorage (KEY) {
  storage.remove(KEY)
  return []
}

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function delArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
