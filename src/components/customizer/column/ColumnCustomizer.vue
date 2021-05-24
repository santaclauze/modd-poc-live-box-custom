<template>
  <div>
    <PaddingViewer
      ref="draggableContainer"
      :viewerStyles="[viewerStyles, { height: viewerHeight + 'px' }]"
      :draggerStyles="[draggerStyles, { bottom: '-10px' }]"
      @move="moveSize"
      :size="this.viewerHeight"
    />
    <PaddingViewer
        ref="draggableContainerLeft"
        :viewerStyles="[viewerStylesSides, { width: viewerWidthLeft + 'px' }]"
        :draggerStyles="[draggerLeftStyles, { right: '-10px' }]"
        @move="moveFromLeft"
        :size="this.viewerWidthLeft"
    />
    <PaddingViewer
        ref="draggableContainerRight"
        :viewerStyles="[viewerStylesSides, { width: viewerWidthRight + 'px', left: 'unset', right: 0 }]"
        :draggerStyles="[draggerRightStyles, { left: '-10px' }]"
        @move="moveFromRight"
        :size="this.viewerWidthRight"
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

import { toPercent } from "../../../helper";
import PaddingViewer from '../../ui/PaddingViewer';

export default {
  name: "ContainerCustomizer",
  components: {
    PaddingViewer,
  },
  props: {
    direction: String,
    parentHeight: Number,
    parentWidth: Number,
    hasSnapToGrid: Boolean,
    hasMirrorPadding: Boolean,
  },
  data: () => ({
    viewerWidthLeft: 0,
    viewerWidthRight: 0,
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
    draggerLeftStyles() {
      return {
        width: '5px',
        top: '37.5%',
        height: '25%',
      };
    },
    draggerRightStyles() {
      return {
        width: '5px',
        top: '37.5%',
        height: '25%',
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
    },
    viewerStylesSides() {
      return {
        position: 'absolute',
        display: 'block',
        top: '1px',
        bottom: '1px',
        left: 0,
      }
    }
  },
  methods: {
    toPercent,
    makeDraggerSize: function (parentSize) {
      return ((parentSize / 2) - (parentSize / 8)) + 'px'
    },
    moveSize: function (initialEvent) {
      this.$refs.draggableContainer.style = {};
      const initialPosition = this.$refs.draggableContainer.size;
      const initialHeight = this.viewerHeight;
      trackMouseDrag(
          initialEvent,
          (dx, dy) => {
            const position = initialPosition + dy;
            // Avoids bug when dragger does not stick to position accurately
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
            // when we add padding top, we do not want to squash the image, so we update the height at the same time
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeight, this.viewerWidthRight, 0, this.viewerWidthLeft] })
          },
          () => {
            // we do not want to save a negative height value. Set it to 0 if it is negative.
            if(this.viewerHeight < 0) { return this.viewerHeight = 0 }
          },
      )
    },
    moveFromLeft: function (initialEvent) {
      this.$refs.draggableContainerLeft.style = {};
      const initialPosition = this.$refs.draggableContainerLeft.size;
      const initialWidth = this.viewerWidthLeft;
      if(this.hasMirrorPadding) {
        this.moveLeftRight(initialEvent, 'left')
      }
      trackMouseDrag(
          initialEvent,
          (dx) => {
            const positionLeft = initialPosition + dx;
            this.$refs.draggableContainerLeft.style.left = positionLeft + 'px';

            // SNAP TO GRID
            if(this.hasSnapToGrid) {
              this.viewerWidthLeft = initialWidth + (dx - dx%4);
            } else {
              this.viewerWidthLeft = initialWidth + dx;
            }
            // Do not allow dragger to go futher than its original position
            if(positionLeft < this.originalDraggerPosition) {
              this.$refs.draggableContainerLeft.style.left = this.originalDraggerPosition + 'px';
              return;
            }
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeight, this.viewerWidthRight, 0, this.viewerWidthLeft] })
          },
          () => {
            if(this.viewerWidthLeft < 0) { return this.viewerWidthLeft = 0 }
          },
      )
    },
    moveFromRight: function (initialEvent) {
      this.$refs.draggableContainerRight.style = {};
      const initialPosition = this.$refs.draggableContainerRight.size;
      const initialWidth = this.viewerWidthRight;
      if(this.hasMirrorPadding) {
        this.moveLeftRight(initialEvent, 'right')
      }
      trackMouseDrag(
          initialEvent,
          (dx) => {
            const positionRight = initialPosition - dx;
            this.$refs.draggableContainerRight.style.right = positionRight + 'px';
            // SNAP TO GRID
            if(this.hasSnapToGrid) {
              this.viewerWidthRight = initialWidth - (dx - dx%4);
            } else {
              this.viewerWidthRight = initialWidth - dx;
            }
            // Do not allow dragger to go futher than its original position
            if(positionRight < this.originalDraggerPosition) {
              this.$refs.draggableContainerLeft.style.right = this.originalDraggerPosition + 'px';
              return;
            }
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeight, this.viewerWidthRight, 0, this.viewerWidthLeft] })
          },
          () => {
            if(this.viewerWidthRight < 0) { return this.viewerWidthRight = 0 }
          },
      )
    },
    moveLeftRight: function (initialEvent, direction) {
      const isLeft = direction === 'left';
      const initialPosition = isLeft ? this.$refs.draggableContainerRight.offsetLeft : this.parentWidth - this.$refs.draggableContainerRight.offsetLeft;
      const initialWidth = this.viewerWidthRight;
      trackMouseDrag(
          initialEvent,
          (dx) => {
            if(isLeft) {
              this.$refs.draggableContainerLeft.style.left = initialPosition - dx + 'px';
              this.$refs.draggableContainerRight.style.left = initialPosition - dx + 'px';
            } else {
              this.$refs.draggableContainerLeft.style.left = initialPosition - dx + 'px';
            }
            // SNAP TO GRID - TODO: TO BE UPDATED WITH THE CALCULATIONS LIKE THOSE ABOVE
            if(this.hasSnapToGrid) {
              if(isLeft) {
                this.viewerWidthRight = initialWidth + (dx - dx%4);
              } else {
                this.viewerWidthLeft = initialWidth - (dx - dx%4);
              }
            } else {
              if(isLeft) {
                this.viewerWidthRight = initialWidth + dx;
              } else {
                this.viewerWidthLeft = initialWidth - dx;
              }
            }
            // Do not allow dragger to go futher than its original position
            if(isLeft ? initialPosition > this.originalDraggerPosition : initialPosition < this.originalDraggerPosition) {
              if(isLeft) {
                this.$refs.draggableContainerLeft.style.left = this.originalDraggerPosition + 'px';
              } else {
                this.$refs.draggableContainerLeft.style.left = this.originalDraggerPosition + 'px';
              }
              return;
            }
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeight, this.viewerWidthRight, 0, this.viewerWidthLeft] })
          },
          () => {
            if(this.viewerWidthRight < 0) { return this.viewerWidthRight = 0 }
            if(this.viewerWidthLeft < 0) { return this.viewerWidthLeft = 0 }
          },
      )
    },
  }
}
</script>

<style scoped>

</style>