<template>
  <div>
    <dl
      id="userinfoWrap"
      :style="edititem.divuserinfo ?? true ? 'display: block' : 'display: none'"
    >
      <dd class="content"></dd>
      <!-- 배경 이미지 설정 -->
      <div class="userinfo-bg"></div>
      <!-- s : 여기에 내용입력 -->
      <table id="userinfo" style="width: 800px">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="100px" />
          <col width="*" />
          <col width="100px" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <td colspan="4" class="text-center">
              <div class="my-4">
                <strong style="font-size: 30px">{{ props.title }}</strong>
              </div>
            </td>
          </tr>
          <tr v-if="action === 'I'">
            <th scope="row">로그인ID <span class="font_red">*</span></th>
            <td>
              <input
                type="text"
                class="form-control"
                name="loginID"
                id="loginID"
                v-model="edititem.loginID"
              />
              <a class="btn btn-danger mx-2" @click="duplicationcheck">
                <span>중복확인</span>
              </a>
            </td>
            <th scope="row">비밀번호 <span class="font_red">*</span></th>
            <td>
              <input
                type="text"
                class="form-control"
                name="password"
                id="password"
                v-model="edititem.password"
              />
            </td>
          </tr>
          <tr v-else>
            <th scope="row">로그인ID <span class="font_red">*</span></th>
            <td>
              <input
                type="text"
                class="form-control"
                name="loginID"
                id="loginID"
                readonly
                v-model="edititem.loginID"
              />
            </td>
            <th scope="row">비밀번호 <span class="font_red">*</span></th>
            <td>
              <input
                type="text"
                class="form-control"
                name="password"
                id="password"
                v-model="edititem.password"
              />
            </td>
          </tr>
          <tr>
            <th scope="row">이름<span class="font_red">*</span></th>
            <td>
              <input
                type="text"
                class="form-control"
                name="username"
                id="username"
                v-model="edititem.username"
              />
            </td>
            <th scope="row">사용자 구분<span class="font_red">*</span></th>
            <td>
              <Comcombo
                groupcode="usertype"
                selectid="user_type"
                type="sel"
                :selvalue="edititem.user_type"
                eventid="usertypeevent"
                v-model="edititem.user_type"
              />
            </td>
          </tr>
          <tr>
            <th scope="row">성별</th>
            <td>
              <select id="sex" name="sex" v-model="edititem.sex">
                <option value="">선택</option>
                <option value="M">남자</option>
                <option value="W">여자</option>
              </select>
            </td>
            <th scope="row">핸드폰</th>
            <td>
              <input
                type="text"
                class="form-control"
                name="hp"
                id="hp"
                placeholder="000-0000-0000"
                @input="phonemask"
                v-model="edititem.hp"
              />
            </td>
          </tr>
          <tr>
            <th scope="row">지역</th>
            <td>
              <Comcombo
                groupcode="areacd"
                selectid="loc"
                type="sel"
                :selvalue="edititem.loc"
                eventid="locevent"
                v-model="edititem.loc"
              />
            </td>
            <th scope="row">생년월일</th>
            <td>
              <input
                type="date"
                class="form-control"
                name="birthday"
                id="birthday"
                v-model="edititem.birthday"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- e : 여기에 내용입력 -->
      <div
        class="btn_areaC mt30"
        id="userother"
        :style="edititem.divsel ?? false ? 'display: block' : 'display: none'"
      >
        <!-- 배경 이미지 설정 -->
        <div class="userinfo-bg"></div>
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
        Hidden DIV !!!!!!!!!!!!<br />
      </div>
    </dl>
    <dl id="userinfobutton">
      <div class="btn_areaC mt30">
        <a class="btn btn-primary" id="btnSaveGrpCod" name="btn" @click="save">
          <span>저장</span>
        </a>
        <a
          class="btn btn-danger mx-2"
          v-show="edititem.delflag"
          @click="deleteusetinfo"
        >
          <span>삭제</span>
        </a>
        <a class="btn btn-info mx-2" @click="closeopopup">
          <span>닫기</span>
        </a>
        <a class="btn btn-info mx-2" @click="downloadPDF"> <span>PDF</span> </a
        >>
      </div>
    </dl>
  </div>
</template>
<script setup>
import { defineProps, inject, onMounted, ref } from "vue";
import { closeModal } from "jenesius-vue-modal";
import Comcombo from "@/components/common/ComCombo.vue";
import axios from "axios";
import { getCurrentInstance } from "vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const { appContext } = getCurrentInstance();
const $emptyValidation = appContext.config.globalProperties.$emptyValidation;

const emitter = inject("emitter");

const props = defineProps({
  title: String,
  loginid: String,
  action: String,
  retrunval: Function,
});

const edititem = ref({
  loginID: "",
  password: "",
  username: "",
  user_type: "",
  sex: "",
  hp: "",
  loc: "",
  birthday: "",
  delflag: false,
  duplate: "N",
  divuserinfo: true,
  divsel: false,
});

const closeopopup = () => {
  closeModal(this);
};

const save = () => {
  if (edititem.value.duplate === "N") {
    alert("Login ID 중복 체크 해주세요");
    return;
  }

  edititem.value.action = props.action;

  let checkitem = [
    {
      checkval: edititem.value.loginID,
      checkmsg: "로그인 ID를 입력해 주세요.",
    },
    {
      checkval: edititem.value.password,
      checkmsg: "비밀번호를 입력해 주세요.",
    },
    { checkval: edititem.value.username, checkmsg: "이름를 입력해 주세요." },
    {
      checkval: edititem.value.user_type,
      checkmsg: "사용자 구분를 입력해 주세요.",
    },
  ];

  if (!$emptyValidation(checkitem)) {
    return;
  }

  // 입력값에 대한 Validation
  // save axois, back

  saveproc();
};

