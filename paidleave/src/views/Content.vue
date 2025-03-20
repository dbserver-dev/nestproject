<template>
  <component v-bind:is="isSelected"></component>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  props: { type: String, menu: String },

  computed: {
    isSelected: function () {
      const viewpath =
        "@/views/" + this.type + "/" + this.toCapitalize(this.menu) + ".vue";

      console.log(viewpath);
      return defineAsyncComponent(() =>
        import(
          "@/views/" + this.type + "/" + this.toCapitalize(this.menu) + ".vue"
        )
      );
    },
  },
  methods: {
    toCapitalize(str) {
      return str.replace(/\b\w/g, (match) => match.toUpperCase());
    },
  },
};
</script>

<style></style>
