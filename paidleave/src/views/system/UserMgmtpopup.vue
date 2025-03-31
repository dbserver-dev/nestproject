<template>
  <div>
    <dl id="grpInfoWrap">
      <dd class="content"></dd>
      <!-- s : 여기에 내용입력 -->
      <table id="grpInfo" style="width: 600px">
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
                <strong style="font-size: 30px">{{ title }}</strong>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">Login ID <span class="font_red">*</span></th>
            <td>
              <input
                type="text"
                class="form-control"
                name="loginID"
                id="loginID"   
                ref="loginidRef"
                :readonly="props.action === 'U' ? true : false"
                v-model="edititem.loginID"             
              />
              <button type="button" class="btn btn-primary" v-show="props.action === 'I'" @click="checkLoginID">중복확인</button>
            </td>
            <th scope="row">비밀번호<span class="font_red">*</span></th>
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
                name="name"
                id="name"
                v-model="edititem.name"
              />
            </td>
            <th scope="row">사용자 구분<span class="font_red">*</span></th>
            <td> 
              <select id="selusertype" name="selusertype" style="width: 50%" v-model="edititem.user_type">
                <option value="">전체</option>
                <option value="A">관리자</option>
                <option value="B">사용자</option>
              </select>
            </td>
          </tr>
          <tr>
            <th scope="row">성별</th>
            <td>
              <select id="selgender" name="selgender" style="width: 50%" v-model="edititem.sex">
                <option value="">전체</option>
                <option value="M">남자</option>
                <option value="W">여자</option>
              </select>
            </td>
            <th scope="row">연락처</th>
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
            <th scope="row">eMail</th>
            <td>
              <input
                type="text"
                class="form-control"
                name="email"
                id="email"
                placeholder="exsample@aaa.com"                      
                v-model="edititem.email"
              />
            </td>
            <th scope="row">우편번호</th>
            <td> 
              <input
                type="text"
                class="form-control"
                name="zipcd"
                id="zipcd"
                readonly
                v-model="edititem.zipcd"
              />
              <button type="button" class="btn btn-primary" @click="openDaumZipCode">우편번호찾기</button>
            </td>
          </tr>
          <tr>
            <th scope="row">주소</th>
            <td>
              <input
                type="text"
                class="form-control"
                name="addr"
                id="addr"
                readonly
                v-model="edititem.addr"
              />
            </td>
            <th scope="row">상세주소</th>
            <td> 
              <input
                type="text"
                class="form-control"
                name="dtladdr"
                id="dtladdr"
                v-model="edititem.dtladdr"
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
                selvalue=""
                eventid="UserMgmtpopupareacd"
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

      <div class="btn_areaC mt30">
        <a class="btn btn-primary" id="btnSaveGrpCod" name="btn" @click="save">
          <span>저장</span>
        </a>
        <a class="btn btn-danger mx-2" v-show="edititem.delshow" @click="deleteuser">
          <span>삭제</span>
        </a>
        <a class="btn btn-info mx-2" @click="closepopup">
          <span>닫기</span>
        </a>
        
      </div>
    </dl>
  </div>
</template>

