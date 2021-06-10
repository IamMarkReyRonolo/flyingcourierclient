<template>
	<v-app id="inspire">
		<div v-if="load" class="loading">
			<v-progress-circular
				:size="70"
				:width="7"
				color="teal"
				indeterminate
			></v-progress-circular>
		</div>
	</v-app>
</template>

<script>
	export default {
		name: "App",

		data: () => ({
			load: false,
		}),
		methods: {
			async logOut() {
				this.load = true;
				setTimeout(() => {
					localStorage.removeItem("token");
					localStorage.removeItem("historyRoute");
					this.load = false;

					this.$router.push("/");
				}, 1000);
			},
		},

		async created() {
			await this.logOut();
		},
	};
</script>

<style scoped>
	.loading {
		font-weight: bold;
		text-align: center;
		font-size: 20px;
		padding: 20px;
		margin: auto;
		width: 300px;
	}
</style>
