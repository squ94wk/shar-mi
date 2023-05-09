<script lang="ts">
  import {byteArrayToUtf8} from "$lib/bytearray";
  import * as QRCode  from 'qrcode';
  import ScannerQR from "../ScannerQR.svelte";

  export let exportValue: Uint8Array;
  type Mode = "Show" | "Detect";
  let mode: Mode = "Show";
  let canvas;
  let error;

  $: {
    if (mode === "Show" && exportValue) {
      try {
        QRCode.toCanvas(canvas, byteArrayToUtf8(exportValue), (err) => {
          if (error) { error = err };
        });
      } catch (e) {
        error = e;
      }
    }
  }

  function switchMode(m: Mode) {
    mode = m;
  }

  function onScanComplete(event) {
    if (event.detail.code) {
      exportValue = event.detail.code;
    }
    switchMode("Show")
  }
</script>

<label>
    {#if mode === "Show"}
        {#if exportValue}
            <canvas bind:this={canvas}></canvas>
        {:else}
            <div>No value</div>
        {/if}
        <button on:click={() => switchMode("Detect")}>Replace</button>
    {:else}
        <ScannerQR on:scanComplete={onScanComplete}></ScannerQR>
    {/if}
    {error}
</label>
