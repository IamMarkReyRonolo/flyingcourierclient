<template>
	<v-app id="inspire">
		{{ refresh }}
		<v-navigation-drawer v-model="drawer" app color="#37474f" permanent>
			<div class="drawer">
				<img
					src="../assets/creative-abstract-horse-wing-logo-design-symbol-vector-26089335-removebg-preview.png"
					alt=""
				/>
				<h2>FLYING <span>COURIER</span></h2>
			</div>
			<v-divider></v-divider>
			<v-spacer></v-spacer>
			<v-list nav dense>
				<v-list-item-group v-model="selectedItem" color="white" class="mx-10">
					<v-list-item v-for="(item, i) in items" :key="i">
						<v-list-item-icon>
							<v-icon v-text="item.icon" class="white--text" size="30"></v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title
								v-text="item.text"
								class="white--text "
							></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar app color="#37474F">
			<v-avatar color="white" size="40" v-if="user.fullname">{{
				user.fullname.split("")[0].toUpperCase()
			}}</v-avatar>
			<p>{{ user.fullname }}</p>
			<v-spacer></v-spacer>

			<v-btn class="mr-10" @click="logOut">Log Out</v-btn>
		</v-app-bar>

		<v-main>
			<div class="list" v-if="selectedItem == 0">
				<div class="header">
					<h1>Order List</h1>
					<v-spacer></v-spacer>
					<v-btn @click="getOrders">Refresh</v-btn>
				</div>

				<div v-if="load" class="loading">
					<v-progress-circular
						:size="50"
						:width="5"
						color="#37474f"
						indeterminate
					></v-progress-circular>
				</div>

				<div v-if="error" class="error">
					<h1>There is something wrong</h1>
				</div>

				<div v-if="fetched">
					<div v-if="orders.length != 0">
						<div class="ordersContainer" v-if="ordersInProcess.length != 0">
							<h2>Orders In Process</h2>
							<v-expansion-panels>
								<v-expansion-panel
									v-for="order in ordersInProcess"
									:key="order.id"
								>
									<v-expansion-panel-header
										color="#37474f"
										class="white--text"
										disable-icon-rotate
										><h3>
											Order Id: <span class="orderID">{{ order.id }}</span>
										</h3>
										<v-spacer></v-spacer>
										<template v-slot:actions>
											<v-icon color="primary">
												mdi-progress-clock
											</v-icon>
										</template>
									</v-expansion-panel-header>

									<v-expansion-panel-content color="#e1e1e1">
										<div
											class="actions"
											v-if="order.order_status == 'Processing'"
										>
											<v-dialog
												transition="dialog-top-transition"
												max-width="400"
											>
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-bind="attrs" v-on="on">Edit</v-btn>
												</template>
												<template>
													<update-order
														:order="order"
														:branches="branches"
													></update-order>
												</template>
											</v-dialog>

											<v-dialog persistent max-width="290">
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-bind="attrs" v-on="on" color="error" dark
														>Cancel Order</v-btn
													>
												</template>

												<template v-slot:default="dialog">
													<v-card color="#37474f" dark>
														<v-card-title class="headline">
															Cancel Order?
														</v-card-title>
														<v-card-text
															>Cancelling this order will delete this order. Are
															you sure you want to cancel?</v-card-text
														>
														<v-card-actions>
															<v-spacer></v-spacer>
															<v-btn
																color="white darken-1"
																text
																@click="dialog.value = false"
															>
																Cancel
															</v-btn>

															<v-btn
																:disabled="dialog5"
																:loading="dialog5"
																class="white--text"
																text
																type="submit"
																@click="deleteOrder(order.id, dialog)"
															>
																Agree
															</v-btn>
															<v-dialog
																v-model="dialog5"
																hide-overlay
																persistent
																width="300"
															>
																<v-card color="white" light>
																	<v-card-text>
																		<p class="black--text mx-auto pt-5">
																			Cancelling order.
																		</p>
																		<v-progress-linear
																			indeterminate
																			color="teal"
																			class="mb-0 mt-5"
																		></v-progress-linear>
																	</v-card-text>
																</v-card>
															</v-dialog>
														</v-card-actions>
													</v-card>
												</template>
											</v-dialog>
										</div>
										<div class="mainCon">
											<div class="innerCon1">
												<div class="con">
													<div class="div">
														<div class="innerDiv">
															<h3>Status</h3>
															<h4>{{ order.order_status }}</h4>
														</div>
														<div class="innerDiv">
															<h3>Type</h3>
															<h4>{{ order.order_type }}</h4>
														</div>
														<div class="innerDiv">
															<h3>Baggage</h3>
															<h4>{{ order.order_baggage }}</h4>
														</div>
													</div>
													<div class="div">
														<div class="innerDiv">
															<h3>Destination Branch</h3>
															<h4>{{ order.branch.branch_name }}</h4>
														</div>
														<div class="innerDiv">
															<h3>Business Hours</h3>
															<h4>{{ order.branch.branch_businesshours }}</h4>
														</div>
													</div>
													<div class="div">
														<div class="innerDiv">
															<h3>Estimated Time of Arrival</h3>
															<h4 v-if="order.order_status != 'Processing'">
																{{ order.order_estimatedtime }}
															</h4>
															<h4 v-if="order.order_status == 'Processing'">
																Processing
															</h4>
														</div>
													</div>
												</div>
											</div>
											<div class="innerCon2">
												<div class="con">
													<div class="in">
														<h3>Sender</h3>
														<h4>{{ order.sender }}</h4>
													</div>

													<div class="in">
														<h3>Contact Number</h3>
														<h4>{{ order.sender_contact }}</h4>
													</div>
												</div>
												<div class="con">
													<div class="in">
														<h3>Receiver</h3>
														<h4>{{ order.receiver }}</h4>
													</div>

													<div class="in">
														<h3>Contact Number</h3>
														<h4>{{ order.receiver_contact }}</h4>
													</div>
												</div>
											</div>
										</div>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels>
							<br />
						</div>

						<div class="ordersContainer" v-if="ordersinTransit.length != 0">
							<h2>Orders In Transit</h2>
							<v-expansion-panels>
								<v-expansion-panel
									v-for="order in ordersinTransit"
									:key="order.id"
								>
									<v-expansion-panel-header
										color="#37474f"
										class="white--text"
										disable-icon-rotate
										><h3>
											Order Id: <span class="orderID">{{ order.id }}</span>
										</h3>
										<v-spacer></v-spacer>
										<template v-slot:actions>
											<v-icon color="teal">
												mdi-car-lifted-pickup
											</v-icon>
										</template>
									</v-expansion-panel-header>

									<v-expansion-panel-content color="#e1e1e1">
										<div class="mainCon">
											<div class="innerCon1">
												<div class="con">
													<div class="div">
														<div class="innerDiv">
															<h3>Status</h3>
															<h4>{{ order.order_status }}</h4>
														</div>
														<div class="innerDiv">
															<h3>Type</h3>
															<h4>{{ order.order_type }}</h4>
														</div>
														<div class="innerDiv">
															<h3>Baggage</h3>
															<h4>{{ order.order_baggage }}</h4>
														</div>
													</div>
													<div class="div">
														<div class="innerDiv">
															<h3>Destination Branch</h3>
															<h4>{{ order.branch.branch_name }}</h4>
														</div>
														<div class="innerDiv">
															<h3>Business Hours</h3>
															<h4>{{ order.branch.branch_businesshours }}</h4>
														</div>
													</div>
													<div class="div">
														<div class="innerDiv">
															<h3>Estimated Time of Arrival</h3>
															<h4 v-if="order.order_status != 'Processing'">
																{{ order.order_estimatedtime }}
															</h4>
															<h4 v-if="order.order_status == 'Processing'">
																Processing
															</h4>
														</div>
													</div>
												</div>
											</div>
											<div class="innerCon2">
												<div class="con">
													<div class="in">
														<h3>Sender</h3>
														<h4>{{ order.sender }}</h4>
													</div>

													<div class="in">
														<h3>Contact Number</h3>
														<h4>{{ order.sender_contact }}</h4>
													</div>
												</div>
												<div class="con">
													<div class="in">
														<h3>Receiver</h3>
														<h4>{{ order.receiver }}</h4>
													</div>

													<div class="in">
														<h3>Contact Number</h3>
														<h4>{{ order.receiver_contact }}</h4>
													</div>
												</div>
											</div>
										</div>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels>
							<br />
						</div>

						<div class="ordersContainer" v-if="ordersReadyToPickUp.length != 0">
							<h2>Orders Ready To Pick Up</h2>
							<v-expansion-panels>
								<v-expansion-panel
									v-for="order in ordersReadyToPickUp"
									:key="order.id"
								>
									<v-expansion-panel-header
										color="#37474f"
										class="white--text"
										disable-icon-rotate
										><h3>
											Order Id: <span class="orderID">{{ order.id }}</span>
										</h3>
										<v-spacer></v-spacer>
										<template v-slot:actions>
											<v-icon color="success">
												mdi-check
											</v-icon>
										</template>
									</v-expansion-panel-header>

									<v-expansion-panel-content color="#e1e1e1">
										<div class="mainCon">
											<div class="innerCon1">
												<div class="con">
													<div class="div">
														<div class="innerDiv">
															<h3>Status</h3>
															<h4>{{ order.order_status }}</h4>
														</div>
														<div class="innerDiv">
															<h3>Type</h3>
															<h4>{{ order.order_type }}</h4>
														</div>
														<div class="innerDiv">
															<h3>Baggage</h3>
															<h4>{{ order.order_baggage }}</h4>
														</div>
													</div>
													<div class="div">
														<div class="innerDiv">
															<h3>Destination Branch</h3>
															<h4>{{ order.branch.branch_name }}</h4>
														</div>
														<div class="innerDiv">
															<h3>Business Hours</h3>
															<h4>{{ order.branch.branch_businesshours }}</h4>
														</div>
													</div>
													<div class="div">
														<div class="innerDiv">
															<h3>Estimated Time of Arrival</h3>
															<h4 v-if="order.order_status != 'Processing'">
																{{ order.order_estimatedtime }}
															</h4>
															<h4 v-if="order.order_status == 'Processing'">
																Processing
															</h4>
														</div>
													</div>
												</div>
											</div>
											<div class="innerCon2">
												<div class="con">
													<div class="in">
														<h3>Sender</h3>
														<h4>{{ order.sender }}</h4>
													</div>

													<div class="in">
														<h3>Contact Number</h3>
														<h4>{{ order.sender_contact }}</h4>
													</div>
												</div>
												<div class="con">
													<div class="in">
														<h3>Receiver</h3>
														<h4>{{ order.receiver }}</h4>
													</div>

													<div class="in">
														<h3>Contact Number</h3>
														<h4>{{ order.receiver_contact }}</h4>
													</div>
												</div>
											</div>
										</div>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels>
						</div>
					</div>

					<div class="empty" v-if="orders.length == 0">
						<h2>Empty</h2>
					</div>
				</div>
			</div>

			<div class="bookingCon" v-else-if="selectedItem == 1">
				<div class="booking">
					<div class="mainForm">
						<h1>Book Order</h1>
						<div class="form">
							<v-text-field
								label="Receiver Name"
								v-model="receiver"
							></v-text-field>
							<v-text-field
								label="Receiver Contact"
								type="number"
								v-model="receiverContact"
							></v-text-field>
							<div class="division">
								<h2>Order Baggage</h2>
								<v-list-item-group class="innerDivi" v-model="orderBaggage">
									<v-list-item class="inner">
										<v-btn outlined>Box</v-btn>
									</v-list-item>

									<v-list-item class="inner">
										<v-btn outlined>Satchel</v-btn>
									</v-list-item>
								</v-list-item-group>
							</div>

							<div class="division">
								<h2>Order Type</h2>
								<v-list-item-group class="innerDivi" v-model="orderType">
									<v-list-item class="inner">
										<v-btn outlined>Express</v-btn>
									</v-list-item>

									<v-list-item class="inner">
										<v-btn outlined>Standard</v-btn>
									</v-list-item>
								</v-list-item-group>
							</div>

							<div class="division">
								<v-select
									:items="branches"
									label="Drop Off Branch"
									outlined
									v-model="destinationBranch"
								></v-select>
							</div>
						</div>
					</div>

					<div class="terms">
						<h2>Terms</h2>
						<p>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim
							placeat qui sint doloribus, minus, esse tenetur dignissimos, vel
							voluptatibus reprehenderit velit rerum optio fugiat dolores nobis
							consequatur laudantium. Maxime voluptates quae alias, repudiandae
							delectus sed dolores maiores. Tempore reprehenderit aliquid facere
							rem maxime nobis! Delectus nesciunt officia ut quasi? Doloribus!
						</p>
						<div class="termAction">
							<p v-if="!agreed">You must agree to terms and condition.</p>
							<v-btn @click="agreed = !agreed"
								><p v-if="agreed">Disagree</p>
								<p v-if="!agreed">Agree</p></v-btn
							>
						</div>
					</div>
				</div>

				<div class="placeOrder">
					<v-btn
						color="#37474f"
						class="white--text"
						:disabled="!verify"
						@click="createOrder"
					>
						Place Order</v-btn
					>

					<v-dialog hide-overlay persistent width="300" v-model="dialog2">
						<v-card color="white" light>
							<v-card-text>
								<h4>Submitting Order. Please wait.</h4>
								<v-progress-linear
									indeterminate
									color="black"
									class="mb-0 mt-5"
								></v-progress-linear>
							</v-card-text>
						</v-card>
					</v-dialog>
				</div>
			</div>

			<div v-else class="rickRolled">
				<h4>
					<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
						Heyyyy you've found an easter egg but Don't Click This</a
					>
				</h4>
			</div>
		</v-main>
	</v-app>
