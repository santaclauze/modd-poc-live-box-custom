<template>
  <div
    ref="draggableContainer"
    id="draggable-container"
    class="dragger"
    @mousedown="dragMouseDown"
    :class="[direction + '-dragger']"
  />
</template>

<script>
export default {
  name: "Dragger",
  props: {
    direction: String,
  },
  data: () => ({
    positions: {
      clientX: undefined,
      clientY: undefined,
      movementX: 0,
      movementY: 0
    }
  }),
  methods: {
    dragMouseDown: function (event) {
      event.preventDefault()
      // get the mouse cursor position at startup:
      console.log(this.direction)

      if(['top', 'bottom'].includes(this.direction)) {
        this.positions.clientY = event.clientY
        document.onmousemove = this.elementDrag
        document.onmouseup = this.closeDragElement
      }
      if(['left', 'right'].includes(this.direction)) {
        this.positions.clientX = event.clientX
        document.onmousemove = this.elementDrag
        document.onmouseup = this.closeDragElement
      }
    },
    elementDrag: function (event) {
      event.preventDefault()
      if(['top', 'bottom'].includes(this.direction)) {
        this.positions.movementY = this.positions.clientY - event.clientY
        this.positions.clientY = event.clientY
        console.log(this.$refs.draggableContainer.style.top)
        if((this.$refs.draggableContainer.offsetTop) < 0) {
          this.$refs.draggableContainer.style.top = 0;
          this.$refs.draggableContainer.style.bottom = 0;
        }
        this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      }
      if(['left', 'right'].includes(this.direction)) {
        this.positions.movementX = this.positions.clientX - event.clientX
        this.positions.clientX = event.clientX
        this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
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