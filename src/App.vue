<template>
  <div id="app">
    <map-style-selector :user="user" @changeStyle="changeStyle" />
    <Menu
      :mapData="mapData"
      :user="user"
      @login="loginWithGoogle"
      @refreshMarkers="refreshMarkers"
    />
    <div
      class="overlay"
      :class="{
        show: !user.connected || user.showPopup,
        index: user.showPopup,
      }"
      @click="user.showPopup = false"
    ></div>
    <div v-if="user.showPopup" class="popup">
      <div class="content">
        <h1>{{ markerLocation || "..." }}</h1>
        <input
          type="text"
          name=""
          id=""
          placeholder="Donnez un nom à votre marqueur"
          v-model="markerName"
          @keyup.enter="addMarker"
        />
        <br />
      </div>
    </div>
    <l-map
      @click="openPopup"
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
      <routing
        v-if="routeTo"
        :waypoints="routeTo"
        :routeWhileDragging="false"
        :autoRoute="false"
      ></routing>
      <l-marker v-if="routeTo" :lat-lng="routeTo[0]">
        <l-icon :icon-anchor="[16, 37]">
          <img src="~@/assets/marker.png" style="filter: invert()" />
        </l-icon>
      </l-marker>
      <div v-if="user.connected">
        <l-marker
          v-for="marker in user.markers"
          :key="marker.id"
          :lat-lng="marker.position"
          @click="routingTo(marker.position)"
        >
          <l-icon :icon-anchor="[16, 37]">
            <img src="~@/assets/marker.png" />
          </l-icon>
        </l-marker>
      </div>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon } from "vue2-leaflet";

import Menu from "./components/Menu.vue";
import MapStyleSelector from "./components/MapStyleSelector.vue";

import { supabase } from "./plugins/supabase";
import Routing from "./components/Routing.vue";

export default {
  name: "App",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    Menu,
    MapStyleSelector,
    Routing,
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

      markerName: "",
      markerPosition: null,
      markerLocation: null,

      routeTo: null,

      user: {
        loggingIn: false,
        connected: false,
        showPopup: false,
        profile: null,
        markers: [],
      },
    };
  },
  async mounted() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        this.user.loggingIn = true;
        await this.refreshMarkers();
        this.user.connected = true;
        this.user.profile = session.user.user_metadata;
        this.user.loggingIn = false;
      }
    });
  },
  methods: {
    changeStyle(style) {
      this.mapData.url = `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${this.here.apiKey}&ppi=320`;
    },
    async loginWithGoogle() {
      this.user.loggingIn = true;

      const { error } = await supabase.auth.signIn({
        provider: "google",
      });

      if (error) {
        console.error(error);
        return;
      }
    },
    getCityFromCoordinates(lat, lng) {
      let url = `api/getCityFromCoordinates?lat=${lat}&lon=${lng}`;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => {
          return (
            data.address.charAt(0).toUpperCase() +
            data.address.slice(1) +
            ", " +
            data.location
          );
        });
    },
    async openPopup(e) {
      this.markerPosition = [e.latlng.lat, e.latlng.lng];
      this.user.showPopup = true;
      this.markerLocation = "";
      this.markerLocation = await this.getCityFromCoordinates(
        e.latlng.lat,
        e.latlng.lng
      );
    },
    async routingTo(position) {
      if (!("geolocation" in navigator)) return;

      let getPosition = (options) => {
        return new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, options)
        );
      };

      try {
        let pos = await getPosition({
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });

        this.routeTo = [
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          { lat: position[0], lng: position[1] },
        ];
      } catch (e) {
        console.error(e);
      }

      // this.routeTo = [
      //   { lat: 38.7436056, lng: -9.2304153 },
      //   { lat: position[0], lng: position[1] },
      // ];
    },
    async refreshMarkers() {
      const { data, error } = await supabase.from("markers").select();

      if (error) {
        console.error(error);
        return;
      }

      this.user.markers = [];

      for (let i in data) {
        this.user.markers.push({
          id: data[i].id,
          name: data[i].name,
          position: JSON.parse(data[i].position),
        });
      }
    },
    async addMarker() {
      if (!this.user.connected) {
        return;
      }

      const marker = {
        name: this.markerName,
        position: this.markerPosition,
      };

      this.markerName = "";
      this.user.showPopup = false;

      const { error } = await supabase.from("markers").insert([marker]);
      if (error) {
        console.error(error);
      }

      this.refreshMarkers();
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap");

@mixin media-max($_max-width) {
  @media screen and (max-width: $_max-width) {
    & {
      @content;
    }
  }
}

#app {
  height: 100vh;
}

body {
  margin: 0;
  font-family: "Rubik", sans-serif;
  font-weight: 300;
}

.leaflet-routing-container {
  display: none;
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

.index {
  z-index: 10001 !important;
}

.popup {
  background-color: rgba(0, 0, 0, 0);
  transition: 0.25s ease-in-out;

  .content {
    color: #fff;

    position: absolute;
    z-index: 10001;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 80%;
    height: 190px;
    border-radius: 15px;
    text-align: center;

    @include media-max(800px) {
      width: 90%;
      height: 65vh;
    }

    input {
      width: 80%;
      outline: 0;
      border-width: 0 0 2px;
      border-color: #fff;
      color: #fff;
      text-align: center;
      font-size: 24px;
      background-color: rgba(0, 0, 0, 0);
    }
  }
}

svg {
  stroke-dasharray: 1604;
  stroke-dashoffset: 1604;
  animation: dash 5s ease-in-out forwards;
}

@keyframes dash {
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
