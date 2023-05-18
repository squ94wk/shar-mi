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

<form>
    <label>
        UTF-8
        <input bind:group={format} on:click={() => updateFormat(UTF8)} type="radio" name="format" value={UTF8}/>
    </label>
    <label>
        Base64
        <input bind:group={format} on:click={() => updateFormat(B64)} type="radio" name="format" value={B64}/>
    </label>
    <label>
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

  label {
    padding: 5px 10px;
    border-color: rgba(0, 0, 0, 0.2);
    border-style: solid;
    border-width: 1px;

    font-size: 0.8em;

    // round corners
    &:first-of-type {
      border-radius: 4px 0 0 4px;
    }
    &:last-of-type {
      border-radius: 0 4px 4px 0;
    }
    // collapse border with neighbor
    &:not(:first-of-type) {
      margin-left: -1px;
    }

    // hover / checked combos
    background-color: transparent;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
    &:has(input:checked) {
      background-color: rgba(0, 0, 0, 0.6);
      color: #f1f1f1;
    }
  }

  input {
    visibility: hidden;
    max-width: 0;
    max-height: 0;
    margin: 0;
  }
</style>
