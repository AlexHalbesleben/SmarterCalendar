<template>
  <div class="calendar-container">
    <div class="container p-2 text-light">
      <div class="row ml-0 mr-0 text-center">
        <div
          v-for="weekday in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
          :key="weekday"
          class="d-none d-sm-block col-sm"
        >
          {{ weekday }}
        </div>
      </div>
      <div
        class="row ml-0 mr-0"
        v-for="i in (numberOfFrontFillers +
          numberOfDays +
          numberOfBackFillers) /
        7"
        :key="`calendar_row_${i}`"
      >
        <Day
          v-for="d in days.slice(i * 7 - 7, i * 7)"
          class="col-xs col-sm"
          :class="d[0] === month ? '' : 'invalid-day'"
          :key="`calendar_day_${d}`"
          :month="d[0]"
          :day="d[1]"
        />
      </div>
    </div>
    <div class="row justify-content-center mb-2">
      <b-button-group>
        <b-button
          @click="month = (month + 11) % 12"
          variant="primary"
          class="text-dark"
          >&lt;</b-button
        >
        <div
          class="h-100 pl-2 pr-2 bg-primary align-items-center row no-gutters"
        >
          <div class="text-dark">
            {{
              strMonth.slice(0, 1).toUpperCase() +
              strMonth.slice(1).toLowerCase()
            }}
          </div>
        </div>

        <b-button
          @click="month = (month + 1) % 12"
          variant="primary"
          class="text-dark"
        >
          &gt;
        </b-button>
      </b-button-group>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Day from "./Day.vue";

const DaysPerMonth: Record<number, number> = {
  0: 31, // January
  1: 28, // February
  2: 31, // March
  3: 30, // April
  4: 31, // May
  5: 30, // June
  6: 31, // July
  7: 31, // August
  8: 30, // September
  9: 31, // October
  10: 30, // November
  11: 31, // December
};

@Component({
  components: {
    Day,
  },
})
export default class Calendar extends Vue {
  month: number = new Date().getMonth();

  /**
   * @returns the number of days in the current month
   */
  get numberOfDays(): number {
    return DaysPerMonth[this.month];
  }

  /**
   * @returns the number of days in the month before that need to be shown
   */
  get numberOfFrontFillers(): number {
    let firstOfMonth = new Date();
    firstOfMonth.setMonth(this.month);
    firstOfMonth.setDate(1);
    /*
      A slick little trick that happens to work. If the day of the week of the first of the month is Sunday,
      there are no days to fill in beforehand. The function returns 0 for Sunday, which is the expected output.
      If it's a Saturday, there are 6 days to fill in, and the function returns 6. Convenient!
    */
    return firstOfMonth.getDay();
  }

  /**
   * @returns the day of the previous month at which the front fillers should start
   */
  get frontFillerStart(): number {
    return DaysPerMonth[(this.month + 11) % 12] - this.numberOfFrontFillers + 1;
  }

  /*
    Another nice trick that works easily. The number of back fillers is just how many days are needed fill the last
    week (effectively, make the total number divisible by 7). Modulo gives the number of "normal days" on the last week,
    so subtracting this from 7 gives the necessary filler
  */
  get numberOfBackFillers(): number {
    return 7 - ((this.numberOfFrontFillers + this.numberOfDays) % 7);
  }

  /**
   * Returns a list of the days displayed as an array of tuples containing the month and day
   */
  get days(): [number, number][] {
    let days: [number, number][] = [];

    for (let i = 0; i < this.numberOfFrontFillers; i++) {
      days.push([(this.month + 11) % 12, this.frontFillerStart + i]);
    }

    for (let i = 0; i < this.numberOfDays; i++) {
      days.push([this.month, i + 1]);
    }

    for (let i = 0; i < this.numberOfBackFillers; i++) {
      days.push([(this.month + 1) % 12, i + 1]);
    }

    return days;
  }

  get strMonth() {
    const MONTHS = [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ];
    return MONTHS[this.month];
  }
}
</script>
<style lang="scss" scoped>
.day {
  border-top: 1px solid gray;
  border-left: 1px solid gray;
}

.container > .row:last-child {
  border-bottom: 1px solid gray;
}

.row > .day:last-child {
  border-right: 1px solid gray;
}
</style>
