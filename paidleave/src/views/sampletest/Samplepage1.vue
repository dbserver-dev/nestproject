<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">기준정보</span>
      <span class="btn_nav bold">공지사항 관리 / </span>
      <router-link to="/dashboard/sampletest/samplepage1">새로고침</router-link>
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
              <div id="searchArea" class="d-flex justify-content-around">
                제목
                <input
                  type="text"
                  style="width: 10%"
                  class="form-control"
                  v-model="stitle"
                />
                등록일자
                <input
                  type="date"
                  style="width: 15%"
                  class="form-control"
                  v-model="ssdate"
                />
                ~
                <input
                  type="date"
                  style="width: 15%"
                  class="form-control"
                  v-model="sedate"
                />

                <span class="fr">
                  <a
                    class="btn btn-primary mx-2"
                    id="searchGrpcod"
                    name="btnSearch"
                    @click="searchbtn"
                  >
                    <span>검 색</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="newreg">
                    <span>신규</span>
                  </a>
                  <a
                    class="btn btn-primary mx-2"
                    name="btnNew"
                    @click="newregfile"
                  >
                    <span>신규파일</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="excel">
                    <span>excel</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="pdf">
                    <span>pdf</span>
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
          <template v-if="totalcnt > 0">
            <template v-for="item in noticelist" :key="item.noticeNo">
              <tr>
                <td @click="noticemodofy(item.noticeNo)">
                  {{ item.noticeNo }}
                </td>
                <td @click="noticemodofyfile(item.noticeNo)">
                  {{ item.noticeTitle }}
                </td>
                <td>{{ item.noticeRegdate }}</td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="7">조회된 데이터가 없습니다.</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div id="noticePagination">
      <paginate
        class="justify-content-center"
        v-model="currentpage"
        :page-count="page()"
        :page-range="5"
        :margin-pages="0"
        :click-handler="searchlist"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>
    <div>
      <Comcombo
        groupcode="1"
        selectid="testsel"
        type="sel"
        selvalue=""
        eventid="testselevent"
        v-model="selcombovar"
      />
      <a class="btn btn-primary mx-2" name="btnNew" @click="selvarcheck">
        <span>확인</span>
      </a>
      <a class="btn btn-primary mx-2" name="btnNew" @click="changesel">
        <span>변경</span>
      </a>
      <Comcombo
        groupcode="2"
        selectid="testselworkCD"
        type="all"
        selvalue=""
        eventid="testseleventworkCD"
        v-model="selcombovarworkCD"
      />
    </div>
  </div>
</template>

<script>
import { openModal } from "jenesius-vue-modal";
import Samplepage1popup from "./Samplepage1popup.vue";
import Samplepage1popupfile from "./Samplepage1popupfile.vue";
import Paginate from "vuejs-paginate-next";
import Comcombo from "@/components/common/ComCombo.vue";

export default {
  data: function () {
    return {
      stitle: "",
      ssdate: "",
      sedate: "",
      noticelist: [],
      totalcnt: 0,
      pagesize: 10,
      currentpage: 1,
      modnoticeno: 0,
      action: "",
      ptitle: "",
      opoupreturn: "",
      selcombovar: "",
      selcombovarworkCD: "",
    };
  },
  mounted() {
    this.searchlist();
  },
  beforeUnmount() {
    this.emitter.off("testselevent");
    this.emitter.off("testseleventworkCD");
  },
  methods: {
    searchbtn: function () {
      this.currentpage = 1;
      this.searchlist();
    },
    searchlist: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append("stitle", this.stitle);
      params.append("ssdate", this.ssdate);
      params.append("sedate", this.sedate);
      params.append("currentpage", this.currentpage);
      params.append("pagesize", this.pagesize);

      this.axios
        .post("/system/noticeListvue.do", params)
        .then((response) => {
          console.log(response);
          console.log(JSON.stringify(response));

          vm.noticelist = response.data.listdate;
          vm.totalcnt = response.data.totalcnt;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    page: function () {
      var total = this.totalcnt;
      var page = this.pagesize;
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
    newreg: function () {
      this.action = "I";
      this.ptitle = "공지사항 등록";
      this.openpopup();
    },
    noticemodofy: function (noticeno) {
      //alert("noticemodofy : " + noticeno);
      this.action = "U";
      this.ptitle = "공지사항 수정";
      this.modnoticeno = noticeno;
      this.openpopup();
    },
    openpopup: async function () {
      const popupvar = await openModal(Samplepage1popup, {
        title: this.ptitle,
        pnoticeNo: this.modnoticeno,
        action: this.action,
        retrunval: (value) => {
          this.opoupreturn = value;
          console.log("return val : " + value);
        },
      });

      popupvar.onclose = () => {
        console.log("Close!!!!!   ");

        if (this.opoupreturn === "Y") {
          this.searchlist();
        }

        // return false;
      };

      console.log(popupvar);
    },
    returnpopup: function (flag) {
      alert(flag);
    },
    newregfile: function () {
      this.action = "I";
      this.ptitle = "공지사항 등록";
      this.openpopupfile();
    },
    noticemodofyfile: function (noticeno) {
      //alert("noticemodofy : " + noticeno);
      this.action = "U";
      this.ptitle = "공지사항 수정";
      this.modnoticeno = noticeno;
      this.openpopupfile();
    },
    openpopupfile: async function () {
      const popupvar = await openModal(Samplepage1popupfile, {
        title: this.ptitle,
        pnoticeNo: this.modnoticeno,
        action: this.action,
        retrunval: (value) => {
          this.opoupreturn = value;
          console.log("return val : " + value);
        },
      });

      popupvar.onclose = () => {
        console.log("Close!!!!!   ");

        if (this.opoupreturn === "Y") {
          this.searchlist();
        }

        // return false;
      };

      console.log(popupvar);
    },
    excel: function () {
      let params = new URLSearchParams();
      params.append("ssdate", this.ssdate);
      params.append("sedate", this.sedate);
      params.append("stitle", this.stitle);
      params.append("currentpage", 1);
      params.append("pagesize", 9999999);

      this.axios({
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
    },
    pdf: function () {
      let params = new URLSearchParams();
      params.append("stitle", this.stitle);
      params.append("ssdate", this.ssdate);
      params.append("sedate", this.sedate);
      params.append("currentpage", 1);
      params.append("pagesize", 9999999);


      this.axios({
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
    },
    selvarcheck: function () {
      alert(this.selcombovar);
    },
    changesel: function () {
      this.selcombovar = "4";

      this.emitter.emit("testselevent", "4");
      this.emitter.emit("testseleventworkCD", "4");
    },
  },
  beforeUnmount() {
    console.log("beforeUnmount ~~~~ !!!!!!!!!!");
    this.emitter.off("testselevent");
    this.emitter.off("testseleventworkCD");
  },
  components: { Paginate, Comcombo },
};
</script>

<style></style>
