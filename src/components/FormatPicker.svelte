<script lang="ts">
    import type {Format} from "$lib/format";

    export let value: Format = "UTF8";
</script>

<form>
    <label>
        UTF-8
        <input bind:group={value} type="radio" name="format" value="UTF8"/>
    </label>
    <label>
        Base 64
        <input bind:group={value} type="radio" name="format" value="B64"/>
    </label>
    <label>
        QR
        <input bind:group={value} type="radio" name="format" value="QR"/>
    </label>
</form>
<div>
    {value}
</div>