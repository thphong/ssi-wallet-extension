<script lang="ts">
    import TextInput from "../components/TextInput.svelte";
    import { unlock } from "../did-interfaces/session";
    import { currentUser } from "../did-interfaces/users";
    
    let password = "";
    let submitting = false;
    let errorMessage = "";


    currentUser.subscribe(() => {
        password = "";
        submitting = false;
        errorMessage = "";
    });

    $: isValidPassword = password.trim().length > 0;
</script>

<section class="main-content">
    <TextInput
        bind:value={password}
        placeholder={"Enter your password"}
        readonlyCon={submitting}
        type="password"
        {errorMessage}
    ></TextInput>
    <button
        class="primary"
        disabled={!isValidPassword || submitting}
        on:click={async () => {
            if ($currentUser) {
                try {
                    errorMessage = "";
                    submitting = true;
                    await unlock($currentUser.did, password);
                } catch {
                    errorMessage = "Please check your password and try again";
                } finally {
                    submitting = false;
                }
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
