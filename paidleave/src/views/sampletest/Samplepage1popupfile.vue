<template>
  <div>
    <form id="regform">
      <dl id="grpInfoWrap">
        <dd class="content"></dd>
        <!-- s : 여기에 내용입력 -->
        <table id="grpInfo" style="width: 800px">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="60px" />
            <col width="*" />
            <col width="60px" />
            <col width="*" />
          </colgroup>

          <tbody>
            <tr>
              <td colspan="4" class="text-center">
                <div class="my-4">
                  <strong style="font-size: 30px">{{ title }}</strong>
                </div>
              </td>
            </tr>
            <tr v-if="paction === 'U' || paction === 'D'">
              <th scope="row">번호 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="form-control"
                  name="noticeNo"
                  id="noticeNo"
                  readonly
                  v-model="noticeNo"
                />
              </td>
              <th scope="row">작성자</th>
              <td>
                <input
                  type="text"
                  class="form-control"
                  name="loginName"
                  id="loginName"
                  readonly
                  v-model="loginName"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">제목<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="form-control"
                  name="noticeTitle"
                  id="noticeTitle"
                  v-model="noticeTitle"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">내용<span class="font_red">*</span></th>
              <td colspan="3">
                <textarea
                  name="noticeContent"
                  id="noticeContent"
                  v-model="noticeContent"
                ></textarea>
              </td>
            </tr>
            <tr>
              <th scope="row">파일</th>
              <td>
                <input
                  type="file"
                  id="upfiletag"
                  name="upfiletag"
                  @change="newpreview"
                />
                <br />
                <template v-if="checkshow">
                  파일 유지
                  <input
                    type="checkbox"
                    id="checkyn"
                    name="checkyn"
                    true-value="Y"
                    false-value="N"
                    v-model="checkyn"
                  />
                </template>
              </td>
              <td colspan="2">
                <div
                  id="preview"
                  v-html="previewhtml"
                  @click="download('D')"
                ></div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a
            class="btn btn-primary"
            id="btnSaveGrpCod"
            name="btn"
            @click="save"
          >
            <span>저장</span>
          </a>
          <a class="btn btn-danger mx-2" v-show="delshow" @click="noticedelete">
            <span>삭제</span>
          </a>
          <a class="btn btn-info mx-2" @click="closeopopup">
            <span>닫기</span>
          </a>
        </div>
      </dl>
    </form>
  </div>
</template>

<script>
import { closeModal } from "jenesius-vue-modal";

