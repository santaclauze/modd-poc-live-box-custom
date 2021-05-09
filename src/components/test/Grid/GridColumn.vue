<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "GridColumn"
}
</script>

<style scoped>
  div {
    display: flex;
    flex-direction: column;
  }
</style>