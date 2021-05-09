<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "GridContent"
}
</script>

<style scoped>
div {
  display: flex;
  flex-direction: row;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

</style>