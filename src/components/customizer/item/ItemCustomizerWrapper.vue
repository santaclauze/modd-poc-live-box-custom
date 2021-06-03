<template>
  <div class="customizer-wrapper">
    <div :style="styles"><slot></slot></div>
    <ItemCustomizer
      @update-padding="updatePadding"
    />
  </div>
</template>
<script lang="ts">

import Vue from "vue";
import ItemCustomizer from "./ItemCustomizer";
import {PaddingSizeUpdate} from "@/types";

export default Vue.extend({
  name: "CustomizerWrapper.vue",
  components: {
    ItemCustomizer,
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
    }
  }),
  methods: {
    updatePadding(newCustomPad: PaddingSizeUpdate) {
      this.customPad = Object.assign({}, this.customPad, {
        // replace l with the global breakpoint
        l: newCustomPad.size, ...newCustomPad }
      )
    }
  },
  computed: {
    styles() {
      return {
        paddingTop: this.customPad.l[0] + (this.unit?.y || 'px'),
      };
    }
  },
})
</script>

<style>
.customizer-wrapper {
  position: relative;
  display: flex;
}


</style>