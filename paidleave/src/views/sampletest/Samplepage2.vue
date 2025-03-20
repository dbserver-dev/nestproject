<template>
  <div>
    <input v-model="searchQuery" placeholder="Search users..." />
    <!-- 검색어 입력 필드 -->
    <ul>
      <li
        v-for="user in filteredUsers"
        :key="user.id"
        v-bind:class="{ active: user.isActive }"
      >
        <!-- 사용자 목록을 반복 렌더링하고, 각 항목에 동적으로 클래스를 바인딩 -->
        <span v-if="user.isActive">{{ user.name }} (Active)</span>
        <span v-else>{{ user.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const searchQuery = ref("");
const users = ref([
  { id: 1, name: "Alice", isActive: true },
  { id: 2, name: "Bob", isActive: false },
  { id: 3, name: "Charlie", isActive: true },
  { id: 4, name: "David", isActive: false },
]);

const filteredUsers = computed(() => {
  return users.value.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  alert("mounted");
});
</script>
