<template>
  <div>
    <div
        ref="draggableContainer"
        @mousedown.prevent.stop="moveSize"
        :style="[draggerStyles, { top: '10px' }]"
        class="dragger"
    />
    <div
        class="container-padding-viewer"
        :style="[viewerStyles, { height: viewerHeight + 'px'}]"
        @mousedown.prevent.stop="moveSize"
    >
      <div v-if="this.viewerHeight > 0" class="height-displayer">{{this.viewerHeight}}px</div>
    </div>
    <div
        ref="draggableContainerHeight"
        @mousedown.prevent.stop="moveHeight"
        :style="[draggerStyles, { bottom: '10px' }]"
        class="dragger"
    />
    <div
        ref="draggableContainerWidth"
        @mousedown.prevent.stop="moveWidth"
        :style="[draggerWidthStyles, { right: '10px' }]"
        class="dragger"
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


export default {
  name: "ContainerCustomizer",
  props: {
    direction: String,
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
        width: this.parentWidth / 4 + 'px',
        left: this.makeDraggerSize(this.parentWidth),
      };
    },
    draggerWidthStyles() {
      return {
        width: '5px',
        top: this.parentHeight / 4 + 'px',
        height: this.makeDraggerSize(this.parentWidth),
      };
    },
    viewerStyles() {
      return {
        position: 'absolute',
        display: 'block',
        top: 0,
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
      const initialParentHeight = this.parentHeight;
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
            // when we add padding top, we do not want to squash the image, so we update the height at the same time
            this.$emit('update-height', initialParentHeight + dy)
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeight, 15, 0, 15] })
          },
          () => {
            // we do not want to save a negative height value. Set it to 0 if it is negative.
            if(this.viewerHeight < 0) { return this.viewerHeight = 0 }
          },
      )
    },
    moveHeight: function (initialEvent) {
      const initialPosition = this.$refs.draggableContainerHeight.offsetTop;
      const initialHeight = this.parentHeight;
      trackMouseDrag(
          initialEvent,
          (dx, dy) => {
            const position = initialPosition + dy;
            this.$refs.draggableContainerHeight.style.top = position + 'px';
            this.$emit('update-height', initialHeight + dy)

            // Do not allow dragger to go futher than its original position
            if(position < this.originalDraggerPosition) {
              this.$refs.draggableContainerHeight.style.top = this.originalDraggerPosition + 'px';
              return;
            }
          },
          () => {
            // we do not want to save a negative height value. Set it to 0 if it is negative.
          },
      )
    },
    moveWidth: function (initialEvent) {
      const initialPosition = this.$refs.draggableContainerWidth.offsetLeft;
      const initialWidth = this.parentWidth;
      trackMouseDrag(
          initialEvent,
          (dx) => {
            const position = initialPosition + dx;
            this.$refs.draggableContainerWidth.style.left = position + 'px';
            this.$emit('update-width', initialWidth + dx)
            this.$emit('update-height', this.parentHeight)

            // Do not allow dragger to go futher than its original position
            if(position < this.originalDraggerPosition) {
              this.$refs.draggableContainerWidth.style.left = this.originalDraggerPosition + 'px';
              return;
            }
          },
          () => {
            // we do not want to save a negative height value. Set it to 0 if it is negative.
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