<template>
  <div class="marker-box" @click="centerToMarker">
    <div class="data">
      <div class="info">
        <span class="location">{{ location }}</span>
        <span class="name">{{ data.name }}</span>
      </div>
    </div>
    <div class="map">
      <l-map
        class="map"
        style="height: 100%"
        :center="data.position"
        :zoom="16"
      >
        <l-tile-layer
          :url="mapData.url"
          :attribution="mapData.attribution"
        ></l-tile-layer>
        <l-marker :lat-lng="data.position">
          <l-icon :icon-anchor="[16, 37]">
            <img src="../assets/marker.png" />
          </l-icon>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon } from "vue2-leaflet";

export default {
  name: "MapMarker",
  props: ["data", "mapData"],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
  data() {
    return {
      location: "",
    };
  },
  mounted() {
    this.getCityFromCoordinates(this.data.position[0], this.data.position[1]);
  },
  methods: {
    getCityFromCoordinates(lat, lng) {
      let url = `api/getCityFromCoordinates?lat=${lat}&lon=${lng}`;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.location = data.location;
        });
    },
    centerToMarker() {
      this.mapData.center = this.data.position;
    },
  },
};
</script>

<style lang="scss">
@mixin media-max($_max-width) {
  @media screen and (max-width: $_max-width) {
    & {
      @content;
    }
  }
}

.marker-box {
  display: block;
  width: calc(100% - 5px);
  height: 150px;
  cursor: pointer;

  @include media-max(800px) {
    height: 100px;
  }

  .map {
    height: inherit;
    width: 100%;
    border-radius: 15px;
  }

  .data {
    display: block;
    height: inherit;
    width: inherit;
    position: absolute;
    z-index: 5999;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
    border-radius: 15px;

    .info {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      height: 100%;
      width: 100%;
      text-align: left;

      .name {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 90%;
        height: 1.6rem;
        font-size: 1.5rem;
        font-weight: 500;
        color: white;
        padding-bottom: 10px;
        margin-left: 10px;
      }

      .location {
        display: block;
        width: 90%;
        font-size: 1rem;
        font-weight: normal;
        color: white;
        padding-bottom: 10px;
        margin-left: 10px;
        line-height: 0.3rem;
      }
    }
  }

  .leaflet-control-zoom {
    display: none;
  }

  .leaflet-control-attribution {
    display: none;
  }
}
</style>
