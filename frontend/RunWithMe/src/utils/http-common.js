import axios from "axios";

// axios 객체 생성
export default axios.create({
	baseURL: "https://k3a303.p.ssafy.io:8443/",
  // baseURL: "http://localhost:8080/",
  
  // baseURL: "https://878b31284fc1.ngrok.io",
    headers: {
      AUTH:localStorage.getItem("auth")
    },
    xhrFields: {
      withCredentials: true
    }
});

