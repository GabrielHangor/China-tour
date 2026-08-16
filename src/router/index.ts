import { createRouter, createWebHistory } from 'vue-router'
import AppShell from '@/layouts/AppShell.vue'
import CatalogPanel from '@/features/catalog/CatalogPanel.vue'
import PlaceDetail from '@/features/catalog/PlaceDetail.vue'
import EmptyView from '@/pages/EmptyView.vue'
import TripsPanel from '@/features/trips/TripsPanel.vue'
import TripDetail from '@/features/trips/TripDetail.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppShell,
      children: [
        { path: '', name: 'map', component: EmptyView },
        { path: 'catalog', name: 'catalog', component: CatalogPanel },
        { path: 'place/:placeId', name: 'place', component: PlaceDetail },
        { path: 'trips', name: 'trips', component: TripsPanel },
        { path: 'trip/:tripId', name: 'trip', component: TripDetail },
      ],
    },
  ],
})
