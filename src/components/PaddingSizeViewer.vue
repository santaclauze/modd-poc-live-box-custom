<template>
  <div
      class="padding-size-viewer"
      v-if="active.direction.includes(direction)"
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
    active: {
      direction: [],
      padding: {
        top: Number,
        right: Number,
        bottom: Number,
        left: Number,
      }
    }
  },
  computed: {
    styles: function() {
      const viewerStyles = {
        display: 'block'
      };
      if (this.direction === 'top' && this.active.padding.top !== 0) {
        return {
          ...viewerStyles,
          top: 0,
          right: 0,
          left: 0,
          height: (this.active.padding.top - 10) + 'px'}
      }
      if (this.direction === 'bottom' && this.active.padding.bottom !== 0) {
        return {
          ...viewerStyles,
          bottom: 0,
          right: 0,
          left: 0,
          height: (this.parentHeight - this.active.padding.bottom - 20) + 'px'}
      }
      if (this.direction === 'right' && this.active.padding.right !== 0) {
        return {
          ...viewerStyles,
          top: 0,
          bottom: 0,
          right: 0,
          width: (this.parentWidth - this.active.padding.right - 20) + 'px'}
      }
      if (this.direction === 'left' && this.active.padding.left !== 0) {
        return {
          ...viewerStyles,
          top: 0,
          bottom: 0,
          left: 0,
          width: (this.active.padding.left - 10) + 'px'}
      }
      return viewerStyles;
    }
  },
}
</script>

<style scoped>
.padding-size-viewer {
  background-color: lightskyblue;
  border: 1px dashed royalblue;
  position: absolute;
}
</style>