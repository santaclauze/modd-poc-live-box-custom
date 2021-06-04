<template>
  <div>
    <PaddingViewer
      :viewerStyles="[viewerStyles, { height: size.top + 'px', top: 0 }]"
      :draggerStyles="[draggerYStyles, { bottom: '-10px' }]"
      :size="size.top + 'px'"
      @move="moveFromTop"
    />
    <PaddingViewer
        :viewerStyles="[viewerStyles, { height: size.bottom + 'px', bottom: 0 }]"
        :draggerStyles="[draggerYStyles, { bottom: '10px' }]"
        :size="size.bottom + 'px'"
        @move="moveFromBottom"
    />
    <PaddingViewer
        :viewerStyles="[viewerStylesSides, {
          width: calculateSize(isPercent, size.left, parentWidth) + 'px', left: 0
        }]"
        :draggerStyles="[draggerXStyles, { right: '-10px' }]"
        :size="calculateSize(isPercent, size.left, parentWidth) + 'px'"
        :isUnitToggleable=true
        :isPercent="isPercent"
        @move="moveFromLeft"
        @toggleUnit="handleToggleUnit"
    />
    <PaddingViewer
        :viewerStyles="[viewerStylesSides, {
          width: calculateSize(isPercent, size.right, parentWidth) + 'px', right: 0
        }]"
        :draggerStyles="[draggerXStyles, { left: '-10px' }]"
        :size="calculateSize(isPercent, size.right, parentWidth) + 'px'"
        :isUnitToggleable=true
        :isPercent="isPercent"
        @move="moveFromRight"
        @toggleUnit="handleToggleUnit"
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
      const initialPositionLeft = this.size.left;
      const initialPositionRight = this.size.right;
      trackMouseDrag(
        initialEvent,
        (dx, dy, { shift, ctrl }) => {
          // SNAP TO GRID
          this.size.left = shift ?
              initialPositionLeft + dx : initialPositionLeft + (dx - dx % 4);

          if(ctrl) {
            this.size.right = shift ?
                initialPositionRight + dx : initialPositionRight + (dx - dx % 4);
          }

          this.$emit('update-padding', {
            size: [
              this.size.top,
              ctrl ? this.calculateSize(this.isPercent, this.size.right, this.parentWidth) : this.size.right,
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
      const initialPositionLeft = this.size.left;
      const initialPositionRight = this.size.right;
      trackMouseDrag(
        initialEvent,
          (dx, dy, { shift, ctrl }) => {
            // SNAP TO GRID
            this.size.right = shift ?
                initialPositionRight - dx : initialPositionRight - (dx - dx % 4);

            if(ctrl) {
              this.size.left = shift ?
                  initialPositionLeft - dx : initialPositionLeft - (dx - dx % 4);
            }

          this.$emit('update-padding', {
            size: [
              this.size.top,
              this.calculateSize(this.isPercent, this.size.right, this.parentWidth),
              this.size.bottom,
              ctrl ? this.calculateSize(this.isPercent, this.size.left, this.parentWidth) : this.size.left,
            ],
            unit: { x: this.isPercent ? '%' : 'px' }
          })
        },
        () => {
          if(this.size.right < 0) { return this.size.right = 0 }
        },
      )
    },
  },
}
</script>

<style scoped>

</style>