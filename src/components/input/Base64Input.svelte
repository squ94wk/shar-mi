<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {base64ToByteArray, byteArrayToBase64} from "$lib/bytearray";

  export let exportValue;
  let formValue: string;
  let editable = false;
  let inputField;
  const dispatch = createEventDispatcher();

  function edit() {
    editable = true;
    formValue = byteArrayToBase64(exportValue);
    inputField.focus();
  }

  function submit() {
    let b64Value: Uint8Array;
    try {
      b64Value = base64ToByteArray(formValue);
      dispatch('updateValue', {
        value: b64Value,
      });
    } catch (_) {}

    editable = false;
  }
</script>

<div>
    <form class:editable={editable} on:submit={submit} on:focusout={submit}>
        <input type="text" bind:this={inputField} on:focusin={edit} bind:value={formValue}>
    </form>
    {#if !editable}
        <span on:click={edit}>
            {#if exportValue.length > 0}
                {byteArrayToBase64(exportValue)}
            {:else}
                edit
            {/if}
        </span>
    {/if}
</div>

<style>
    form:not(.editable) {
        transform: scaleY(0%);
        max-height: 0;
    }
</style>