<script setup>
import { closeModal, promptModal, pushModal } from "jenesius-vue-modal";
import { defineProps, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';
import DaumPostCode from "@/components/common/DaumZipCode.vue";
import { ref } from "vue"
import Comcombo from "@/components/common/ComCombo.vue";

import { inject } from "vue";
import axios from "axios";

//import path from "path-browserify"; // ✅ Webpack 5에서 정상 동작

// Inject the emitter from global properties
const emitter = inject("emitter");

const props = defineProps({
  title: String,
  action : String,
  loginid : String,
  returnprocess : Function,
});

let daumpopup = null;

const edititem = ref({
  loginID : "",
  password : "",
  name : "",
  user_type : "",
  sex : "",
  hp : "",
  email : "",
  zipcd : "",
  addr : "",
  dtladdr : "",
  loc : "",
  birthday : "",
  delshow : false,
  dupcheck : false,
});

const loginidRef = ref(null);

/*
const DaumPostCode = defineAsyncComponent({
  loader: () => import("@/components/common/DaumZipCode.vue"),
  loadingComponent: {
    template: "<p>로딩 중...</p>",
  },
  delay: 200, // 200ms 후 로딩 표시
});
*/


// console.log("src : ", path.resolve("src")); // `@` alias가 정확한 경로를 가리키는지 확인




const openDaumZipCode = async () => {
  daumpopup =  await promptModal(DaumPostCode);

  //console.log(daumpopup);
  
  // console.dir(daumpopup); // ✅ 객체의 모든 속성을 트리 형태로 출력
  /*
  console.log("Waiting for DaumPostCode to be loaded...");
  console.log("DaumPostCode:", DaumPostCode); // ✅ undefined가 아니라면 정상 import됨
  console.log("DaumPostCode type:", typeof DaumPostCode);

  const LoadedComponent = await DaumPostCode; // ✅ 비동기 컴포넌트 로드 대기

  console.log("LoadedComponent:", LoadedComponent);
  
  
  daumpopup = pushModal({
    component: LoadedComponent,
    props: {
      title: "우편번호 찾기",
    },
  });
  

  console.log("Modal instance:", daumpopup);
  */
};

const checkLoginID = () => {
  const params = {
    loginID : edititem.value.loginID,
  };

  axios
        .post("/system/usercheckLoginID.do", params)
        .then((response) => {
          console.log(response);
          
          if(response.data.result === "N") {
            alert("loginID 가 중복 되었습니다.");
            edititem.value.dupcheck = false;
          } else {
            edititem.value.dupcheck = true;
            alert("loginID 가 사용 가능 합니다.");
          }
          
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
}

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


const emailmask = () => {
  let input = edititem.value.email.trim(); // 앞뒤 공백 제거

  // ✅ 이메일 정규식: 영문, 숫자, 특수문자 조합의 이메일 형식 검사
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailRegex.test(input)) {
    edititem.value.email = input; // ✅ 유효한 이메일이면 저장
    return true;
  } else {
    // edititem.value.email = ""; // 🚨 유효하지 않으면 초기화 (또는 에러 메시지 표시 가능)
    console.error("🚨 잘못된 이메일 형식입니다.");
    return false;
  }
};

const save = (atype) => {

  let actiontype = "";

  if(typeof atype === "string") {
    actiontype = "D";
  } else {
    actiontype = "IU";
  }
  
  if(actiontype === "IU") {
    if(edititem.value.dupcheck === false) {
      alert("Login ID 중복 체크 해 주세요.");
      return;
    }

    if(!emailmask()) return;
  }

  const params = new URLSearchParams(Object.entries(edititem.value));

  if(actiontype === "IU") {
    params.append("action", props.action);
  } else {
    params.append("action", atype);
  }

  for (const [key, value] of params.entries()) {
        console.log(`${key}:`, value);
      }


  axios
        .post("/system/usersave.do", params)
        .then((response) => {
          console.log(response);
          
          if(response.data.result === "Y") {
            if(actiontype === "IU") {
              alert("저장 되었습니다.");
            } else {
              alert("삭제 되었습니다.");
            }
            
            closepopup("Y");
          } else {
            alert("저장 실패 되었습니다.");
          }
          
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });


}

const deleteuser = () => {
  save("D");
}

const closepopup = (saveyn) => {

  // console.log(saveyn, typeof saveyn);

  typeof saveyn === "string" ? props.returnprocess(saveyn) : props.returnprocess("N");

  /*
  if(typeof saveyn === "string") {
    props.returnprocess(saveyn);    
  } else {
    props.returnprocess("N");
  }
    */

  closeModal();
  
}

onMounted(() => {
  //console.log(props.title);

  loginidRef.value.focus();

  if(props.action === "I") {
    edititem.value.delshow = false;
  } else {  

    const seloneparam = {
      loginID : props.loginid,
    };

    axios
        .post("/system/userselectone.do", seloneparam)
        .then((response) => {
          console.log(response);

          if(response.data.result === "Y") {
            edititem.value = { ...edititem.value, ...response.data.userlistModel };
            edititem.value.delshow = true;
            edititem.value.dupcheck = true;

            emitter.emit("UserMgmtpopupareacd",response.data.userlistModel.loc);
            
            /* 
            edititem.value.loginID = response.data.userlistModel.loginID;
            edititem.value.password = response.data.userlistModel.password;
            edititem.value.name = response.data.userlistModel.name;
            edititem.value.user_type = response.data.userlistModel.user_type;
            edititem.value.sex = response.data.userlistModel.sex;
            edititem.value.hp = response.data.userlistModel.hp;
            edititem.value.email = response.data.userlistModel.email;
            edititem.value.zipcd = response.data.userlistModel.zipcd;
            edititem.value.addr = response.data.userlistModel.addr;
            edititem.value.dtladdr = response.data.userlistModel.dtladdr;
            edititem.value.loc = response.data.userlistModel.loc;
            edititem.value.birthday = response.data.userlistModel.birthday;
            */
           } else  {
            alert("조회가 실패 했습니다.");
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });

  }

  emitter.on("daumZipResult",(resp) => {
    console.log(resp);
    edititem.value.zipcd = resp.addeinfo.zonecode;
    if (resp.addeinfo.userSelectedType == "R") {
      edititem.value.addr = resp.addeinfo.roadAddress;
    } else {
      edititem.value.dtladdr = resp.addeinfo.jibunAddress;
    }

    /*
    if (!daumpopup) {
       console.error("🚨 daumpopup이 null입니다. ");
    }

    if (typeof daumpopup.resolve === "function") {
       daumpopup.resolve(); // ✅ 닫기
       daumpopup = null; // ✅ `null`로 초기화하여 중복 호출 방지
    } else {
       console.error("🚨 daumpopup.resolve가 함수가 아닙니다.", typeof daumpopup.resolve);
    }
    */
    //resp.popup.resolve(); // ✅ popup 닫기

    //daumpopup.resolve();
  }); 
});


onBeforeUnmount(() => {
  emitter.off("daumZipResult");
  emitter.off("UserMgmtpopupareacd");
});

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
