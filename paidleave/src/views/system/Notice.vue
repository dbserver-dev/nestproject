<template>
  <div id="notice">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">기준정보</span>
      <span class="btn_nav bold">공지사항 관리</span>
      <a href="../system/noticeList.do" class="btn_set refresh">새로고침</a>
    </p>
    <p class="conTitle">
      <span>공지사항</span>
      <span>
        <table
          style="border: 1px #50bcdf"
          width="100%"
          cellpadding="5"
          cellspacing="0"
          border="1"
          align="left"
        >
          <tr style="border: 0px; border-color: blue">
            <td
              width="50"
              height="25"
              style="font-size: 100%; text-align: left"
            >
              <div
                id="searchArea"
                class="d-flex justify-content-around mb-2 mt-2"
              >
                <select
                  id="searchKey"
                  class="form-select"
                  style="width: 150px; height: 38px"
                  v-model="searchKey"
                >
                  <option value="all">전체</option>
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                </select>

                <input
                  type="text"
                  style="width: 200px"
                  class="form-control"
                  v-model="sname"
                />
                <input
                  type="date"
                  style="width: 15%"
                  class="form-control"
                  v-model="fromDate"
                />
                ~
                <input
                  type="date"
                  style="width: 15%"
                  class="form-control"
                  v-model="toDate"
                />
                <span class="fr">
                  <a
                    @click="searchList()"
                    class="btn btn-primary mx-2"
                    id="btnSearchNotice"
                    name="btn"
                  >
                    <span>검 색</span>
                  </a>
                  <a
                    class="btn btn-primary mx-2"
                    @click="newReg()"
                    name="modal"
                  >
                    <span>신규등록</span>
                  </a>
                </span>
              </div>
            </td>
          </tr>
        </table>
      </span>
    </p>
    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="10%" />
          <col width="50%" />
          <col width="30%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">제목</th>
            <th scope="col">작성일</th>
            <th scope="col">작성자</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCount == 0">
            <tr>
              <td colspan="7">일치하는 검색 결과가 없습니다</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="item in items" :key="item.noticeNo">
              <td>{{ item.noticeNo }}</td>
              <td id="groupTitle" @click="searchDetail(item.noticeNo)">
                {{ item.noticeTitle }}
              </td>
              <td>{{ item.noticeRegdate }}</td>
              <td>{{ item.loginId }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :key="1">
          <button
            type="button"
            class="page-link"
            v-if="currentBlock > 1"
            @click="clickPrevPage"
          >
            이전
          </button>
        </li>
        <template
          v-for="(pageNumber, index) in Array(blockSize).fill(startPage)"
        >
          <li
            :class="
              pageNumber + index == currentPage ? 'pageItem active' : 'pageItem'
            "
            v-if="pageNumber + index <= totalPage"
            :key="pageNumber"
          >
            <button
              class="page-link"
              @click="clickPageNumber(pageNumber + index)"
            >
              {{ pageNumber + index }}
            </button>
          </li>
        </template>
        <li class="page-item" :key="totalPage + 1">
          <button
            type="button"
            class="page-link"
            v-if="currentBlock != lastBlock"
            @click="clickNextPage"
          >
            다음
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import NoticeDetailModal from "@/components/system/NoticeDetailModal.vue";

export default {
  data: function () {
    return {
      items: [],
      noticeNo: "",
      currentPage: 1,
      pageSize: 5,
      blockSize: 5,
      totalPage: 0,
      totalCount: 0,
      startPage: 1,
      currentBlock: 0,
      lastBlock: 0,
      searchKey: "all",
      sname: "",
      action: "",
      fromDate: "",
      toDate: "",
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    searchList() {
      let vm = this;

      let params = new URLSearchParams();
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      params.append("option", this.searchKey);
      params.append("keyword", this.sname);
      params.append("fromDate", this.fromDate);
      params.append("toDate", this.toDate);

      this.axios
        .post("/system/noticeList.do", params)
        .then(function (response) {
          console.log(response);
          vm.totalCount = response.data.noticeCnt;
          vm.items = response.data.noticeList;
          vm.totalPage = Math.ceil(vm.totalCount / vm.pageSize);
          vm.currentBlock = Math.ceil(vm.currentPage / vm.blockSize);
          vm.lastBlock = Math.ceil(vm.totalPage / vm.blockSize);
          vm.startPage = vm.blockSize * (vm.currentBlock - 1) + 1;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    newReg() {
      this.$vbsModal.open({
        // pass your component as the whole modal content
        // you can also use the component's registered name
        content: NoticeDetailModal,
        size: 0,
        // pass custom data as props to the EditProfileComponent.
        contentProps: {
          title: "공지사항 신규",
          noticeNo: "",
          action: "N",
        },
        // pass event listeners to the EditProfileComponent.
        contentEmits: {
          onSubmit: this.onSubmitProfileForm,
        },
        center: true, // default is false
        backgroundScrolling: true, // default is false
        staticBackdrop: true, // will disable backdrop click to close modal if true
      });
    },
    searchDetail(noticeNo) {
      console.log(noticeNo);

      this.$vbsModal.open({
        // pass your component as the whole modal content
        // you can also use the component's registered name
        content: NoticeDetailModal,
        size: "0",
        // pass custom data as props to the EditProfileComponent.
        contentProps: {
          title: "공지사항 상세",
          noticeNo,
          action: "U",
        },
        // pass event listeners to the EditProfileComponent.
        contentEmits: {
          onSubmit: this.onSubmitProfileForm,
        },
        center: true, // default is false
        backgroundScrolling: true, // default is false
        staticBackdrop: false, // will disable backdrop click to close modal if true
      });
    },
    clickPrevPage() {
      this.currentPage = (this.currentBlock - 1) * this.blockSize;

      this.searchList();
    },
    clickNextPage() {
      this.currentPage = this.currentBlock * this.blockSize + 1;

      this.searchList();
    },
    clickPageNumber(pageNumber) {
      this.currentPage = pageNumber;
      this.searchList();
    },
  },
};
</script>

<style></style>
