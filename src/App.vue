<template>
  <div id="app">
    <h1>Item example</h1>
    <ItemCustomizerWrapper><ContainerExample /></ItemCustomizerWrapper>
    <hr />
    <h1>Grid/Column example</h1>
    <GridContent>
      <ColumnCustomizerWrapper>
        <GridColumn>
          <ItemCustomizerWrapper>
            <ContainerExample />
          </ItemCustomizerWrapper>
          <ItemCustomizerWrapper>
            <ContainerExample />
          </ItemCustomizerWrapper>
        </GridColumn>
      </ColumnCustomizerWrapper>
      <ColumnCustomizerWrapper>
        <GridColumn>
          <ItemCustomizerWrapper>
            <ContainerExample />
          </ItemCustomizerWrapper>
        </GridColumn>
      </ColumnCustomizerWrapper>
    </GridContent>
    <hr />
    <h1>Column example</h1>
    <ColumnCustomizerWrapper><ContainerExample /></ColumnCustomizerWrapper>
  </div>
</template>

<script>


import ItemCustomizerWrapper from "./components/customizer/item/ItemCustomizerWrapper";
import ColumnCustomizerWrapper from "./components/customizer/column/ColumnCustomizerWrapper";
import ContainerExample from "@/components/test/ContainerExample";
import GridContent from "./components/test/Grid/GridContent";
import GridColumn from "./components/test/Grid/GridColumn";

// TODO: Refactor to function factory
// TODO: try to simplify

// makeMoveFunc: function (side, initialEvent) {
//   const initialPosition = this.viewerHeight;
//   trackMouseDrag(
//       initialEvent,
//       (dx, dy, {shift}) => {
//         const position = initialPosition + dy;
//
//         // SNAP TO GRID
//         this.viewerHeight = shift ? initialPosition + dy : initialPosition + (dy - dy % 4);
//
//         // Do not allow dragger to go futher than its original position
//         if (position < 0) {
//           return this.viewerHeight = 0;
//         }
//         this.$emit('update-padding', {breakpoint: 'l', padding: [this.viewerHeight, 15, 0, 15]})
//       },
//       () => {
//         // we do not want to save a negative height value. Set it to 0 if it is negative.
//         if (this.viewerHeight < 0) {
//           return this.viewerHeight = 0
//         }
//       },
//   )
// },

export default {
  name: 'App',
  components: {
    GridColumn,
    GridContent,
    ItemCustomizerWrapper,
    ColumnCustomizerWrapper,
    ContainerExample,
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