</template>

<script>
	import userAPI from "../api/userAPI";
	import orderAPI from "../api/orderAPI";
	import branchAPI from "../api/branchAPI";
	import updateOrder from "../components/UserPageComponents/updateOrder.vue";

	export default {
		components: { updateOrder },
		data: () => ({
			drawer: null,
			items: [
				{ text: "Order List", icon: "mdi-format-list-bulleted-square" },
				{ text: "Book Order", icon: "mdi-shape-square-rounded-plus" },
			],
			branches: [],
			types: ["Express", "Standard"],
			baggages: ["Box", "Satchel"],
			selectedItem: 0,
			user: {},
			orders: [],
			load: false,
			error: null,
			fetched: null,
			dialog5: false,
			agreed: false,
			destinationBranch: "",
			orderType: "",
			orderBaggage: "",
			receiver: "",
			receiverContact: "",
			dialog2: false,
		}),

		methods: {
			logOut() {
				this.$router.push("/logout");
			},

			async getUser() {
				try {
					this.user = await userAPI.prototype.getSpecificUser();

					this.user = this.user.data;
				} catch (error) {
					this.error = true;
				}
			},

			async getOrders() {
				try {
					this.load = true;

					this.error = null;
					this.fetched = null;
					this.orders = await orderAPI.prototype.getOrdersAsUser();
					this.getBranches();

					this.fetched = this.orders;
					this.load = false;
				} catch (error) {
					this.error = true;
					this.load = false;
				}
			},

			async getBranches() {
				const branches = await branchAPI.prototype.getBranches();

				this.branches = branches.map((branch) => {
					return branch.branch_location;
				});
			},

			async deleteOrder(id, dialog) {
				try {
					this.dialog5 = true;
					await orderAPI.prototype.deleteOrder(id);
					alert("Successfully cancelled order");
					this.dialog5 = false;
					dialog.value = false;
					this.getOrders();
				} catch (error) {
					alert("An Error occured! Try Again");
					this.dialog5 = false;
					dialog.value = false;
				}
			},

			async createOrder() {
				try {
					const data = {
						order_type: this.types[this.orderType],
						order_baggage: this.baggages[this.orderBaggage],
						order_status: "Processing",
						order_estimatedtime: "",
						sender: this.user.fullname,
						sender_contact: this.user.contact_number,
						receiver: this.receiver,
						receiver_contact: this.receiverContact,
						branch_location: this.destinationBranch,
					};

					this.dialog2 = true;

					const order = await orderAPI.prototype.createOrder(data);
					await this.getOrders();

					this.dialog2 = false;

					alert("successfully submitted order");
					this.agreed = false;
					this.destinationBranch = "";
					this.orderType = "";
					this.orderBaggage = "";
					this.receiver = "";
					this.receiverContact = "";
					this.selectedItem = 0;
				} catch (error) {
					alert("There was something wrong. Submission Failed.");
				}
			},
		},

		computed: {
			refresh() {
				if (this.selectedItem == 0) {
					this.getOrders();
				}
			},

			listenForEstimatedDate() {},

			verify() {
				if (
					this.agreed &&
					this.destinationBranch &&
					this.types[this.orderType] &&
					this.baggages[this.orderBaggage] &&
					this.receiver &&
					this.receiverContact
				) {
					return true;
				}
				return false;
			},

			ordersinTransit() {
				return this.orders.filter((order) => {
					return order.order_status == "In Transit";
				});
			},

			ordersInProcess() {
				return this.orders.filter((order) => {
					return order.order_status == "Processing";
				});
			},

			ordersReadyToPickUp() {
				return this.orders.filter((order) => {
					return order.order_status == "Ready To Pick Up";
				});
			},
		},

		async created() {
			if (localStorage.getItem("token")) {
				if (localStorage.getItem("historyRoute") == "/administrator") {
					this.$router.push("/administrator");
				} else {
					await this.getUser();
					await this.getOrders();
					console.log(
						"There is an easter egg in this system - Mark Rey Ronolo"
					);
					localStorage.setItem("historyRoute", this.$route.fullPath);
				}
			} else {
				this.$router.push("/accessdenied");
			}
		},
	};
