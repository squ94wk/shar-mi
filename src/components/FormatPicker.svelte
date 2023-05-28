<script lang="ts">
  import type {Format} from "$lib/format";
  import {createEventDispatcher} from "svelte";
  import {B64, QR, UTF8} from "$lib/format";

  export let format: Format = UTF8;

  const dispatch = createEventDispatcher();

  function updateFormat(f: Format) {
    dispatch('updateFormat', {
      format: f,
    });
    format = f;
  }
</script>

<form class="button-group">
    <label class="button">
        UTF-8
        <input bind:group={format} on:click={() => updateFormat(UTF8)} type="radio" name="format" value={UTF8}/>
    </label>
    <label class="button">
        Base64
        <input bind:group={format} on:click={() => updateFormat(B64)} type="radio" name="format" value={B64}/>
    </label>
    <label class="button">
        QR
        <input bind:group={format} on:click={() => updateFormat(QR)} type="radio" name="format" value={QR}/>
    </label>
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  input {
    visibility: hidden;
    max-width: 0;
    max-height: 0;
    margin: 0;
  }
</style>
