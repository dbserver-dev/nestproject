<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">기준정보</span>
      <span class="btn_nav bold">사용자 관리 / </span>
      <router-link to="/dashboard/sampletest/samplepage1">새로고침</router-link>
    </p>

    <p class="conTitle">
      <span>사용자 관리</span>
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
              <div id="searchArea" class="d-flex justify-content-around">
                사용자타입
                <select
                  id="susertype"
                  name="susertype"
                  v-model="searcharea.susertype"
                >
                  <option value="">전체</option>
                  <option value="A">관리자</option>
                  <option value="B">사용자</option>
                </select>
                이름
                <input
                  type="text"
                  id="sname"
                  name="sname"
                  style="width: 15%"
                  class="form-control"
                  v-model="searcharea.sname"
                />
                등록일자
                <input
                  type="date"
                  id="ssdate"
                  name="ssdate"
                  style="width: 15%"
                  class="form-control"
                  v-model="searcharea.ssdate"
                />
                ~
                <input
                  type="date"
                  id="sedate"
                  name="sedate"
                  style="width: 15%"
                  class="form-control"
                  v-model="searcharea.sedate"
                />

                <span class="fr">
                  <a
                    class="btn btn-primary mx-2"
                    id="searchGrpcod"
                    name="btnSearch"
                    @click="searchdata"
                  >
                    <span>검 색</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="newreg">
                    <span>신규</span>
                  </a>
                </span>
              </div>
            </td>
          </tr>
        </table>
      </span>
    </p>

    <div class="divuser">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">LoginID</th>
            <th scope="col">이름</th>
            <th scope="col">사용자타입</th>
            <th scope="col">휴대폰</th>
            <th scope="col">가입일자</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="dataarea.totalcnt == 0">
            <tr>
              <td colspan="5">조회된 데이터가 없습니다.</td>
            </tr>
          </template>
          <template v-else>
            <template v-for="item in dataarea.listdate" :key="item.loginID">
              <tr @click="modufy(item.loginID)">
                <td>{{ item.loginID }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.user_type }}</td>
                <td>{{ item.hp }}</td>
                <td>{{ item.regdate }}</td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    <div id="userPagination">
      <paginate
        class="justify-content-center"
        v-model="searcharea.currentpage"
        :page-count="page()"
        :page-range="5"
        :margin-pages="0"
        :click-handler="searchdata"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Paginate from "vuejs-paginate-next";
import { openModal } from "jenesius-vue-modal";
import axios from "axios";
import Samplepage5popup from "./Samplepage5popup.vue";

const searcharea = ref({
  susertype: "",
  sname: "",
  ssdate: "",
  sedate: "",
  currentpage: 1,
  pagesize: 10,
});

const dataarea = ref({
  listdate: [],
  totalcnt: 0,
});

const popupparam = ref({
  action: "",
  loginid: "",
  title: "",
  saveyn: "N",
});

const searchdata = async () => {
  let params = new URLSearchParams();
  params.append("susertype", searcharea.value.susertype);
  params.append("sname", searcharea.value.sname);
  params.append("ssdate", searcharea.value.ssdate);
  params.append("sedate", searcharea.value.sedate);
  params.append("currentpage", searcharea.value.currentpage);
  params.append("pagesize", searcharea.value.pagesize);

  await axios
    .post("/usermgr/userListvue.do", params)
    .then((response) => {
      console.log(response);

      dataarea.value.listdate = response.data.listdate;
      dataarea.value.totalcnt = response.data.totalcnt;
    })
    .catch(function (error) {
      alert("에러! API 요청에 오류가 있습니다. " + error);
    });
};

const page = () => {
  let total = dataarea.value.totalcnt;
  let page = searcharea.value.pagesize;
  let xx = total % page;
  let result = parseInt(total / page);

  if (xx == 0) {
    return result;
  } else {
    result = result + 1;
    return result;
  }
};

const popupreturn = (param) => {
  popupparam.value.saveyn = param;
};

const newreg = () => {
  // 타이틀
  // 등록,수정
  // 수정할 loginid
  // 리턴 함수

  popupparam.value.action = "I";
  popupparam.value.loginid = "";
  popupparam.value.title = "사용자 등록";

  openpopup();
};

const modufy = (loginid) => {
  popupparam.value.action = "U";
  popupparam.value.loginid = loginid;
  popupparam.value.title = "사용자 수정";

  openpopup();
};

const openpopup = async () => {
  const popupvar = await openModal(Samplepage5popup, {
    title: popupparam.value.title,
    loginid: popupparam.value.loginid,
    action: popupparam.value.action,
    retrunval: popupreturn,
  });

  popupvar.onclose = () => {
    console.log("Close!!!!!  : " + popupparam.value.saveyn);

    if (popupparam.value.saveyn === "Y") {
      searchdata();
    }
  };
};

onMounted(() => {
  searchdata();
});
</script>
