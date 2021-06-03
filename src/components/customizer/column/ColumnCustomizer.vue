<template>
  <div>
    <PaddingViewer
      ref="draggableContainerTop"
      :viewerStyles="[viewerStyles, { height: size.top + 'px', top: 0 }]"
      :draggerStyles="[draggerYStyles, { bottom: '-10px' }]"
      @move="moveFromTop"
      :size="size.top + 'px'"
    />
    <PaddingViewer
        ref="draggableContainerBottom"
        :viewerStyles="[viewerStyles, { height: size.bottom + 'px', bottom: 0 }]"
        :draggerStyles="[draggerYStyles, { bottom: '10px' }]"
        @move="moveFromBottom"
        :size="size.bottom + 'px'"
    />
    <PaddingViewer
        ref="draggableContainerLeft"
        :viewerStyles="[viewerStylesSides, {
          width: calculateSize(isPercent, size.left, parentWidth) + 'px', left: 0
        }]"
        :draggerStyles="[draggerXStyles, { right: '-10px' }]"
        @move="moveFromLeft"
        @toggleUnit="handleToggleUnit"
        :size="calculateSize(isPercent, size.left, parentWidth) + 'px'"
        :isUnitToggleable=true
    />
    <PaddingViewer
        ref="draggableContainerRight"
        :viewerStyles="[viewerStylesSides, {
          width: calculateSize(isPercent, size.right, parentWidth) + 'px', right: 0
        }]"
        :draggerStyles="[draggerXStyles, { left: '-10px' }]"
        @move="moveFromRight"
        @toggleUnit="handleToggleUnit"
        :isPercent="isPercent"
        :size="calculateSize(isPercent, size.right, parentWidth) + 'px'"
        :isUnitToggleable=true
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
    // TODO: add crtl eventv via this method
    onMove(
      e.pageX - initEvent.pageX,
      e.pageY - initEvent.pageY,
      { ctrl: e.ctrlKey, alt: e.altKey, shift:e.shiftKey }
    );
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
    parentHeight: String,
    parentWidth: String,
  },
  data: () => ({
    size: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    isPercent: false,
  }),
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
    calculateSize: function(isPercent, viewerSize, parentSize) {
      // if(typeof(viewerSize || parentSize) === 'string') return;
      if(isPercent) {
        return toPercent(viewerSize, parentSize)
      } else {
        return viewerSize
      }
    },
    handleToggleUnit: function() {
      this.isPercent = !this.isPercent;
    },
    moveFromTop: function (initialEvent) {
      const initialPosition = this.size.top;
      trackMouseDrag(
        initialEvent,
        (dx, dy, { shift }) => {

          // SNAP TO GRID
          this.size.top = shift ?
              initialPosition + dy : initialPosition + (dy - dy % 4);

          this.$emit('update-padding', {
            size: [this.size.top, this.size.right, 0, this.size.left],
            unit: { x: 'px' }
          })
        },
        () => {
          // we do not want to save a negative height value. Set it to 0 if it is negative.
          if(this.size.top < 0) {
            return this.size.top = 0
          }
        },
      )
    },
    // TODO: has a bug when parent is bigger than child
    moveFromBottom: function (initialEvent) {
      const initialPosition = this.size.bottom;
      trackMouseDrag(
        initialEvent,
        (dx, dy, { shift }) => {
          // SNAP TO GRID
          this.size.bottom = shift ?
              initialPosition + dy : initialPosition + (dy - dy % 4);

          this.$emit('update-padding', {
            size: [this.size.top, this.size.right, this.size.bottom, this.size.left],
            unit: { x: 'px' }
          })
        },
        () => {
          // we do not want to save a negative height value. Set it to 0 if it is negative.
          if(this.size.bottom < 0) {
            return this.size.bottom = 0
          }
        },
      )
    },

    moveFromLeft: function (initialEvent) {
      const initialPosition = this.size.left;
      // if(this.hasMirrorPadding) {
      //   this.moveLeftRight(initialEvent, 'left')
      // }
      trackMouseDrag(
        initialEvent,
        (dx, dy, { shift }) => {

          // SNAP TO GRID
          this.size.left = shift ?
              initialPosition + dx : initialPosition + (dx - dx % 4);

          this.$emit('update-padding', {
            size: [
              this.size.top,
              this.size.right,
              this.size.bottom,
              this.calculateSize(this.isPercent, this.size.left, this.parentWidth),
            ],
            unit: { x: this.isPercent ? '%' : 'px' }
          })
        },
        () => {
          if(this.size.left < 0) { return this.size.left = 0 }
        },
      )
    },
    moveFromRight: function (initialEvent) {
      const initialPosition = this.size.right;
      // if(this.hasMirrorPadding) {
      //   this.moveLeftRight(initialEvent, 'right')
      // }
      trackMouseDrag(
        initialEvent,
          (dx, dy, { shift }) => {
            // SNAP TO GRID
            this.size.right = shift ?
                initialPosition - dx : initialPosition - (dx - dx % 4);

          this.$emit('update-padding', {
            size: [
              this.size.top,
              this.calculateSize(this.isPercent, this.size.right, this.parentWidth),
              this.size.bottom,
              this.size.left
            ],
            unit: { x: this.isPercent ? '%' : 'px' }
          })
        },
        () => {
          if(this.size.right < 0) { return this.size.right = 0 }
        },
      )
    },
    moveLeftRight: function (initialEvent, direction) {
      const isLeft = direction === 'left';
      const initialPosition = isLeft ? this.$refs.draggableContainerRight.offsetLeft : this.parentWidth - this.$refs.draggableContainerRight.offsetLeft;
      const initialWidth = this.viewerWidthRight;
      trackMouseDrag(
        initialEvent,
        (dx, dy, { crtl, alt }) => {
          if(isLeft || crtl) {
            this.$refs.draggableContainerLeft.style.left = initialPosition - dx + 'px';
            this.$refs.draggableContainerRight.style.left = initialPosition - dx + 'px';
          } else {
            this.$refs.draggableContainerLeft.style.left = initialPosition - dx + 'px';
          }
          if(alt) {
            if(isLeft || crtl) {
              this.viewerWidthRight = initialWidth + (dx - dx%4);
            } else {
              this.viewerWidthLeft = initialWidth - (dx - dx%4);
            }
          } else {
            if(isLeft || crtl) {
              this.viewerWidthRight = initialWidth + dx;
            } else {
              this.viewerWidthLeft = initialWidth - dx;
            }
          }
          // Do not allow dragger to go futher than its original position
          if(isLeft || crtl ? initialPosition > this.originalDraggerPosition : initialPosition < this.originalDraggerPosition) {
            if(isLeft || crtl) {
              this.$refs.draggableContainerLeft.style.left = this.originalDraggerPosition + 'px';
            } else {
              this.$refs.draggableContainerLeft.style.left = this.originalDraggerPosition + 'px';
            }
            return;
          }
          this.$emit('update-padding',
            {
              breakpoint: 'l',
              padding: [
                this.viewerHeightTop,
                this.calculateSize(this.isPercent, this.viewerWidthRight, this.parentWidth),
                this.viewerHeightBottom,
                this.calculateSize(this.isPercent, this.viewerWidthLeft, this.parentWidth),
              ]
            })
        },
        () => {
          if(this.viewerWidthRight < 0) { return this.viewerWidthRight = 0 }
          if(this.viewerWidthLeft < 0) { return this.viewerWidthLeft = 0 }
        },
      )
    },
  },
  // moveFromRight2: makeMoveLR('right',-1),
}

// TODO: Refactor to function factory
// TODO: try to simplify

// makeMoveFunc: function (side, initialEvent) {
//   const initialPosition = this.viewerHeight;
//   trackMouseDrag(
//       initialEvent,
//       (dx, dy, {shift}) => {
//         const position = initialPosition + dy;
//
//         // SNAP TO GRID
//         this.viewerHeight = shift ? initialPosition + dy : initialPosition + (dy - dy % 4);
//
//         // Do not allow dragger to go futher than its original position
//         if (position < 0) {
//           return this.viewerHeight = 0;
//         }
//         this.$emit('update-padding', {breakpoint: 'l', padding: [this.viewerHeight, 15, 0, 15]})
//       },
//       () => {
//         // we do not want to save a negative height value. Set it to 0 if it is negative.
//         if (this.viewerHeight < 0) {
//           return this.viewerHeight = 0
//         }
//       },
//   )
// },
</script>

<style scoped>

</style>