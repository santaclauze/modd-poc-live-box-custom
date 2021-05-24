<template>
  <div
      class="container-padding-viewer"
      :style="this.viewerStyles"
      @mousedown.prevent.stop="handleMouseDown"
  >
    <div
        :style="this.draggerStyles"
        class="dragger"
    />
    <div v-if="this.size > 0" class="padding-badge">{{this.size}}px</div>
  </div>
</template>

<script>
export default {
  name: "PaddingViewer",
  props: {
    viewerStyles: Array,
    move: Function,
    draggerStyles: Array,
    size: Number
  },
  methods: {
    handleMouseDown(e) {
      this.$emit('move', e)
    }
  }
}
</script>

<style scoped>

.container-padding-viewer {
  position: relative;
}

.dragger {
  border-radius: 50px;
  position: absolute;
  z-index: 1000;
}

.padding-badge {
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