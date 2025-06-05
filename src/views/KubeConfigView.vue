<script setup>
import { mdiKubernetes } from '@mdi/js'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import CardBox from '@/components/CardBox.vue'
import TableKubeContexts from '@/components/TableKubeContexts.vue'
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiKubernetes" title="KubeConfig" main />
      <NotificationBar color="info" :icon="mdiKubernetes"> 클러스터 컨텍스트 목록 </NotificationBar>
      <CardBox has-table>
        <TableKubeContexts />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
