<template>
  <div>
    <p class="conTitle">
      <span>chatGPT</span>
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
        {{ message.text }}
      </div>
    </div>
    <input
      v-model="userMessage"
      @keyup.enter="sendMessage"
      placeholder="메시지를 입력하세요"
    />
    <button @click="sendMessage">전송</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const userMessage = ref("");

const messages = ref([]);

const sendMessage = async () => {
  if (userMessage.value.trim() === "") return;

  let restext = "";

  // 사용자의 메시지를 추가합니다.
  messages.value.push({ sender: "user", text: userMessage.value });

  let params = new URLSearchParams();
  params.append("sendmsg", userMessage.value);

  await axios({
    url: "/chatgpt/connectchatgpt4.do", // File URL Goes Here
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

      messages.value.push({ sender: "bot", text: restext });
    })
    .catch(function (error) {
      alert("에러! API 요청에 오류가 있습니다. " + error);
    });

  // 메시지 초기화
  userMessage.value = "";
};
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
  width: 80%;
  margin-right: 10px;
}

button {
  padding: 5px 10px;
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
</style>
