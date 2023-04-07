import React, { useState, useEffect } from "react";
import "./Form.css";
import axios from "axios";
import * as Yup from "yup";

const emptyForm = { fullName: "", email: "", password: "", languages: [] };

const formSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("İsim alanı zorunludur")
    .min(3, "İsim en az 3 karakter olmalı"),
  email: Yup.string()
    .email("eposta alanında bir hata olabilir mi?")
    .required("eposta zorunlu"),
  password: Yup.string()
    .min(6, "şifre en az 6 hane olmalı")
    .required("şifre zorunlu"),
  languages: Yup.array()
    .min(1, "en az 1 dil seçin")
    .max(2, "en çok 2 dil seçin"),
});

function Form(props) {
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setisEditing] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    languages: "",
  });

  useEffect(() => {
    console.log("Ak Gandalf oldum");
    props.editMode ? setFormData(props.editMode) : setFormData(emptyForm);
    props.editMode ? setisEditing(true) : setisEditing(false);
  }, [props.editMode]);

  useEffect(() => {
    formSchema.isValid(formData).then((valid) => setIsButtonDisabled(!valid));
  }, [formData]);

  const handleReset = () => {
    setFormData(emptyForm);
    setErrors({
      fullName: "",
      email: "",
      password: "",
      languages: "",
    });
  };

  const checkFormErrors = (name, value) => {
    Yup.reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({
          ...errors,
          [name]: "",
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [name]: err.errors[0],
        });
      });
  };

  const handleChange = (event) => {
    const { value, type, name } = event.target;
    console.log(value);

    if (type === "checkbox") {
      let newLanguages;
      if (formData.languages.includes(value)) {
        // zaten işaretli, arrayden çıkar
        newLanguages = formData.languages.filter((lang) => lang !== value);
      } else {
        //  işaretli değil, arraye ekle
        newLanguages = [...formData.languages, value];
      }
      checkFormErrors(name, newLanguages); // YUP
      setFormData({
        ...formData,
        [name]: newLanguages,
      });
    } else {
      checkFormErrors(name, value); // YUP
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.addMember(formData);
    setisEditing(false);
    setFormData(emptyForm);

    const postData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      languages: formData.languages,
    };

    axios
      .post("https://reqres.in/api/users", postData)
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  console.log("languages:", languages);

  return (
    <div className="form">
      {isEditing ? <h2>Üye Düzenle</h2> : <h2>Yeni Üye Ekle</h2>}
      <form onSubmit={handleSubmit} className="form-line">
        <label htmlFor="fullName">
          Fullname:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={(event) => handleChange(event)}
          />
          {errors.fullName !== "" && (
            <div className="field-error">{errors.fullName}</div>
          )}
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={(event) => handleChange(event)}
          />
          {errors.email !== "" && (
            <div className="field-error">{errors.email}</div>
          )}
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={(event) => handleChange(event)}
          />
          {errors.password !== "" && (
            <div className="field-error">{errors.password}</div>
          )}
        </label>
        <div className="checkBox">
          <h4>Languages:</h4>
          <label htmlFor="languages">
            <input
              type="checkbox"
              name="languages"
              value="tamil"
              onChange={handleChange}
              checked={formData.languages.includes("tamil")}
            />
            Tamil
          </label>
          <label htmlFor="languages">
            <input
              type="checkbox"
              name="languages"
              value="tagalog"
              onChange={handleChange}
              checked={formData.languages.includes("tagalog")}
            />
            Tagalog
          </label>
          <label htmlFor="languages">
            <input
              type="checkbox"
              name="languages"
              value="wolof"
              onChange={handleChange}
              checked={formData.languages.includes("wolof")}
            />
            Wolof
          </label>
          {errors.languages !== "" && (
            <div className="field-error">{errors.languages}</div>
          )}
        </div>
        <button type="reset" onClick={handleReset}>
          Clear form
        </button>
        <button className="submit" type="submit" disabled={isButtonDisabled}>
          {isEditing ? "Edit Member" : "Add New Member"}
        </button>
      </form>
    </div>
  );
}

export default Form;
