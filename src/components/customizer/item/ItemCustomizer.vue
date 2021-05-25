<template>
  <div>
    <PaddingViewer
      ref="draggableContainer"
      :viewerStyles="[viewerStyles, { height: viewerHeight + 'px', top: 0 }]"
      :draggerStyles="[draggerStyles, { bottom: '-10px' }]"
      @move="moveSize"
      :size="this.viewerHeight"
    />
  </div>
</template>

<script>

function trackMouseDrag(
    initEvent,
    onMove,
    onDone,
) {
  function mouseMove(e) {
    onMove(e.pageX - initEvent.pageX, e.pageY - initEvent.pageY);
  }
  function mouseUp(e) {
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

export default {
  name: "ContainerCustomizer",
  components: {
    PaddingViewer,
  },
  props: {
    parentHeight: Number,
    parentWidth: Number,
    hasSnapToGrid: Boolean,
  },
  data: () => ({
    viewerHeight: 0,
    originalDraggerPosition: 0,
  }),
  mounted() {
    this.originalDraggerPosition = this.$refs.draggableContainer.offsetTop;
  },
  computed: {
    draggerStyles() {
      return {
        height: '5px',
        width: '25%',
        left: '37.5%',
      };
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
    moveSize: function (initialEvent) {
      this.$refs.draggableContainer.style = {};
      const initialPosition = this.$refs.draggableContainer.size;
      const initialHeight = this.viewerHeight;
      trackMouseDrag(
          initialEvent,
          (dx, dy) => {
            const position = initialPosition + dy;
            console.log(initialPosition, dy)

            this.$refs.draggableContainer.style.top = position + 'px';
            // SNAP TO GRID
            if(this.hasSnapToGrid) {
              this.viewerHeight = initialHeight + (dy - dy%4);
            } else {
              this.viewerHeight = initialHeight + dy;
            }

            // Do not allow dragger to go futher than its original position
            if(position < this.originalDraggerPosition) {
              this.$refs.draggableContainer.style.top = this.originalDraggerPosition + 'px';
              return;
            }
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeight, 15, 0, 15] })
          },
          () => {
            // we do not want to save a negative height value. Set it to 0 if it is negative.
            if(this.viewerHeight < 0) { return this.viewerHeight = 0 }
          },
      )
    },
  }
}
</script>

<style scoped>

</style>