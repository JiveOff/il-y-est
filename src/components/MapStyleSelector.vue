<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="user.connected" class="style-box">
        <toggle-button
          :value="true"
          :color="{
            checked: 'rgb(255, 232, 106)',
            unchecked: 'rgb(34, 34, 34)',
          }"
          :width="50"
          :height="30"
          @change="changeDaylight"
        />
        <toggle-button
          :value="false"
          :labels="{
            checked: '🚆',
            unchecked: '🚓',
          }"
          :width="60"
          :height="30"
          @change="changeTransit"
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "MapStyleSelector",
  props: ["user"],
  data: () => ({
    daylight: true,
    transit: false,
  }),
  methods: {
    emitChangeStyle() {
      let style = `normal.${this.daylight ? "day" : "night"}${
        this.transit ? ".transit" : ".grey"
      }`;

      this.$emit("changeStyle", style);
    },
    changeDaylight: function ({ value }) {
      this.daylight = value;
      this.emitChangeStyle();
    },
    changeTransit: function ({ value }) {
      this.transit = value;
      this.emitChangeStyle();
    },
  },
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 800px) {
  .style-box {
    position: absolute;
    top: 10px;
    left: unset !important;
    right: 10px;
  }
}

.style-box {
  width: 130px;
  height: 50px;
  background-color: rgba(129, 129, 129, 0.418);
  border-radius: 15px;
  position: absolute;
  z-index: 5999;
  bottom: 20px;
  left: 20px;

  padding: 0px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
}
</style>
