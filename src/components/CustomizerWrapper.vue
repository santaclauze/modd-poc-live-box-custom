<template>
  <div class="customizer-wrapper" ref="draggableContainer" @click="removePaddingViewers">
    <div class="slot-wrapper" :style="[styles]"><DivToBeTested /></div>
    <PaddingSizeViewer
        v-for="direction in directions"
        :direction="direction"
        :key="'viewer-'+ direction"
        :activePadding="activePadding"
        :parentHeight="slotHeight"
        :parentWidth="slotWidth"
        :isBidirectionnal="isBidirectionnal"
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
import DivToBeTested from './DivToBeTested';
// import TextToBeTested from './TextToBeTested';
import PaddingSizeViewer from './PaddingSizeViewer';

export default Vue.extend({
  name: "CustomizerWrapper.vue",
  components: {
    DivToBeTested,
    // TextToBeTested,
    Dragger,
    PaddingSizeViewer,
  },
  data: () => ({
    isDraggerClicked: false,
    isBidirectionnal: false,
    directions: ['top', 'right', 'bottom', 'left'],
    activePadding: {
      direction: [],
      size: '',
    },
    slotHeight: 0,
    slotWidth: 0,
  }),
  mounted() {
    window.addEventListener('keypress', this._keyDownListener);
    window.addEventListener("keyup", this._keyUpListener);
    this.$nextTick(() => {
      this.slotHeight = this.$refs.draggableContainer.clientHeight;
      this.slotWidth = this.$refs.draggableContainer.clientWidth;
    })
  },
  beforeDestroy() {
    window.removeEventListener('keypress', this._keyDownListener);
    window.removeEventListener('keyup', this._keyUpListener);
  },
  methods: {
    _keyDownListener(e) {
      if (e.key === "a") {
        e.preventDefault();
        this.isBidirectionnal = true;
      }
    },
    _keyUpListener(e) {
      if (e.key === "a") {
        e.preventDefault();
        this.isBidirectionnal = false;
      }
    },
    updateActivePaddingViewer: function (direction) {
      if(this.activePadding.direction.length > 0) {
        this.activePadding.direction.splice(0, this.activePadding.direction.length)
      }
      this.activePadding.direction = [...this.activePadding.direction, ...direction]
    },
    updatePaddingViewerSize: function (size) {
      this.$set(this.activePadding, 'size', size)
    },
    handleMouseDown: function () {
      this.$set(this.isDraggerClicked = true);
    },
    handleMouseUp() {
      this.$set(this.isDraggerClicked = false);
    },
    removePaddingViewers() {
      this.$set(this.activePadding.direction = [])
    }
  },
  computed: {
    styles() {
      const stylesUnilateral = {
        paddingTop: this.activePadding.direction.includes('top') && this.activePadding.size - 10 + 'px',
        paddingBottom: this.activePadding.direction.includes('bottom') && (this.slotHeight - this.activePadding.size - 20) + 'px',
        paddingRight: this.activePadding.direction.includes('right') && (this.slotWidth - this.activePadding.size - 20) + 'px',
        paddingLeft: this.activePadding.direction.includes('left') && this.activePadding.size - 10 + 'px',
      };

      const stylesBilateral = {
        paddingTop: this.activePadding.direction.includes('top') && this.activePadding.size - 10 + 'px',
        paddingBottom: this.activePadding.direction.includes('bottom') && this.activePadding.size - 10 + 'px',
        paddingRight: this.activePadding.direction.includes('right') && this.activePadding.size - 10 + 'px',
        paddingLeft: this.activePadding.direction.includes('left') && this.activePadding.size - 10 + 'px',
      };
      return this.isBidirectionnal ? stylesBilateral : stylesUnilateral;
    }
  },
})
</script>

<style scoped>
.slot-wrapper {
  display: flex;
  width: 100%;
}

.customizer-wrapper {
  position: relative;
  display: flex;
  height: 500px;
  width: 600px;
  border: 1px solid grey;
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