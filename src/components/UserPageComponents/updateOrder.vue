<template>
	<div class="updateOrder">
		<v-card dark max-width="400" color="blue-grey darken-3">
			<form
				action=""
				enctype="multipart/form-data"
				@submit.prevent="updateOrder"
			>
				<v-card-title>
					<div class="div">
						<h2>Update Order</h2>
					</div>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-text-field
							label="Receiver *"
							required
							v-model="order.receiver"
							dense
							outlined
						></v-text-field>

						<v-text-field
							label="Receiver Contact*"
							v-model="order.receiver_contact"
							required
							dense
							outlined
						></v-text-field>

						<v-select
							:items="types"
							label="Type"
							outlined
							dense
							v-model="order.order_type"
						></v-select>

						<v-select
							:items="baggage"
							label="Baggage"
							outlined
							dense
							v-model="order.order_baggage"
						></v-select>

						<v-select
							:items="branches"
							label="Destination Branch"
							outlined
							dense
							v-model="order.branch.branch_location"
						></v-select>
					</v-container>
					<small>*indicates required field</small>
				</v-card-text>

				<v-card-actions>
					<div class="btns">
						<v-btn
							class="black--text"
							color="white lighten-4"
							type="submit"
							light
						>
							Update
						</v-btn>
					</div>

					<v-dialog hide-overlay persistent width="300" v-model="dialog2">
						<v-card color="white" light>
							<v-card-text>
								<p mt-5>Updating Order. Please wait.</p>
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
	</div>
</template>

<script>
	import orderAPI from "../../api/orderAPI";

	export default {
		data: () => ({
			user: {
				username: "",
				password: "",
			},
			dialog2: false,
			types: ["Express", "Standard"],
			baggage: ["Box", "Satchel"],
		}),
		props: {
			order: Object,
			branches: Array,
		},
		methods: {
			async updateOrder() {
				try {
					this.dialog2 = true;

					const data = {
						order_type: this.order.order_type,
						order_baggage: this.order.order_baggage,
						order_status: this.order.order_status,
						order_estimatedtime: this.order.order_estimatedtime,
						sender: this.order.sender,
						sender_contact: this.order.sender_contact,
						receiver: this.order.receiver,
						receiver_contact: this.order.receiver_contact,
						branch_location: this.order.branch.branch_location,
					};

					const order = await orderAPI.prototype.updateOrder(
						this.order.id,
						data
					);

					alert("Successfully updated order");
					this.dialog2 = false;
				} catch (error) {
					alert("There was an error occured.");
					this.dialog2 = false;
				}
			},
		},
	};
</script>

<style scoped>
	.updateOrder {
		margin: auto;
		text-align: center;
		width: 400px;
	}

	.con {
		display: flex;
		justify-content: center;
	}

	.div {
		text-align: center;
		margin: auto;
	}

	.v-text-field {
		margin-top: 0px;
		margin-bottom: 0px;
	}

	.v-card__actions {
		display: block;
	}

	.btns {
		margin: 4px 0px;
	}

	p {
		padding: 0px;
		margin: 0px;
	}
</style>
