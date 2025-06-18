<script setup lang="ts">
// 不需要导入router-view，它是Vue Router的内置组件
</script>

<template>
  <div class="app-container">
    <!-- 路由视图，用于显示当前路由匹配的组件 -->
    <router-view />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
