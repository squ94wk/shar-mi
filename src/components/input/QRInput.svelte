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

  let devices: {
    id: string,
    name: string,
  }[];
  let deviceID: string;

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

  $: {
    if (editable && !devices) {
      navigator.mediaDevices.enumerateDevices().then((media) => {
        devices = media.filter(d => d.kind == 'videoinput').map(d => ({
          id: d.deviceId,
          name: d.label,
        }));
        if (devices.length > 0) {
          deviceID = devices[0].id
        }
      });
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
    {#if editable}
        <div class="options">
            {#if devices && devices.length > 1}
                <select class="device-selector" bind:value={deviceID}>
                    {#each devices as d}
                        <option value="{d.id}">{d.name}</option>
                    {/each}
                </select>
            {/if}
        </div>
        {#if deviceID}
            <!-- Recreate scanner if deviceID changes -->
            {#each [deviceID] as id (deviceID)}
                <ScannerQR deviceID="{id}" on:scanComplete={submit}></ScannerQR>
            {/each}
        {/if}
        <div class="actions">
            <button class="cancel" on:click={() => editable = false}>Cancel</button>
        </div>
    {:else}
        <canvas class="canvas" bind:this={canvas}></canvas>
        <div class="actions">
            <button class="replace" on:click={edit}>
                Replace
                <Camera color="rgba(0, 0, 0, 0.9)"/>
            </button>
        </div>
    {/if}
</div>

<style lang="scss">
  .container {
    max-width: 16rem;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-left: auto;
    margin-right: auto;
  }

  .options {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: stretch;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .canvas {
    > canvas {
      aspect-ratio: 1 / 1;
    }
  }
</style>
