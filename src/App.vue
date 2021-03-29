<template>
  <div id="app">
    <CustomizerWrapper>
      <Test />
    </CustomizerWrapper>
  </div>
</template>

<script>


import Test from "@/components/Test";
import CustomizerWrapper from "@/components/CustomizerWrapper";

export default {
  name: 'App',
  components: {
    Test,
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
