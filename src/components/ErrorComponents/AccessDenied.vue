<template>
	<h1>Access Denied</h1>
</template>

<script>
	export default {
		name: "App",

		created() {
			if (localStorage.getItem("token")) {
				if (localStorage.getItem("historyRoute") == "/account") {
					this.$router.push("/account");
				} else if (localStorage.getItem("historyRoute") == "/administrator") {
					this.$router.push("/administrator");
				}
			}
		},
	};
</script>
