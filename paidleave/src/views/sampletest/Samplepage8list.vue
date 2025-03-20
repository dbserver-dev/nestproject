<template>
  <div class="product-card">
    <!-- ✅ 상품 이미지 -->
    <div class="product-image" @click="viewdetail">
      <img v-if="imagenamesurl.length > 0" :src="imagenamesurl[imageidx]" :alt="product.product_name" />
      <img v-else :src="defalutlogo" alt="기본 이미지" /> 
      
      <!-- ✅ 퀵뷰 버튼 추가 -->
      <div class="quick-view">퀵뷰 보기</div>
    </div>

    <!-- ✅ 상품 정보 -->
    <div class="product-info">
      <div class="discount-label">쿠폰최대할인가</div>
      <div class="product-price">
        <span class="discount">{{ product.free_price }}%</span>
        <span class="price">{{ product.price.toLocaleString() }}원</span>
      </div>
      <div class="product-name">{{ product.product_name }}</div>
      <div class="product-brand">{{ product.maker }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, onBeforeUnmount, ref } from "vue";
import defalutlogo from "@/assets/logo.png";
import { openModal } from "jenesius-vue-modal";
import Samplepage8detail from "./Samplepage8detail.vue";

import axios from "axios";

// ✅ 부모 컴포넌트에서 상품 데이터를 전달받음
const props = defineProps({
  product: Object, // ✅ 객체 형태로 상품 정보 받기
});

// ✅ 이미지 데이터를 저장할 변수
const imagenames = ref([]);
const imagenamesurl = ref([]);
const imageidx = ref(0);
let scrollTimer = null;


// ✅ 컴포넌트 마운트 시 이미지 목록 불러오기
onMounted(() => {
  if (props.product.product_no) {
    searchImageList();
  }
  startAutoimagenum();
});

// ✅ 언마운트 시 타이머 제거
onBeforeUnmount(() => {
  stopScroll();
});

// ✅ 이미지 목록 API 호출
const searchImageList = async () => {
  try {
    const param = new URLSearchParams();
    param.append("product_no", props.product.product_no);
    param.append("type", "1");

    const response = await axios.post("/shopping/imagelist", param);
    imagenames.value = response.data.imagelist;

    if (imagenames.value.length > 0) {
      readImageBlob();
    }
  } catch (error) {
    console.error("이미지 목록 불러오기 오류:", error);
  }
};

// ✅ 이미지 바이너리 데이터 불러오기
const readImageBlob = async () => {
  for (const item of imagenames.value) {
    try {
      const param = new URLSearchParams();
      param.append("product_no", props.product.product_no);
      param.append("type", "1");
      param.append("file_name", item.file_name);

      const response = await axios({
        url: "/shopping/imageblob",
        data: param,
        method: "POST",
        responseType: "blob",
      });

      // ✅ Blob 데이터를 사용하여 파일 URL 생성
      let fileURL = URL.createObjectURL(new Blob([response.data]));
      imagenamesurl.value.push(fileURL);
    } catch (error) {
      console.error("이미지 불러오기 오류:", error);
    }
  }
};

const viewdetail = async () => {  

  const popupvar = await openModal(Samplepage8detail, {
        product: props.product,
        imagenames: imagenames.value,
        imagenamesurl: imagenamesurl.value,
      });

      popupvar.onclose = () => {
        console.log("Close!!!!!   ");
      };
}

// ✅ 자동 image 번호 변환
const startAutoimagenum = () => {
  stopScroll();
  scrollTimer = setInterval(() => {
    imageidx.value++;

    if(imageidx.value > imagenamesurl.value.length) {
      imageidx.value = 0;
    }
  }, 2000);
};

// ✅ setInterval 멈추기 함수
const stopScroll = () => {
  clearInterval(scrollTimer);
};

</script>

<style scoped>
/* ✅ 상품 카드 스타일 */
.product-card {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  text-align: center;
  padding-bottom: 10px;
  margin-right: 10px;
}

/* ✅ 상품 이미지 컨테이너 */
.product-image {
  position: relative; /* ✅ 퀵뷰 버튼 위치 기준 */
  width: 100%;
  height: 200px;
  overflow: hidden;
}

/* ✅ 상품 이미지 스타일 */
.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ✅ 퀵뷰 버튼 (기본 숨김) */
.quick-view {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  opacity: 0; /* ✅ 기본적으로 숨김 */
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
  font-weight: bold;
  width: 100px;
  text-align: center;
}

/* ✅ 마우스를 올리면 퀵뷰 버튼 보이기 */
.product-image:hover .quick-view {
  opacity: 1;
}

/* ✅ 상품 정보 스타일 */
.product-info {
  padding: 10px;
  font-size: 14px;
}

/* ✅ 할인율 */
.discount-label {
  color: #ff6b6b;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
}

.discount {
  color: red;
  font-weight: bold;
  margin-right: 5px;
}

.price {
  font-weight: bold;
  font-size: 16px;
}

.product-name {
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
}

.product-brand {
  font-size: 12px;
  color: gray;
  margin-top: 3px;
}
</style>
