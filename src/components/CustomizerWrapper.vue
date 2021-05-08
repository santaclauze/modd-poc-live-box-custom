<template>
  <div class="customizer-wrapper" ref="draggableContainer" @click="removePaddingViewers">
    <div class="slot-wrapper" :style="styles"><slot></slot></div>
    <ContainerCustomizer
        direction="bottom"
        :parentHeight="slotHeight"
        :parentWidth="slotWidth"
        @update-padding="updatePadding"
    />
<!--        <Dragger-->
<!--            v-for="direction in directions"-->
<!--            :direction="direction"-->
<!--            :key="'dragger-'+ direction"-->
<!--            :parentHeight="slotHeight"-->
<!--            :parentWidth="slotWidth"-->
<!--            :class="{'test' : isDraggerClicked}"-->
<!--            @mousedown="handleMouseDown"-->
<!--            @mouseup="handleMouseUp"-->
<!--            @update-padding-viewer-size="updatePaddingViewerSize"-->
<!--            @update-active-padding-viewer-direction="updateActivePaddingViewer"-->
<!--        />-->
<!--    <ItemCustomizer-->
<!--        v-for="direction in directions"-->
<!--        :direction="direction"-->
<!--        :key="'item-customizer-'+ direction"-->
<!--        :activePadding="activePadding"-->
<!--        :parentHeight="slotHeight"-->
<!--        :parentWidth="slotWidth"-->
<!--        :isBidirectionnal="isBidirectionnal"-->
<!--        :class="{'test' : isDraggerClicked}"-->
<!--        @mousedown="handleMouseDown"-->
<!--        @mouseup="handleMouseUp"-->
<!--        @update-padding-viewer-size="updatePaddingViewerSize"-->
<!--        @update-active-padding-viewer-direction="updateActivePaddingViewer"-->
<!--    />-->
<!--    <PaddingSizeViewer-->
<!--        v-for="direction in directions"-->
<!--        :direction="direction"-->
<!--        :key="'viewer-'+ direction"-->
<!--        :activePadding="activePadding"-->
<!--        :parentHeight="slotHeight"-->
<!--        :parentWidth="slotWidth"-->
<!--        :isBidirectionnal="isBidirectionnal"-->
<!--    />-->
  </div>
</template>

<script>
import Vue from "vue";
// import TextToBeTested from './TextToBeTested';
// import PaddingSizeViewer from './PaddingSizeViewer';
// import ItemCustomizer from "./ItemCustomizer";
// import Dragger from "./Dragger";
import ContainerCustomizer from "./customizer/ContainerCustomizer";

export default Vue.extend({
  name: "CustomizerWrapper.vue",
  components: {
    // ItemCustomizer,
    // TextToBeTested,
    // PaddingSizeViewer,
    // Dragger,
    ContainerCustomizer,
  },
  data: () => ({
    isDraggerClicked: false,
    activePadding: {
      direction: [],
      size: '',
    },
    customPad: {
      s: [0, 15, 0, 15],
      m: [0, 15, 0, 15],
      l: [0, 15, 0, 15]
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
      this.$set(this.customPad, 'l[3]', size[0])
    },
    handleMouseDown: function () {
      this.$set(this.isDraggerClicked = true);
    },
    handleMouseUp() {
      this.$set(this.isDraggerClicked = false);
    },
    removePaddingViewers() {
      this.$set(this.activePadding.direction = [])
    },
    updatePadding(size) {

      this.customPad = Object.assign({}, this.customPad, { l: [0, 15, size[0], 15] })

    }
  },
  computed: {
    styles() {
      return {
        paddingBottom: this.customPad.l[2] + 'px',
      };
      // const stylesUnilateral = {
      //   paddingTop: this.activePadding.direction.includes('top') && this.activePadding.size - 10 + 'px',
      //   paddingBottom: this.activePadding.direction.includes('bottom') && (this.slotHeight - this.activePadding.size - 20) + 'px',
      //   paddingRight: this.activePadding.direction.includes('right') && (this.slotWidth - this.activePadding.size - 20) + 'px',
      //   paddingLeft: this.activePadding.direction.includes('left') && this.activePadding.size - 10 + 'px',
      // };
      //
      // const stylesXAxis = {
      //   paddingRight: this.activePadding.direction.includes('right') && this.activePadding.size + 'px',
      //   paddingLeft: this.activePadding.direction.includes('left') && this.activePadding.size - 10 + 'px',
      // };
      //
      // console.log(stylesXAxis)
      //
      // const stylesYAxis = {
      //   paddingBottom: this.activePadding.direction.includes('bottom') && (this.slotHeight - this.activePadding.size - 20) + 'px',
      //   paddingTop: this.activePadding.direction.includes('top') && this.activePadding.size - 10 + 'px',
      // };
    }
  },
})
</script>

<style>
.slot-wrapper {
  display: flex;
  width: 100%;
}

.customizer-wrapper {
  position: relative;
  display: flex;
  border: 1px solid grey;
}

.customizer-wrapper:hover .dragger {
  visibility: visible;
  background: blue;
}

.customizer-wrapper:hover .container-padding-viewer {
  background-color: rgba(215,235,247,0.6);
}

.customizer-wrapper:hover .height-displayer {
  display: block;
}

.customizer-wrapper:hover .dragger:hover {
  cursor: grab;
  background: deepskyblue;
}



</style>