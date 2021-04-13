<template>
  <div class="customizer-wrapper" ref="draggableContainer">
    <slot></slot>
    <PaddingSizeViewer
        v-for="direction in directions"
        :direction="direction"
        :key="'viewer-'+ direction"
        :activePaddingSizeViewer="activePaddingSizeViewer"
        :parentHeight="slotHeight"
        :parentWidth="slotWidth"
    />
    <Dragger
        v-for="direction in directions"
        :direction="direction"
        :key="'dragger-'+ direction"
        :parentHeight="slotHeight"
        :parentWidth="slotWidth"
        :class="{'test' : isDraggerClicked}"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @update-padding-viewer-size="updatePaddingViewerSize"
        @update-active-padding-viewer-direction="updateActivePaddingViewer"
    />
  </div>
</template>

<script>
import Vue from "vue";
import Dragger from './Dragger';
import PaddingSizeViewer from './PaddingSizeViewer';

export default Vue.extend({
  name: "CustomizerWrapper.vue",
  components: {
    Dragger,
    PaddingSizeViewer,
  },
  data: () => ({
    isDraggerClicked: false,
    directions: ['top', 'right', 'bottom', 'left'],
    activePaddingSizeViewer: {
      direction: [],
      size: '',
    },
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
    updateActivePaddingViewer: function (direction) {
      const index = this.activePaddingSizeViewer.direction.findIndex(v => v === direction)
      if (index >= 0)
        this.activePaddingSizeViewer.direction.splice(index, 1)
      if(index === -1) this.activePaddingSizeViewer.direction.push(direction)
    },
    updatePaddingViewerSize: function (size) {
      this.$set(this.activePaddingSizeViewer, 'size', size)
    },
    handleMouseDown: function () {
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