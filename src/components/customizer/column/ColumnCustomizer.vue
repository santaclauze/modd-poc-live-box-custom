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
        ref="draggableContainerLeft"
        @mousedown.prevent.stop="moveFromLeft"
        :style="[draggerLeftStyles, { left: '10px' }]"
        class="dragger"
    />
    <div
        class="container-padding-viewer"
        :style="[viewerStylesSides, { width: viewerWidthLeft + 'px'}]"
        @mousedown.prevent.stop="moveFromLeft"
    >
      <div v-if="this.viewerWidthLeft > 0" class="height-displayer">{{toPercent(this.viewerWidthLeft, this.parentWidth)}}%</div>
    </div>
    <div
        ref="draggableContainerRight"
        @mousedown.prevent.stop="moveFromRight"
        :style="[draggerRightStyles, { right: '10px' }]"
        class="dragger"
    />
    <div
        class="container-padding-viewer"
        :style="[viewerStylesSides, { width: viewerWidthRight + 'px', left: 'unset', right: 0 }]"
        @mousedown.prevent.stop="moveFromRight"
    >
      <div v-if="this.viewerWidthRight > 0" class="height-displayer">{{toPercent(this.viewerWidthRight,this.parentWidth)}}%</div>
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

import { toPercent } from "../../../helper";

export default {
  name: "ContainerCustomizer",
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
        height: '7px',
        width: this.parentWidth / 4 + 'px',
        left: this.makeDraggerSize(this.parentWidth),
      };
    },
    draggerLeftStyles() {
      return {
        width: '5px',
        top: this.parentHeight / 4 + 'px',
        height: this.makeDraggerSize(this.parentHeight),
      };
    },
    draggerRightStyles() {
      return {
        width: '5px',
        top: this.parentHeight / 4 + 'px',
        height: this.makeDraggerSize(this.parentHeight),
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
      const initialPosition = this.$refs.draggableContainer.offsetTop;
      const initialHeight = this.viewerHeight;
      trackMouseDrag(
          initialEvent,
          (dx, dy) => {
            const position = initialPosition + dy;
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
      const initialPosition = this.$refs.draggableContainerLeft.offsetLeft;
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
      const initialPosition = this.parentWidth - this.$refs.draggableContainerRight.offsetLeft;
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
              if(dx%4 === 0) {
                if(isLeft) {
                  this.viewerWidthRight = initialWidth + dx;
                } else {
                  this.viewerWidthLeft = initialWidth - dx;
                }
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