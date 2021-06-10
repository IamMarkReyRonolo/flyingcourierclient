<template>
	<div class="userSignIn">
		<v-card dark max-width="400" height="450" color="blue-grey darken-3">
			<form action="" enctype="multipart/form-data" @submit.prevent="signIn">
				<v-card-title>
					<div class="div">
						<h2>Sign in User</h2>
					</div>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
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
							Sign-In
						</v-btn>
					</div>

					<p>Or</p>

					<div class="btns">
						<v-btn color="white lighten-4" :to="'/signUp'" text>
							Sign Up
						</v-btn>
					</div>

					<v-dialog hide-overlay persistent width="300" v-model="dialog2">
						<v-card color="white" light>
							<v-card-text>
								<p mt-5>Signing in. Please wait.</p>
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
	import userAPI from "../../api/userAPI";

	export default {
		data: () => ({
			user: {
				username: "",
				password: "",
			},
			dialog2: false,
		}),
		methods: {
			async signIn() {
				try {
					this.dialog2 = true;
					const user = await userAPI.prototype.signInUser(this.user);

					this.dialog2 = false;
					localStorage.setItem("token", user.data.user.token);
					this.$router.push("/account");
				} catch (error) {
					this.dialog2 = false;
					if (error.message == "Network Error") {
						alert(error.message);
					} else {
						alert("Email or Password is incorrect!");
					}
				}
			},
		},
	};
</script>

<style scoped>
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
