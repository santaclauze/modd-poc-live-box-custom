<template>
  <div class="customizer-wrapper" ref="draggableContainer">
    <slot></slot>
    <Dragger
        v-for="direction in directions"
        :direction="direction"
        :key="direction"
        :parentHeight="slotHeight"
        :parentWidth="slotWidth"
        :class="{'test' : isDraggerClicked}"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
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
    directions: ['top', 'right', 'bottom', 'left'],
    slotHeight: 0,
    slotWidth: 0,
  }),
  mounted() {
    this.$nextTick(() => {
      this.slotHeight = this.$refs.draggableContainer.clientHeight;
      this.slotWidth = this.$refs.draggableContainer.clientWidth;
    })
  },
  methods: {
    handleMouseDown: function () {
      console.log('?')
      this.set(this.isDraggerClicked = true);
    },
    handleMouseUp() {
      this.set(this.isDraggerClicked = false);
    }
  },
})
</script>

<style scoped>
.customizer-wrapper {
  position: relative;
}

.dragger.test {
  visibility: visible;
  background: blue;
}

.customizer-wrapper:hover .dragger {
  visibility: visible;
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
  border: 1px solid red;
  background-color: lightskyblue;
  z-index: 900;
}


</style>