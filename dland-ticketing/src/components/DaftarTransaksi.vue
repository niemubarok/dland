<template>
  <q-card style="width: 70%" class="fixed-top-right q-mt-md q-mr-xl">
    <q-table
      table-class="q-mt-md full-width window-height"
      :columns="columns"
      :rows="tableRows"
      row-key="name"
      title="Daftar Hadir Kelas"
      virtual-scroll
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props"
            ><q-chip>
              <span class="text-weight-bolder">{{ col.label }}</span></q-chip
            ></q-th
          >
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            <p class="text-center">{{ props.pageIndex + 1 }}</p>
          </q-td>
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <q-td key="class" :props="props">{{ props.row.class_id }}</q-td>
          <q-td key="class" :props="props">{{ props.row.date }}</q-td>
          <q-td key="in" :props="props">{{ props.row.in }}</q-td>
          <!-- <q-td key="out" :props="props">{{ props.row.out }}</q-td> -->
          <q-td key="status" :props="props">{{ props.row.status }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>

<script setup>
import { useStudentAttendancesStore } from "src/stores/student-attendances-store";
import { onMounted, ref } from "vue";

const useAttendance = useStudentAttendancesStore();
const attendances = useAttendance.attendances;

const columns = [
  {
    name: "no",
    label: "NO",
    align: "center",
  },
  {
    name: "name",
    label: "Nama",
    align: "left",
  },
  {
    name: "class",
    label: "Kelas",
    align: "center",
  },
  {
    name: "date",
    label: "Tanggal",
    align: "center",
  },
  {
    name: "in",
    label: "Jam Datang",
    align: "center",
  },
  {
    name: "status",
    label: "Status",
    align: "center",
  },
];

const tableRows = ref([]);

onMounted(() => {
  tableRows.value = useAttendance.attendances;
  // useAttendance.addAttendance();
});
</script>