const deleteusetinfo = () => {
  edititem.value.action = "D";
  saveproc();
};

const saveproc = () => {
  /*
  let params = new URLSearchParams();
  params.append("loginID", edititem.value.loginID);
  params.append("password", edititem.value.password);
  params.append("username", edititem.value.username);
  params.append("user_type", edititem.value.user_type);
  params.append("sex", edititem.value.sex);
  params.append("hp", edititem.value.hp);
  params.append("loc", edititem.value.loc);
  params.append("birthday", edititem.value.birthday);
  params.append("action", edititem.value.action);
  */

  const params = new URLSearchParams(edititem.value);

  axios
    .post("/usermgr/saveuserinfo.do", params)
    .then((response) => {
      console.log(response);

      if (response.data.result === "Y") {
        alert(response.data.resultmsg);

        props.retrunval("Y");

        closeopopup();
      } else {
        alert(response.data.resultmsg);
      }
    })
    .catch(function (error) {
      alert("에러! API 요청에 오류가 있습니다. " + error);
    });
};

const phonemask = (e) => {
  let input = e.target.value.replace(/\D/g, ""); // 정규식을 사용해 숫자가 아닌 문자를 제거

  if (input.length <= 3) {
    edititem.value.hp = input;
  } else if (input.length <= 7) {
    edititem.value.hp = input.slice(0, 3) + "-" + input.slice(3); // "000-0000" 형식으로 변환
  } else {
    edititem.value.hp =
      input.slice(0, 3) + "-" + input.slice(3, 7) + "-" + input.slice(7, 11); // "000-0000-0000" 형식으로 변환
  }
};

const duplicationcheck = () => {
  const params = new URLSearchParams();
  params.append("loginID", edititem.value.loginID);

  axios
    .post("/usermgr/loginidcheck.do", params)
    .then((response) => {
      edititem.value.duplate = "Y";
      console.log(response);

      if (response.data.count > 0) {
        alert(edititem.value.loginID + " 가 중복 되었습니다.");
      } else {
        alert(edititem.value.loginID + " 가 사용 가능 합니다.");
      }
    })
    .catch(function (error) {
      alert("에러! API 요청에 오류가 있습니다. " + error);
    });
};

onMounted(() => {
  edititem.value.divuserinfo = true;
  edititem.value.divsel = false;

  if (props.action === "U") {
    const params = new URLSearchParams();
    params.append("loginid", props.loginid);

    axios
      .post("/usermgr/selectuserinfo.do", params)
      .then((response) => {
        const userinfo = response.data.userinfo;

        edititem.value = JSON.parse(JSON.stringify(userinfo));
        edititem.value.delflag = true;
        edititem.value.username = userinfo.name;
        edititem.value.duplate = "N";

        const celvalueusertype = userinfo.user_type || "";
        const celvalueloc = userinfo.loc || "";
        edititem.value.sex = userinfo.sex || "";

        console.log("Location: ", celvalueloc, "User Info: ", userinfo);
        console.log("Edit Item: ", edititem.value);

        // 이벤트 발생
        emitter.emit("usertypeevent", celvalueusertype);
        emitter.emit("locevent", celvalueloc);
      })
      .catch((error) => {
        alert("에러! API 요청에 오류가 있습니다. " + error);
      });
  }
});

/*
const displaydiv = () => {
  if (edititem.value.divsel) {
    edititem.value.divsel = false;
  } else {
    edititem.value.divsel = true;
  }

  //alert(edititem.value.divsel);
};
*/
const downloadPDF = async () => {
  edititem.value.divsel = true;

  const pdf = new jsPDF("p", "mm", "a4");
  // 첫 번째 인자 ("p")	"p" 또는 "l"	PDF 페이지의 방향(Orientation)
  // 두 번째 인자 ("mm")	"mm", "cm", "in", "px"	단위(Unit)
  // 세 번째 인자 ("a4")	"a3", "a4", "a5", "letter", "legal"	페이지 크기(Page Size)

  const imgWidth = 210; // A4 가로 크기

  const element = document.getElementById("userinfoWrap");
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const imgHeight = (canvas.height * imgWidth) / canvas.width; // 비율 맞추기

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  pdf.addPage();

  const element2 = document.getElementById("userother");
  const canvas2 = await html2canvas(element2, { scale: 2 });
  const imgData2 = canvas2.toDataURL("image/png");
  const imgHeight2 = (canvas2.height * imgWidth) / canvas2.width; // 비율 맞추기

  pdf.addImage(imgData2, "PNG", 0, 0, imgWidth, imgHeight2);

  pdf.save("userinfoWrap.pdf");

  edititem.value.divsel = false;
};
</script>

<style>
#userinfo {
  border-collapse: separate;
  border-spacing: 20px;
}
#userinfoWrap {
  background-color: #fff;
  padding: 3rem;
  border-radius: 10px;
  border: 2px solid rgb(59, 59, 59);
}

/* 배경 이미지 */
.userinfo-bg {
  position: absolute;
  top: 10;
  left: 200;
  width: 65%;
  height: 65%;
  background-image: url("@/assets/images/foobao.jpg"); /* 배경 이미지 */
  background-size: cover;
  opacity: 0.3; /* 투명도 30% */
  filter: blur(1px); /* 흐리게 처리 (값이 클수록 더 흐림) */
  z-index: 1;
  pointer-events: none; /* ✅ 배경이 클릭 이벤트를 막지 않도록 설정 */
}
</style>
