<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getItemCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <div class="loading" v-show="hasMore">
        <loading :title="''"></loading>
      </div>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import Singer from 'common/js/singer'

  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {mapMutations} from 'vuex'
  import {mapActions} from 'vuex'

  const TPYE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        page: 1,
        result: [],
        pullup: true,
        beforeScroll: true,
        hasMore: true
      }
    },
    methods: {
      _search () {
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkHasMore(res.data)
          }
        })
      },
      selectItem (item) {
        if (item.type === TPYE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insetSong(item)
        }
        this.$emit('select')
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insetSong'
      ]),
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page ++
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkHasMore(res.data)
          }
        })
      },
      _checkHasMore (data) {
        let song = data.song
        if (!song.list.length || (song.curnum + song.curpage * 20) >= song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TPYE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach(musicData => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      getItemCls (item) {
        if (item.type === TPYE_SINGER) {
          return 'icon-mine'
        }
        return 'icon-music'
      },
      getDisplayName (item) {
        if (item.type === TPYE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      listScroll () {
        this.$emit('listScroll')
      },
      refresh () {
        this.$refs.suggest.refresh()
      }
    },
    watch: {
      query () {
        this._search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

