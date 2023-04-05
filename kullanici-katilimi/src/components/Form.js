import React, { useState, useEffect } from "react";
import "./Form.css";
import axios from "axios";

const emptyForm = { fullName: "", email: "", password: "", languages: [] };

function Form(props) {
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setisEditing] = useState(false);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    console.log("Ak Gandalf oldum");
    props.editMode ? setFormData(props.editMode) : setFormData(emptyForm);
    props.editMode ? setisEditing(true) : setisEditing(false);
  }, [props.editMode]);

  const handleChange = (event) => {
    console.log(event.target.value);
    const newFormData = {
      ...formData,
      [event.target.name]: event.target.value,
    };
    setFormData(newFormData);

    // let newLanguages;
    // if (languages.includes(event.target.value)) {
    //   // zaten işaretli, arrayden çıkar
    //   newLanguages = languages.filter(
    //     (language) => language !== event.target.value
    //   );
    // } else {
    //   //  işaretli değil, arraye ekle
    //   newLanguages = [...languages, event.target.value];
    // }
    // setLanguages(newLanguages);
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

  const handleCheck = (event) => {
    const { value } = event.target;
    let newLanguages;
    if (languages.includes(value)) {
      // zaten işaretli, arrayden çıkar
      newLanguages = languages.filter((language) => language !== value);
    } else {
      //  işaretli değil, arraye ekle
      newLanguages = [...languages, value];
    }
    setLanguages(newLanguages);
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
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={(event) => handleChange(event)}
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={(event) => handleChange(event)}
          />
        </label>
        <div className="checkBox">
          <h4>Languages:</h4>
          <label htmlFor="languages">
            <input
              type="checkbox"
              name="languages"
              value="tamil"
              onChange={handleCheck}
              checked={languages.includes("tamil")}
            />
            Tamil
          </label>
          <label htmlFor="languages">
            <input
              type="checkbox"
              name="languages"
              value="tagalog"
              onChange={handleCheck}
              checked={languages.includes("tagalog")}
            />
            Tagalog
          </label>
          <label htmlFor="languages">
            <input
              type="checkbox"
              name="languages"
              value="wolof"
              onChange={handleCheck}
              checked={languages.includes("wolof")}
            />
            Wolof
          </label>
        </div>
        <button className="submit" type="submit">
          {isEditing ? "Edit Member" : "Add New Member"}
        </button>
      </form>
    </div>
  );
}

export default Form;
