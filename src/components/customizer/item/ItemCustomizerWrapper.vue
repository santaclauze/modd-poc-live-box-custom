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
  }),
  methods: {
    updatePadding(newCustomPad: PaddingSizeUpdate) {
      this.customPad = Object.assign({}, this.customPad, {
        l: newCustomPad.size, ...newCustomPad }
      )
    }
  },
  computed: {
    styles() {
      return {
        paddingTop: this.customPad.l[0] + 'px',
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


</style>