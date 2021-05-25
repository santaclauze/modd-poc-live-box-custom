<template>
  <div>
    <PaddingViewer
      ref="draggableContainerTop"
      :viewerStyles="[viewerStyles, { height: viewerHeightTop + 'px', top: 0 }]"
      :draggerStyles="[draggerYStyles, { bottom: '-10px' }]"
      @move="moveFromTop"
      :size="this.viewerHeightTop"
    />
    <PaddingViewer
        ref="draggableContainerBottom"
        :viewerStyles="[viewerStyles, { height: viewerHeightBottom + 'px', bottom: 0 }]"
        :draggerStyles="[draggerYStyles, { bottom: '10px' }]"
        @move="moveFromBottom"
        :size="this.viewerHeightBottom"
    />
    <PaddingViewer
        ref="draggableContainerLeft"
        :viewerStyles="[viewerStylesSides, { width: viewerWidthLeft + 'px', left: 0 }]"
        :draggerStyles="[draggerXStyles, { right: '-10px' }]"
        @move="moveFromLeft"
        :size="this.viewerWidthLeft"
        :isToggleable=true
    />
    <PaddingViewer
        ref="draggableContainerRight"
        :viewerStyles="[viewerStylesSides, { width: calculateSize(displayInPercent.length > 0, viewerWidthRight), right: 0 }]"
        :draggerStyles="[draggerXStyles, { left: '-10px' }]"
        @move="moveFromRight"
        @toggleUnit="handleToggleUnit"
        :isPercent="displayInPercent.length > 0"
        :size="parseInt(this.viewerWidthRight, 10)"
        :isToggleable=true
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
    viewerHeightTop: 0,
    viewerHeightBottom: 0,
    originalDraggerPosition: 0,
    displayInPercent: '',
  }),
  mounted() {
    this.originalDraggerPosition = this.$refs.draggableContainerTop.offsetTop;
  },
  computed: {
    draggerYStyles() {
      return {
        height: '5px',
        width: '25%',
        left: '37.5%',
      };
    },
    draggerXStyles() {
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
      }
    }
  },
  methods: {
    toPercent,
    calculateSize: function(isPercent, size) {
      if(isPercent) {
        return size + '%'
      } else {
        return size + 'px'
      }
    },
    handleToggleUnit: function(direction) {
      this.displayInPercent = direction;
    },
    moveFromTop: function (initialEvent) {
      this.$refs.draggableContainerTop.style = {};
      const initialPosition = this.$refs.draggableContainerTop.size;
      const initialHeight = this.viewerHeightTop;
      trackMouseDrag(
          initialEvent,
          (dx, dy) => {
            const position = initialPosition + dy;
            // Avoids bug when dragger does not stick to position accurately
            this.$refs.draggableContainerTop.style.top = position + 'px';
            // SNAP TO GRID
            if(this.hasSnapToGrid) {
              this.viewerHeightTop = initialHeight + (dy - dy%4);
            } else {
              this.viewerHeightTop = initialHeight + dy;
            }

            // Do not allow dragger to go futher than its original position
            if(position < this.originalDraggerPosition) {
              this.$refs.draggableContainerTop.style.top = this.originalDraggerPosition + 'px';
              return;
            }
            // when we add padding top, we do not want to squash the image, so we update the height at the same time
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeightTop, this.viewerWidthRight, 0, this.viewerWidthLeft] })
          },
          () => {
            // we do not want to save a negative height value. Set it to 0 if it is negative.
            if(this.viewerHeightTop < 0) { return this.viewerHeightTop = 0 }
          },
      )
    },
    moveFromBottom: function (initialEvent) {
      this.$refs.draggableContainerBottom.style = {};
      const initialPosition = this.$refs.draggableContainerBottom.size;
      const initialHeight = this.viewerHeightBottom;
      trackMouseDrag(
          initialEvent,
          (dx, dy) => {
            const position = initialPosition - dy;
            // Avoids bug when dragger does not stick to position accurately
            this.$refs.draggableContainerBottom.style.top = position + 'px';
            // SNAP TO GRID
            if(this.hasSnapToGrid) {
              this.viewerHeightBottom = initialHeight + (dy - dy%4);
            } else {
              this.viewerHeightBottom = initialHeight + dy;
            }

            // Do not allow dragger to go futher than its original position
            if(position < this.originalDraggerPosition) {
              this.$refs.draggableContainerTop.style.top = this.originalDraggerPosition + 'px';
              return;
            }
            // when we add padding top, we do not want to squash the image, so we update the height at the same time
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeightTop, this.viewerWidthRight, this.viewerHeightBottom, this.viewerWidthLeft] })
          },
          () => {
            // we do not want to save a negative height value. Set it to 0 if it is negative.
            if(this.viewerHeightTop < 0) { return this.viewerHeightTop = 0 }
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
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeightTop, this.viewerWidthRight, this.viewerHeightBottom, this.viewerWidthLeft] })
          },
          () => {
            if(this.viewerWidthLeft < 0) { return this.viewerWidthLeft = 0 }
          },
      )
    },
    moveFromRight: function (initialEvent) {
      this.$refs.draggableContainerRight.style = {};
      let initialPosition;
      let initialWidth;
      // if(this.displayInPercent === 'right') {
      //   initialPosition = toPercent(this.$refs.draggableContainerRight.size, this.parentWidth);
      //   initialWidth = toPercent(this.viewerWidthRight, this.parentWidth);
      // } else {
      //   initialPosition = this.$refs.draggableContainerRight.size;
      //   initialWidth = this.viewerWidthRight;
      // }
      initialPosition = this.$refs.draggableContainerRight.size;
      initialWidth = this.viewerWidthRight;

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
            if(this.displayInPercent === 'right') {
              this.viewerWidthRight = toPercent(this.viewerWidthRight, this.parentWidth);
            }
            // Do not allow dragger to go futher than its original position
            if(positionRight < this.originalDraggerPosition) {
              this.$refs.draggableContainerLeft.style.right = this.originalDraggerPosition + 'px';
              return;
            }
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeightTop, this.viewerWidthRight, this.viewerHeightBottom, this.viewerWidthLeft] })
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
            this.$emit('update-padding', { breakpoint: 'l', padding: [this.viewerHeightTop, this.viewerWidthRight, this.viewerHeightBottom, this.viewerWidthLeft] })
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