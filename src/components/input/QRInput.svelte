<script lang="ts">
  import {byteArrayToUtf8} from "$lib/bytearray";
  import * as QRCode from 'qrcode';
  import ScannerQR from "../ScannerQR.svelte";
  import {createEventDispatcher} from "svelte";

  export let exportValue: Uint8Array;

  let editable = false;
  const dispatch = createEventDispatcher();
  let canvas;

  // let error;

  function edit() {
    editable = true;
  }

  $: {
    if (exportValue && canvas) {
      try {
        QRCode.toCanvas(canvas, byteArrayToUtf8(exportValue), (err) => {
          // if (error) { error = err };
        });
      } catch (e) {
        // error = e;
      }
    }
  }

  function submit(event) {
    if (!event.detail.code) {
      editable = false;
      return
    }

    dispatch('updateValue', {
      value: event.detail.code,
    });

    editable = false;
  }
</script>

<label>
    {#if exportValue && exportValue.length > 0}
        <canvas bind:this={canvas}></canvas>
    {:else}
        <div>No value</div>
    {/if}
    <button on:click={edit}>Replace</button>
    {#if editable}
        <ScannerQR on:scanComplete={submit}></ScannerQR>
    {/if}
</label>
