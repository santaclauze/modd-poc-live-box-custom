<template>
  <div id="app">
    <h1>Container example</h1>
    <ItemCustomizerWrapper><ContainerExample /></ItemCustomizerWrapper>
    <hr />
    <h1>Image example</h1>
    <ImageCustomizerWrapper><ImageExample /></ImageCustomizerWrapper>
    <hr />
    <h1>Grid/Column example</h1>
    <GridContent>
      <ColumnCustomizerWrapper>
        <GridColumn>
          <h1>Testing Column</h1>
        </GridColumn>
      </ColumnCustomizerWrapper>
      <ColumnCustomizerWrapper>
        <GridColumn>
          <h1>Testing Column</h1>
        </GridColumn>
      </ColumnCustomizerWrapper>
    </GridContent>
  </div>
</template>

<script>


import ItemCustomizerWrapper from "./components/customizer/item/ItemCustomizerWrapper";
import ImageCustomizerWrapper from "./components/customizer/image/ImageCustomizerWrapper";
import ColumnCustomizerWrapper from "./components/customizer/column/ColumnCustomizerWrapper";
import ContainerExample from "@/components/test/ContainerExample";
import ImageExample from "@/components/test/ImageExample";
import GridContent from "./components/test/Grid/GridContent";
import GridColumn from "./components/test/Grid/GridColumn";

export default {
  name: 'App',
  components: {
    GridColumn,
    GridContent,
    ItemCustomizerWrapper,
    ImageCustomizerWrapper,
    ColumnCustomizerWrapper,
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
  height: 2000px;
}

hr {
  width: 100%;
  margin: 50px 0;
}
</style>
