import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Api from "../../Api/ApiUtils.js";
import LocalStorage from "../../Api/LocalStorage.js";

// ******************************
const useForm = ({ initState, callback, validator }) => {
  //const [loader, setLoader] = useState(false);
  const [state, setState] = useState(initState);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  const [br, setBR] = useState(true);

  const history = useHistory();

  // ******************************
  useEffect(() => {
    const isValidErrors = () =>
      Object.values(errors).filter((error) => typeof error !== "undefined")
        .length > 0;
    if (isSubmited && !isValidErrors()) callback();
  }, [errors, message]);

  // ******************************
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(() => ({
      ...state,
      [name]: value,
    }));
  };

  const handleCloseMsg = () => {
    setBR(false);
  };

  // ******************************
  const handleBlur = (e) => {
    const { name: fieldName } = e.target;
    const faildFiels = validator(state, fieldName);
    setErrors(() => ({
      ...errors,
      [fieldName]: Object.values(faildFiels)[0],
    }));
  };

  // ******************************
  const handleSubmit = (e) => {
    setState(() => ({
      ...state,
      loader: true,
    }));
    //setLoader(true);
    e.preventDefault();
    //console.log("nisha", errors);
    const { name: fieldName } = e.target;
    const faildFiels = validator(state, fieldName);
    setErrors(() => ({
      ...errors,
      [fieldName]: Object.values(faildFiels)[0],
    }));
    setIsSubmited(true);
    const payload = {
      email: state.email,
      password: state.password,
      role_id: [2, 5],
    };
    console.log(payload, "payload");
    Api.login(payload)
      .then((res) => {
        // console.log(" in then for login");
        console.log("rew", res);
        if (res.status === 1) {
          // setLoader(false);
          // console.log("res login page", res);
          console.log("---->", res.data[0].role_id);
          if (res.data[0].role_id === 2) {
            LocalStorage.setItem(
              "HamroSuperAdminInfo",
              JSON.stringify(res.data)
            ).then((fulfilled) => {
              // console.log("Inside local storage userdata");
              LocalStorage.setItem(
                "HamroSuperAdminAccessToken",
                JSON.stringify(res.data[0].access_token)
              ).then((success) => {
                // console.log("Inside local storage token");
                history.push("/superadmin");
                setState(() => ({
                  ...state,
                  loader: false,
                }));
              });
            });
          } else if (res.data[0].role_id === 5) {
            LocalStorage.setItem(
              "HamroSuperAdminInfo",
              JSON.stringify(res.data)
            ).then((fulfilled) => {
              // console.log("Inside local storage userdata");
              LocalStorage.setItem(
                "HamroSuperAdminAccessToken",
                JSON.stringify(res.data[0].access_token)
              ).then((success) => {
                // console.log("Inside local storage token");
                history.push("/superadmin");
                console.log("-----sub admin");
                setState(() => ({
                  ...state,
                  loader: false,
                }));
              });
            });
          }
        }

        //  else if (res.data.errors.email) {
        //   //console.log('res.data.errors.email',res.data.errors.email[0])
        //   setMessage(res.data.errors.email[0]);
        //   setBR(true);
        //   setState(() => ({
        //     ...state,
        //     loader: false,
        //   }));
        // }
        else {
          // console.log("in else");
          // console.log(res.msg);
          setMessage(res.msg);
          setBR(true);
          setState(() => ({
            ...state,
            loader: false,
          }));
        }
      })
      .catch((err) => {
        if (err && err.msg) {
          // console.log("in catch");
          // console.log(err.msg);
          setMessage(err.msg);
          setBR(true);
        }
        setState(() => ({
          ...state,
          loader: false,
        }));
      });
  };

  return {
    handleChange,
    handleSubmit,
    handleBlur,
    state,
    errors,
    message,
    br,
    setBR,
    handleCloseMsg,
  };
};

export default useForm;
