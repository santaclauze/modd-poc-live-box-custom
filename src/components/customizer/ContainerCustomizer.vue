<template>
  <div>
    <div
        ref="draggableContainer"
        id="draggable-container"
        class="dragger"
        @mousedown.prevent.stop="moveSize($event)"
        :style="draggerStyles"
    />
    <div
      class="container-padding-viewer"
      ref="viewerContainer"
      :style="[viewerStyles]"
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
    document.removeEventListener('mouseup', mouseUp);
    document.removeEventListener('mousemove', mouseMove);
    onDone(e.pageX - initEvent.pageX, e.pageY - initEvent.pageY);
    e.preventDefault();
    e.stopPropagation();
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
      trackMouseDrag(
          initialEvent,
          (dx, dy) => {
            const height = position + dy;
            this.$refs.draggableContainer.style.top = height + 'px';
            this.$refs.viewerContainer.style.height = dy + 'px';

            if(0 > dy) {
              this.$refs.draggableContainer.style.top = position + 'px'
            }
            this.$emit('update-padding', [dy])
          },
          (dx, dy) => {
            const height = position + dy;
            this.$refs.draggableContainer.style.top = height + 'px';
            this.$refs.viewerContainer.style.height = dy + 'px';

            if(0 > dy) {
              this.$refs.draggableContainer.style.top = position + 'px'
            }
            this.$emit('update-padding', [dy])
          },
      )
    },
  }
}
</script>

<style scoped>
div:hover > .container-padding-viewer {
  background-color: lightskyblue;
  outline: 1px dashed royalblue;
}

.dragger {
  border-radius: 50px;
  position: absolute;
  z-index: 1000;
}
</style>