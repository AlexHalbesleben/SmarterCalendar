<template>
  <div class="changelog-modal-container">
    <b-modal
      id="changelog-modal"
      title="Changelog"
      ok-only
      v-model="vxm.store.changelogModalShown"
    >
      <b-input-group prepend="v" class="mb-3">
        <b-form-input
          :min="minMajorVersion"
          :max="maxMajorVersion"
          :value="currentVersion[0]"
          @input="updateMajorVersion"
          :number="true"
          type="number"
        />
        <b-input-group-append is-text class="no-right-border">
          .
        </b-input-group-append>
        <b-form-input
          :min="minMinorVersion"
          :max="maxMinorVersion"
          :value="currentVersion[1]"
          @input="updateMinorVersion"
          :number="true"
          type="number"
        />
        <b-input-group-append is-text class="no-right-border">
          .
        </b-input-group-append>
        <b-form-input
          :min="minPatchVersion"
          :max="maxPatchVersion"
          :value="currentVersion[2]"
          @input="updatePatchVersion"
          :number="true"
          type="number"
        />
      </b-input-group>

      <p class="h6">{{ currentEntry.title }}</p>
      <p>{{ currentEntry.description }}</p>

      <template #modal-footer="{ ok }">
        <b-button @click="ok" class="text-dark" variant="primary">OK</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { changelog, ChangelogEntry } from "@/types/Changelog";
import { Component, Vue } from "vue-property-decorator";
import vxm from "@/store/index.vuex";

@Component
export default class ChangelogModal extends Vue {
  data = changelog;

  get versions(): [number, number, number][] {
    return this.data.map((entry) => {
      const nums = entry.version.split(".").map((str) => parseInt(str));
      return [nums[0], nums[1], nums[2]];
    });
  }

  get vxm(): typeof vxm {
    return vxm;
  }

  currentIndex = this.data.length - 1;

  get currentEntry(): ChangelogEntry {
    return this.data[this.currentIndex];
  }

  get currentVersion(): [number, number, number] {
    return this.versions[this.currentIndex];
  }

  updateMajorVersion(val: string) {
    const value = parseInt(val);
    const newValue = this.versions.findIndex((version) => version[0] === value);
    this.currentIndex = newValue > -1 ? newValue : this.currentIndex;
  }

  get minMajorVersion(): number {
    return this.versions.reduce(
      (prev, curr) => Math.min(prev, curr[0]),
      Number.MAX_VALUE
    );
  }
  get maxMajorVersion(): number {
    return this.versions.reduce(
      (prev, curr) => Math.max(prev, curr[0]),
      Number.MIN_VALUE
    );
  }

  updateMinorVersion(val: string) {
    const value = parseInt(val);

    const newValue = this.versions.findIndex(
      (version) => version[0] === this.currentVersion[0] && version[1] === value
    );
    this.currentIndex = newValue > -1 ? newValue : this.currentIndex;
  }

  get minMinorVersion(): number {
    return this.versions
      .filter((version) => version[0] === this.currentVersion[0])
      .reduce((prev, curr) => Math.min(prev, curr[1]), Number.MAX_VALUE);
  }

  get maxMinorVersion(): number {
    return this.versions
      .filter((version) => version[0] === this.currentVersion[0])
      .reduce((prev, curr) => Math.max(prev, curr[1]), Number.MIN_VALUE);
  }

  updatePatchVersion(val: string) {
    const value = parseInt(val);

    const newValue = this.versions.findIndex(
      (version) =>
        version[0] === this.currentVersion[0] &&
        version[1] === this.currentVersion[1] &&
        version[2] === value
    );
    this.currentIndex = newValue > -1 ? newValue : this.currentIndex;
  }

  get minPatchVersion(): number {
    return this.versions
      .filter(
        (version) =>
          version[0] === this.currentVersion[0] &&
          version[1] === this.currentVersion[1]
      )
      .reduce((prev, curr) => Math.min(prev, curr[2]), Number.MAX_VALUE);
  }

  get maxPatchVersion(): number {
    return this.versions
      .filter(
        (version) =>
          version[0] === this.currentVersion[0] &&
          version[1] === this.currentVersion[1]
      )
      .reduce((prev, curr) => Math.max(prev, curr[2]), Number.MIN_VALUE);
  }

  backVersion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  forwardVersion() {
    if (this.currentIndex < this.versions.length - 1) {
      this.currentIndex++;
    }
  }
}
</script>
<style lang="scss" scoped>
.no-right-border > .input-group-text {
  border-right: 0 !important;
}
</style>
