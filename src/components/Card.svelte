<script>
    const Option = {
        UTF8: 'UTF-8',
        Base64: 'Base64',
        QR: 'QR',
    };
    let format = Option.UTF8;

    function changeFormat(event) {
        format = event.target.value;
    }
</script>

<div class="card">
    <div class="option-group">
        <label>
            <input
                    type="radio"
                    name="format"
                    value={Option.UTF8}
                    bind:checked={format}
                    on:change={changeFormat}
            />
            UTF-8
        </label>
        <label>
            <input
                    type="radio"
                    name="format"
                    value={Option.Base64}
                    bind:checked={format}
                    on:change={changeFormat}
            />
            Base64
        </label>
        <label>
            <input
                    type="radio"
                    name="format"
                    value={Option.QR}
                    bind:checked={format}
                    on:change={changeFormat}
            />
            QR
        </label>
    </div>
</div>

<style>
    .card {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 20px;
    }

    .option-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
