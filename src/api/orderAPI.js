import axios from "axios";
const url = "https://flyingcourierserver.herokuapp.com/api/order";
axios.defaults.headers.common["auth-token"] =
	"Bearer " + localStorage.getItem("token");

export default class API {
	async getSpecificOrder(orderId) {
		const order = await axios.get(url + "/" + orderId);
		return order.data;
	}

	async getOrdersAsUser() {
		const orders = await axios.get(url + "/user/all");
		return orders.data;
	}

	async getOrdersAsAdmin() {
		axios.defaults.headers.common["auth-token"] =
			"Bearer " + localStorage.getItem("token");
		const orders = await axios.get(url + "/admin/all");
		return orders.data;
	}

	async createOrder(submittedOrder) {
		const order = await axios.post(url + "/create", submittedOrder);
		return order.data;
	}

	async deleteOrder(orderId) {
		const order = await axios.delete(url + "/" + orderId);
		return order;
	}

	async updateOrder(orderId, newOrder) {
		const order = await axios.patch(url + "/" + orderId, newOrder);
		return order;
	}
}
