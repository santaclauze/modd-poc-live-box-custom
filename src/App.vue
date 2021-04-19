<template>
  <div id="app">
    <CustomizerWrapper />
  </div>
</template>

<script>


import CustomizerWrapper from "@/components/CustomizerWrapper";

export default {
  name: 'App',
  components: {
    CustomizerWrapper,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
