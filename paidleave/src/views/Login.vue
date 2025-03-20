<template>
  <div id="background_board">
    <div class="login_form shadow" align="center">
      <div class="login-form-right-side" style="font-size: 15px">
        <div class="top-logo-wrap">
          <img
            id="login-logo"
            src="@/assets/images/admin/login/logo_img.png"
          />
        </div>
        <h3>안되는 것이 실패가 아니라 포기하는 것이 실패다</h3>
        <p>
          성공은 실패의 꼬리를 물고 온다. 지금 포기한 것이 있는가?<br />
          그렇다면 다시 시작해 보자.<br />
          안되는 것이 실패가 아니라 포기하는 것이 실패다.<br />
          포기한 순간이 성공하기 5분전이기 쉽다.<br />
          실패에서 더 많이 배운다.<br />
          실패를 반복해서 경험하면 실망하기 쉽다. <br />하지만 포기를 생각해선
          안된다. 실패는 언제나 중간역이지 종착역은 아니다. <br />
        </p>
        <p>- 이대희, ‘1%의 가능성을 희망으로 바꾼 사람들’ 에서</p>
      </div>
      <div class="login-form-left-side">
        <fieldset>
          <legend>로그인</legend>
          <p class="id">
            <label for="userId">아이디</label>
            <input
              v-model="loginId"
              type="text"
              placeholder="아이디"
              style="ime-mode: inactive"
              id="userId"
              ref="userId"
            />
          </p>
          <p class="pw">
            <label for="userPwd">비밀번호</label>
            <input
              v-model="pwd"
              type="password"
              placeholder="비밀번호"
              onfocus="this.placeholder=''; return true"
              id="userPwd"
              ref="userPwd"
            />
          </p>
          <p class="member_info">
            <input
              v-model="saveId"
              id="cb_saveId"
              type="checkbox"
            />
            <span class="id_save">ID저장</span>
          </p>
          <div>
            <a href="" id="RegisterBtn" name="modal"
              ><strong>[회원가입]</strong></a
            >
            <a href=""><strong>[아이디/비밀번호 찾기]</strong></a>
          </div>
          <!-- Login Btn -->
          <a class="btn_login" id="btn_login" @click="fLoginProc">
            <strong>Login</strong>
          </a>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/admin/login.css";
export default {
  data: function() {
    return {
      loginId: "",
      pwd: "",
      saveId: false,
    }
  },
  mounted() {
    let id = this.getCookie("LOGIN_ID")
    console.log('id:::' + id)
    this.loginId = id
    this.saveId = id != "" ? true : false

    //document.querySelector("#userPwd")
    //document.getElementById("userPwd")
    //$('#userPwd').focus()
    //this.$refs.userPwd.focus()
  },
  methods: {
    fLoginProc: function() {
      console.log('saveId::' + this.saveId)

      this.setCookie("LOGIN_ID", this.loginId, this.saveId == true ? 7 : -1)

      //로그인 전에 필수 체크
      if(this.$refs.userId.value == "") {
        alert("로그인 ID를 입력하세요.")
        this.$refs.userId.focus()
        return false
      } else if(this.$refs.userPwd.value == "") {
        alert("비밀번호를 입력하세요.")
        this.$refs.userPwd.focus()
        return false
      } 

      const params = new URLSearchParams();
      params.append('lgn_Id', this.loginId);
      params.append('pwd', this.pwd);
      this.axios.post('/api/loginProc.do', params)
      .then(res => {
        console.log(res)
        let data = res.data;
        if(data.result == "SUCCESS") {
          this.$store.commit("setLoginInfo", {
            loginId: data.loginId,
            userNm: data.userNm,
            userType: data.userType,
            usrMnuAtrt: data.usrMnuAtrt,
          })
          sessionStorage.setItem('loginInfo', JSON.stringify(data))
          sessionStorage.setItem('loginId', data.loginId)
          this.$router.push('/dashboard')
        } else {
          alert("ID 혹은 비밀번호가 틀립니다.");
        }
      }).catch(error => {
        console.log(error);
      })
    },
    setCookie: function(name, value, day) {
      let today = new Date()
      today.setDate(today.getDate() + day)
      document.cookie = name + "=" + value +"; path=/; expires=" 
      + today.toUTCString() + ";"
    },
    getCookie: function(name) {
      //쿠키에서 loginId 값을 가져온다.
      let cookie = document.cookie + ";"
      let idx = cookie.indexOf(name, 0)
      let val = ""
      console.log('idx::' + idx)
      if(idx > -1){
        cookie = cookie.substring(idx, cookie.length)
        let begin = cookie.indexOf("=", 0) + 1
        let end = cookie.indexOf(";", begin)
        val = unescape(cookie.substring(begin, end))
      }
      console.log('val::' + val)
      return val
    }
  }
}
</script>

<style>
.member_info > .id_save {
  font-size: 15px;
}
#login-logo {
  width: 300px;
  margin-bottom: 50px;
}
#cb_saveId {
  vertical-align: baseline;
  margin-right: 5px;
}
</style>