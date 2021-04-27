<template>
  <div
      ref="draggableContainer"
      id="draggable-container"
      class="dragger"
      @mouseup="handleMouseUp(direction)"
      @mousedown="dragMouseDown(direction, $event)"
      :class="[direction + '-dragger']"
      :style="draggerStyles"
  />
</template>

<script>
export default {
  name: "Dragger",
  props: {
    direction: String,
    parentHeight: Number,
    parentWidth: Number,
    bidirectionnal: Boolean,
  },
  data: () => ({
    positions: {
      clientX: undefined,
      clientY: undefined,
      movementX: 0,
      movementY: 0
    },
  }),
  computed: {
    draggerStyles() {
      let styles = {};
      if(['top', 'bottom'].includes(this.direction)) {
        // dagger basic styles for top and bottom
        styles = {
          height: '7px',
          width: this.parentWidth / 4 + 'px',
          left: this.makeDraggerSize(this.parentWidth),
        }
        // dagger position top
        if(this.direction === 'top') {
          return {
            ...styles,
            // top position of top dragger
            top: '10px',
          }
        }
        // dagger position bottom
        if(this.direction === 'bottom') {
          return {
            ...styles,
            bottom: '10px',
          }
        }
      }
      if(['left', 'right'].includes(this.direction)) {
        // dagger basic styles for left and right
        styles = {
          height: this.parentHeight / 4 + 'px',
          width: '7px',
          top: this.makeDraggerSize(this.parentHeight),
        }
        // dagger position
        if(this.direction === 'right') {
          return {
            ...styles,
            right: '10px',
          }
        }
        if(this.direction === 'left') {
          return {
            ...styles,
            left: '10px',
          }
        }
      }
      return styles
    }
  },
  methods: {
    makeDraggerSize: function (parentSize) {
      return ((parentSize / 2) - (parentSize / 8)) + 'px'
    },
    handleMouseUp: function (direction) {
      // remove direction from parent
      this.$emit('update-active-padding-viewer-direction', [direction])
    },
    dragMouseDown: function (direction, event) {
      event.preventDefault()
      // send direction to parent
      this.$emit('update-active-padding-viewer-direction', [direction])
      if(this.bidirectionnal) {
        if (this.direction === 'top' || this.direction === 'bottom') {
          this.$emit('update-active-padding-viewer-direction', ['top', 'bottom'])
        }
        if (this.direction === 'left' || this.direction === 'right') {
          this.$emit('update-active-padding-viewer-direction', ['left', 'right'])
        }
      }
      if(this.direction === 'top') {
        this.positions.clientY = event.clientY
        this.$emit('update-padding-viewer-size', this.direction, this.$refs.draggableContainer.offsetTop)
        document.onmousemove = this.elementDragMovement
        document.onmouseup = this.closeDragElement
      }
      if(this.direction === 'bottom') {
        this.positions.clientY = event.clientY
        const position = this.$refs.draggableContainer.offsetTop + 20;
        this.$emit('update-padding-viewer-size', this.direction, position - this.positions.movementY)
        document.onmousemove = this.elementDragMovement
        document.onmouseup = this.closeDragElement
      }
      if(this.direction === 'left') {
        this.positions.clientX = event.clientX
        this.$emit('update-padding-viewer-size', this.direction, this.$refs.draggableContainer.offsetLeft)
        document.onmousemove = this.elementDragMovement
        document.onmouseup = this.closeDragElement
      }
      if(this.direction === 'right') {
        this.positions.clientX = event.clientX
        this.$emit('update-padding-viewer-size', this.direction, this.$refs.draggableContainer.offsetLeft - this.positions.movementX)
        document.onmousemove = this.elementDragMovement
        document.onmouseup = this.closeDragElement
      }
    },
    elementDragMovement: function (event) {
      event.preventDefault()
      const maxPosition = {
        top: this.parentHeight - 10 - this.$refs.draggableContainer.offsetHeight,
        right: this.parentWidth - 10 - this.$refs.draggableContainer.offsetWidth,
        bottom: 10,
        left: 10
      }

      if(this.direction === 'top') {
        this.positions.movementY = this.positions.clientY - event.clientY
        this.positions.clientY = event.clientY
        const styleTop = this.$refs.draggableContainer.offsetTop - this.positions.movementY;
        this.$refs.draggableContainer.style.top = styleTop + 'px'
        this.$emit('update-padding-viewer-size', this.direction, styleTop)
        if(this.$refs.draggableContainer.offsetTop - this.positions.movementY < maxPosition.bottom) {
          this.$refs.draggableContainer.style.top = '0px'
        }
      }
      if(this.direction === 'bottom') {
        this.positions.movementY = this.positions.clientY - event.clientY
        this.positions.clientY = event.clientY
        const styleTop = (this.$refs.draggableContainer.offsetTop - this.positions.movementY)
        this.$refs.draggableContainer.style.top = styleTop + 'px'
        this.$emit('update-padding-viewer-size', this.direction, styleTop)
        if(maxPosition.top < this.$refs.draggableContainer.offsetTop) {
          this.$refs.draggableContainer.style.top = maxPosition.top + 'px'
        }
      }
      if(this.direction === 'left') {
        this.positions.movementX = this.positions.clientX - event.clientX
        this.positions.clientX = event.clientX
        const styleLeft = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX)
        this.$refs.draggableContainer.style.left = styleLeft + 'px'
        this.$emit('update-padding-viewer-size', this.direction, styleLeft)
        if((this.$refs.draggableContainer.offsetLeft - this.positions.movementX) < maxPosition.left) {
          this.$refs.draggableContainer.style.left = maxPosition.left + 'px'
        }
      }
      if(this.direction === 'right') {
        this.positions.movementX = this.positions.clientX - event.clientX
        this.positions.clientX = event.clientX
        const styleLeft = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX)
        this.$refs.draggableContainer.style.left = styleLeft + 'px'
        this.$emit('update-padding-viewer-size', this.direction, styleLeft)
        if(maxPosition.right < this.$refs.draggableContainer.offsetLeft ) {
          this.$refs.draggableContainer.style.left = maxPosition.right + 'px'
        }
      }
    },
    closeDragElement () {
      document.onmouseup = null
      document.onmousemove = null
    }
  }
}
</script>

<style>

.dragger {
  border-radius: 50px;
  position: absolute;
  z-index: 1000;
}

</style>