import axios from "axios";
import { Alert } from "@mui/material";
import LocalStorage from "./LocalStorage";
import moment from "moment";

// export const API_URL = "https://hemrostay-api.apps.openxcell.dev/api/v1/";
// export const API_URL = "http://localhost:4000/api/v1/";
console.log("ENV VARIABLE READ:", process.env.API_BASE_URL);
const API_URL = process.env.REACT_APP_API_BASE_URL + "/api/v1/";

const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

const checkIfTokenExpired = (response) => {
  if (response.data.code === 401) {
    return true;
  } else return false;
};

axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      localStorage.removeItem("HamroSuperAdminAccessToken");
      localStorage.removeItem("HamroSuperAdminInfo");
      window.location.reload();
    } else if (response.data.subAdminAuth) {
      alert(response.data.msg);
      setTimeout(() => {
        localStorage.removeItem("HamroSuperAdminAccessToken");
        localStorage.removeItem("HamroSuperAdminInfo");
        window.location.reload();
      }, 1000);
    } else {
      return response;
    }
  },
  (err) => {
    return err;
  }
);

const ApiUtils = {
  // get in touch

  getInTouch: function (payload) {
    const headers = {
      "Content-Type": "application/json",
    };
    return axios
      .post(API_URL + "common-module/landing-get-in-touch", payload, {
        headers: headers,
      })
      .then(function (response) {
        return response;
      })
      .catch(function (response) {
        throw response;
      });
  },

  // login
  login: function (payload) {
    const headers = {
      "Content-Type": "application/json",
    };
    return axios
      .post(API_URL + "super-admin/signin", payload, {
        headers: headers,
      })
      .then(function (response) {
        //handle success
        return response.data;
      })
      .catch(function (response) {
        //handle error

        throw response.data;
      });
  },

  //   get super admin edit profile data
  getProfileData: async function () {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      //console.log("token---nisha", TOKEN);
    });
    const headers = {
      // "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .get(API_URL + "super-admin/superAdminProfile", {
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
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  //get customer list
  customerListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/customerList", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
        // params: {
        //   limits: 2,
        //   page: 1,
        //   search: tableParams.search,
        // },
      })

      .then((response) => {
        // console.log("inside then apiutils");
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // super admin edit profile api

  superAdminUpdateProfile: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("super admin----", TOKEN);
    });
    var bodyFormData = new FormData();
    // bodyFormData.append("id", payload.id);
    bodyFormData.append("first_name", payload.first_name);
    bodyFormData.append("last_name", payload.last_name);
    bodyFormData.append("user_name", payload.user_name);
    bodyFormData.append("address", payload.address);
    bodyFormData.append("mobile_num", payload.mobile_num);
    bodyFormData.append("hotel_id", payload.hotel_id);
    bodyFormData.append("hotel_description", payload.hotel_description);
    // console.log("body form data", payload);
    return axios(
      {
        method: "PUT",
        url: API_URL + "super-admin/update-profile",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${TOKEN}`,
        },
      }
      // console.log("put method----", TOKEN)
    )
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          // console.log("response");
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },

  //staff listing
  staffListing: async function (tableParams, payload, master_service_id) {
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
      .post(API_URL + "super-admin/hotelStaffList", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
          filter: master_service_id ? master_service_id : "",
        },
      })

      .then((response) => {
        //console.log("inside then apiutils");
        if (response && response.data) {
          // console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // service list for staff
  masterServiceList: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/masterServicesList", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // create hotel owner
  createHotelStaff: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    var bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    //  console.log("body form data", payload);
    return axios(
      {
        method: "post",
        url: API_URL + "super-admin/add-hotelStaff",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${TOKEN}`,
        },
      }
      // console.log("post method----", TOKEN)
    )
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          //  console.log("response---", response.data);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },

  // create hotel customer
  createHotelCustomer: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    var bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    // console.log("body form data", payload);
    return axios(
      {
        method: "post",
        url: API_URL + "super-admin/add-customer",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${TOKEN}`,
        },
      }
      //  console.log("post method----", TOKEN)
    )
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          //  console.log("response---", response.data);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },

  //change password
  superAdminChangePassword: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      //  console.log("master admin----", TOKEN);
    });
    let bodyFormData = new FormData();
    // bodyFormData.append("id", payload.id);
    bodyFormData.append("old_password", payload.old_password);
    bodyFormData.append("new_password", payload.new_password);
    bodyFormData.append("confirm_password", payload.confirm_password);

    // console.log("body form data", payload);
    return axios(
      {
        method: "PUT",
        url: API_URL + "super-admin/chage-password",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${TOKEN}`,
        },
      }
      //  console.log("put method----", TOKEN)
    )
      .then((response) => {
        //  console.log("nishares", response);
        if (response && response.data) {
          //   console.log("response");
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },

  // get details of staff
  showStaffDetails: async function (user_id, payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      //  console.log("id--->", user_id);
    });
    const headers = {
      // "Content-Type": "multipart/form-data",
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + `super-admin/get-hotelStaff/${user_id}`, payload, {
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
  // get customer details
  showCustomerDetails: async function (user_id, payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      //  console.log("id--->", user_id);
    });
    const headers = {
      // "Content-Type": "multipart/form-data",
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + `super-admin/get-customer/${user_id}`, payload, {
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
  // edit staff details

  editHotelStaffDetails: async function (user_id, payload) {
    delete payload.password_confirmation;
    delete payload.password;
    delete payload.user_name;
    // delete payload.userUsed;
    // delete payload.staffUsed;
    //  console.log("edit payload", payload);

    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      //  console.log("token---nisha", TOKEN);
      //  console.log("id--->", user_id);
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + `super-admin/edit-hotelStaff/${user_id}`, bodyFormData, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //   console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // edit customer details
  editSuperAdminDetails: async function (user_id, payload) {
    delete payload.password_confirmation;
    delete payload.password;
    // delete payload.userUsed;
    // delete payload.staffUsed;
    // console.log("edit payload", payload);
    let bodyFormData = new FormData();
    // if (!payload.profile_image) {
    // if (payload.profile_image) {
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }
    // } else {
    //   bodyFormData.append("profile_image", payload.profile_image.files[0]);
    // }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      //  console.log("id--->", user_id);
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + `super-admin/edit-customer/${user_id}`, bodyFormData, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // delete staff
  deleteHotelStaff: async function (user_id, payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      // console.log("id--->", user_id);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(
        API_URL + `super-admin/remove-hotelStaff/${user_id}`,
        payload,

        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // delete customer
  deleteHotelCustomer: async function (user_id, payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      // console.log("id--->", user_id);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(
        API_URL + `super-admin/remove-customer/${user_id}`,
        payload,

        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // category listing
  categoryListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/mealCategoryList", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })

      .then((response) => {
        // console.log("inside then apiutils");
        if (response && response.data) {
          // console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  createHotelCategory: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    var bodyFormData = new FormData();
    // bodyFormData.append("id", payload.id);

    bodyFormData.append("hotel_id", payload.hotel_id);
    bodyFormData.append("category_name", payload.category_name);
    bodyFormData.append("category_image", payload.category_image);

    return axios(
      {
        method: "post",
        url: API_URL + "super-admin/add-category",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${TOKEN}`,
        },
      }
      //console.log("post method----", TOKEN)
    )
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          //   console.log("response---", response.data);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },
  // edit category
  editHotelCategoryDetails: async function (payload) {
    // console.log("edit payload", payload);
    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + `super-admin/edit-category`, bodyFormData, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //    console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // api for delete category
  deleteHotelCategory: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      // console.log("id--->", user_id);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + `super-admin/remove-category`, payload, {
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

  //get menu list
  menuListing: async function (tableParams, payload, category_id) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      //  console.log("token---nisha", TOKEN);
      // console.log("table Paerams page", tableParams.page + 1);
      // console.log("table Paerams limit", tableParams.limits);
      // console.log("table Paerams search", tableParams.search);
      // console.log("hotel id payload--", payload);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };

    return axios
      .post(API_URL + "super-admin/mealListing", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
          filter: category_id ? category_id : "",
        },
      })

      .then((response) => {
        //  console.log("inside then apiutils");
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  //view menu details

  showMenuDetails: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + `super-admin/view-meals`, payload, {
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

  deleteHotelMenu: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      // console.log("id--->", user_id);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + `super-admin/remove-meals`, payload, {
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

  //api call for category list for dropdown
  mealCategoryList: async function (payload, default_key) {
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
      .post(API_URL + "super-admin/mealCategoryList", payload, {
        headers: headers,
        params: {
          is_default: default_key,
        },
      })

      .then((response) => {
        // console.log("inside then apiutils");
        if (response && response.data) {
          //   console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  //api for add meal

  addHotelMeal: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });

    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }
    // payload.category_id.forEach((id) => {
    //   bodyFormData.append("category_id", id);
    // });

    // console.log("body form data", payload);
    return axios(
      {
        method: "post",
        url: API_URL + "super-admin/add-meals",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          // "Content-Type": "application/json",
          authorization: `Bearer ${TOKEN}`,
        },
      }
      // console.log("post method----", TOKEN)
    )
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          //  console.log("response---", response.data);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },

  // edit meal details
  editHotelMealDetails: async function (payload) {
    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + "super-admin/update-meals", bodyFormData, {
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
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // sub service listing
  sub_serviceListing: async function (tableParams, payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      // "Content-Type": "multipart/form-data",
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/subSerevicesList", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // add sub service
  createHotelService: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      // "Content-Type": "multipart/form-data",
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/add-services", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  //get sub service details
  getServiceDetails: async function (payload) {
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
      .post(API_URL + "super-admin/get-services", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  //edit sub service details

  editHotelServiceDetails: async function (payload) {
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
      .put(API_URL + "super-admin/update-services", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //    console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  //delete sub service details
  deleteHotelService: async function (payload) {
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
      .put(API_URL + "super-admin/remove-services", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // get note content
  getNoteContent: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      //console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",

      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/notesList", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  updateNoteContent: async function (payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/save-notes", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  //export csv api
  exportCustomerCsv: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    //console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/export-Csv", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  //export excel api
  exportCustomerExcel: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    //  console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/export-excel", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //   console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //    console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  exportStaffCsv: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    //  console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/hotelStaff-Csv", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  //export excel api
  exportStaffExcel: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    // console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/hotelStaff-excel", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  countriesList: async function () {
    // let TOKEN;
    // await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (result) {
    //   TOKEN = result;
    //   console.log("master admin----", TOKEN);
    // });
    let bodyFormData = new FormData();
    // bodyFormData.append("id", payload.id);
    // bodyFormData.append("old_password", payload.old_password);
    // bodyFormData.append("new_password", payload.new_password);
    // bodyFormData.append("confirm_password", payload.confirm_password);

    // console.log("body form data", payload);
    return axios(
      {
        method: "post",
        url: API_URL + "customer/user/countries",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          // authorization: `Bearer ${TOKEN}`,
        },
      }
      // console.log("put method----", TOKEN)
    )
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          // console.log("response");
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },
  statesList: async function (payload) {
    const headers = {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
    };
    return axios
      .post(API_URL + "customer/user/states", payload, {
        headers: headers,
      })
      .then((response) => {
        //console.log("nishares", response);
        if (response && response.data) {
          // console.log("response");
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },
  citiesList: async function (payload) {
    const headers = {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
    };
    return axios
      .post(API_URL + "customer/user/cities", payload, {
        headers: headers,
      })
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          //   console.log("response");
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },

  //amenities listing api
  amenityListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/amenitiesList", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })

      .then((response) => {
        // console.log("inside then apiutils");
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  createHotelAmenity: async function (payload) {
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
      .post(API_URL + "super-admin/add-amenities", payload, {
        headers: headers,
      })
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          //  console.log("response---", response.data);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },

  //edit amenity
  editHotelAmenityDetails: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + `super-admin/edit-amenities`, payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  //remove amenity
  deleteHotelAmenity: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + `super-admin/remove-amenities`, payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  subscriptionHistoryList: async function (tableParams, payload) {
    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/subscription-histories", bodyFormData, {
        headers: headers,

        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        if (response && response.data) {
          console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          console.log("error-apiutils", error.response);
        throw error.response;
      });
  },
  premiumListing: async function (tableParams, payload) {
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
      .post(
        API_URL + "super-admin/premium-service/premiumServicesList",
        payload,
        {
          headers: headers,
          params: {
            limits: tableParams.limits,
            page: tableParams.page + 1,
            search: tableParams.search ? tableParams.search : "",
            sortValue: tableParams.sortValue,
            sortField: tableParams.sortField,
          },
          // params: {
          //   limits: 2,
          //   page: 1,
          //   search: tableParams.search,
          // },
        }
      )

      .then((response) => {
        // console.log("inside then apiutils");
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // add premium service
  createHotelPremiumServices: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    var bodyFormData = new FormData();
    bodyFormData.append("hotel_id", payload.hotel_id);
    bodyFormData.append("important_notes", payload.important_notes);
    bodyFormData.append("name", payload.name);
    bodyFormData.append("description", payload.description);
    bodyFormData.append("premium_image", payload.premium_image);
    bodyFormData.append("openForAll", payload.openForAll);
    bodyFormData.append("openHours", payload.openHours);
    // for (var i = 0; i < payload.premium_image.length; i++) {
    //   bodyFormData.append("premium_image", payload.premium_image[i]);
    // }
    // for (let kv in payload) {
    //   if (!payload.premium_image) {
    //     bodyFormData.append(kv, payload[kv]);
    //   } else {
    //     for (var i = 0; i < payload.premium_image.length; i++) {
    //       bodyFormData.append("premium_image", payload.premium_image[i]);
    //     }
    //   }
    // }

    console.log("body form data", bodyFormData);
    return axios(
      {
        method: "post",
        url: API_URL + "super-admin/premium-service/add-premiumServices",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${TOKEN}`,
        },
      }
      //  console.log("post method----", TOKEN)
    )
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          //  console.log("response---", response.data);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },

  // api for uploading multiple ps images
  uploadPremiumImages: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    var bodyFormData = new FormData();
    bodyFormData.append("hotel_id", payload.hotel_id);
    bodyFormData.append("ps_id", payload.ps_id);
    for (var i = 0; i < payload.multi_premium_image.length; i++) {
      bodyFormData.append(
        "multi_premium_image",
        payload.multi_premium_image[i]
      );
    }

    console.log("body form data", bodyFormData);
    return axios(
      {
        method: "post",
        url: API_URL + "super-admin/premium-service/premiumServicesImages",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${TOKEN}`,
        },
      }
      //  console.log("post method----", TOKEN)
    )
      .then((response) => {
        // console.log("nishares", response);
        if (response && response.data) {
          //  console.log("response---", response.data);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) throw error;
      });
  },

  deleteHotelPremiumService: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      // console.log("id--->", user_id);
    });
    var bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    return axios(
      {
        method: "put",
        url: API_URL + "super-admin/premium-service/remove-premiumServices",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${TOKEN}`,
        },
      }
      //  console.log("post method----", TOKEN)
    )
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  //view premium service details

  showPremiumServiceDetails: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    var bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    return axios({
      method: "post",
      url: API_URL + "super-admin/premium-service/premiumServices",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${TOKEN}`,
      },
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

  // delete premium service images individually
  removePremiumImages: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      // console.log("id--->", user_id);
    });
    var bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    return axios({
      method: "put",
      url: API_URL + "super-admin/premium-service/remove-premiumServicesImages",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // edit premium service details
  editPremiumServiceDetails: async function (payload) {
    let bodyFormData = new FormData();

    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    // ------for appending multiple images-------
    // const arrayKeys = ["multi_premium_image"];
    // for (let kv in payload) {
    //   if (arrayKeys.indexOf(kv) > -1) {
    //     for (let ele of payload[kv]) {
    //       bodyFormData.append(kv, ele);
    //     }
    //   } else bodyFormData.append(kv, payload[kv]);
    // }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(
        API_URL + "super-admin/premium-service/update-premiumServices",
        bodyFormData,
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response && response.data) {
          // console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // package listing
  packageListing: async function (tableParams, payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });

    var bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    return axios({
      method: "post",
      url: API_URL + "super-admin/premium-service/packagesList",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${TOKEN}`,
      },
      params: {
        limits: tableParams.limits,
        page: tableParams.page + 1,

        sortValue: tableParams.sortValue,
        sortField: tableParams.sortField,
      },
    })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  //add packages
  createHotelPackage: async function (payload) {
    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(
        API_URL + "super-admin/premium-service/add-packages",
        bodyFormData,
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response && response.data) {
          console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          console.log("error-apiutils", error.response);
        throw error.response;
      });
  },

  // remove packages
  deletePackages: async function (payload) {
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
      .put(API_URL + "super-admin/premium-service/remove-packages", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // view packages details
  showPackageDetails: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + `super-admin/premium-service/get-packages`, payload, {
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

  // edit packages
  // edit meal details
  editHotelPackageDetails: async function (payload) {
    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(
        API_URL + "super-admin/premium-service/update-packages",
        bodyFormData,
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response && response.data) {
          // console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // slot listing
  slotListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/premium-service/slotList", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // add slot
  createHotelSlot: async function (payload) {
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
      .post(API_URL + "super-admin/premium-service/add-slot", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // get slot details
  showSlotDetails: async function (payload) {
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
      .post(API_URL + "super-admin/premium-service/get-slot", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // edit slot detaild
  editHotelSlotDetails: async function (payload) {
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
      .put(API_URL + "super-admin/premium-service/edit-slot", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // delete slot
  deleteHotelSlotDetails: async function (payload) {
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
      .put(API_URL + "super-admin/premium-service/remove-slot", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  requestListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/request-listing", payload, {
        headers: headers,
        params: {
          search: tableParams.search,
          limits: tableParams.limits,
          page: tableParams.page + 1,
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },

  bookingListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/bookingListing", payload, {
        headers: headers,
        params: {
          search: tableParams.search,
          limits: tableParams.limits,
          page: tableParams.page + 1,
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  orderListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/order-listing", payload, {
        headers: headers,
        params: {
          search: tableParams.search,
          limits: tableParams.limits,
          page: tableParams.page + 1,
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  orderComplainListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/orderComplain-listing", payload, {
        headers: headers,
        params: {
          search: tableParams.search,
          limits: tableParams.limits,
          page: tableParams.page + 1,
          sortValue: tableParams.sortValue,
          // sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        // console.log("then--->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  bookingComplainListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/bookingComplain-list", payload, {
        headers: headers,
        params: {
          search: tableParams.search,
          limits: tableParams.limits,
          page: tableParams.page + 1,
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        // console.log("then--->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  requestComplainListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/requestComplain-listing", payload, {
        headers: headers,
        params: {
          search: tableParams.search,
          limits: tableParams.limits,
          page: tableParams.page + 1,
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        // console.log("then--->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  showRequestDetails: async function (payload) {
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
      .post(API_URL + "super-admin/request-details", payload, {
        headers: headers,
      })
      .then((response) => {
        // console.log("then--->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  showOrderDetails: async function (payload) {
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
      .post(API_URL + "super-admin/order-details", payload, {
        headers: headers,
      })
      .then((response) => {
        // console.log("then--->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },

  showBookingDetails: async function (payload) {
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
      .post(API_URL + "super-admin/bookingDetails", payload, {
        headers: headers,
      })
      .then((response) => {
        // console.log("then--->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  // directory listing
  directoryListing: async function (payload) {
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
      .post(API_URL + "super-admin/content/directoryList", payload, {
        headers: headers,
      })
      .then((response) => {
        // console.log("then--->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  createHotelDirectory: async function (payload) {
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
      .post(API_URL + "super-admin/content/add-directory", payload, {
        headers: headers,
      })
      .then((response) => {
        // console.log("then--->", response);
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  editDirectoryData: async function (payload) {
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
      .put(API_URL + "super-admin/content/update-directory", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  deleteHotelDirectory: async function (payload) {
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
      .put(API_URL + "super-admin/content/directory-remove", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },

  getStaticStaffContent: async function (payload) {
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
      .post(API_URL + "super-admin/content/cmscontentListstaff", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  getStaticCustomerContent: async function (payload) {
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
      .post(API_URL + "super-admin/content/cmscontentListCustomer", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  updateStaffContent: async function (payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/content/cmsForstaff", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  updateCustomerContent: async function (payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/content/cmsForcustomer", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  getOwnerMsgContent: async function (payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/content/get-owner-message", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  updateOwnerMsgContent: async function (payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/content/save-owner-message", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  faqListing: async function (tableParams, payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/content/faqsList", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
        },
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  createHotelFaq: async function (payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/content/add-faq", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  editHotelFaqDetails: async function (payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + "super-admin/content/update-faq", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  deleteHotelFaq: async function (payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + "super-admin/content/faq-remove", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  // ----hotel review listing ---
  hotelReviewListing: async function (tableParams, payload) {
    // console.log("edit payload", payload);

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/reviews/hotel-review", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  getMasterAdminData: async function () {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .get(
        API_URL + "super-admin/content/masterAdminDetails",

        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response && response.data) {
          //(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // ---current user list for bill module---
  getCurrentUserListing: async function (tableParams, payload) {
    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/bills/current-stay-customer", bodyFormData, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
          room_no: tableParams.room_no == "all" ? "" : tableParams.room_no,
          payment_status: tableParams.payment_status,
          check_in_datetime: tableParams.check_in_date,
          check_out_datetime: tableParams.check_out_date,
        },
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  //--view bill--
  getViewBillDetails: async function (payload) {
    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/bills/bill-details", bodyFormData, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  generateBillDetails: async function (payload) {
    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/bills/request-by-customer", bodyFormData, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  submitGeneratedBill: async function (payload) {
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
    console.log("-----payload", payload);
    return axios
      .post(API_URL + "super-admin/bills/add-bill", payload, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },

  // sub admin listing
  subAdminListing: async function (tableParams, payload) {
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
      .post(API_URL + "super-admin/subAdmin/listing", payload, {
        headers: headers,
        params: {
          limits: tableParams.limits,
          page: tableParams.page + 1,
          search: tableParams.search ? tableParams.search : "",
          sortValue: tableParams.sortValue,
          sortField: tableParams.sortField,
        },
      })

      .then((response) => {
        // console.log("inside then apiutils");
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          // console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  deleteHotelSubAdmin: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      // console.log("id--->", user_id);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(
        API_URL + "super-admin/subAdmin/remove",
        payload,

        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  createHotelSubAdmin: async function (payload) {
    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(API_URL + "super-admin/subAdmin/add", bodyFormData, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },

  subAdminProfileDetails: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      // console.log("id--->", user_id);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(
        API_URL + "super-admin/subAdmin/view-profile",
        payload,

        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  editHotelSubAdminDetails: async function (payload) {
    delete payload.password;
    delete payload.password_confirmation;

    let bodyFormData = new FormData();
    for (let kv in payload) {
      bodyFormData.append(kv, payload[kv]);
    }

    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .put(API_URL + "super-admin/subAdmin/edit", bodyFormData, {
        headers: headers,
      })
      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  hotelModuleListing: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
      // console.log("token---nisha", TOKEN);
      // console.log("id--->", user_id);
    });
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${TOKEN}`,
    };
    return axios
      .post(
        API_URL + "super-admin/subAdmin/moduleList",
        payload,

        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response && response.data) {
          //  console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //  console.log("error-apiutils", error.response);
          throw error.response;
      });
  },

  // api for setting data in localstorage for sub admin
  setSubAdminInfo: async function (payload) {
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
      .post(API_URL + "super-admin/subAdmin/localStorege", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },

  // dashboard details
  showDashBoardDetails: async function (payload) {
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
      .post(API_URL + "super-admin/dashbordCount", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          throw error.response;
      });
  },
  exportRequestCSV: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    //console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/export-requestListing", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  exportOrderCSV: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    //console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/export-orderListing", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  exportBookingCSV: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    //console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/export-bookingListing", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  exportRequestComplainCSV: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    //console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/export-requestComplain", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  exportOrderComplainCSV: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    //console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/export-orderComplain", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  exportBookingComplainCSV: async function (payload) {
    let TOKEN;
    await LocalStorage.getItem("HamroSuperAdminAccessToken").then(function (
      result
    ) {
      TOKEN = result;
    });
    const headers = {
      authorization: `Bearer ${TOKEN}`,
    };
    //console.log("Token------>", TOKEN);
    return axios
      .post(API_URL + "super-admin/export-bookingComplain", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  showOpenForAllTimings: async function (payload) {
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
    //console.log("Token------>", TOKEN);
    return axios
      .post(
        API_URL + "super-admin/premium-service/psOpeningHoursList",
        payload,
        {
          headers: headers,
        }
      )

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  exportBillCSV: async function (payload) {
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
      .post(API_URL + "super-admin/bills/export-customer-stay", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  roomAvailable: async function (payload) {
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
      .post(API_URL + "super-admin/roomAvailable", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  roomList: async function (payload) {
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
      .post(API_URL + "super-admin/userRoomList", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  extraItemsBillListing: async function (payload) {
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
      .post(API_URL + "super-admin/bills/offline-order-list", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  addExtraItemsBill: async function (payload) {
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
      .post(API_URL + "super-admin/bills/offline-orders", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  deleteExtraItemsBill: async function (payload) {
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
      .post(API_URL + "super-admin/bills/delete-offline-order", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
  editExtraItemsBill: async function (payload) {
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
      .post(API_URL + "super-admin/bills/offline-order-update", payload, {
        headers: headers,
      })

      .then((response) => {
        if (response && response.data) {
          //console.log(response);
          return response;
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data)
          //   console.log("error-apiutils", error.response);
          throw error.response;
      });
  },
};
export default ApiUtils;
