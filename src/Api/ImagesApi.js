import axios from "axios";
import LocalStorage from "./LocalStorage";

const API_URL = "https://hemrostay-api.apps.openxcell.dev/api/v1/";

const checkIfTokenExpired = (response) => {
  if (response.data.code === 401) {
    return true;
  } else return false;
};

axios.interceptors.response.use(
  (response) => {
    if (checkIfTokenExpired(response)) {
      localStorage.removeItem("HamroSuperAdminAccessToken");
      localStorage.removeItem("HamroSuperAdminInfo");
      window.location.reload();
    }
    return response;
  },
  (err) => {
    console.error(err);
    return err;
  }
);

const ImagesApi = {
  getAllImages: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/content/hotelSlideImage", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          // console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  editMainImage: async function (payload) {
    let TOKEN;
    var bodyFormData = new FormData();
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("master admin----", TOKEN);
    });
    bodyFormData.append("hotel_id", payload.hotel_id);
    bodyFormData.append("main_image", payload.main_image);
    return axios({
      method: "PUT",
      url: API_URL + "super-admin/content/edit-hotelMainImage",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((response) => {
        // console.log("response --->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },
  editSliderImage: async function (payload) {
    let bodyFormData = new FormData();
    // for (let kv in payload) {
    //   bodyFormData.append(kv, payload[kv]);
    // }
    // console.log("slide_image");
    // console.log(payload.slide_image);

    bodyFormData.append("hotel_id", payload.hotel_id);
    for (var i = 0; i < payload.slide_image.length; i++) {
      bodyFormData.append("slide_image", payload.slide_image[i]);
    }
    let TOKEN;
    // console.log("payload", payload);
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });

    return axios({
      method: "POST",
      url: API_URL + "super-admin/content/hotel-slideImage",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((response) => {
        // console.log("response --->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },
  deleteSliderImage: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });

    const headers = {
      // "Content-Type": "multipart/form-data",
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + "super-admin/content/remove-hotelSlideImage", payload, {
        headers: headers,
      })
      .then((response) => {
        // console.log("response --->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },
  deleteSliderSingleImage: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });

    const headers = {
      // "Content-Type": "multipart/form-data",
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + "super-admin/content/remove-hotelSlideImage", payload, {
        headers: headers,
      })
      .then((response) => {
        //  console.log("response --->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },
};
export default ImagesApi;
