<template>
  <div style="display: none">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
import L from "leaflet";
import { IRouter, IGeocoder, LineOptions } from "leaflet-routing-machine";
import { findRealParent } from "vue2-leaflet";
const props = {
  visible: {
    type: Boolean,
    default: true,
  },
  waypoints: {
    type: Array,
    required: true,
  },
};
export default {
  props,
  name: "LRoutingMachine",
  data() {
    return {
      parentContainer: null,
      ready: false,
      layer: null,
    };
  },
  mounted() {
    this.parentContainer = findRealParent(this.$parent);
    this.add();
    this.ready = true;
  },
  beforeDestroy() {
    return this.layer ? this.layer.remove() : null;
  },
  methods: {
    async add() {
      if (this.parentContainer._isMounted) {
        const { mapObject } = this.parentContainer;

        // get a route from waypoints
        let getRoute = (waypoints) => {
          return new Promise((resolve, reject) => {
            L.Routing.control({
              waypoints,
              routeWhileDragging: true,
            })
              .on("routeselected", function (e) {
                var route = e.route;
                resolve(route);
              })
              .addTo(L.map("maptest"));
          });
        };

        let rt = await getRoute([
          L.latLng(this.waypoints[0].lat, this.waypoints[0].lng),
          L.latLng(this.waypoints[1].lat, this.waypoints[1].lng),
        ]);

        const routingLayer = L.Routing.line(rt, {
          addWaypoints: false,
          styles: [{ color: "black", opacity: 1, weight: 3 }],
        });
        routingLayer.addTo(mapObject);
        this.layer = routingLayer;
      }
    },
  },
};
</script>
