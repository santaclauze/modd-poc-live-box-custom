<template>
  <div
    class="customizer-wrapper"
    ref="draggableContainer"
    @click="removePaddingViewers"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <div :style="styles"><slot></slot></div>
    <ColumnCustomizer
      :parentHeight="height"
      :parentWidth="width"
      :hasSnapToGrid="hasSnapToGrid"
      :hasMirrorPadding="hasMirrorPadding"
      @update-padding="updatePadding"
      @update-height="updateHeight"
      @update-width="updateWidth"
    />
  </div>
</template>

<script>
import Vue from "vue";
import ColumnCustomizer from "./ColumnCustomizer";

export default Vue.extend({
  name: "CustomizerWrapper.vue",
  components: {
    ColumnCustomizer,
  },
  data: () => ({
    customPad: {
      s: [0, 15, 0, 15],
      m: [0, 15, 0, 15],
      l: [0, 15, 0, 15]
    },
    width: '0',
    height: '0',
    hasSnapToGrid: true,
    hasMirrorPadding: false,
  }),
  mounted() {
    this.$nextTick(() => {
      this.height = this.$refs.draggableContainer.clientHeight.toString(10);
      this.width = this.$refs.draggableContainer.clientWidth.toString(10);
    })
  },
  methods: {
    removePaddingViewers() {
    },
    toggleKey(e) {
      if(e.key === 'Shift') {
        this.hasSnapToGrid = !this.hasSnapToGrid
      }
      if(e.key === 'Control') {
        this.hasMirrorPadding = !this.hasMirrorPadding
      }
    },
    handleMouseEnter() {
      document.addEventListener('keydown', this.toggleKey);
      document.addEventListener('keyup', this.toggleKey);
    },
    handleMouseLeave() {
      document.removeEventListener('keydown', this.toggleKey);
      document.removeEventListener('keyup', this.toggleKey);
    },
    updateHeight(height) {
      this.height = height;
    },
    updateWidth(width) {
      this.width = width;
    },
    updatePadding(args) {
      this.customPad = Object.assign({}, this.customPad, { [args.breakpoint]: args.padding })
    }
  },
  computed: {
    styles() {
      // TODO: add 2 keys to store units of each direction and remove use of breakpoint in child, it will be global value
      // TS Type   const pad: {size:[number,number,number,number], unit:{x:'px'|'%', y: 'px'|'%'}}
      const pad = this.customPad.l;
      return {
        width: '100%',
        paddingTop: pad.size[0] + (pad.unit?.y || 'px'),
        paddingRight: pad.size[1] + (pad.unit?.x || 'px'),
        paddingBottom: pad.size[2] + (pad.unit?.y || 'px'),
        paddingLeft: pad.size[3] + (pad.unit?.x || 'px'),
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

.customizer-wrapper:hover .padding-badge {
  display: block;
}

.customizer-wrapper:hover .dragger:hover {
  cursor: grab;
  background: deepskyblue;
}



</style>