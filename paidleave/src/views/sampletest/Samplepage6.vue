<template>
  <div>
    <p class="conTitle">
      <span>chatGPT (File and Response : HTML) </span>
    </p>
    <div class="chat-window">
      <div
        class="message"
        v-for="(message, index) in messages"
        :key="index"
        :class="{
          'user-message': message.sender === 'user',
          'chatgpt-message': message.sender !== 'user',
        }"
      >
        <strong v-if="message.sender === 'user'">사용자:</strong>
        <strong v-else>chatGpt :</strong>
        <div v-html="message.html"></div>
      </div>
    </div>

    <form id="sendform">
      <table style="width: 100%">
        <colgroup>
          <col width="75%" />
          <col width="25%" />
        </colgroup>
        <tr>
          <td>
            <input
              placeholder="선행 메시지를 입력하세요"
              v-model="premessage"
            />
          </td>
          <td>
            <input
              ref="fileInput"
              placeholder="file upload"
              type="file"
              @change="filechange"
              accept="image/*"
            />
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <textarea
              class="textarea-field"
              v-model="userMessage"
              @keyup.enter="sendMessage"
              placeholder="메시지를 입력하세요"
              rows="3"
            ></textarea>
            <button @click="sendMessage" class="button-container">전송</button>
          </td>
        </tr>
      </table>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const userMessage = ref("");

const messages = ref([]);
const premessage = ref("");
const infile = ref("");
const fileInput = ref(null);

const filechange = (e) => {
  console.log(e.target.files[0]);
  infile.value = e.target.files[0];
};

const sendMessage = async () => {
  //if (userMessage.value.trim() === "") return;

  let restext = "";

  // 사용자의 메시지를 추가합니다.

  const userMessageformattedText =
    premessage.value + "<br>" + userMessage.value.replace(/\n/g, "<br>");
  messages.value.push({ sender: "user", html: userMessageformattedText });

  let params = new FormData();
  params.append(
    "sendmsg",
    "html로 응답을 보내 줘 " + premessage.value + " " + userMessage.value
  );
  params.append("infile", infile.value);

  await axios({
    url: "/chatgpt/connectchatgpt4file.do", // File URL Goes Here
    header: {
      "Content-Type": "multipart/form-data",
    },
    data: params,
    method: "POST",
  })
    .then((response) => {
      console.log(response);
      //console.log(JSON.stringify(response));

      // 봇의 응답을 추가합니다.
      // JSON 문자열 파싱
      if (response.data.result === "Y") {
        const parsedAnswer = JSON.parse(response.data.answer);
        restext = parsedAnswer.choices[0].message.content;
        console.log(restext);
      } else {
        restext = response.data.answer;
      }

      // 개행을 <br> 태그로 변환
      const formattedText = restext.replace(/\n/g, "<br>");

      messages.value.push({ sender: "bot", html: formattedText });
    })
    .catch(function (error) {
      alert("에러! API 요청에 오류가 있습니다. " + error);
    });

  // 메시지 초기화
  userMessage.value = "";
  premessage.value = "";
  infile.value = "";
  if (fileInput.value) {
    fileInput.value.value = ""; // HTML 요소의 파일 입력값 초기화
  }
};

/*
-- Chatgpt 응답 Json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4",    // 이미지 처리 모델 : "gpt-4-turbo"
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}

*/

/*
   테스트 데이터
   영어 오타 난 부분을 빨간색으로 알려 줘

월요일	Munday	 
화요일	Tuesday	 
수요일	Wednesday 
목요일	Thursday	 
금요일	Friday	 
토요일	Saturday	 
일요일	Sanday	 
*/
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

.chat-window {
  border: 1px solid #ccc;
  padding: 10px;
  height: 400px;
  overflow-y: scroll;
  margin-bottom: 10px;
}

.message {
  margin: 5px 0;
}

input {
  padding: 5px;
  width: 100%;
  margin-right: 10px;
}

/* 사용자 메시지: 오른쪽 정렬 */
.user-message {
  align-self: flex-end;
  background-color: #d1e7dd;
  text-align: right;
}

/* ChatGPT 메시지: 왼쪽 정렬 */
.chatgpt-message {
  align-self: flex-start;
  background-color: #f8d7da;
  text-align: left;
}

.button-container button {
  margin-top: -40px; /* 버튼을 위로 올림 */
  padding: 8px 16px;
  font-size: 16px;
}

/* 입력 필드 크기와 정렬 맞추기 */
.textarea-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box;
  vertical-align: top; /* 입력 요소의 높이 맞추기 */
}

/* textarea 크기 조절 */
.textarea-field {
  height: 100px;
  resize: vertical;
}
</style>
