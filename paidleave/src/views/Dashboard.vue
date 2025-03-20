<template>
  <!--GLOBAL MASKING -->
  <div id="mask"></div>

  <!-- GLOBAL WRAP -->
  <div id="wrap_area">
    <!-- Content area -->
    <div id="container">
      <ul>
        <li class="lnb">
          <!-- lnb area -->
          <Menu></Menu>
        </li>
        <li class="contents">
          <!-- content AREA -->
          <!-- connecting to router view -->
          <div class="content">
            <router-view :type="type" :menu="menu"></router-view>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/LeftMenu.vue'
export default {
  data: function() {
    return {
      type: this.$route.params.type,
      menu: this.$route.params.menu,
    }
  },
  watch: {
    $route(to) {
      this.type = to.params.type;
      this.menu = to.params.menu;
    },
  },
  components: {Menu},
}
</script>

<style>

</style>