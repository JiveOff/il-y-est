<template>
  <div id="app">
    <map-style-selector :user="user" @changeStyle="changeStyle" />
    <Menu :mapData="mapData" :user="user" />
    <div class="overlay" :class="{ show: !user.connected }"></div>
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
import { initializeApp } from "firebase/app";

import Menu from "./components/Menu.vue";
import MapStyleSelector from "./components/MapStyleSelector.vue";

export default {
  name: "App",
  components: {
    LMap,
    LTileLayer,
    Menu,
    MapStyleSelector,
  },
  mounted() {
    this.firebase = initializeApp(this.firebaseConfig);
  },
  data() {
    let defaultCenter = [48.84159496838822, 2.2712731361389165];
    let here = {
      apiKey: "_dJS3EWxq3eW-qpShsUesGimvw_SwYO3ZtB3cbC97-E",
      style: "normal.day.grey",
    };

    return {
      here,

      mapData: {
        url: `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${here.style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`,
        attribution:
          '&copy; HERE 2019 © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        zoom: 16,
        zoomOffset: -1,
        zoomSnap: 0.5,
        tileSize: 512,
        center: defaultCenter,
        defaultCenter,
      },

      user: {
        connected: false,
        profile: null,
        markers: [
          {
            id: 1,
            name: "Eiffel Tower",
            position: [48.85837, 2.29448],
          },
          {
            id: 2,
            name: "Fontenay",
            position: [48.85837, 2.49448],
          },
          {
            id: 3,
            name: "Some place",
            position: [48.4837, 2.19448],
          },
          {
            id: 4,
            name: "Morgan's place",
            position: [51.5081157, -0.078138],
          },
          {
            id: 5,
            name: "Some place",
            position: [48.4837, 2.19448],
          },
          {
            id: 6,
            name: "Morgan's place",
            position: [51.5081157, -0.078138],
          },
        ],
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
  methods: {
    changeStyle(style) {
      this.mapData.url = `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${this.here.apiKey}&ppi=320`;
    },
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
  z-index: 0;
  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0);
  transition: 0.25s ease-in-out;
}

.overlay.show {
  z-index: 5000;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
