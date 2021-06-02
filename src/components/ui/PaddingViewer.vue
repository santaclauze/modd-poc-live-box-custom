<template>
  <div
    class="container-padding-viewer"
    :style="this.viewerStyles"
    @mousedown.prevent.stop="handleMouseDown"
  >
    <div
      :style="this.draggerStyles"
      class="dragger"
      @mousedown.prevent.stop="handleMouseDown"
    />
    <button
      v-if="parseInt(this.size, 10) > 0"
      class="padding-badge"
      @click="handleClick"
    >{{this.size}}</button>
  </div>
</template>

<script>
// TODO: improve button styles
export default {
  name: "PaddingViewer",
  props: {
    viewerStyles: Array,
    move: Function,
    toggleUnit: Function,
    draggerStyles: Array,
    isPercent: Boolean,
    isUnitToggleable: {
      type: Boolean,
      default: false,
    },
    size: String
  },
  methods: {
    handleMouseDown(e) {
      this.$emit('move', e)
    },
    handleClick() {
      if(parseInt(this.size, 10) > 0 && !this.isUnitToggleable) return;
      this.$emit('toggleUnit', !this.isPercent)
    }
  }
}
</script>

<style scoped>

.container-padding-viewer {
  position: relative;
}

.container-padding-viewer:hover {
  cursor: grab;
  background: deepskyblue;
}

.dragger {
  border-radius: 50px;
  position: absolute;
  z-index: 1000;
  cursor: hand;
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