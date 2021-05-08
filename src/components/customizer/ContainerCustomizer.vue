<template>
  <div>
    <div
        ref="draggableContainer"
        id="draggable-container"
        @mousedown.prevent.stop="moveSize($event)"
        :style="draggerStyles"
        class="dragger"
    />
    <div
      class="container-padding-viewer"
      :style="[viewerStyles, { height: viewerHeight + 'px'}]"
      @mousedown.prevent.stop="moveSize($event)"
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
    direction: String,
    parentHeight: Number,
    parentWidth: Number,
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
      const position = this.$refs.draggableContainer.offsetTop;
      const initialHeight = this.viewerHeight;
      trackMouseDrag(
          initialEvent,
          (dx, dy) => {
            const newDraggerTopPosition = position + dy;
            this.$refs.draggableContainer.style.top = newDraggerTopPosition + 'px';
            // SNAP TO GRID
            // if(dy%8 === 0 ) {
            //   console.log(dy%4, dy)
            //   this.viewerHeight = initialHeight + dy;
            // }
            this.viewerHeight = initialHeight + dy;

            if(newDraggerTopPosition < this.originalDraggerPosition) {
              this.$refs.draggableContainer.style.top = this.originalDraggerPosition + 'px';
              return;
            }
            this.$emit('update-padding', [this.viewerHeight])
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
  top: 50%;
  left: 50%;
  font-size: 13px;
  background-color: #438ce6;
  padding: 9px 14px;
  border-radius: 30px;
  color: white;
  z-index: 1001;
  display: none;
}
</style>