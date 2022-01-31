<template>
  <button class="button" @click="event">
    <img class="logo" :src="logo" alt="Logo" />
    <p class="text">{{ text }}</p>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: ["logo", "text", "event"],
};
</script>

<style scoped>
.button {
  border: 1px solid black;
  background: black;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 10px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
}

.logo {
  width: 22px;
  height: 22px;
  padding: 8px 10px;
  background: white;
  border-radius: 7px;
}

.text {
  max-height: 18px;
  color: white;
  text-align: center;
  width: 100%;

  font-family: "Rubik", sans-serif;
  font-weight: 500;
  font-size: 14px;
}
</style>
