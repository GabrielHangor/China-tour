import { createPinia } from 'pinia'
import ui from '@nuxt/ui/vue-plugin'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { useTripsStore } from './features/trips/tripsStore'
import './assets/css/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ui)

const trips = useTripsStore(pinia)
void trips.hydrate()

app.mount('#app')
