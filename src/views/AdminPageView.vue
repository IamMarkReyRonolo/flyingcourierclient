<template>
	<v-app id="inspire">
		{{ refresh }}
		<v-navigation-drawer app color="#37474f" permanent>
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
				<v-list-item-group v-model="selectedItem" color="white" class="mx-auto">
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
			<v-avatar color="white" size="40"> A</v-avatar>
			<p>Admin</p>
			<v-spacer></v-spacer>

			<v-btn class="mr-10" @click="logOut">Log Out</v-btn>
		</v-app-bar>

		<v-main>
			<div class="requests" v-if="selectedItem == 0">
				<div class="header">
					<h1>All Orders</h1>
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
													<v-btn v-bind="attrs" v-on="on">Accept</v-btn>
												</template>
												<template v-slot:default="dialog">
													<accept-order
														:order="order"
														:dialog="dialog"
													></accept-order>
												</template>
											</v-dialog>

											<v-dialog persistent max-width="290">
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-bind="attrs" v-on="on" color="error" dark
														>Decline Order</v-btn
													>
												</template>

												<template v-slot:default="dialog">
													<v-card color="#37474f" dark>
														<v-card-title class="headline">
															Decline Order?
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
										<div class="actions">
											<v-dialog persistent max-width="290">
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-bind="attrs" v-on="on" color="success" light
														>Mark As Arrived</v-btn
													>
												</template>

												<template v-slot:default="dialog">
													<v-card color="#37474f" dark>
														<v-card-title class="headline">
															Mark As Arrived?
														</v-card-title>
														<v-card-text
															>This means that the order will be ready to pick
															up on their designated location.</v-card-text
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
																@click="updateStatus(order, dialog)"
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
																			Updating status.
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
										<div class="actions">
											<v-dialog persistent max-width="290">
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-bind="attrs" v-on="on" color="primary"
														>Mark As Received</v-btn
													>
												</template>

												<template v-slot:default="dialog">
													<v-card color="#37474f" dark>
														<v-card-title class="headline">
															Mark As Received?
														</v-card-title>
														<v-card-text
															>This means that the order is received by the
															receiver. The transaction is done</v-card-text
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
																			Updating Transaction.
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
						</div>
					</div>

					<div class="empty" v-if="orders.length == 0">
						<h2>Empty</h2>
					</div>
				</div>
			</div>

			<div class="branches" v-else-if="selectedItem == 1">
				<div class="header">
					<h1>Branches</h1>
					<v-spacer></v-spacer>

					<v-dialog transition="dialog-top-transition" max-width="400">
						<template v-slot:activator="{ on, attrs }">
							<v-btn v-bind="attrs" v-on="on">Create Branch</v-btn>
						</template>
						<template v-slot:default="dialog">
							<v-card dark max-width="400" color="blue-grey darken-3">
								<form
									action=""
									enctype="multipart/form-data"
									@submit.prevent="createBranch(dialog)"
								>
									<v-card-title>
										<div class="divi">
											<h2>Create Branch</h2>
										</div>
									</v-card-title>
									<v-card-text>
										<v-container>
											<v-text-field
												label="Branch Location"
												outlined
												dense
												required
												v-model="createdBranch.branch_location"
											></v-text-field>

											<v-text-field
												label="Branch Name"
												outlined
												dense
												required
												v-model="createdBranch.branch_name"
											></v-text-field>

											<div class="busCon">
												<h2>Business Hours</h2>

												<div class="businessHours">
													<label for="start">Start Time:</label>
													<input
														type="time"
														id="appt"
														name="start"
														v-model="start"
														required
													/>
												</div>

												<div class="businessHours">
													<label for="end">End Time:</label>
													<input
														type="time"
														id="appt"
														name="end"
														v-model="end"
														required
													/>
												</div>
											</div>
										</v-container>

										<small>*indicates required field</small>
									</v-card-text>

									<v-card-actions>
										<div class="btns">
											<v-spacer></v-spacer>
											<v-btn
												class="black--text"
												color="white lighten-4"
												type="submit"
												dark
											>
												Create Branch
											</v-btn>
										</div>

										<v-dialog
											hide-overlay
											persistent
											width="300"
											v-model="dialog2"
										>
											<v-card color="white" light>
												<v-card-text>
													<h4 class="black--text mt-5">
														Creating Branch. Please wait.
													</h4>
													<v-progress-linear
														indeterminate
														color="black"
														class="mb-0 mt-5"
													></v-progress-linear>
												</v-card-text>
											</v-card>
										</v-dialog>
									</v-card-actions>
								</form>
							</v-card>
						</template>
					</v-dialog>
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
					<div v-if="branches.length != 0">
						<div class="ordersContainer" v-if="branches.length != 0">
							<v-expansion-panels>
								<v-expansion-panel v-for="branch in branches" :key="branch.id">
									<v-expansion-panel-header
										color="#37474f"
										class="white--text"
										disable-icon-rotate
										><h3>
											Branch Location:
											<span class="orderID">{{ branch.branch_location }}</span>
										</h3>
										<v-spacer></v-spacer>
										<template v-slot:actions>
											<v-icon color="primary">
												mdi-office-building-marker
											</v-icon>
										</template>
									</v-expansion-panel-header>

									<v-expansion-panel-content color="#e1e1e1">
										<div class="actions">
											<v-dialog
												transition="dialog-top-transition"
												max-width="400"
											>
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-bind="attrs" v-on="on">Edit</v-btn>
												</template>
												<template>
													<edit-branch :branch="branch"></edit-branch>
												</template>
											</v-dialog>

											<v-dialog persistent max-width="290">
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-bind="attrs" v-on="on" color="error" dark
														>Delete Branch</v-btn
													>
												</template>

												<template v-slot:default="dialog">
													<v-card color="#37474f" dark>
														<v-card-title class="headline">
															Delete Branch?
														</v-card-title>
														<v-card-text
															>Deleting this branch will delete all the orders
															referrenced to it.</v-card-text
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
																@click="deleteBranch(branch.id, dialog)"
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
																			Deleting branch.
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
										<div class="branchCon">
											<div class="branchDetails">
												<div>
													<h3>Branch Name</h3>
													<h4>{{ branch.branch_name }}</h4>
												</div>
												<div>
													<h3>Branch Business-Hours</h3>
													<h4>{{ branch.branch_businesshours }}</h4>
												</div>
											</div>

											<br />

											<h2 class="orderTitle">Orders</h2>

											<div class="hasContent" v-if="branch.orders.length != 0">
												<div class="orderArray">
													<div
														class="orderListInBranch"
														v-for="order in branch.orders"
														:key="order.id"
													>
														<div class="innerCon1">
															<div class="con">
																<div class="innerDiv">
																	<h3>Order ID</h3>
																	<h4>{{ order.id }}</h4>
																</div>

																<div class="flexCon">
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

																<div class="flexCon">
																	<div class="innerDiv">
																		<h3>
																			Estimated Time of Arrival (On or Before)
																		</h3>
																		<h4
																			v-if="order.order_status != 'Processing'"
																		>
																			{{ order.order_estimatedtime }}
																		</h4>
																		<h4
																			v-if="order.order_status == 'Processing'"
																		>
																			Processing
																		</h4>
																	</div>
																</div>

																<div class="flexCon">
																	<div class="innerDiv">
																		<h3>Sender</h3>
																		<h4>{{ order.sender }}</h4>
																	</div>

																	<div class="innerDiv">
																		<h3>Contact Number</h3>
																		<h4>{{ order.sender_contact }}</h4>
																	</div>
																</div>

																<div class="flexCon">
																	<div class="innerDiv">
																		<h3>Receiver</h3>
																		<h4>{{ order.receiver }}</h4>
																	</div>

																	<div class="innerDiv">
																		<h3>Contact Number</h3>
																		<h4>{{ order.receiver_contact }}</h4>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div class="empty" v-if="branch.orders.length == 0">
												<h2>Empty</h2>
											</div>
										</div>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels>
							<br />
						</div>
					</div>

					<div class="empty" v-if="branches.length == 0">
						<h2>Empty</h2>
					</div>
				</div>
			</div>

			<div class="users" v-else-if="selectedItem == 2">
				<div class="header">
					<h1>Users</h1>
					<v-spacer></v-spacer>
				</div>

				<user-list></user-list>
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
	import orderAPI from "../api/orderAPI";
	import branchAPI from "../api/branchAPI";
	import acceptOrder from "../components/AdminPageComponents/acceptOrder.vue";
	import editBranch from "../components/AdminPageComponents/editBranch.vue";
	import userList from "../components/AdminPageComponents/userListComponent.vue";

	export default {
		components: {
			acceptOrder,
			editBranch,
			userList,
		},
		data: () => ({
			load: false,
			selectedItem: 0,
			items: [
				{ text: "All Orders", icon: "	mdi-progress-clock" },
				{ text: "Branches", icon: "mdi-office-building-marker" },
				{ text: "Users", icon: "mdi-account-box-multiple-outline" },
			],

			orders: [],
			error: null,
			fetched: null,
			dialog5: false,
			branches: [],
			dialog2: false,
			start: "",
			end: "",
			createdBranch: {
				branch_location: "",
				branch_name: "",
			},
		}),
		methods: {
			logOut() {
				this.$router.push("/logout");
			},

			async getOrders() {
				try {
					this.load = true;

					this.error = null;
					this.fetched = null;
					this.orders = await orderAPI.prototype.getOrdersAsAdmin();

					this.fetched = this.orders;
					this.load = false;
				} catch (error) {
					this.error = true;
					this.load = false;
				}
			},

			async deleteOrder(id, dialog) {
				try {
					this.dialog5 = true;
					await orderAPI.prototype.deleteOrder(id);
					this.dialog5 = false;
					dialog.value = false;
					this.getOrders();
				} catch (error) {
					alert("An Error occured! Try Again");
					this.dialog5 = false;
					dialog.value = false;
				}
			},

			async updateStatus(order, dialog) {
				try {
					this.dialog5 = true;

					const data = {
						order_type: order.order_type,
						order_baggage: order.order_baggage,
						order_status: "Ready To Pick Up",
						order_estimatedtime: order.order_estimatedtime,
						sender: order.sender,
						sender_contact: order.sender_contact,
						receiver: order.receiver,
						receiver_contact: order.receiver_contact,
						branch_location: order.branch.branch_location,
					};

					await orderAPI.prototype.updateOrder(order.id, data);
					alert("Successfully updated order");
					this.dialog5 = false;
					dialog.value = false;
					order.order_status = "Ready To Pick Up";
				} catch (error) {
					alert("An Error occured! Try Again");
					this.dialog5 = false;
					dialog.value = false;
				}
			},

			async getBranches() {
				try {
					this.load = true;

					this.error = null;
					this.fetched = null;
					const branches = await branchAPI.prototype.getBranches();
					this.fetched = branches;
					this.load = false;

					this.branches = branches;
				} catch (error) {
					this.error = true;
					this.load = false;
				}
			},

			async createBranch(dialog) {
				try {
					this.dialog2 = true;

					const startTime = this.start.split(":")[0] >= 12 ? " pm" : " am";
					const endTime = this.end.split(":")[0] >= 12 ? " pm" : " am";
					const startHour =
						this.start.split(":")[0] % 12 == 0
							? 12
							: this.start.split(":")[0] % 12;
					const endHour =
						this.end.split(":")[0] % 12 == 0 ? 12 : this.end.split(":")[0] % 12;

					const businessHours =
						startHour +
						":" +
						this.start.split(":")[1] +
						startTime +
						" to " +
						endHour +
						":" +
						this.end.split(":")[1] +
						endTime;

					const data = {
						branch_name: this.createdBranch.branch_name,
						branch_location: this.createdBranch.branch_location,
						branch_businesshours: businessHours,
					};

					const branch = await branchAPI.prototype.createBranch(data);

					this.dialog2 = false;
					dialog.value = false;

					alert("Sucessfully created branch");
					this.createdBranch = {
						branch_location: "",
						branch_name: "",
					};

					this.start = "";
					this.end = "";
					this.getBranches();
				} catch (error) {
					this.dialog2 = false;
					alert("Something went wrong.");
				}
			},

			async deleteBranch(id, dialog) {
				try {
					this.dialog5 = true;
					await branchAPI.prototype.deleteBranch(id);
					alert("Successfully deleted branch");
					this.dialog5 = false;
					dialog.value = false;
					this.getBranches();
				} catch (error) {
					alert("An Error occured! Try Again");
					this.dialog5 = false;
					dialog.value = false;
				}
			},

			async getUsers() {
				try {
					this.load = true;

					this.error = null;
					this.fetched = null;
				} catch (error) {
					this.error = true;
					this.load = false;
				}
			},
		},

		computed: {
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

			refresh() {
				if (this.selectedItem == 0) {
					this.getOrders();
				} else if (this.selectedItem == 1) {
					this.getBranches();
				} else if (this.selectedItem == 2) {
					this.getUsers();
				}
			},
		},

		async created() {
			if (localStorage.getItem("token")) {
				if (localStorage.getItem("historyRoute") == "/account") {
					this.$router.push("/account");
				} else {
					await this.getOrders();
					await this.getBranches();
					console.log(
						"There is an easter egg in this system - Mark Rey Ronolo"
					);
					localStorage.setItem("historyRoute", this.$route.fullPath);
				}
			}
		},
	};
