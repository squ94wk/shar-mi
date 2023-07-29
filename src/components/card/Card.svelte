<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import FormatPicker from "../FormatPicker.svelte";
  import type {Format} from "$lib/format";
  import {B64, UTF8} from "$lib/format";
  import Utf8Input from "../input/Utf8Input.svelte";
  import Base64Input from "../input/Base64Input.svelte";
  import QRInput from "../input/QRInput.svelte";

  import Close from "svelte-material-icons/Close.svelte";

  export let value: Uint8Array;
  export let format: Format;
  export let opaque: boolean;

  const dispatch = createEventDispatcher();

  function remove() {
    dispatch('remove');
  }
</script>

<div class="card">
    <div class="card-header">
        <FormatPicker bind:format={format}></FormatPicker>
        <div class="remove-button" on:click={remove}>
            <Close class="remove-button"/>
        </div>
    </div>
    {#if format === UTF8}
        <Utf8Input on:updateValue exportValue={value} opaque={opaque}></Utf8Input>
    {:else if format === B64}
        <Base64Input on:updateValue exportValue={value}></Base64Input>
    {:else}
        <QRInput on:updateValue exportValue={value}></QRInput>
    {/if}
</div>

<style lang="scss">
  .card {
    display: grid;
    row-gap: 1rem;
    padding: 1rem;

    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
  }

  .remove-button {
    cursor: pointer;
    font-size: 1.2em;
    margin: auto 0;

    color: rgba(0, 0, 0, 0.2);

    &:hover {
      color: rgba(0, 0, 0, 0.5);
    }

    transition: color 100ms ease-in-out;
  }
</style>
