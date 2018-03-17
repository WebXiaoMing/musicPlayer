import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {clearStorage, saveStorage, deleteOneStorage, STORAGE_KEY} from 'common/js/cache'

function findeIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findeIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insetSong = function ({commit, state}, song) {
  let playlist = [...state.playList]
  let sequenceList = [...state.sequenceList]
  let currentIndex = state.currentIndex

  let fpIndex = findeIndex(playlist, song)
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let fsIndex = findeIndex(sequenceList
    , song)

  sequenceList
  .splice(currentIndex, 0, song)
  if (fsIndex > -1) {
    if (currentIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = [...state.playList]
  let sequenceList = [...state.sequenceList]
  let currentIndex = state.currentIndex

  let fpIndex = findeIndex(playlist, song)
  playlist.splice(fpIndex, 1)
  let fqIndex = findeIndex(sequenceList, song)
  sequenceList.splice(fqIndex, 1)

  if (currentIndex > fpIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playlistState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playlistState)
}

export function clearPlayList ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_CURRENT_INDEX, -1)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveStorage(STORAGE_KEY.SEARCH, query))
}

export const delSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteOneStorage(STORAGE_KEY.SEARCH.KEY, query))
}

export const saveplayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, saveStorage(STORAGE_KEY.PLAY, song))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearStorage(STORAGE_KEY.SEARCH.KEY))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveStorage(STORAGE_KEY.FAVORITE, song))
}

export const delFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteOneStorage(STORAGE_KEY.FAVORITE.KEY, song))
}
