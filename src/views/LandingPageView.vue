<template>
	<div class="landingPage">
		<v-app-bar app color="#37474F">
			<img
				src="../assets/creative-abstract-horse-wing-logo-design-symbol-vector-26089335-removebg-preview.png"
				alt=""
			/>
			<h2>FLYING <span>COURIER</span></h2>

			<v-spacer></v-spacer>

			<v-dialog transition="dialog-top-transition" max-width="400">
				<template v-slot:activator="{ on, attrs }">
					<v-btn v-bind="attrs" v-on="on" class="mr-10">Sign In</v-btn>
				</template>
				<template>
					<userSignIn></userSignIn>
				</template>
			</v-dialog>
		</v-app-bar>
		<div class="main">
			<div class="titleContainer">
				<br />
				<h1>Track Order</h1>
			</div>
			<div class="searchContainer">
				<form @submit.prevent="trackOrder">
					<v-text-field
						label="Enter order id to track order then press enter"
						height="55"
						solo
						rounded
						clearable
						append-icon="mdi-map-search"
						v-model="orderId"
					></v-text-field>
				</form>
			</div>

			<div class="resultContainer">
				<div v-if="load" class="loading">
					<v-progress-circular
						:size="50"
						:width="5"
						color="#37474f"
						indeterminate
					></v-progress-circular>
				</div>

				<div v-if="error">
					<h1>Couldn't track order</h1>
					<p>Please make sure that the order id is correct.</p>
				</div>

				<div v-if="fetched">
					<div v-if="true">
						<h1>Result</h1>
						<v-card width="800" height="80" dark color="#37474F">
							<div class="result">
								<div>
									<p>Id</p>
									<p class="content">
										{{ id.split("-")[0] }}
										{{ id.split("-")[1] }}
										...
									</p>
								</div>
								<div>
									<p>Status</p>
									<p class="content">{{ order.order_status }}</p>
								</div>
								<div>
									<p>Type</p>
									<p class="content">{{ order.order_type }}</p>
								</div>
								<div>
									<p>Baggage</p>
									<p class="content">{{ order.order_baggage }}</p>
								</div>

								<div>
									<p>Destination</p>
									<p class="content">{{ order.branch.branch_location }}</p>
								</div>

								<div>
									<p>Estimated Date</p>
									<p class="content" v-if="order.order_status != 'Processing'">
										{{ order.order_estimatedtime }}
									</p>
									<p class="content" v-if="order.order_status == 'Processing'">
										Processing
									</p>
								</div>
							</div>
							<div class="result2">
								<div class="box">
									<div class="inner">
										<h2>Sender</h2>
										<p class="content">{{ order.sender }}</p>
									</div>
									<div class="inner">
										<h2>Receiver</h2>
										<p class="content">{{ order.receiver }}</p>
									</div>
								</div>
								<div class="box">
									<div class="inner">
										<h2>Drop Off</h2>
										<p class="content">{{ order.branch.branch_name }}</p>
									</div>
									<div class="inner">
										<h3>Business Hours</h3>
										<p class="content">
											{{ order.branch.branch_businesshours }}
										</p>
									</div>
								</div>
							</div>
						</v-card>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import userSignIn from "../components/LandingPageComponents/UserSignIn.vue";
	import orderAPI from "../api/orderAPI";

	export default {
		data: () => ({
			signIn: false,
			load: false,
			error: null,
			fetched: null,
			orderId: "",
			order: {},
			id: "",
		}),
		components: {
			userSignIn,
		},

		methods: {
			async trackOrder() {
				try {
					this.load = true;

					const order = await orderAPI.prototype.getSpecificOrder(this.orderId);
					this.fetched = order;
					this.load = false;

					this.order = order;
					this.id = order.id;
				} catch (error) {
					this.load = false;
					this.error = true;
				}
			},
		},
		created() {
			if (localStorage.getItem("token")) {
				if (localStorage.getItem("historyRoute") == "/administrator") {
					this.$router.push("/administrator");
				} else if (localStorage.getItem("historyRoute") == "/account") {
					this.$router.push("/account");
				}
			}
		},
	};
</script>

<style scoped>
	img {
		width: 100px;
	}

	h2 {
		color: #1e1e1e;
		font-weight: bold;
		margin: 0px;
		padding: 5px;
		color: white;
	}

	span {
		background-color: white;
		color: #37474f;
		padding: 0px 5px;
	}

	.main {
		margin: 150px auto;
		width: 90%;
	}

	.searchContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750px;
		margin: auto;
	}

	form {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 750px;
		margin: auto;
	}

	.titleContainer {
		margin: auto;
		text-align: center;
		padding: 10px;
	}

	.titleContainer h1 {
		padding: 0px;
		margin: 0px;
		font-size: 50px;
		color: #37474f;
	}

	.resultContainer {
		width: 800px;
		margin: auto;
		text-align: center;
	}

	.resultContainer h1 {
		margin: 0px;
		padding: 10px;
		padding-bottom: 20px;
		color: #37474f;
	}

	.resultContainer .loading {
		margin: auto;
		width: 100px;
		text-align: center;
	}

	.result {
		color: #e1e1e1;
		display: flex;
		justify-content: space-evenly;
	}

	.result div {
		padding: 10px;
		min-width: 100px;
	}

	p {
		margin: 0px;
	}

	.result div .content {
		background-color: white;
		color: #37474f;
		font-weight: bolder;
		padding: 2px;
		margin-top: 5px;
		padding: 3px 5px;
		border-radius: 10px;
	}

	.result2 {
		display: flex;
		width: 800px;
		margin: 10px 0px;
		justify-content: space-between;
	}

	.result2 .box {
		width: 49%;

		padding: 20px;
		margin-top: 10px;
		background-color: #37474f;
		border-radius: 5px;
	}

	.box .inner {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.box .inner .content {
		padding: 5px 20px;
		border-radius: 10px;
		background-color: white;
		color: #37474f;
		font-weight: bolder;
		margin-left: 10px;
	}
</style>
