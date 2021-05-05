<template>
  <div id="app">
    <h1>item</h1>
    <CustomizerWrapper><DivToBeTested /></CustomizerWrapper>
    <hr />
    <h1>container</h1>

    <CustomizerWrapper><ContainerTest /></CustomizerWrapper>

  </div>
</template>

<script>


import CustomizerWrapper from "@/components/CustomizerWrapper";
import DivToBeTested from "@/components/test/DivToBeTested";
import ContainerTest from "@/components/test/ContainerTest";

export default {
  name: 'App',
  components: {
    CustomizerWrapper,
    DivToBeTested,
    ContainerTest,
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

hr {
  width: 100%;
  margin: 50px 0;
}
</style>
