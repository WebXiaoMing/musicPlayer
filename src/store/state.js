import {playMode} from 'common/js/config'
import {loadStorage, STORAGE_KEY} from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  toplist: {},
  searchHistory: loadStorage(STORAGE_KEY.SEARCH.KEY),
  playHistory: loadStorage(STORAGE_KEY.PLAY.KEY),
  favoriteList: loadStorage(STORAGE_KEY.FAVORITE.KEY)
}

export default state
