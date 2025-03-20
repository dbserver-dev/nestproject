<template>
    <div id="userMgr">
        <div id="searcharea">
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
                          <select id="viewcount" style="width: 5%" v-model="searcharea.pagesize" @change="changecount">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                          </select>
                          LoginID
                          <input
                            type="text"
                            id="sloginid"
                            name="sloginid"
                            style="width: 10%"
                            class="form-control"
                            ref="sloginidRef"
                            v-model="searcharea.sloginid"
                          />
                          이름
                          <input
                            type="text"
                            id="sname"
                            name="sname"
                            style="width: 10%"
                            class="form-control"
                            v-model="searcharea.sname"
                          />
                          사용자 구분
                          <select
                            id="selusertype"
                            name="selusertype"
                            style="width: 10%"
                            v-model="searcharea.selusertype"
                          >
                            <option value="">전체</option>
                            <option value="A">관리자</option>
                            <option value="B">사용자</option>
                          </select>
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
        </div>
        <div id="userlist">
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
                    <th scope="col">loginid</th>
                    <th scope="col">이름</th>
                    <th scope="col">사용자 구분</th>   
                    <th scope="col">성별</th>                 
                    <th scope="col">등록일자</th>
                  </tr>
                </thead>
                <tbody>
                    <template v-if="datalist.totalcnt === 0">
                       <tr>
                          <td colspan="5"> 조회된 데이토가 없습니다.</td>
                       </tr>
                    </template>
                    <template v-else>
                        <tr v-for="item in datalist.userlistModel" :key="item.loginID" @click="modify(item.loginID)">
                            <td>{{ item.loginID }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.user_type }}</td>
                            <td>{{ item.sex }}</td>
                            <td>{{ item.regdate }}</td>
                         </tr>
                    </template>
                </tbody>
              </table>
        </div>
        <div id="noticePagination">
            <paginate
              class="justify-content-center"
              v-model="searcharea.currentpage"
              :page-count="datalist.totalcnt % searcharea.pagesize === 0 ? datalist.totalcnt / searcharea.pagesize - 1 : datalist.totalcnt / searcharea.pagesize"
              :page-range="10"
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
   import {ref, onMounted, watch } from "vue";
   import axios from "axios";
   import paginate from "vuejs-paginate-next";
   import UserMgmtpopup from "./UserMgmtpopup.vue"
   import { openModal } from "jenesius-vue-modal";
   //import { inject } from "vue";

   // Inject the emitter from global properties
   //const emitter = inject("emitter");


   const searcharea = ref({
    sloginid : "",
    sname : "",
    selusertype : "",
    currentpage : 1,
    pagesize : 10,
   });
   
   const datalist = ref({
       totalcnt : 0,
       userlistModel : [],
   });

   // `ref`를 사용하여 `input` 요소에 접근
   const sloginidRef = ref(null);

   /*
   const search = (e) => {
      alert(searcharea.value.sloginid + " : " + searcharea.value.sname  + " : " + searcharea.value.selusertype);
   } 
   */   

   const searchdata = async () => {

    const params = new URLSearchParams(Object.entries(searcharea.value));

    await axios
        .post("/system/userListvue.do", params)
        .then((response) => {
          console.log(response);
          
          if(response.data.result === "Y") {
            datalist.value.totalcnt =  response.data.totalcnt;
            datalist.value.userlistModel =  response.data.userlistModel;
          } else {
            alert("조회가 실패 했습니다.");
          }
          
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });


   }

   const changecount = () => {
    searcharea.value.currentpage = 1;
    searchdata();
   }

   const newreg = async () => {
    const opoupparam = {
      title: "사용자 등록",
      action: "I",
      loginid: "",
      returnprocess : popupreturn,
    };

    await openModal(UserMgmtpopup,opoupparam);

   }

   const modify = async (loginid) => {
    const opoupparam = {
      title: "사용자 수정",
      action: "U",
      loginid: loginid,
      returnprocess : popupreturn
    };

    await openModal(UserMgmtpopup,opoupparam);

   }

   const popupreturn = (saveyn) => {
      console.log("popupreturn : ", saveyn);

        if (saveyn === "Y") {
          searchdata();
        }

      };

   onMounted(()=> {
      console.log("Strat");
      sloginidRef.value.focus();
      searchdata();
   });

   // 1️⃣ `aaa` 값이 변경될 때 실행
   watch(searcharea.value.loginID, (newVal, oldVal) => {
      console.log(`aaa 변경됨: ${oldVal} → ${newVal}`);
   });

</script> 