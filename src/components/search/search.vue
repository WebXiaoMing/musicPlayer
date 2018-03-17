<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" @click="addQuery(item.k)" v-for="item in hotkey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory"
                        @select="addQuery"
                        @delete="deleteOne"
            />
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" @select="saveSearch"  @listScroll="blurInput" :query="query"></suggest>
    </div>
    <confirm ref="confirm"
             title="是否清空所有历史"
             confirmBtntext="清空"
             @confirm="clearSearchHistory"
    />
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {mapActions, mapGetters} from 'vuex'
  import {playlistMixin, searchMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin, searchMixin],
    props: {
    },
    data () {
      return {
        hotkey: [],
        query: ''
      }
    },
    created () {
      this._getHotKey()
    },
    methods: {
      handlePlaylist (list) {
        let bottom = list.length > 0 ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      _getHotKey () {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    computed: {
      shortcut () {
        return this.hotkey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    watch: {
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
