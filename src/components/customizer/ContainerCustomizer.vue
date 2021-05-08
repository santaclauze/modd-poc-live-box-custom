<template>
  <div>
    <div
        ref="draggableContainer"
        id="draggable-container"
        @mousedown.prevent.stop="moveSize"
        :style="draggerStyles"
        class="dragger"
    />
    <div
      class="container-padding-viewer"
      :style="[viewerStyles, { height: viewerHeight + 'px'}]"
      @mousedown.prevent.stop="moveSize"
    >
      <div v-if="this.viewerHeight > 0" class="height-displayer">{{this.viewerHeight}}px</div>
    </div>
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


export default {
  name: "ContainerCustomizer",
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
        height: '7px',
        width: this.parentWidth / 4 + 'px',
        left: this.makeDraggerSize(this.parentWidth),
        bottom: '10px',
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
    makeDraggerSize: function (parentSize) {
      return ((parentSize / 2) - (parentSize / 8)) + 'px'
    },
    moveSize: function (initialEvent) {
      const initialPosition = this.$refs.draggableContainer.offsetTop;
      const initialHeight = this.viewerHeight;
      trackMouseDrag(
          initialEvent,
          (dx, dy) => {
            const position = initialPosition + dy;
            this.$refs.draggableContainer.style.top = position + 'px';
            // SNAP TO GRID
            if(this.hasSnapToGrid) {
              if(dy%4 === 0) {
                this.viewerHeight = initialHeight + dy;
              }
            } else {
              this.viewerHeight = initialHeight + dy;
            }

            // Do not allow dragger to go futher than its original position
            if(position < this.originalDraggerPosition) {
              this.$refs.draggableContainer.style.top = this.originalDraggerPosition + 'px';
              return;
            }
            console.log('?')
            this.$emit('update-padding', { breakpoint: 'l', padding: [0, 15, this.viewerHeight, 15] })
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

.dragger {
  border-radius: 50px;
  position: absolute;
  z-index: 1000;
}

.height-displayer {
  position: absolute;
  top: 45%;
  left: 48%;
  font-size: 13px;
  background-color: #438ce6;
  padding: 9px 14px;
  border-radius: 30px;
  color: white;
  z-index: 1001;
  display: none;
}
</style>