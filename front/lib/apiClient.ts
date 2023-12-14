import axios from "axios";

// TODO:久乗にインストールすることを促す
const authClient = axios.create({
  baseURL: "http:localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
})

export { authClient }