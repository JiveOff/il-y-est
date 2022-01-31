<template>
  <div class="menu">
    <transition name="fade" mode="out-in">
      <div v-if="!user.connected" class="connexion">
        <h2>Il y est</h2>
        <h3>Application de partage de carte</h3>
        <hr />
        <button class="g-button" @click="loginWithGoogle">
          <img
            class="g-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/157px-Google_%22G%22_Logo.svg.png"
            alt="Google Logo"
          />
          <p class="g-text">Connexion avec Google</p>
        </button>
      </div>
      <div v-else class="home">
        <img :src="user.profile.photoURL" alt="Photo de profil" />
        <h2>{{ user.profile.displayName }}</h2>
        <h3>Application de partage de carte</h3>
      </div>
    </transition>
  </div>
</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default {
  name: "Menu",
  props: ["mapData", "user"],
  methods: {
    loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      signInWithPopup(auth, provider).then((result) => {
        this.user.connected = true;
        this.user.profile = result.user;
      });
    },
  },
};
</script>

<style lang="scss">
.menu {
  height: calc(100% - 75px);
  width: 20vw;
  background-color: white;
  border-radius: 25px;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.2);
  padding: 20px;
  position: absolute;
  z-index: 10000;
  right: 0;
  margin: 10px;
  font-weight: 400;
}

.g-button {
  border: 1px solid black;
  background: black;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.g-logo {
  width: 21px;
  height: 21px;
  padding: 8px 10px;
  background: white;
  border-radius: 7px;
}

.g-text {
  max-height: 18px;
  color: white;
  text-align: center;
  padding-right: 5px;
  font-weight: 500;
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;

  img {
    border-radius: 100%;
    width: 128px;
    height: 128px;
  }

  h2 {
    font-size: 1.4em;
    text-align: center;
    margin-bottom: 10px;
    line-height: 12px;
  }

  h3 {
    font-size: 1em;
    font-weight: 300;
  }
}

.connexion {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;

  h2 {
    font-size: 3em;
    margin-bottom: 10px;
    line-height: 12px;
  }

  h3 {
    font-size: 1em;
    font-weight: 300;
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
