<script lang="ts">
  import {onMount} from "svelte";
  import {base64ToByteArray, byteArrayToBase64} from "$lib/bytearray";

  export let exportValue: Uint8Array;
  let formValue: string;
  let error;

  $: {
    if (formValue != undefined) {
      try {
        exportValue = base64ToByteArray(formValue)
      } catch (e) {
        error = e;
      }
    }
  }

  onMount(() => {
    try {
      formValue = byteArrayToBase64(exportValue)
    } catch (_) {
      formValue = '';
    }
  })
</script>

<label>
    Base 64
    <input type="text" bind:value={formValue}>
    {error}
</label>
