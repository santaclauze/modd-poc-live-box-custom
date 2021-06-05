<template>
  <div
    class="container-padding-viewer"
    :style="this.viewerStyles"
    @mousedown.prevent.stop="handleMouseDown"
  >
    <div
      :style="this.draggerStyles"
      class="dragger dragger-left"
      @mousedown.prevent.stop="handleMouseDown"
    />
    <div
        :style="this.draggerStyles"
        class="dragger dragger-right"
        @mousedown.prevent.stop="handleMouseDown"
    />
    <button
      v-if="parseInt(this.size, 10) > 0"
      class="padding-badge"
      :style="{backgroundColor: unit === '%' ? 'green' : '#438ce6'}"
      @click="handleClick"
    >{{makeSize(this.size)}}</button>
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
    unit: String,
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
      this.$emit('toggleUnit')
    },
    makeSize(size) {
      return this.unit === '%' ? Math.trunc(parseInt(size, 10)) + '%' : this.size
    }
  }
}
</script>

<style scoped>

button {
  border-color: #438ce6;
  cursor: pointer;
}

.container-padding-viewer {
  position: relative;
}

.container-padding-viewer:hover {
  cursor: grab;
}

.container-padding-viewer:hover {
  background-color: rgba(215,235,247,0.6);
}

.container-padding-viewer:hover .padding-badge {
  display: block;
}

.dragger {
  border-radius: 50px;
  position: absolute;
  z-index: 1000;
  cursor: hand;
  height: 5px;
  width: 15%;
  bottom: -10px;
}

.dragger-left {
  left: 20%;
}

.dragger-right {
  right: 20%;
}


.padding-badge {
  position: absolute;
  top: 45%;
  left: 48%;
  font-size: 13px;
  padding: 9px 14px;
  border-radius: 30px;
  color: white;
  z-index: 1001;
  display: none;
}

</style>