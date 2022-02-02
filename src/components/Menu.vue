<template>
  <div class="menu">
    <transition name="fade" mode="out-in">
      <div v-if="!user.connected" class="header" key="header">
        <font-awesome-icon :icon="mapPin" size="2x" />
      </div>
      <div v-else class="header connected" key="connected-header">
        <div class="welcome">
          <font-awesome-icon :icon="mapPin" size="2x" />
          <div>
            <h3>Bienvenue,</h3>
            <h2>{{ user.profile.displayName }}</h2>
          </div>
        </div>
        <div class="separator"></div>
        <img
          class="profile-picture extra-small"
          :src="user.profile.photoURL"
          alt="Photo de profil"
        />
      </div>
    </transition>
    <transition name="fade" mode="out-in">
      <div v-if="!user.connected" class="box connexion" key="connexion">
        <div>
          <h2>Il y est</h2>
          <h3>Application de partage de marqueurs</h3>
        </div>
      </div>
      <div v-else class="box home" key="home" style="margin-top: 1rem">
        <div class="markers">
          <MapMarker
            v-for="marker in user.markers"
            :key="marker.id"
            :data="marker"
            :mapData="mapData"
          />
          <original-button
            class="show-on-small"
            text="Créer un itinéraire"
            :disabled="true"
          />
        </div>
        <div class="markers-overlay"></div>
      </div>
    </transition>
    <div class="footer" :class="{ 'flex-1': user.connected }">
      <transition name="fade" mode="out-in">
        <login-button
          v-if="!user.connected"
          logo="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/157px-Google_%22G%22_Logo.svg.png"
          text="Se connecter avec Google"
          :event="loginWithGoogle"
          :loading="loggingIn"
        />
      </transition>
      <transition name="fade" mode="out-in">
        <original-button
          class="hide-on-small"
          v-if="user.connected"
          text="Créer un itinéraire"
          :disabled="true"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

import LoginButton from "./LoginButton.vue";
import MapMarker from "./MapMarker.vue";
import OriginalButton from "./OriginalButton.vue";

export default {
  name: "Menu",
  components: { LoginButton, MapMarker, OriginalButton },
  props: ["mapData", "user"],
  data: () => ({
    loggingIn: false,
  }),
  methods: {
    loginWithGoogle() {
      this.loggingIn = true;
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      signInWithPopup(auth, provider)
        .then((result) => {
          this.user.connected = true;
          this.user.profile = result.user;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loggingIn = false;
        });
    },
  },
  computed: {
    mapPin() {
      return faMapPin;
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

@mixin media-min($_min-width) {
  @media screen and (min-width: $_min-width) {
    & {
      @content;
    }
  }
}

.menu {
  height: calc(100% - 75px);
  width: 300px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.2);
  padding: 20px;
  position: absolute;
  z-index: 10000;
  right: 0;
  margin: 10px;
  font-weight: 400;
  text-align: center;

  display: flex;
  flex-direction: column;
  height: calc(100% - 75px);

  @include media-max(800px) {
    position: absolute;
    bottom: 0;
    width: calc(100% - 60px) !important;
    height: calc(50vh - 60px) !important;
    max-height: 300px;
    margin-top: 50vh !important;
  }

  .header {
    flex: 0;

    &.connected {
      display: flex;

      .welcome {
        flex: 0 0 100px;
        display: flex;
        align-items: center;
        justify-content: left;
        gap: 15px;
        font-size: 20px;
        font-weight: 500;

        div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 300;
          }

          h2 {
            margin: 0;
            font-size: 22px;
            font-weight: 500;
            max-width: 200px;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

      .separator {
        flex: 1;
      }
    }
  }

  .box {
    flex: 1;
  }

  .footer {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
    flex: 0;
  }
}

.hide-on-small {
  @include media-max(800px) {
    display: none !important;
  }
}

.show-on-small {
  @include media-min(800px) {
    display: none !important;
  }
}

.flex-1 {
  flex: 1 !important;
}

.profile-picture {
  border-radius: 100%;
  width: 144px;
  height: 144px;

  &.small {
    width: 72px;
    height: 72px;
  }

  &.extra-small {
    width: 36px;
    height: 36px;
  }
}

.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &.home {
    align-items: flex-start;
    justify-content: flex-start;
    max-height: 80%;
    position: relative;

    h2 {
      font-size: 1.4em;
      margin-bottom: 10px;
      line-height: 12px;
    }

    h3 {
      font-size: 1em;
      font-weight: 300;
    }

    .markers {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: inherit;
      overflow-y: hidden;
      width: 100%;
      overflow-y: scroll;
      scrollbar-color: rgb(175, 175, 175) white;
      scrollbar-width: thin;
      padding-bottom: 25px;

      @include media-max(800px) {
        padding-bottom: 0;
      }
    }

    &:after {
      content: "";
      position: absolute;
      z-index: 6000;
      bottom: 0;
      width: 100%;
      height: 25px;
      background: linear-gradient(rgba(255, 255, 255, 0.001), white);

      @include media-max(800px) {
        display: none;
      }
    }
  }

  &.connexion {
    h2 {
      font-size: 3em;
      margin-bottom: 10px;
      line-height: 0.8em;
    }

    h3 {
      font-size: 1em;
      font-weight: 300;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
