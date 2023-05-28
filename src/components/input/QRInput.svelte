<script lang="ts">
  import {byteArrayToUtf8, utf8ToByteArray} from "$lib/bytearray";
  import * as QRCode from 'qrcode';
  import ScannerQR from "../ScannerQR.svelte";
  import {createEventDispatcher} from "svelte";
  import Camera from "svelte-material-icons/Camera.svelte";

  export let exportValue: Uint8Array;

  let editable = false;
  const dispatch = createEventDispatcher();
  let canvas;

  // let error;

  function edit() {
    editable = true;
  }

  $: {
    if (canvas) {
      try {
        let source;
        if (exportValue && exportValue.length > 0) {
          source = exportValue;
        } else {
          source = utf8ToByteArray('secret');
        }
        QRCode.toCanvas(canvas, byteArrayToUtf8(source), {
          margin: 0,
          width: canvas.parentElement.clientWidth
        }, (err) => {
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

<div class="container">
    <div class="qr-container">
        <canvas bind:this={canvas}></canvas>
        <button class="button" on:click={edit}>Replace
            <Camera/>
        </button>
    </div>
    {#if editable}
        <ScannerQR on:scanComplete={submit}></ScannerQR>
    {/if}
</div>

<style lang="scss">
  .qr-container {
    max-width: 16rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    margin-left: auto;
    margin-right: auto;

    > canvas {
      width: 100%;
      aspect-ratio: 1 / 1;
    }

    button {
      width: 100%;
    }
  }
</style>
