<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import FormatPicker from "../FormatPicker.svelte";
  import type {Format} from "$lib/format";
  import {B64, UTF8} from "$lib/format";
  import Utf8Input from "../input/Utf8Input.svelte";
  import Base64Input from "../input/Base64Input.svelte";
  import QRInput from "../input/QRInput.svelte";

  export let value: Uint8Array;
  export let format: Format;

  const dispatch = createEventDispatcher();

  function remove() {
    dispatch('remove');
  }
</script>

<div class="card">
    <span class="remove-button" on:click={remove}>X</span>
    <FormatPicker bind:format={format}></FormatPicker>
    {#if format === UTF8}
        <Utf8Input on:updateValue exportValue={value}></Utf8Input>
    {:else if format === B64}
        <Base64Input on:updateValue exportValue={value}></Base64Input>
    {:else}
        <QRInput on:updateValue exportValue={value}></QRInput>
    {/if}
</div>

<style>
    .card {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
        position: relative;
    }

    .remove-button {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        font-weight: bold;
    }
</style>
