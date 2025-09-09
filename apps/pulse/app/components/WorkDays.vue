<script setup lang="ts">
import type { Workday } from "../types";
import { formatDay, getMoodEmoji, getPlaceEmoji } from "../utils";

const workdays: Workday[] = [{
  name: "Monday",
  date: "2024-06-03",
  hours: {
    value: 10,
    expected: 8
  },
  project: ["Pulse"],
  place: "Home",
  mood: {
    value: 7,
    reason: "Productive day"
  }
}, {
  name: "Tuesday",
  date: "2024-06-04",
  hours: {
    value: 5,
    expected: 8,
  },
  project: ["Pulse", "Umbra"],
  place: "Office",
  mood: {
    value: 6,
    reason: "Meetings took time"
  }
}, {
  name: "Wednesday",
  date: "2024-06-05",
  hours: {
    value: 5,
    expected: 8,
  },
  project: ["Umbra"],
  place: "Home",
  mood: {
    value: 8,
    reason: "Good progress"
  }
}, {
  name: "Thursday",
  date: "2024-06-06",
  hours: {
    value: 8,
    expected: 8,
  },
  project: ["Pulse"],
  place: "Office",
  mood: {
    value: 5,
    reason: "Long day"
  }
}, {
  name: "Friday",
  date: "2024-06-07",
  hours: {
    value: 8,
    expected: 8,
  },
  project: ["Pulse", "Umbra"],
  place: "Home",
  mood: {
    value: 9,
    reason: "Finished tasks"
  }
}]

const totalHours = workdays.reduce((sum, day) => sum + day.hours.value, 0);
const averageMood = Math.round(workdays.reduce((sum, day) => sum + day.mood.value, 0) / workdays.length);
const totalExpectedHours = workdays.reduce((sum, day) => sum + day.hours.expected, 0);
const deficitHours = totalExpectedHours - totalHours;
const surplusHours = totalHours - totalExpectedHours;
</script>

<template>
  <div class="WorkdaysSection">
    <div class="WorkdaysCentral">
      <div class="DayList ContentWidth">
        <div v-for="day in workdays" :key="day.name" class="DayWrapper">
          <div class="EntryDay">
            <p class="label caption">{{ formatDay(day) }}</p>
          </div>
          <div class="DayEntry">
            <div class="EntryTop">
              <p>{{ getMoodEmoji(day.mood.value) }}</p>
            </div>
            <div class="EntryCore">
              <p class="display"><span>{{ day.hours.expected }}</span></p>
            </div>
            <div class="EntryBottom">
              <p>{{ getPlaceEmoji(day.place) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="WeekDetails">
        <p>{{ totalExpectedHours }}h</p>
        <p>{{ getMoodEmoji(averageMood) }} {{ averageMood }} / 10</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.WorkdaysSection {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-2);
  background: var(--accent-10);
}

.WorkdaysCentral {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.DayList {
  display: grid;
  gap: var(--space-1);
  grid-template-columns: repeat(5, 1fr);
}

.DayWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.DayEntry {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;

  background-color: var(--accent-40);
  border-radius: var(--radius);
  padding: var(--space-1);
}

.EntryBottom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.EntryCore {
  display: flex;
  align-items: center;
  justify-content: center;
}

.WeekDetails {
  display: flex;
  justify-content: space-between;
  background: var(--accent-20);
  padding: var(--space-1);
  border-radius: var(--radius);
}
</style>
