import "./App.css";
import React, { useState } from "react";
import Form from "./components/Form";

function App() {
  const [editingMember, setEditingMember] = useState();
  const [editingOrder, setEditingOrder] = useState();
  const [members, setMembers] = useState([
    {
      fullName: "Grotesque",
      email: "grotesque@test.com",
      password: "1111",
      languages: ["wolof", "tamil"],
    },
    {
      fullName: "Burlesque",
      email: "burlesque@test.com",
      password: "2222",
      languages: ["wolof", "tamil"],
    },
    {
      fullName: "Baroque",
      email: "baroque@test.com",
      password: "3333",
      languages: ["wolof", "tamil"],
    },
  ]);

  function addMember(newMember) {
    console.log("editingOrder", editingOrder);
    if (editingOrder !== undefined) {
      const updatedMembers = [...members];
      updatedMembers.splice(editingOrder, 1, newMember);
      setMembers(updatedMembers);
    } else {
      setMembers([...members, newMember]);
    }
    setEditingOrder();
  }

  function editHelper(memberData, order) {
    setEditingMember(memberData);
    setEditingOrder(order);
  }

  return (
    <div className="App App-header">
      <ul>
        {members.map((member, i) => {
          return (
            <li key={i}>
              <a
                className="App-link"
                href={
                  `mailto:${member.email}` /*Tıklayınca email göndermek için*/
                }
              >
                {member.fullName} - {member.password} -{" "}
                {member.languages.join(", ")}
              </a>
              <button onClick={() => editHelper(member, i)}>Edit</button>
            </li>
          );
        })}
      </ul>
      <Form addMember={addMember} editMode={editingMember} />
    </div>
  );
}

export default App;