</script>

<style scoped>
	.loading {
		margin: auto;
		width: 100px;
		text-align: center;
	}
	.orderID {
		padding: 5px 10px;
		border-radius: 5px;
		margin: 0px 5px;
		font-weight: normal;
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

	.rickRolled h4 {
		margin: auto;
		text-align: center;
		justify-content: center;
		align-items: center;
		display: flex;
		color: #37474f;
		height: 90vh;
	}

	/* Request */

	.ordersContainer h2 {
		color: #37474f;
	}

	.requests {
		width: 80%;
		margin: auto;
		padding: 20px;
	}

	.requests h1 {
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

	.empty h2 {
		text-align: center;
		color: #37474f;
	}

	/* End- Request */

	/* Start - Branch */

	.branches {
		width: 80%;
		margin: auto;
		padding: 20px;
	}

	.branches h1 {
		color: #37474f;
		font-size: 50px;
		margin: 20px 0px;
	}

	.branchMain {
		background-color: #37474f;
		border-radius: 10px;
		color: white;
	}

	.branchDetails {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 5px 10px;
		background-color: #37474f;
		border-radius: 10px;
		color: white;
	}

	.branchDetails div {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0px 10px;
	}

	.branchDetails div h4 {
		margin: 0px 10px;
		padding: 0px 10px;
		color: #37474f;
		background-color: white;
		border-radius: 5px;
	}

	.orderTitle {
		color: #37474f;
	}

	.orderArray {
		display: flex;
		flex-wrap: wrap;
	}

	.flexCon {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 12px;

		background-color: white;
	}

	.flexCon h3 {
		font-weight: bold;
		color: #37474f;
		padding: 2px 5px;
		border-radius: 5px;
	}

	.flexCon h4 {
		color: white;
		font-weight: normal;
		background-color: #37474f;
		padding: 3px 5px;
		border-radius: 5px;
		min-width: 70px;
	}

	.orderListInBranch {
		display: flex;
		justify-content: space-between;
		padding: 0px;
		margin: 20px auto;
	}

	.orderListInBranch .innerCon1 {
		padding: 5px;
		width: 500px;
	}

	.orderListInBranch .innerCon1 .innerDiv {
		display: flex;
		justify-content: flex-start;
	}

	/* create branch */

	::-webkit-calendar-picker-indicator {
		background-color: white;
		cursor: pointer;
	}
	.busCon {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-direction: column;
	}

	.divi h2 {
		margin: auto;
	}

	.btns {
		margin: 4px 0px;
		margin-left: 110px;
	}

	.busCon .businessHours {
		padding: 10px;
	}

	.businessHours input {
		padding: 5px;
		margin-left: 10px;
		width: 150px;
		border-radius: 5px;
		color: white;
		border: 1px solid grey;
	}
	/* create branch end */

	/* End - Branch */

	/* Start Users */
	.users {
		width: 80%;
		margin: auto;
		padding: 20px;
	}

	.users h1 {
		color: #37474f;
		font-size: 50px;
		margin: 20px 0px;
	}

	/* End Users */
</style>
