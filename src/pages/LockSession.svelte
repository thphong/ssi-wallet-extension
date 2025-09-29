<script lang="ts">
    import TextInput from "../components/TextInput.svelte";
    import { unlock } from "../did-interfaces/session";
    import { currentUser } from "../did-interfaces/users";
    let password = "";
    let submitting = false;
</script>

<section class="main-content">
    <TextInput
        bind:value={password}
        placeholder={"your password"}
        readonlyCon={submitting}
        type="password"
    ></TextInput>
    <button
        class="primary"
        on:click={() => {
            if ($currentUser) {
                unlock($currentUser.did, password);
            }
        }}>Unlock your Account</button
    >
</section>

<style>
    /* Balance section */
    .main-content {
        text-align: left;
        margin: 18px 2px;
        margin-top: 50%;
    }
</style>
