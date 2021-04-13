<template>
  <div
    ref="draggableContainer"
    id="draggable-container"
    class="dragger"
    @mouseup="handleMouseUp(direction)"
    @mousedown="dragMouseDown(direction, $event)"
    :class="[direction + '-dragger']"
  />
</template>

<script>
export default {
  name: "Dragger",
  props: {
    direction: String,
    parentHeight: Number,
    parentWidth: Number,
  },
  data: () => ({
    positions: {
      clientX: undefined,
      clientY: undefined,
      movementX: 0,
      movementY: 0
    },
  }),
  methods: {
    handleMouseUp: function (direction) {
      this.$emit('update-active-padding-viewer-direction', direction)
      // remove size to avoid displaying viewer when unwanted
      this.$emit('update-padding-viewer-size', 0)
    },
    dragMouseDown: function (direction, event) {
      event.preventDefault()
      this.$emit('update-active-padding-viewer-direction', direction)
      if(['top', 'bottom'].includes(this.direction)) {
        this.positions.clientY = event.clientY
        // make sure that onClick viewer displays the right side straight away
        this.$emit('update-padding-viewer-size', this.$refs.draggableContainer.offsetTop - this.positions.movementY)
        document.onmousemove = this.elementDrag
        document.onmouseup = this.closeDragElement
      }
      if(['left', 'right'].includes(this.direction)) {
        this.positions.clientX = event.clientX
        // make sure that onClick viewer displays the right side straight away
        this.$emit('update-padding-viewer-size', this.$refs.draggableContainer.offsetLeft - this.positions.movementX)
        document.onmousemove = this.elementDrag
        document.onmouseup = this.closeDragElement
      }
    },
    elementDrag: function (event) {
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
        const styleTop = (this.$refs.draggableContainer.offsetTop - this.positions.movementY)
        this.$refs.draggableContainer.style.top = styleTop + 'px'
        this.$emit('update-padding-viewer-size', styleTop)
        if(this.$refs.draggableContainer.offsetTop - this.positions.movementY < maxPosition.bottom) {
          this.$refs.draggableContainer.style.top = maxPosition.bottom + 'px'
        }
      }
      if(this.direction === 'bottom') {
        this.positions.movementY = this.positions.clientY - event.clientY
        this.positions.clientY = event.clientY
        const styleTop = (this.$refs.draggableContainer.offsetTop - this.positions.movementY)
        this.$refs.draggableContainer.style.top = styleTop + 'px'
        this.$emit('update-padding-viewer-size', styleTop)
        if(maxPosition.top < this.$refs.draggableContainer.offsetTop) {
          this.$refs.draggableContainer.style.top = maxPosition.top + 'px'
        }
      }
      if(this.direction === 'left') {
        this.positions.movementX = this.positions.clientX - event.clientX
        this.positions.clientX = event.clientX
        const styleLeft = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX)
        this.$refs.draggableContainer.style.left = styleLeft + 'px'
        this.$emit('update-padding-viewer-size', styleLeft)
        if((this.$refs.draggableContainer.offsetLeft - this.positions.movementX) < maxPosition.left) {
          this.$refs.draggableContainer.style.left = maxPosition.left + 'px'
        }
      }
      if(this.direction === 'right') {
        this.positions.movementX = this.positions.clientX - event.clientX
        this.positions.clientX = event.clientX
        const styleLeft = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX)
        this.$refs.draggableContainer.style.left = styleLeft + 'px'
        this.$emit('update-padding-viewer-size', styleLeft)
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


.dragger.top-dragger {
  top: 10px;
  left: 40%;
  width: 100px;
  height: 5px;
}

.dragger.right-dragger {
  right: 10px;
  top: 40%;
  width: 5px;
  height: 100px;
}

.dragger.bottom-dragger {
  bottom: 10px;
  left: 40%;
  width: 100px;
  height: 5px;
}

.dragger.left-dragger {
  left: 10px;
  top: 40%;
  width: 5px;
  height: 100px;
}


/*#draggable-container {*/
/*  position: absolute;*/
/*  z-index: 9;*/
/*}*/
/*#draggable-header {*/
/*  z-index: 10;*/
/*}*/
</style>