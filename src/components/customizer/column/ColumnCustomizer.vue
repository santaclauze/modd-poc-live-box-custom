<template>
  <div>
    <DoublePaddingViewer
      :viewerStyles="[viewerStyles, { height: size.top + 'px', top: 0 }]"
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
          width: makeSize(unit, size.left, parentWidth), left: 0
        }]"
        :draggerStyles="[draggerXStyles, { right: '-10px' }]"
        :size="makeSize(unit, size.left, parentWidth)"
        :isUnitToggleable=true
        :unit="unit"
        @move="moveFromLeft"
        @toggleUnit="handleToggleUnit"
    />
    <PaddingViewer
        :viewerStyles="[viewerStylesSides, {
          width: makeSize(unit, size.right, parentWidth), right: 0
        }]"
        :draggerStyles="[draggerXStyles, { left: '-10px' }]"
        :size="makeSize(unit, size.right, parentWidth)"
        :isUnitToggleable=true
        :unit="unit"
        @move="moveFromRight"
        @toggleUnit="handleToggleUnit"
    />
  </div>
</template>

<script lang="ts">

import {toPercent, trackMouseDrag} from "../../../helper";
import PaddingViewer from '../../ui/PaddingViewer';
import DoublePaddingViewer from '../../ui/DoublePaddingViewer';

export default {
  name: "ContainerCustomizer",
  components: {
    PaddingViewer,
    DoublePaddingViewer,
  },
  props: {
    parentHeight: Number,
    parentWidth: Number,
  },
  data: () => ({
    size: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    unit: 'px',
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
    makeSize: function(unit: 'px'|'%', viewerSize: number, parentSize?: number): string {
      if(unit === '%' && parentSize) {
        return toPercent(viewerSize, parentSize) + unit
      } else {
        return viewerSize + unit
      }
    },
    handleToggleUnit: function(): void {
      this.unit = this.unit === 'px' ? '%' : 'px';
    },
    moveFromTop: function (initialEvent: MouseEvent) {
      const initialPosition = this.size.top;
      trackMouseDrag(
        initialEvent,
        (dx, dy, { shift }) => {

          // SNAP TO GRID
          this.size.top = shift ?
              initialPosition + dy : initialPosition + (dy - dy % 4);
          this.$emit('update-padding', {
            // top and bottom are always expressed in PX
            size: [this.makeSize('px', this.size.top), this.size.right, 0, this.size.left],
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
    moveFromBottom: function (initialEvent: MouseEvent) {
      const initialPosition = this.size.bottom;
      trackMouseDrag(
        initialEvent,
        (dx, dy, { shift }) => {
          // SNAP TO GRID
          this.size.bottom = shift ?
              initialPosition + dy : initialPosition + (dy - dy % 4);

          this.$emit('update-padding', {
            // top and bottom are always expressed in PX
            size: [this.size.top, this.size.right, this.makeSize('px', this.size.bottom), this.size.left],
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

    moveFromLeft: function (initialEvent: MouseEvent) {
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
              ctrl ? this.makeSize(this.unit, this.size.right, this.parentWidth) : this.size.right,
              this.size.bottom,
              this.makeSize(this.unit, this.size.left, this.parentWidth),
            ],
          })
        },
        () => {
          if(this.size.left < 0) { return this.size.left = 0 }
        },
      )
    },
    moveFromRight: function (initialEvent: MouseEvent) {
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
              this.makeSize(this.unit, this.size.right, this.parentWidth),
              this.size.bottom,
              ctrl ? this.makeSize(this.unit, this.size.left, this.parentWidth) : this.size.left,
            ],
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