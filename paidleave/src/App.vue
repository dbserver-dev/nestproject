<template>
  <router-view />
  <widget-container-modal />
</template>
<script>
// js 내용
// 팝업을 띄우기 위한 "jenesius-vue-modal"을 사용하기 위해
// 기본적으로 contianer라는 걸 설정해 줌
import { container } from "jenesius-vue-modal";

/* import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue"; */

// 팝업을 띄우기 위해 components에 container 설정 (decrepated)
export default {
  components: { WidgetContainerModal: container },
  name: "app",
};
</script>

<style>
.modal-container {
  z-index: 100;
}
</style>
