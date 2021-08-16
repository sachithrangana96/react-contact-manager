import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { uuid } from "uuidv4";
import api from '../api/contacts'
import "./App.css";
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import EditContact from "./EditContact";

function App() {
  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults,setSearchResults] = useState("");

  // Retrive Contacts
  const retriveContacts = async () => {
    const response =await api.get("/contacts");
    return response.data;
  };

  const addContactHandler = async (contact) => {
    // console.log(contact);
    // setContacts([...contacts, { id: uuid(), ...contact }]);
    const request = {
      id:uuid(),
      ...contact,
    }
    const response = await api.post("/contacts",request);
    console.log(response);
    setContacts([...contacts, response.data]);
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };


  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if(searchTerm !==""){
      const newContactList = contacts.filter((contact)=> {
        return Object.values(contact)
              .join(" ")
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
      });
      setSearchResults(newContactList);
    }else{
      setSearchResults(contacts);
    }
  }


  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`,contact);
    const { id, name, email } = response.data;
    setContacts(
      contacts.map((contact) => {
        return contact.id === id ? {...response.data } : contact;
      })
    )
    console.log(response.data)
  }


  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if (retriveContacts) setContacts(retriveContacts);

    const getAllContacts = async () => {
      const allContacts = await retriveContacts();
      if(allContacts) setContacts(allContacts);
    }

    getAllContacts();
    // console.log(contacts)
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  return (
    <div className="ui container">
      <Router>
        <Header />
          <Switch>
            <Route path="/" exact render={(props) => (
                <ContactList {...props} contacts={searchTerm.length < 1? contacts : searchResults} getContactId={removeContactHandler} term={searchTerm}  searchKeyword={searchHandler} />
                )} 
              />

              <Route 
                path="/add"
                render={(props) => (
                    <AddContact {...props} addContactHandler={addContactHandler} />
                )} 
              />

              <Route 
                path="/edit"
                render={(props) => (
                    <EditContact {...props} updateContactHandler={updateContactHandler} />
                )} 
              />

              {/* <AddContact addContactHandler={addContactHandler} />
              <ContactList contacts={contacts} getContactId={removeContactHandler} /> */}
          </Switch>  
      </Router>
    </div>
  );
}

export default App;
