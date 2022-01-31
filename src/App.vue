<template>
  <div id="app">
    <Menu :mapData="mapData" :user="user" />
    <div :class="{ overlay: !user.connected }"></div>
    <l-map
      style="height: 100%"
      :center="mapData.center"
      :zoom="mapData.zoom"
      @update:zoom="
        (zoom) => {
          mapData.zoom = zoom;
        }
      "
      @update:center="
        (center) => {
          mapData.center = center;
        }
      "
      @update:bounds="
        (bounds) => {
          mapData.bounds = bounds;
        }
      "
    >
      <l-tile-layer
        :url="mapData.url"
        :attribution="mapData.attribution"
      ></l-tile-layer>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
import Menu from "./components/Menu.vue";

import { initializeApp } from "firebase/app";

export default {
  name: "App",
  components: {
    LMap,
    LTileLayer,
    Menu,
  },
  mounted() {
    this.firebase = initializeApp(this.firebaseConfig);
  },
  data() {
    let defaultCenter = [48.85127481320342, 2.4087524414062504];
    return {
      mapData: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 12,
        center: defaultCenter,
        defaultCenter,
      },

      user: {
        connected: false,
        profile: null,
      },

      firebaseConfig: {
        apiKey: "AIzaSyAwvesInUD79dm95pQrV5_TGAwWAlGsUhE",
        authDomain: "pwebc-il-y-est.firebaseapp.com",
        projectId: "pwebc-il-y-est",
        storageBucket: "pwebc-il-y-est.appspot.com",
        messagingSenderId: "411497655460",
        appId: "1:411497655460:web:875baa2a699834e1944a31",
      },

      firebase: null,
    };
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap");

#app {
  height: 100vh;
}

body {
  margin: 0;
  font-family: "Rubik", sans-serif;
  font-weight: 300;
}

.overlay {
  position: absolute;
  z-index: 5000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