</script>

<style scoped>
	.orderID {
		padding: 5px 10px;
		border-radius: 5px;
		margin: 0px 5px;
		font-weight: normal;
	}

	.loading {
		margin: auto;
		width: 100px;
		text-align: center;
	}
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

	.drawer {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	p {
		color: white;
		font-size: 18px;
		margin: auto 20px;
	}

	.v-list-item__title {
		font-size: 30px;
	}

	.list {
		width: 80%;
		margin: auto;
		padding: 20px;
	}

	.list h1 {
		color: #37474f;
		font-size: 50px;
		margin: 20px 0px;
	}

	h3 {
		font-weight: lighter;
		margin: 10px 0px;
	}

	.header {
		display: flex;
		align-items: center;
	}

	.actions {
		margin: 20px 0px;
		width: 250px;
		justify-content: space-between;
		align-items: center;
		display: flex;
	}

	.mainCon {
		display: flex;
		justify-content: space-between;
		padding: 0px;
		margin: 20px auto;
	}

	.mainCon .innerCon1 {
		padding: 5px;
		width: 70%;
	}

	.innerCon1 .con {
		min-height: 100%;
	}

	.mainCon .innerCon2 {
		padding: 5px;
		width: 30%;
	}

	.con {
		padding: 5px 10px;
		margin-bottom: 5px;
		background-color: #37474f;
		border-radius: 10px;
	}

	.con .in {
		display: flex;
		align-items: center;
	}

	.con h3,
	.con h4 {
		font-weight: lighter;
		color: white;
		text-align: center;
	}

	.con h4 {
		text-align: center;
		padding: 5px;
		color: white;
		border-radius: 5px;
		font-weight: normal;
		background-color: white;
		color: #37474f;
		margin: 0px 10px;
	}

	.div {
		display: flex;
		align-items: center;
		padding: 0px 0px;
	}

	.div2 {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 0px 0px;
	}

	.innerDiv {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 7px;
	}

	.innerDiv h4 {
		background-color: white;
		color: #37474f;
		margin: 0px 10px;
	}

	.bookingCon {
		width: 80%;
		margin: auto;
		padding: 20px;
	}

	.booking {
		display: flex;
	}

	.booking h1 {
		color: #37474f;
		font-size: 50px;
		margin: 20px 0px;
	}

	.placeOrder {
		width: 90%;
		margin: auto;
	}

	.placeOrder .v-btn {
		display: block;
		width: 100%;
	}

	.form {
		width: 500px;
		margin-left: 40px;
	}

	.terms {
		padding: 60px;
	}

	.terms h2 {
		color: #37474f;
		margin: 0px;
		padding: 20px 0px;
		padding-top: 40px;
		font-size: 30px;
	}

	.terms p {
		color: #37474f;
		margin: auto;
		text-align: justify;
	}

	.termAction {
		justify-content: flex-end;
		align-items: center;
		padding: 10px;
		display: flex;
	}

	.division {
		display: flex;
		align-items: center;
		margin: 10px 0px;
	}

	.division h2 {
		color: #37474f;
	}

	.innerDivi {
		display: flex;
		margin-left: 10px;
	}

	.v-select {
		margin: 10px 0px;
	}

	.empty h2 {
		text-align: center;
		color: #37474f;
	}

	.ordersContainer h2 {
		color: #37474f;
	}

	.rickRolled h4 {
		margin: auto;
		text-align: center;
		justify-content: center;
		align-items: center;
		display: flex;
		color: #37474f;
		height: 90vh;
	}
</style>
