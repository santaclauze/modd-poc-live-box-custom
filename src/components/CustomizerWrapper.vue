<template>
  <div class="customizer-wrapper" @mouseover="mouseEnter($event)">
    <slot></slot>
    <Dragger
      direction="top"
    />
    <Dragger
      direction="left"
    />
    <Dragger
      direction="bottom"
    />
    <Dragger
      direction="right"
    />
    <div class="mock-padding-box" v-if="isDraggerClicked"/>
  </div>
</template>

<script>
import Vue from "vue";
import Dragger from './Dragger';

export default Vue.extend({
  name: "CustomizerWrapper.vue",
  components: {
    Dragger,
  },
  data: () => ({
    isDraggerClicked: false,
  }),
  methods: {
    mouseEnter() {

    },
    handleMouseDown() {
      this.isDraggerClicked = true;
      console.log(this.isDraggerClicked)
    },
    handleMouseUp() {
      this.isDraggerClicked = false;
      console.log(this.isDraggerClicked)
    }
  },
})
</script>

<style scoped>
.customizer-wrapper {
  position: relative;
}

.customizer-wrapper:hover .dragger {
  background: blue;

}

.customizer-wrapper:hover .dragger:hover {
  cursor: grab;
  background: deepskyblue;
}

.mock-padding-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 90%;
  border: 1px solid dodgerblue;
  background-color: lightskyblue;
  z-index: 900;
}


</style>