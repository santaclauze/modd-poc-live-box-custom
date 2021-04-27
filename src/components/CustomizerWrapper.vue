<template>
  <div class="customizer-wrapper" ref="draggableContainer">
    <div class="slot-wrapper" :style="[styles]"><DivToBeTested /></div>
    <PaddingSizeViewer
        v-for="direction in directions"
        :direction="direction"
        :key="'viewer-'+ direction"
        :parentHeight="slotHeight"
        :parentWidth="slotWidth"
        :active="active"
    />
    <Dragger
        v-for="direction in directions"
        :direction="direction"
        :key="'dragger-'+ direction"
        :parentHeight="slotHeight"
        :parentWidth="slotWidth"
        :class="{'test' : isDraggerClicked}"
        :bidirectionnal="isBidirectionnal"
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
    active: {
      direction: [],
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    slotHeight: 0,
    slotWidth: 0,
  }),
  mounted() {
    window.addEventListener('keydown', this._keyDownListener);
    window.addEventListener("keyup", this._keyUpListener);
    this.$nextTick(() => {
      this.slotHeight = this.$refs.draggableContainer.clientHeight;
      this.slotWidth = this.$refs.draggableContainer.clientWidth;
    })
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this._keyDownListener);
    window.removeEventListener('keyup', this._keyUpListener);
  },
  methods: {
    _keyDownListener(e) {
      if (e.key === "Shift") {  //filter down to Ctrl+S (as an example)
        e.preventDefault(); //prevent the default action (save page in this case)
        this.isBidirectionnal = true
      }
    },
    _keyUpListener(e) {
      if (e.key === "Shift") {  //filter down to Ctrl+S (as an example)
        e.preventDefault(); //prevent the default action (save page in this case)
        this.isBidirectionnal = false
      }
    },
    updateActivePaddingViewer: function (direction) {
      if(this.active.direction.length > 0) {
        this.active.direction.splice(0, this.active.direction.length)
      }
      this.active.direction =  [...this.active.direction, ...direction]
      setTimeout(function () { this.active.direction.splice(0, this.active.direction.length) }.bind(this), 1000)
    },
    updatePaddingViewerSize: function (direction, size) {
      this.$set(this.active.padding, direction, size)
    },
    handleMouseDown: function () {
      this.set(this.isDraggerClicked = true);
    },
    handleMouseUp() {
      this.set(this.isDraggerClicked = false);
    }
  },
  computed: {
    styles() {
      const styles = {
        paddingTop: this.active.padding.top - 10 + 'px',
        paddingBottom: this.slotHeight - this.active.padding.bottom - 20 + 'px',
        paddingRight: this.slotWidth - this.active.padding.right - 20 + 'px',
        paddingLeft: this.active.padding.left - 10 + 'px',
      }
      return styles;
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
  outline: 1px solid grey;
}

.customizer-wrapper:hover .dragger {
  visibility: visible;
  background: blue;
}

.customizer-wrapper:hover .dragger:hover {
  cursor: grab;
  background: deepskyblue;
}


</style>