export default {
  props: {
    title: String,
    pnoticeNo: Number,
    action: String,
    retrunval: Function,
  },
  beforeModalClose() {
    this.retrunval(this.saveyn);
  },
  data: function () {
    return {
      noticeNo: this.pnoticeNo,
      paction: this.action,
      loginId: "",
      noticeTitle: "",
      noticeContent: "",
      noticeRegdate: "",
      loginName: "",
      delshow: true,
      saveyn: "N",
      previewhtml: "",
      filename: "",
      checkshow: false,
      checkyn: "Y",
    };
  },
  mounted() {
    if (this.paction === "I") {
      console.log(this.paction);
      this.delshow = false;
    } else {
      this.delshow = true;

      let params = new URLSearchParams();
      params.append("noticeNo", this.noticeNo);

      this.axios
        .post("/system/noticeDetail", params)
        .then((response) => {
          console.log(JSON.stringify(response));

          this.loginName = response.data.noticeDetail.loginName;
          this.noticeTitle = response.data.noticeDetail.noticeTitle;
          this.noticeContent = response.data.noticeDetail.noticeContent;

          //response.data.result.file_name
          //response.data.result.logical_path
          //response.data.result.phygical_path
          //response.data.result.file_size
          //response.data.result.file_ext

          if (
            response.data.noticeDetail.file_name === "" ||
            response.data.noticeDetail.file_name === null
          ) {
            this.previewhtml = "";
            this.checkshow = false;
          } else {
            this.filename = response.data.noticeDetail.file_name;
            this.checkshow = true;

            let ext = response.data.noticeDetail.file_ext;

            //console.log(" ext : " + ext);

            if (
              ext.toLowerCase() == "jpg" ||
              ext.toLowerCase() == "png" ||
              ext.toLowerCase() == "jpeg" ||
              ext.toLowerCase() == "gif"
            ) {
              /*
              this.previewhtml =
                "<img src='" +
                response.data.result.logical_path +
                "' id='imgFile' style='width: 100px; height: 100px;' />";
              */
              this.download("P");
            } else {
              this.previewhtml = response.data.noticeDetail.file_name;
            }
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    }
  },
  methods: {
    save: function () {
      //let vm = this;

      //let checkreturn = this.nullcheck([
      //  { checkval: this.noticeTitle, checkmsg: "제목을 입력해주세요" },
      //  { checkval: this.noticeContent, checkmsg: "내용을 입력해주세요" },
      //]);

      let checkreturn = this.$emptyValidation([
        { checkval: this.noticeTitle, checkmsg: "제목을 입력해주세요" },
        { checkval: this.noticeContent, checkmsg: "내용을 입력해주세요" },
      ]);

      if (!checkreturn) return;

      let dataWithFile = new FormData(document.getElementById("regform"));
      dataWithFile.append("action", this.paction);


      for (const [key, value] of dataWithFile.entries()) {
        console.log(`${key}:`, value);
      }


      let callurl = "";

      if (this.paction === "I") {
        callurl = "/system/insertNoticefile";
      } else if (this.paction === "U") {
        callurl = "/system/noticeUpdatefile";
      } else if (this.paction === "D") {
        callurl = "/system/noticeDelete";
      }

      this.axios
        .post(callurl, dataWithFile) 
        .then((response) => {
          console.log(JSON.stringify(response));

          if (response.data.result > 0) {
            alert(response.data.resultmsg);
            this.saveyn = "Y";
            this.closeopopup();
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    noticedelete: function () {
      this.paction = "D";
      this.save();
    },
    closeopopup: function () {
      closeModal(this);
    },
    newpreview: function (e) {
      let item = e.target;

      if (item.files[0]) {
        //alert("파일 선택 : " + item.files[0].name);

        // previewhtml

        let filename = item.files[0].name; // dsddsd.jpg    sdsds.xlsx
        var imgpath = window.URL.createObjectURL(item.files[0]);
        let extend = filename.split(".");
        let ext = extend[1].toLowerCase();

        //alert(extend[0] + " : " + extend[1] + " : " + imgpath);

        //imgpath = "/serverfile/everland1.jpg";

        if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "gif") {
          this.previewhtml =
            "<img src='" +
            imgpath +
            "' id='imgFile' style='width: 100px; height: 100px;' />";
        } else {
          this.previewhtml = filename;
        }
      } else {
        alert("파일선택 안함");
      }
    },
    download: function (dtype) {
      let params = new URLSearchParams();
      params.append("noticeNo", this.noticeNo);

      this.axios({
        url: "/system/noticefileDetail", // File URL Goes Here
        data: params,
        method: "POST",
        responseType: "blob",
      }).then((res) => {
        console.log(res);
        console.log(res.data);
        let FILE = window.URL.createObjectURL(new Blob([res.data]));
        if (dtype === "D") {
          let docUrl = document.createElement("a");
          docUrl.href = FILE;
          docUrl.setAttribute("download", this.filename);
          document.body.appendChild(docUrl);
          docUrl.click();
        } else {
          this.previewhtml =
            "<img src='" +
            FILE +
            "' id='imgFile' style='width: 100px; height: 100px;' />";
        }

        //console.log('FILE : ' + FILE);
      });
    },
  },
  components: {},
};
</script>

<style>
#grpInfo {
  border-collapse: separate;
  border-spacing: 20px;
}
#grpInfoWrap {
  background-color: #fff;
  padding: 3rem;
  border-radius: 10px;
  border: 2px solid rgb(59, 59, 59);
}
</style>
