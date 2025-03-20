<template>
  <div class="container-xxl">
    <p class="float-sm-center h2 mb-4 mt-4">{{title}}</p>
    <div class="row mb-3" v-show="delshow">
      <label for="noticeNo" class="col-sm-3 col-form-label">공지번호</label>
      <div class="col-sm-9">
        <input type="input" class="form-control" readOnly id="noticeNo" v-model="noticeId">
      </div>
    </div>
    <div class="row mb-3">
      <label for="noticeInput" class="col-sm-3 col-form-label">작성자</label>
      <div class="col-sm-9">
        <input type="input" class="form-control" readOnly id="noticeInput" v-model="userName">
      </div>
    </div>
    <div class="row mb-3">
      <label for="noticeTitle" class="col-sm-3 col-form-label">제목</label>
      <div class="col-sm-9">
        <input type="input" class="form-control" id="noticeTitle" v-model="noticeTitle">
      </div>
    </div>
    <div class="row mb-3">
      <label for="noticeContent" class="col-sm-3 col-form-label">공지내용</label>
      <div class="col-sm-9">
        <textarea 
          rows=5 
          cols=300 
          class="form-control" 
          id="noticeContent" 
          v-model="noticeContent"
          @keyup="handleContent()"
          ref="content"
        />
      </div>
    </div>
    <div class="row mb-3" v-if="action == 'N' || fileNo==0 || fileNo==''">
      <label for="noticeContent" class="col-sm-3 col-form-label">첨부</label>
      <div class="col-sm-9">
        <input type="file" class="inputTxt p100" @change="previewFile(this)" ref="fileImage" accept="image/*" />
      </div>
    </div>
    <div class="row mb-3" v-if="action == 'U' && fileNo!=0 && fileNo!=''">
      <label for="noticeContent" class="col-sm-3 col-form-label">첨부</label>
      <div class="col-sm-9">
        <input readonly v-model="fileName"/>
        <a class="btn" id="download" :href="fileRelativePath" download>
          <button class="btn-default btn-sm">다운로드</button>
        </a>
        <button class="btn-default btn-sm" @click="deleteFile">삭제</button>
       
      </div>
    </div>
    <div class="row mb-3">
      <label for="noticeContent" class="col-sm-3 col-form-label">미리보기</label>
      <div class="col-sm-9">
        <img id="preview" :src="fileRelativePath" width="350" height="200" @click="fileDownlaod" className="filePreview">
      </div>
    </div>
    <div class="float-sm-end mb-3">
      <button type="button" class="btn btn-primary me-2" @click="saveNotice">저장</button>
      <button type="button" class="btn btn-primary me-2" @click="delNotice" v-show="delshow">삭제</button>
      <button type="button" class="btn btn-primary" @click="modalClose">취소</button>
    </div>
  </div>
</template>

