<template>
  <div>
    <h1>Catchy headline to encourage action</h1>
    <button>Get Started</button>
  </div>
</template>

<script>
export default {
  name: "ContainerTest"
}
</script>

<style scoped>
div {
  width: 100vw;
  display: flex;
  justify-content: space-around;
  padding: 50px 30px;
  align-items: center;
  justify-items: center;
}

button {
  padding: 15px 10px;
  height: 50px;
  background: cornflowerblue;
  border-radius: 5%;
  border: 1px solid cornflowerblue;
  color: white;
}

</style>