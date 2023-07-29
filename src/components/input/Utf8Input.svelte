<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {byteArrayToUtf8, utf8ToByteArray} from "$lib/bytearray";
  import Copy from "svelte-material-icons/ContentCopy.svelte";
  import Eye from "svelte-material-icons/Eye.svelte";
  import EyeOff from "svelte-material-icons/EyeOff.svelte";

  export let exportValue;
  let formValue: string;
  let editable = false;
  export let opaque = true;
  let inputField;
  const dispatch = createEventDispatcher();

  function edit() {
    if (!editable) {
      editable = true;
      formValue = byteArrayToUtf8(exportValue);
      inputField.focus();
    }
  }

  function submit() {
    dispatch('updateValue', {
      value: utf8ToByteArray(formValue),
    });
    editable = false;
  }

  function toggleOpaque() {
    opaque = !opaque;
  }

  function copyToClipboard() {
    if (editable) {
      submit();
    }
    if (exportValue && exportValue.length > 0) {
      navigator.clipboard.writeText(byteArrayToUtf8(exportValue));
    }
  }

  $: {
    if (!editable && exportValue && exportValue.length > 0) {
      formValue = byteArrayToUtf8(exportValue);
    }
  }
</script>

<div>
    <form class:editable={editable} on:click={edit} on:submit={submit} on:focusout={submit}>
        {#if opaque}
        <input type="password" placeholder="secret" bind:this={inputField} on:focusin={edit} bind:value={formValue}>
        {:else}
        <input type="text" placeholder="secret" bind:this={inputField} on:focusin={edit} bind:value={formValue}>
        {/if}
        <button on:click={toggleOpaque}>
            {#if opaque}
            <Eye/>
            {:else}
            <EyeOff/>
            {/if}
        </button>
        <button on:click={copyToClipboard}>
            <Copy/>
        </button>
    </form>
</div>

<style lang="scss">
  form {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;

    button {
      display: flex;
      flex-direction: row;
      align-items: center;

      // "merge" with input
      border: none;
      outline: none;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);

      color: rgba(0, 0, 0, 0.5);
    }

    *:first-child {
      border-radius: 4px 0 0 4px;
    }
    *:last-child {
      border-radius: 0 4px 4px 0;
    }
    *:not(:first-child):not(:last-child) {
      border-radius: 0;
    }
    *:not(:first-child) {
      margin-left: 1px;
    }

    input {
      width: 100%;
      padding: 5px;
      border: none;
      outline: none;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);

      transition: box-shadow 100ms linear;

      &::placeholder {
        font-weight: lighter;
        font-style: italic;
        color: rgba(0, 0, 0, 0.2);
      }
    }
    &.editable {
      input {
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
      }
    }
  }
</style>
