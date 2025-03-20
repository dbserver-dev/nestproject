<template>
  <div id="comnCodMgr">
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
              <div id="searchArea" class="d-flex justify-content-around">
                <select
                  id="selcount"
                  name="selcount"
                  style="width: 10%"
                  v-model="searchdata.selcount"
                  @change="searchaction"
                >
                  <option value="10">전체</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </select>

                제목
                <input
                  type="text"
                  id="stitle"
                  name="stitle"
                  style="width: 10%"
                  class="form-control"
                  v-model="searchdata.stitle"
                />
                등록일자
                <input
                  type="date"
                  id="ssdate"
                  name="ssdate"
                  style="width: 15%"
                  class="form-control"
                  v-model="searchdata.ssdate"
                />
                ~
                <input
                  type="date"
                  id="sedate"
                  name="sedate"
                  style="width: 15%"
                  class="form-control"
                  v-model="searchdata.sedate"
                />

                <span class="fr">
                  <a
                    class="btn btn-primary mx-2"
                    id="searchGrpcod"
                    name="btnSearch"
                    @click="searchaction"
                  >
                    <span>검 색</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="newreg">
                    <span>신규</span>
                  </a>
                  <a
                    class="btn btn-primary mx-2"
                    name="btnNew"
                    @click="filenewreg"
                  >
                    <span>파일신규</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="excel">
                    <span>excel</span>
                  </a>
                </span>
              </div>
            </td>
          </tr>
        </table>
      </span>
    </p>

    <div class="divnotice">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="6%" />
          <col width="74%" />
          <col width="20%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">제목</th>
            <th scope="col">등록일자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="listdata.totalcnt == 0">
            <td colspan="3">조회된 데이터가 없습니다.</td>
          </tr>
          <template v-else>
            <tr v-for="item in listdata.listitem" :key="item.noticeNo">
              <td @click="detailviewfile(item.noticeNo)">
                {{ item.noticeNo }}
              </td>
              <td @click="detailview(item.noticeNo)">{{ item.noticeTitle }}</td>
              <td>{{ item.noticeRegdate }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div id="noticePagination">
      <paginate
        class="justify-content-center"
        v-model="pgaeinfo.currentpage"
        :page-count="page()"
        :page-range="5"
        :margin-pages="0"
        :click-handler="dataseachfunc"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>
    <div>
      <Comcombo
        groupcode="industryCD"
        selectid="testsel"
        type="all"
        selvalue=""
        eventid="testselevent"
        v-model="comcombover.selcombovar"
      />
      <a class="btn btn-primary mx-2" name="btnNew" @click="selvarcheck">
        <span>확인</span>
      </a>
      <a class="btn btn-primary mx-2" name="btnNew" @click="changesel">
        <span>변경</span>
      </a>
      <Comcombo
        groupcode="workCD"
        selectid="testselworkCD"
        type="all"
        selvalue=""
        eventid="testseleventworkCD"
        v-model="comcombover.selcombovarworkCD"
      />
      <a class="btn btn-primary mx-2" name="btnNew" @click="pdf">
        <span>pdf</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { openModal } from "jenesius-vue-modal";
import Samplepage1popup from "./Samplepage1popup.vue";
import Samplepage1popupfile from "./Samplepage1popupfile.vue";
import Paginate from "vuejs-paginate-next";
import Comcombo from "@/components/common/ComCombo.vue";
import { inject } from "vue";

// Inject the emitter from global properties
const emitter = inject("emitter");

const searchdata = ref({
  stitle: "",
  ssdate: "",
  sedate: "",
  selcount: "10",
});

const listdata = ref({
  listitem: [],
  totalcnt: 0,
});

const comcombover = ref({
  selcombovarworkCD: "",
  selcombovar: "",
});

const pgaeinfo = {
  currentpage: 1,
  pagesize: 10,
};

const popupinfi = {
  action: "",
  poptitle: "",
  modinoticeno: 0,
  returnval: "",
};

const popupreturn = (returnval) => {
  console.log("popupreturn : " + returnval);
  popupinfi.returnval = returnval;
};

const selvarcheck = () => {
  alert(comcombover.value.selcombovar);
};
const changesel = () => {
  comcombover.value.selcombovar = "F41";

  // emitter가 잘 주입되는지 확인
  console.log(emitter);

  // emitter가 undefined가 아니라면 emit 이벤트 발생

  if (emitter) {
    emitter.emit("testselevent", "F41");
    emitter.emit("testseleventworkCD", "W13");
  } else {
    console.error("Emitter가 주입되지 않았습니다.");
  }
};

const searchaction = () => {
  pgaeinfo.currentpage = 1;

  dataseachfunc();
};

const dataseachfunc = async () => {
  let params = new URLSearchParams();
  params.append("stitle", searchdata.value.stitle);
  params.append("ssdate", searchdata.value.ssdate);
  params.append("sedate", searchdata.value.sedate);
  params.append("currentpage", pgaeinfo.currentpage);
  params.append("pagesize", searchdata.value.selcount);

  await axios
    .post("/system/noticeListvue.do", params)
    .then((response) => {
      console.log(JSON.stringify(response));

      listdata.value.listitem = response.data.listdate;
      listdata.value.totalcnt = response.data.totalcnt;
    })
    .catch(function (error) {
      alert("에러! API 요청에 오류가 있습니다. " + error);
    });
};

const page = () => {
  let total = listdata.value.totalcnt;
  let page = searchdata.value.selcount;
  let xx = total % page;
  let result = parseInt(total / page);

  if (xx == 0) {
    return result;
  } else {
    result = result + 1;
    return result;
  }
};

const excel = () => {
  let params = new URLSearchParams();
  params.append("stitle", searchdata.value.stitle);
  params.append("ssdate", searchdata.value.ssdate);
  params.append("sedate", searchdata.value.sedate);

  axios({
    url: "/system/noticeexcelDown.do", // File URL Goes Here
    data: params,
    method: "POST",
    responseType: "blob",
  }).then((res) => {
    console.log(res);
    console.log(res.data);
    let FILE = window.URL.createObjectURL(new Blob([res.data]));
    let docUrl = document.createElement("a");
    docUrl.href = FILE;
    docUrl.setAttribute("download", "listexcel.xlsx");
    document.body.appendChild(docUrl);
    docUrl.click();
    //console.log('FILE : ' + FILE);
  });
};

const pdf = () => {
  let params = new URLSearchParams();
  params.append("stitle", searchdata.value.stitle);
  params.append("ssdate", searchdata.value.ssdate);
  params.append("sedate", searchdata.value.sedate);

  axios({
    url: "/system/noticepdfDown.do", // File URL Goes Here
    data: params,
    method: "POST",
    responseType: "blob",
  }).then((res) => {
    console.log(res);
    console.log(res.data);
    let FILE = window.URL.createObjectURL(new Blob([res.data]));
    let docUrl = document.createElement("a");
    docUrl.href = FILE;
    docUrl.setAttribute("download", "Noticepdf.pdf");
    document.body.appendChild(docUrl);
    docUrl.click();
    //console.log('FILE : ' + FILE);
  });
};

const newreg = () => {
  popupinfi.action = "I";
  popupinfi.poptitle = "공지사항 등록";

  opendtlpopup("N");
};

const detailview = (no) => {
  popupinfi.action = "U";
  popupinfi.poptitle = "공지사항 수정";
  popupinfi.modinoticeno = no;

  opendtlpopup("N");
};

const opendtlpopup = async (otype) => {
  if (otype === "N") {
    const popupvar = await openModal(Samplepage1popup, {
      title: popupinfi.poptitle,
      pnoticeNo: popupinfi.modinoticeno,
      action: popupinfi.action,
      retrunval: popupreturn,
    });

    popupvar.onclose = () => {
      console.log("Close!!!!!  : " + popupinfi.returnval);

      if (popupinfi.returnval === "Y") {
        dataseachfunc();
      }
    };
  } else {
    const popupvar = await openModal(Samplepage1popupfile, {
      title: popupinfi.poptitle,
      pnoticeNo: popupinfi.modinoticeno,
      action: popupinfi.action,
      retrunval: popupreturn,
    });

    popupvar.onclose = () => {
      console.log("Close!!!!!  : " + popupinfi.returnval);

      if (popupinfi.returnval === "Y") {
        dataseachfunc();
      }
    };
  }
};

//////////////////////////////////////////////////////////
////////////////// file ///////////////

const filenewreg = () => {
  popupinfi.action = "I";
  popupinfi.poptitle = "공지사항 등록";

  opendtlpopup("F");
};

const detailviewfile = (no) => {
  popupinfi.action = "U";
  popupinfi.poptitle = "공지사항 수정";
  popupinfi.modinoticeno = no;

  opendtlpopup("F");
};

onMounted(() => {
  console.log("Sample page3 Start !!!!!!!!!!");
  dataseachfunc();
});
</script>
