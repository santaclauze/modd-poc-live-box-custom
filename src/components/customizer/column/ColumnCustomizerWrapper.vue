<template>
  <div
    class="customizer-wrapper"
    ref="draggableContainer"
  >
    <div :style="styles"><slot></slot></div>
    <ColumnCustomizer
      :parentHeight="height"
      :parentWidth="width"
      @update-padding="updatePadding"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ColumnCustomizer from "./ColumnCustomizer";
import {PaddingSizeUpdate} from "@/types";

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
    unit: {
      x: 'px',
      y: 'px',
    },
    width: '0',
    height: '0',
  }),
  mounted() {
    this.$nextTick(() => {
      this.height = this.$refs.draggableContainer.clientHeight.toString(10);
      this.width = this.$refs.draggableContainer.clientWidth.toString(10);
    })
  },
  methods: {
    updatePadding(newCustomPad: PaddingSizeUpdate) {
      console.log(newCustomPad)
      this.customPad = Object.assign({}, this.customPad, {
        // replace l with the global breakpoint
        l: newCustomPad.size, ...newCustomPad }
      )
    }
  },
  computed: {
    styles() {
      const pad = this.customPad.l;
      return {
        width: '100%',
        paddingTop: pad[0] + (this.unit?.y || 'px'),
        paddingRight: pad[1] + (this.unit?.x || 'px'),
        paddingBottom: pad[2] + (this.unit?.y || 'px'),
        paddingLeft: pad[3] + (this.unit?.x || 'px'),
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


</style>