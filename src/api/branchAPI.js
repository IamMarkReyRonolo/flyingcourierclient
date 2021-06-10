import axios from "axios";
const url = "http://localhost:3000/api/branch";
axios.defaults.headers.common["auth-token"] =
	"Bearer " + localStorage.getItem("token");

export default class API {
	async getBranches() {
		axios.defaults.headers.common["auth-token"] =
			"Bearer " + localStorage.getItem("token");
		const branches = await axios.get(url + "/all");
		return branches.data;
	}

	async updateBranch(branchId, updated) {
		const branch = await axios.patch(url + "/" + branchId, updated);
		return branch;
	}

	async createBranch(newBranch) {
		const branch = await axios.post(url + "/create", newBranch);
		return branch;
	}

	async deleteBranch(branchId) {
		const branch = await axios.delete(url + "/" + branchId);
		return branch;
	}
}
