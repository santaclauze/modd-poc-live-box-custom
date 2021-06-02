<template>
  <div>
    <PaddingViewer
      :viewerStyles="[viewerStyles, { height: viewerHeight + 'px', top: 0 }]"
      :draggerStyles="[draggerStyles]"
      @move="moveHeight"
      :size="this.viewerHeight + 'px'"
    />
  </div>
</template>

<script lang="ts">

function trackMouseDrag(
    initEvent: MouseEvent,
    // eslint-disable-next-line no-unused-vars
    onMove: (moveX: number, number: number, object: { shift: boolean }) => void,
    // eslint-disable-next-line no-unused-vars
    onDone: (moveX: number, number: number) => void,
) {
  function mouseMove(e: MouseEvent) {
    onMove(
      e.pageX - initEvent.pageX,
      e.pageY - initEvent.pageY,
      { shift: e.shiftKey }
    );
  }
  function mouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    document.removeEventListener('mouseup', mouseUp);
    document.removeEventListener('mousemove', mouseMove);
    onDone(e.pageX - initEvent.pageX, e.pageY - initEvent.pageY);
    return false;
  }
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
}

import PaddingViewer from "../../ui/PaddingViewer";
import Vue from 'vue'

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
        width: '25%',
        left: '37.5%'
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