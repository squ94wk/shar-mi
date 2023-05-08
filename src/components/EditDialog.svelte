<script lang="ts">
  import {onMount} from 'svelte';
  import {createEventDispatcher} from 'svelte';
  import Utf8Input from './edit/Utf8Input.svelte';
  import type {Format} from "$lib/format";
  import FormatPicker from "./FormatPicker.svelte";
  import Base64Input from "./edit/Base64Input.svelte";

  // Value
  export let initialValue: Uint8Array;
  let value: Uint8Array;
  onMount(() => {
    value = initialValue;
  });

  // Format
  let format: Format;

  // Dispatch events to parent
  const dispatch = createEventDispatcher();

  function save() {
    dispatch('save', {
      value: value,
    });
  }

  function cancel() {
    dispatch('cancel');
  }

  // Close if click outside or 'ESC'
  let outside;

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      cancel();
    }
  }

  function onClickOutside(event) {
    // ignore events from the modal
    if (event.target === outside) {
      cancel()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown}/>
<div class="backdrop" bind:this={outside} on:click={onClickOutside}>
    <div class="dialog">
        <span class="close-button" on:click={cancel}>X</span>
        <FormatPicker bind:value={format}/>
        {#if format === 'UTF8'}
        <Utf8Input bind:exportValue={value}/>
        {:else if format === 'B64'}
        <Base64Input bind:exportValue={value}/>
        {:else}
        {/if}
        <button on:click={save}>Save</button>
        <button on:click={cancel}>Cancel</button>
    </div>
</div>

<style>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dialog {
        background-color: white;
        border: 1px solid #ccc;
        padding: 20px;
    }

    .close-button {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        font-weight: bold;
    }
</style>
