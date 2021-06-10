<template>
	<div class="signUpPage">
		<v-app-bar app color="#37474F">
			<img
				src="../../assets/creative-abstract-horse-wing-logo-design-symbol-vector-26089335-removebg-preview.png"
				alt=""
			/>
			<h2>FLYING <span>COURIER</span></h2>
		</v-app-bar>

		<div class="main">
			<div class="userSignIn">
				<v-card
					dark
					max-width="400"
					min-height="450"
					color="blue-grey darken-3"
				>
					<form
						action=""
						enctype="multipart/form-data"
						@submit.prevent="signUp"
					>
						<v-card-title>
							<div class="div">
								<h2>Sign Up User</h2>
							</div>
						</v-card-title>
						<v-card-text>
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field
											label="Full Name*"
											required
											v-model="user.fullname"
											dense
											outlined
										></v-text-field> </v-col
									><v-col cols="12">
										<v-text-field
											label="Contact Number*"
											required
											v-model="user.contact_number"
											dense
											outlined
											type="number"
										></v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field
											label="Username*"
											required
											v-model="user.username"
											dense
											outlined
										></v-text-field>
									</v-col>

									<v-col cols="12">
										<v-text-field
											label="Password*"
											v-model="user.password"
											required
											type="password"
											dense
											outlined
										></v-text-field>
									</v-col>
								</v-row>
							</v-container>
							<small>*indicates required field</small>
						</v-card-text>

						<v-card-actions>
							<!-- <v-btn color="white darken-4" text type="submit">
								Add Product
							</v-btn> -->
							<div class="btns">
								<v-btn
									class="black--text"
									color="white lighten-4"
									type="submit"
									light
								>
									Sign-Up
								</v-btn>
							</div>

							<v-dialog hide-overlay persistent width="300" v-model="dialog2">
								<v-card color="white" light>
									<v-card-text>
										<p mt-5>Creating Account. Please wait.</p>
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
		</div>
	</div>
</template>

<script>
	import userAPI from "../../api/userAPI";

	export default {
		name: "SignUpPage",
		data: () => ({
			user: {
				fullname: "",
				contact_number: "",
				username: "",
				password: "",
				adminId: 1,
			},
			dialog2: false,
		}),

		methods: {
			async signUp() {
				try {
					this.dialog2 = true;
					const user = await userAPI.prototype.createUser(this.user);

					this.dialog2 = false;

					this.user = {
						fullname: "",
						contact_number: "",
						username: "",
						password: "",
						adminId: 1,
					};
					alert("success");
				} catch (error) {
					this.dialog2 = false;
					if (error.message == "Network Error") {
						alert(error.message);
					} else {
						alert("Email already exists.");
					}
				}
			},
		},
	};
</script>

<style scoped>
	.main {
		margin: 150px auto;
		width: 90%;
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

	.userSignIn {
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
