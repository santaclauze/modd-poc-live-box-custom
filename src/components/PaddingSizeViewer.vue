<template>
  <div
      class="padding-size-viewer"
      :class="[direction + '-padding-size-viewer']"
      :style="[styles]"
  />
</template>

<script>
export default {
  name: "PaddingSizeViewer",
  props: {
    direction: String,
    size: String,
    parentHeight: Number,
    parentWidth: Number,
    activePaddingSizeViewer: {
      direction: [],
      size: String,
    }
  },
  methods: {
    validateDirection: function (activeDirection) {
      return (this.direction === activeDirection && this.activePaddingSizeViewer.direction.includes(activeDirection))
    },
  },
  computed: {
    styles: function() {
      const viewerStyles = {
        display: 'block'
      };
      if (this.activePaddingSizeViewer.direction.includes('top')) {
        return {
          ...viewerStyles,
          top: 0,
          right: 0,
          left: 0,
          height: (this.activePaddingSizeViewer.size - 10) + 'px'}
      }
      if (this.activePaddingSizeViewer.direction.includes('bottom')) {
        return {
          ...viewerStyles,
          bottom: 0,
          right: 0,
          left: 0,
          height: (this.parentHeight - this.activePaddingSizeViewer.size - 10) + 'px'}
      }
      if (this.activePaddingSizeViewer.direction.includes('right')) {
        return {
          ...viewerStyles,
          top: 0,
          bottom: 0,
          right: 0,
          width: (this.parentWidth - this.activePaddingSizeViewer.size - 10) + 'px'}
      }
      if (this.activePaddingSizeViewer.direction.includes('left')) {
        return {
          ...viewerStyles,
          top: 0,
          bottom: 0,
          left: 0,
          width: (this.activePaddingSizeViewer.size - 10) + 'px'}
      }
      return viewerStyles;
    }
  },
}
</script>

<style scoped>
.padding-size-viewer {
  background-color: lightskyblue;
  outline: 1px dashed royalblue;
  position: absolute;
}
</style>