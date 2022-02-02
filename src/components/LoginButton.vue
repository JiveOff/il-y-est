<template>
  <original-button
    :logo="logo"
    :text="text"
    :event="event"
    :loading="loading"
  />
</template>

<script>
import OriginalButton from "./OriginalButton.vue";

export default {
  components: { OriginalButton },
  name: "LoginButton",
  props: ["logo", "text", "event", "loading"],
};
</script>
