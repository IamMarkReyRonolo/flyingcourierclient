<template>
	<div class="updateOrder">
		<v-card dark max-width="400" color="blue-grey darken-3">
			<form
				action=""
				enctype="multipart/form-data"
				@submit.prevent="updateBranch"
			>
				<v-card-title>
					<div class="div">
						<h2>Edit Branch Details</h2>
					</div>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-text-field
							label="Branch Location"
							outlined
							dense
							required
							v-model="branch.branch_location"
						></v-text-field>

						<v-text-field
							label="Branch Name"
							outlined
							dense
							required
							v-model="branch.branch_name"
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
						<v-btn
							class="black--text"
							color="white lighten-4"
							type="submit"
							dark
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
	import branchAPI from "../../api/branchAPI";

	export default {
		data: () => ({
			dialog2: false,
			start: "",
			end: "",
		}),
		props: {
			branch: Object,
		},
		methods: {
			async updateBranch() {
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
						branch_name: this.branch.branch_name,
						branch_location: this.branch.branch_location,
						branch_businesshours: businessHours,
					};

					const branch = await branchAPI.prototype.updateBranch(
						this.branch.id,
						data
					);

					this.dialog2 = false;

					this.branch.branch_businesshours = businessHours;
					alert("Sucessfully updated branch");
				} catch (error) {
					this.dialog2 = false;
					alert("Something went wrong.");
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

	.dateInput {
		padding: 5px 10px;
		font-size: 18px;
		cursor: pointer;
		border: 1px solid grey;
		color: white;
		border-radius: 5px;
	}

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
</style>
