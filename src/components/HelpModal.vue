<template>
  <div class="helpmodal-container">
    <b-modal id="help-modal" title="Help" ok-only size="lg">
      <p>
        SmarterCalendar is based on <b>tasks</b>: things you want to accomplish.
        Once you create a task (press the "add task" button or <kbd>n</kbd>),
        SmarterCalendar will split it up into <b>chunks</b>. As you complete
        chunks of a task, you can click on them in the calendar and press
        "complete" to tell SmarterCalendar that you've finished them.
      </p>

      <p>
        SmarterCalendar schedules chunks with a few things in mind. Each task
        has a <b>duration</b> (how long it will take) and <b>effort</b> (how
        difficult it will be). SmarterCalendar tries to make sure that you spend
        about the same time and effort completing tasks each day.
      </p>

      <p>
        You can customize SmarterCalendar in <b>settings</b> by clicking on the
        "settings" button. Doing so will launch the settings menu. Hover over a
        setting to see a tooltip that explains what it does.
      </p>

      <p>
        You can help SmarterCalendar work around your schedule by adding
        <b>events</b>. To create an event, click the "add event" button. An
        event is like a task, but it's not split into chunks and it's not meant
        to be completed. When SmarterCalendar schedules chunks, it takes into
        consideration each day's events.
      </p>

      <p>
        SmarterCalendar isn't perfect, and will sometimes schedule chunks in a
        way that doesn't work for you. If that happens, you can
        <b>schedule chunks yourself</b>. To do that, click on a chunk in the
        calendar. Click on the due date to launch the date picker. If you select
        a new date, the checkbox on the side will become checked, indicating
        that you have manually chosen a new date. SmarterCalendar will not
        reassign that chunk unless you uncheck the checkbox.
      </p>

      <template #modal-footer="{ ok }">
        <b-button class="text-dark" variant="primary" @click="ok()">
          OK
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HelpModal extends Vue {}
</script>
<style lang="scss" scoped></style>
