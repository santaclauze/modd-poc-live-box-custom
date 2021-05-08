<template>
  <div
    class="customizer-wrapper"
    ref="draggableContainer"
    @click="removePaddingViewers"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <div :style="styles"><slot></slot></div>
    <ContainerCustomizer
      :parentHeight="slotHeight"
      :parentWidth="slotWidth"
      :hasSnapToGrid="hasSnapToGrid"
      @update-padding="updatePadding"
    />
<!--    <ImageCustomizer-->
<!--        :parentHeight="slotHeight"-->
<!--        :parentWidth="slotWidth"-->
<!--        :hasSnapToGrid="hasSnapToGrid"-->
<!--        @update-padding="updatePadding"-->
<!--    />-->
  </div>
</template>

<script>
import Vue from "vue";
import ContainerCustomizer from "./customizer/ContainerCustomizer";
// import ImageCustomizer from "./customizer/ImageCustomizer";

export default Vue.extend({
  name: "CustomizerWrapper.vue",
  components: {
    ContainerCustomizer,
    // ImageCustomizer,
  },
  data: () => ({
    customPad: {
      s: [0, 15, 0, 15],
      m: [0, 15, 0, 15],
      l: [0, 15, 0, 15]
    },
    slotHeight: 0,
    slotWidth: 0,
    hasSnapToGrid: true,
  }),
  mounted() {
    this.$nextTick(() => {
      this.slotHeight = this.$refs.draggableContainer.clientHeight;
      this.slotWidth = this.$refs.draggableContainer.clientWidth;
    })
  },
  methods: {
    removePaddingViewers() {
    },
    toggleSnapToGrid(e) {
      if(e.key === 'Shift') {
        this.hasSnapToGrid = !this.hasSnapToGrid
      }
    },
    handleMouseEnter() {
      document.addEventListener('keydown', this.toggleSnapToGrid);
      document.addEventListener('keyup', this.toggleSnapToGrid);
    },
    handleMouseLeave() {
      document.removeEventListener('keydown', this.toggleSnapToGrid);
      document.removeEventListener('keyup', this.toggleSnapToGrid);
    },
    updatePadding(args) {
      this.customPad = Object.assign({}, this.customPad, { [args.breakpoint]: args.padding })
    }
  },
  computed: {
    styles() {
      return {
        paddingTop: this.customPad.l[0] + 'px',
        paddingRight: this.customPad.l[1] + 'px',
        paddingBottom: this.customPad.l[2] + 'px',
        paddingLeft: this.customPad.l[3] + 'px',
      };
    }
  },
})
</script>

<style>
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