<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {base64ToByteArray, byteArrayToBase64, byteArrayToUtf8} from "$lib/bytearray";

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

  $: {
    if (!editable && exportValue && exportValue.length > 0) {
      formValue = byteArrayToBase64(exportValue);
    }
  }
</script>

<div>
    <form class:editable={editable} on:click={edit} on:submit={submit} on:focusout={submit}>
        <input type="text" placeholder="secret" bind:this={inputField} on:focusin={edit} bind:value={formValue}>
    </form>
</div>

<style lang="scss">
  form {
    input {
      width: 100%;
      padding: 5px;
      border: none;
      outline: none;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
      border-radius: 4px;

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
