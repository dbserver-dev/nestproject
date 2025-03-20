<template>
  <div>
    <p class="conTitle">
      <span>chatGPT</span>
    </p>
    <div class="chat-window">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <strong v-if="message.sender === 'user'">사용자:</strong>
        <strong v-else>봇:</strong>
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

<script>
export default {
  data() {
    return {
      userMessage: "",
      messages: [],
    };
  },
  methods: {
    async sendMessage() {
      if (this.userMessage.trim() === "") return;

      // 사용자의 메시지를 추가합니다.
      this.messages.push({ sender: "user", text: this.userMessage });

      await this.axios
        .post(
          "http://192.168.0.184:5000/api/chat",
          {
            message: this.userMessage,
          },
          {
            headers: {
              "Content-Type": "application/json", // Content-Type 명시
            },
          }
        )
        .then((response) => {
          console.log(JSON.stringify(response));

          // 봇의 응답을 추가합니다.
          this.messages.push({ sender: "bot", text: response.data.response });
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });

      // 메시지 초기화
      this.userMessage = "";
    },
  },
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
  height: 300px;
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
</style>
