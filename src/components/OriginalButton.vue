<template>
  <button
    class="button"
    :class="{ disabled }"
    @click="event"
    :disabled="loading || disabled"
  >
    <div v-if="loading" class="loading">
      <font-awesome-icon :icon="circle" size="2x" />
    </div>
    <div v-else>
      <div v-if="logo" class="logo">
        <img :src="logo" alt="Logo" />
      </div>
      <p class="text">{{ text }}</p>
    </div>
  </button>
</template>

<script>
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "Button",
  props: ["logo", "text", "event", "loading", "disabled"],
  computed: {
    circle() {
      return faCircleNotch;
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  border: 0;
  background: black;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;

  height: 46px;

  padding: 5px;

  div {
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 10px;
    height: 100%;
  }

  .logo {
    background: white;
    border-radius: 7px;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo img {
    width: 22px;
    height: 22px;
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

  .loading {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: not-allowed;

    svg {
      animation: spin 1s linear infinite;
    }
  }

  &.disabled {
    opacity: 0.7;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: not-allowed;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
