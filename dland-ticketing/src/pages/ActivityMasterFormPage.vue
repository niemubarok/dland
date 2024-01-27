<template>
  <q-table
    :rows-per-page-options="[10, 20]"
    :columns="columns"
    :rows="rows"
    row-key="name"
    separator="cell"
    @request="onRequest"
  >
    <template #top>
      <div class="row">
        <slot name="header"> </slot>
      </div>
      <q-space />
      <slot name="filters"> </slot>
    </template>

    <template #body="props">
      <q-tr :props="props" :class="getTableRowClass(props)">
        <slot name="body" :props="props">
          <q-td v-if="props.column.name === 'name'">
            <q-popup-proxy ref="nameEditPopup" v-model="props.row.name">
              <q-input v-model="nameEditPopup.value" autofocus />
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn
                  size="sm"
                  color="red-9"
                  flat
                  icon="close"
                  @click="nameEditPopup.value = props.row.name"
                />
                <q-btn
                  size="sm"
                  color="green-9"
                  flat
                  icon="check"
                  @click="update(props.row.id, 'name', nameEditPopup.value)"
                />
              </div>
            </q-popup-proxy>
          </q-td>
        </slot>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { QPopupProxy } from "quasar";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["request", "update"]);

const nameEditPopup = ref(null);

watch(props, () => {
  // Hide popup when row changes
  nameEditPopup.value.hide();
});

const onRequest = (props) => {
  // Emit event to fetch data, if needed
  emit("request", props);
};

const update = (id, field, value) => {
  // Update data
  emit("update", { id, field, value });
};

// ... other functions as needed ...
</script>
