import Vue from "vue";
import Seo from "~/mixins/seo.js";
import Mixin from "~/mixins/mixin.js";
import firebase from "firebase";

import moment from "moment";
import $ from 'jquery';
import Vue2TouchEvents from 'vue2-touch-events'
import Swiper, {Autoplay} from 'swiper';

const firebaseConfig = {
    apiKey: "AIzaSyAU-dVvd2ZWwOgh0PLxwqdH3K71qAbAd6k",
    authDomain: "forlunch-87df7.firebaseapp.com",
    projectId: "forlunch-87df7",
    storageBucket: "forlunch-87df7.appspot.com",
    messagingSenderId: "946193821143",
    appId: "1:946193821143:web:0de06a68c68fcc2a50af92"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}
const database = firebase.firestore();

window.firebase = firebase;
window.database = database;
window.moment = moment;
window.$ = window.jquery = window.jQuery = $;
window.Swiper = Swiper;

Swiper.use([Autoplay]);

Vue.mixin(Seo);
Vue.mixin(Mixin);
Vue.use(Vue2TouchEvents, {
    disableClick: false,
    touchClass: '',
    tapTolerance: 10,
    touchHoldTolerance: 400,
    swipeTolerance: 30,
    longTapTimeInterval: 400,
    namespace: 'touch'
})



