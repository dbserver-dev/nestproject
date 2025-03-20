<template>
  <div>
    <VueDaumPostcode @complete="sendAPIdata" />
  </div>
</template>

<script setup>
import { inject } from "vue";
//import { pushModal  } from "jenesius-vue-modal";
import { VueDaumPostcode } from 'vue-daum-postcode';

const emitter = inject("emitter"); // 글로벌 이벤트 버스 사용

const sendAPIdata = (resp) => {
  emitter.emit("daumZipResult", {"addeinfo" : resp, "zipcd" : resp.zonecode,});
  //resolve();
  //pushModal();
};
</script>

<style>
#d-api-zone {
  position: fixed;
  left: 2px;
  top: 2px;
  border: 2px solid black;
  max-height: 80%;
  overflow-y: scroll;
}
</style>
