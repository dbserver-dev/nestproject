<template>
  <div>
    <input type="text" v-on:input="sampleinputevent" :id="sampleinput.samid" :name="sampleinput.samid" :style="sampleinput.bindvalue" v-model="sampleinput.inputvalue" />
    <div>{{sampleinput.inputvalue}}</div>
    <button @click="butoonclick(111)"> 눌러 주세요 </button>

    <div v-for="(item, index) in samplearr" :key="index">
       {{ item }} / {{ index }}
    </div>

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
          <template v-for="(item, index) in tablearr" :key="index">
            <tr>
              <td>{{ item.no }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.regdate }}</td>
            </tr>
          </template>  
           
        </tbody>
      </table>
    </div>

    <template v-if="ifval">
         <input type="text" />
    </template>
    <template v-else>
       <select >
         <option valur="">전체</option>
         <option valur="1">1</option>
         <option valur="2">2</option>
         <option valur="2">3</option>
       </select>
    </template>

    <div v-if="ifval2 === 1">
      1 !!!!!!!!!!!!!
    </div>
    <div v-else-if="ifval2 === 2">
      2 !!!!!!!!!!!!!
    </div>   
    <div v-else>
      3 !!!!!!!!!!!!!
    </div>   
    <div v-html="innerhtml"></div>
    <div v-text="innertext"></div>
    <div v-show="ifval"> Show </div>
  </div>
</template>

<script setup>
import { ref,  onMounted } from "vue";

const sampleinput = ref({
  inputvalue : "황기현",
  bindvalue : "width:100px; height:100px; background-color:yellow;",
  samid : "sampleid"
});

const sampleinputevent = (e) => {
  console.log(e.target.value);
}

let samplearr = ref([0,1,2,3,4,5,6,7,8,9]);
let tablearr = ref([
     {no:1 ,title:"첫번째",regdate:"2025.01-01"},
     {no:2 ,title:"두번째",regdate:"2025.01-02"},
     {no:3 ,title:"세번째",regdate:"2025.01-03"},

  ]);
  
let ifval = ref(true);
let ifval2 = ref(1);
let innerhtml = ref("<input type='checkbox' id='checkid'/>");
let innertext = ref("true value");

const butoonclick = (e) => {
  samplearr.value = [10,11,12,13,14,15,16,17,18,19];
  
  sampleinput.value.bindvalue = "width:50px; height:50px; background-color:black;"
  sampleinput.value.samid = "changeid";

  ifval.value = !ifval.value;
  ifval2.value = 2;

  if(ifval.value) {
    innerhtml.value = "<input type='checkbox' id='checkid'/>";
    innertext.value = "true value";
  } else {
    innerhtml.value = "<select> <option valur=''>전체</option> <option valur='1'>1</option>  <option valur='2'>2</option></select>"
    innertext.value = "false value";
  }

  alert("버튼 눌렀습니다.");
}
 
onMounted(() => {
  alert("mounted");
  sampleinput.value.focus();
});
</script>
