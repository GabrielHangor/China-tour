<script setup lang="ts">
import * as z from 'zod'
import { reactive } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useTripsStore } from '@/features/trips/tripsStore'

const open = defineModel<boolean>('open', { default: false })

const trips = useTripsStore()
const toast = useToast()

const schema = z.object({
  name: z.string().min(1, 'Введите название'),
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ name: '' })

async function onSubmit(event: FormSubmitEvent<Schema>): Promise<void> {
  const trip = await trips.createTrip(event.data.name)
  trips.setActiveTrip(trip.id)
  toast.add({
    title: 'Поездка создана',
    description: trip.name,
    color: 'success',
    icon: 'i-lucide-check',
  })
  state.name = ''
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="Новая поездка" description="Название можно изменить позже">
    <template #body>
      <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="onSubmit">
        <UFormField name="name" label="Название" required>
          <UInput v-model="state.name" placeholder="Золотой треугольник" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="outline" label="Отмена" @click="open = false" />
          <UButton type="submit" label="Создать" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
