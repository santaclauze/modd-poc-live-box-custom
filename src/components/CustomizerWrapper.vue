<template>
  <div class="customizer-wrapper" ref="draggableContainer" @click="removePaddingViewers">
    <div :style="styles"><slot></slot></div>
    <ContainerCustomizer
        direction="bottom"
        :parentHeight="slotHeight"
        :parentWidth="slotWidth"
        @update-padding="updatePadding"
    />
  </div>
</template>

<script>
import Vue from "vue";
import ContainerCustomizer from "./customizer/ContainerCustomizer";

export default Vue.extend({
  name: "CustomizerWrapper.vue",
  components: {
    ContainerCustomizer,
  },
  data: () => ({
    customPad: {
      s: [0, 15, 0, 15],
      m: [0, 15, 0, 15],
      l: [0, 15, 0, 15]
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
    updatePaddingViewerSize: function (size) {
      this.$set(this.customPad, 'l[3]', size[0])
    },
    removePaddingViewers() {
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