<template>
  <div id="app">
    <h1>Container example</h1>
    <CustomizerWrapper><ContainerExample /></CustomizerWrapper>
    <hr />
    <h1>Image example</h1>

    <CustomizerWrapper><ImageExample /></CustomizerWrapper>

  </div>
</template>

<script>


import CustomizerWrapper from "@/components/CustomizerWrapper";
import ContainerExample from "@/components/test/ContainerExample";
import ImageExample from "@/components/test/ImageExample";

export default {
  name: 'App',
  components: {
    CustomizerWrapper,
    ContainerExample,
    ImageExample,
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
