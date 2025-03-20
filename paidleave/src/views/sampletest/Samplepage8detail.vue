<template>
  <div class="product-detail">
    <!-- ✅ 상품 이미지 슬라이드 -->
    <div class="product-images">
      <div class="main-image">
        <button class="prev" @click="prevImage">&lt;</button>
        <img :src="props.imagenamesurl[selimg]" :alt="product.name" />
        <button class="next" @click="nextImage">&gt;</button>
      </div>
      <div class="thumbnail-list">
           <img
              v-for="(image, index) in props.imagenamesurl"
              :key="index"
              :src="image"
              :alt="'썸네일 ' + index"  
              @click="selectimg(index)"
            />
      </div>
    </div>

    <!-- ✅ 상품 정보 -->
    <div class="product-info">      
      <h2 class="product-price">
        <span class="product-name">{{ product.product_name }}</span>
        <span class="original-price">{{ product.price.toLocaleString() }}</span>
        <span class="discounted-price">{{ product.free_price }}</span>
        <span class="discount-rate">{{ product.free_rate }}%</span>
      </h2>
      <p class="discount-info">쿠폰 사용 시 최대 할인 금액 <span class="coupon-price">{{ formatPrice(productoption.couponPrice) }}</span></p>

      <!-- ✅ 혜택 정보 -->
      <div class="benefits">
        <p><strong>카드혜택</strong>: {{ productoption.cardBenefit }}</p>
        <p><strong>멤버십혜택</strong>: {{ productoption.membershipBenefit }}</p>
        <p><strong>배송예상</strong>: {{ productoption.shipping }}</p>
      </div>

      <!-- ✅ 옵션 선택 -->
      <div class="options">
        <h3>옵션을 선택해주세요</h3>
        <div class="color-options">
          <img v-for="(item,index) in optionimgblob"
             :key="index"
             :src="item"
             class="color-box"
             @click="selectOption(index)"
            :class="{ selected: selectedoptionindex === index }"
          />
        </div>  
      </div>

      <!-- ✅ 사이즈 선택 -->
      <div class="size-selection">
        <h3>사이즈 선택</h3>
        <button
          v-for="(size, index) in productoption.sizes"
          :key="index"
          class="size-btn"
          @click="selectSize(size)"
          :class="{ selected: selectedSize === size }"
        >
          {{ size }}
        </button>
      </div>

      <button class="buy-btn">내 사이즈 찾기</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, onBeforeUnmount, ref } from "vue";
import axios from "axios";

// ✅ 부모 컴포넌트에서 상품 데이터를 전달받음
const props = defineProps({
  product: Object, // ✅ 객체 형태로 상품 정보 받기
  imagenames: Array,
  imagenamesurl: Array,
});

// ✅ 상품 데이터
const productoption = ref({
  couponPrice: 31500,
  cardBenefit: "무이자 혜택",
  membershipBenefit: "등급별 혜택 보기",
  shipping: "부분 오늘출발 가능",
  sizes: ["S(미니)", "M(미니)", "S(미디) +6,000", "M(미디) +6,000"],
});

const selimg = ref(0);
let optionimagenames = [];
const optionimgblob = ref([]);

const prevImage = () => {  
     selimg.value === 0 ? selimg.value = 0 : selimg.value -= 1;
}

const nextImage = () => {
    selimg.value === props.imagenamesurl.length - 1 ? selimg.value = props.imagenamesurl.length - 1 : selimg.value += 1;
}

const selectimg = (index) => {
  selimg.value = index;
}


// ✅ 선택된 이미지, 색상, 사이즈
const selectedoptionindex = ref(0);
const selectedSize = ref(null);


// ✅ 옵션 선택 함수
const selectOption = (index) => {
  selectedoptionindex.value = index;
};

const selectSize = (size) => {
  selectedSize.value = size;
};

// ✅ 가격 형식 변환 함수
const formatPrice = (price) => {
  return price.toLocaleString() + "원";
};

onMounted(() => {
  searchImageList()
});

// ✅ 이미지 목록 API 호출
const searchImageList = async () => {
  try {
    const param = new URLSearchParams();
    param.append("product_no", props.product.product_no);
    param.append("type", "2");

    const response = await axios.post("/shopping/imagelist", param);
    optionimagenames = [...response.data.imagelist];

    if (optionimagenames.length > 0) {
       readImageBlob();
    }
  } catch (error) {
    console.error("이미지 목록 불러오기 오류:", error);
  }
};

// ✅ 이미지 바이너리 데이터 불러오기
const readImageBlob = async () => {
  for (const item of optionimagenames) {
    try {
      const param = new URLSearchParams();
      param.append("product_no", props.product.product_no);
      param.append("type", "2");
      param.append("file_name", item.file_name);

      const response = await axios({
        url: "/shopping/imageblob",
        data: param,
        method: "POST",
        responseType: "blob",
      });

      // ✅ Blob 데이터를 사용하여 파일 URL 생성
      let fileURL = URL.createObjectURL(new Blob([response.data]));
      optionimgblob.value.push(fileURL);
    } catch (error) {
      console.error("이미지 불러오기 오류:", error);
    }
  }
};
</script>

<style scoped>
/* ✅ 전체 레이아웃 */
.product-detail {
  display: flex;
  max-width: 1200px;
  margin: auto;
}

.product-name {
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
}

/* ✅ 상품 이미지 슬라이드 */
.product-images {
  flex: 1;
  margin-right: 20px;
}

.main-image {
  position: relative;
  width: 100%;
  text-align: center;
}

.main-image img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.main-image button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.thumbnail-list img {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  cursor: pointer;
}

.thumbnail-list img.active {
  border: 2px solid red;
}

/* ✅ 상품 정보 */
.product-info {
  flex: 1;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
}

/* ✅ 가격 */
.product-price {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.original-price {
  text-decoration: line-through;
  color: gray;
  font-size: 18px;
}

.discounted-price {
  color: red;
  font-size: 24px;
  font-weight: bold;
}

.discount-rate {
  color: #ff6b6b;
  font-size: 20px;
}

/* ✅ 옵션 선택 */
.color-options {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.color-box {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid transparent;
}

.color-box.selected {
  border-color: black;
}

/* ✅ 사이즈 선택 */
.size-btn {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
  border-radius: 5px;
}

.size-btn.selected {
  background: #ff6b6b;
  color: white;
}

/* ✅ 구매 버튼 */
.buy-btn {
  width: 100%;
  background: #ff6b6b;
  color: white;
  padding: 15px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 5px;
}
</style>