<script>
export default {
  props : {
      title: String,
      noticeNo: Number,
      action: String
    },
  data:function(){
      return {
        noticeId: '',
        noticeTitle: '',
        noticeContent: '',
        userName: '',
        delshow: true,
        image: '',
        fileNo: 0,
        fileName: '',
        fileRelativePath: '',
        filePath: '',
        fileStatus: '',
      }
  },
  mounted() {
    if(this.action == 'N') {
      this.delshow = false;
      this.userName = sessionStorage.getItem("loginId")
    } else {
      this.noticeId = this.noticeNo
      const vm = this
      let params = new URLSearchParams();
      //alert(this.noticeNo);
      params.append("noticeNo", this.noticeNo);

      this.axios
        .post("/api/system/noticeDetail.do", params)
        .then(function (res) {
          console.log(JSON.stringify(res))
          let data = res.data.result
          vm.noticeId = data.noticeNo
          vm.noticeTitle = data.noticeTitle
          vm.noticeContent = data.noticeContent
          vm.userName = data.loginId
          vm.fileNo = data.fileNo? data.fileNo: 0
          vm.fileName = data.fileName
          vm.filePath = data.fileLocalPath
          vm.fileRelativePath = data.fileRelativePath
          
          vm.delshow = true;
          console.log(vm.fileNo)
          console.log(vm.fileName)
          
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    }
  },
  methods : {
      saveNotice()  {
        const vm = this
        if(this.action=='N') { //신규 저장
          //let params = new URLSearchParams();
          const formData = new FormData();
          formData.append("noticeTitle", this.noticeTitle);
          formData.append("noticeContent", this.noticeContent);
          formData.append("action", this.action)

          if(this.image.size > 0) {
            formData.append("file", this.image);
            formData.append("isFile", "isFile");
          }

          this.axios({
              method: "post",
              url: "/api/system/noticeInsert.do",
              header: {
                "Content-Type": "multipart/form-data",
              },
              data: formData,
            })
            .then(function (res) {
              console.log(JSON.stringify(res));
              alert("저장이 완료되었습니다.")
              //모달닫기
              vm.$vbsModal.close()
              //화면리프레쉬
              vm.$router.go(vm.$router.currentRoute)
            })
            .catch(function (error) {
              alert("에러! API 요청에 오류가 있습니다. " + error);
            });
        } else {  // 수정 저장
          //let params = new URLSearchParams();
          const formData = new FormData();
          formData.append("noticeNo", this.noticeNo);
          formData.append("noticeTitle", this.noticeTitle);
          formData.append("noticeContent", this.noticeContent);
          formData.append("action", this.action)

          if(this.image.size > 0) {
            formData.append("file", this.image);
            formData.append("isFile", "isFile");
            if(this.action == 'U' && this.fileNo == 0) {
              this.fileStatus =  'A';
            } else if(this.action == 'U' && this.fileNo != 0){
              this.fileStatus =  'M';
            }
          }
          if(this.fileStatus =='D') {
            formData.append("deleted", "deleted"); // 첨부파일만 삭제하고 저장하는 경우
          } else if(this.fileStatus =='M') { // 첨부파일 삭제후 첨부추가하여 저장하는경우
            formData.append("modified", "modified");
            formData.append("fileNm", this.image.name);
          }  else if(this.fileStatus =='A') { // 기존에 첨부가 없었는데 새로 추가 하는경우
            formData.append("added", "added");
            this.fileNo = 0;
            formData.append("fileNm", this.image.name);
          } else {
            formData.append("noFile", "noFile"); // 첨부가 없는 경우
          }
          formData.append("fileNo", this.fileNo);
          formData.append("fileNm", this.fileName);
          formData.append("noticeNo", this.noticeNo);
          
          this.axios({
              method: "post",
              url: "/api/system/noticeUpdate.do",
              headers: {
                "Content-Type" : "multipart/form-data",
              },
              data: formData,
            })
            //.post("/api/system/noticeUpdate.do", formData)
            .then(function (res) {
              console.log(JSON.stringify(res));
              alert("수정이 완료되었습니다.")
              //모달닫기
              vm.$vbsModal.close()
              //화면리프레쉬
              vm.$router.go(vm.$router.currentRoute)
            })
            .catch(function (error) {
              alert("에러! API 요청에 오류가 있습니다. " + error);
            });
        }
      },
      delNotice()  {
        if (confirm("정말 삭제하시겠습니까?")) {
          const vm = this
          let params = new URLSearchParams();
          params.append("noticeNo", this.noticeNo);
          this.axios
            .post("/api/system/noticeDelete.do", params)
            .then(function (res) {
              console.log(JSON.stringify(res));
              alert("삭제가 완료되었습니다.")
              //모달닫기
              vm.$vbsModal.close()
              //화면리프레쉬
              vm.$router.go(vm.$router.currentRoute)
            })
            .catch(function (error) {
              alert("에러! API 요청에 오류가 있습니다. " + error);
            });
        }
      },
      modalConfirm(){
        this.$vbsModal.close();
          //this.$emit('close')
      },
      modalClose(){
        this.$vbsModal.close();
      },
      handleContent: function() {
        if(this.noticeContent.length>=1000) {
          alert('내용은 1000자 이하로 작성해 주세요');
          this.$refs.content.value = this.noticeContent.substring(0,1000);
        }
        return false;
      },
      previewAttach(input) {
        var input = this.$refs.attachImage
        //this.image = this.$refs.attachImage.files[0];
        
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            //console.log(e.target.result)
            //this.previewImage = e.target.result;
            document.getElementById('preview').src = e.target.result;
          };
          reader.readAsDataURL(input.files[0]);
        } else {
          this.previewImage = ''
        }
        //console.log(this.previewImage)
      },
      deleteFile: function() {
        this.fileStatus = 'D';
      },
      previewFile: function() {
        var input = this.$refs.fileImage
        this.image = input.files[0]
        console.log(this.image)
        if(input.files && this.image) {
          var reader = new FileReader()
          reader.onloadend = function(e) {
            document.getElementById("preview").src = e.target.result
          }
          reader.readAsDataURL(this.image)
        }
      },
      deleteFile: function() {
        this.fileStatus = "D"
        this.fileNo = 0
        this.fileRelativePath = ""
      }
  }
}
  </script>

<style>

</style>