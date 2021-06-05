<template>
  <PaddingViewer
    :viewerStyles="[viewerStyles, { height: viewerHeight + 'px', top: 0 }]"
    :draggerStyles="[draggerStyles]"
    @move="moveHeight"
    :size="this.viewerHeight + 'px'"
  />
</template>

<script lang="ts">

import PaddingViewer from "../../ui/PaddingViewer";
import Vue from 'vue'
import {trackMouseDrag} from "@/helper";

export default Vue.extend({
  name: "ContainerCustomizer",
  components: {
    PaddingViewer,
  },
  data: () => ({
    viewerHeight: 0,
  }),
  computed: {
    draggerStyles() {
      return {
        bottom: '-10px',
        height: '5px',
        width: '10%',
        // based on above width
        left: (100 - 10) / 2 + '%'
      }
    },
    viewerStyles() {
      return {
        position: 'absolute',
        display: 'block',
        bottom: 0,
        right: '1px',
        left: '1px',
      }
    }
  },
  methods: {
    moveHeight: function (initialEvent: MouseEvent) {
      const initialPosition: number = this.viewerHeight;
      trackMouseDrag(
        initialEvent,
        (dx: number, dy: number, { shift }: { shift: boolean }) => {

          // SNAP TO GRID
          this.viewerHeight = shift ?
              initialPosition + dy : initialPosition + (dy - dy % 4);

          this.$emit('update-padding', {
            size: [this.viewerHeight, 15, 0, 15],
            unit: { x: 'px' }
          })
        },
        () => {
          // we do not want to save a negative height value. Set it to 0 if it is negative.
          if (this.viewerHeight < 0) {
            return this.viewerHeight = 0
          }
        },
      )
    },
  }
})

</script>

<style scoped>

</style>