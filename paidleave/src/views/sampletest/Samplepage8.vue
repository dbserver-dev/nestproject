<template>
  <div>
    <h1>참조 사이트 :</h1>
    <a
      href="https://attrangs.co.kr/"
      target="_blank"
      rel="noreferrer noopener"
    >
      <h1>아뜨랑스</h1>
    </a>

    <!-- ✅ 가로 스크롤 컨테이너 -->
    <div 
      ref="containerRef" 
      class="scroll-container scroll-container"
      @mouseenter="stopScroll" 
      @mouseleave="startAutoScroll"
    >
      <div v-for="(item, index) in products" :key="index">
        <Samplepage8list :product="item" />
      </div>
    </div>
    <div class="scroll-container" style="width: 1100px;"> 
       <div v-for="(item, index) in products" :key="index" class="product-item">
         <Samplepage8list :product="item" />
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import Samplepage8list from "./Samplepage8list.vue";

// ✅ 상품 목록 데이터
const products = ref([]);

const containerRef = ref(null);
let scrollTimer = null;

// ✅ 자동 스크롤 함수
const startAutoScroll = () => {
  stopScroll();
  scrollTimer = setInterval(() => {
    if (containerRef.value) {
      containerRef.value.scrollLeft += 2;
      const maxScrollLeft = Math.ceil(containerRef.value.scrollWidth - containerRef.value.clientWidth);
      if (Math.ceil(containerRef.value.scrollLeft) >= maxScrollLeft) {
        containerRef.value.scrollTo({ left: 0, behavior: "instant" });
      }
    }
  }, 30);
};

// ✅ 스크롤 멈추기 함수
const stopScroll = () => {
  clearInterval(scrollTimer);
};

// ✅ 컴포넌트 마운트 시 자동 스크롤 시작
onMounted(() => {
  serchproductlist();

  startAutoScroll();
});

// ✅ 언마운트 시 타이머 제거
onBeforeUnmount(() => {
  stopScroll();
});

const serchproductlist = async () => {
  await axios
        .post("/shopping/productlist")
        .then((response) => {
          console.log(response);

          products.value = response.data.productlist;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
}

</script>

<style>
/* ✅ 가로 스크롤 가능하도록 설정 */
.scroll-container {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  border: 1px solid #ccc;
  padding: 10px;
  width: 800px;
  scroll-behavior: smooth;
}

/* ✅ 개별 아이템 (상품 카드) */
.product-item {
  display: flex;
  flex-direction: column; /* ✅ 내부 요소는 세로 정렬 */
  align-items: center;
  justify-content: center;
  min-width: 200px; /* ✅ 최소 너비 설정 */
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
}  

.scroll-container {
  overflow: hidden;  /* ✅ 넘치는 콘텐츠를 숨김 (스크롤 X) */
}


</style>
