<template>
  <div
      class="padding-size-viewer"
      :class="[direction + '-padding-size-viewer']"
      :style="[styles]"
  />
</template>

// DEPRECATED

<script>
export default {
  name: "PaddingSizeViewer",
  props: {
    direction: String,
    size: String,
    parentHeight: Number,
    parentWidth: Number,
    activePadding: {
      direction: [],
      size: String,
    }
  },
  computed: {
    styles: function() {
      const viewerStyles = {
        display: 'block'
      };
      if (this.activePadding.direction.includes('top')) {
        return {
          ...viewerStyles,
          top: 0,
          right: '1px',
          left: '1px',
          height: (this.activePadding.size - 10) + 'px'}
      }
      if (this.activePadding.direction.includes('bottom')) {
        return {
          ...viewerStyles,
          bottom: 0,
          right: '1px',
          left: '1px',
          height: (this.parentHeight - this.activePadding.size - 20) + 'px'}
      }
      if (this.activePadding.direction.includes('right')) {
        return {
          ...viewerStyles,
          top: '1px',
          bottom: '1px',
          right: 0,
          width: (this.parentWidth - this.activePadding.size - 20) + 'px'}
      }
      if (this.activePadding.direction.includes('left')) {
        return {
          ...viewerStyles,
          top: '1px',
          bottom: '1px',
          left: 0,
          width: (this.activePadding.size - 10) + 'px'}
      }
      return viewerStyles;
    }
  },
}
</script>

<style scoped>
.padding-size-viewer {
  background-color: rgba(215,235,247,0.6);
  position: absolute;
}
</style>