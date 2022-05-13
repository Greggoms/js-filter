import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios("https://jsonplaceholder.typicode.com/todos")
      .then(function (response) {
        const payload = response.data;
        setData(payload);
        setFilteredData(payload);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log("useEffect: ", data);
    // eslint-disable-next-line
  }, []);

  // <button> filter Function
  // https://codesandbox.io/s/r5x4i?file=/src/App.js:555-768
  function filterData(e) {
    if (e.target.value === "reset") {
      setFilteredData(data);
    } else if (e.target.value === "hide-completed") {
      const filterOutCompleted = data.filter(
        ({ completed }) => completed === false
      );
      setFilteredData(filterOutCompleted);
    } else if (e.target.value === "completed-only") {
      const filterOutIncomplete = data.filter(
        ({ completed }) => completed === true
      );
      setFilteredData(filterOutIncomplete);
    }
  }

  // <select> filter function
  const handleSelectChange = (e) => {
    if (e.target.value === "") {
      setFilteredData(data);
    } else {
      const result = data.filter((todo) => {
        // the == throws an eqeqeq warning, but is needed to
        // compare all the repeated userIds from data to the array of
        // strings returned from removeDuplicateIds
        // eslint-disable-next-line
        return todo.userId == e.target.value;
      });
      setFilteredData(result);
    }
  };

  // This function removes the duplicate IDs that
  // are mapped to the <option> mapping
  function removeDups() {
    let unique = {};
    data.forEach((todo) => {
      if (!unique[todo.userId]) {
        unique[todo.userId] = true;
      }
    });
    // console.log(unique);
    return Object.keys(unique);
  }
  const removeDuplicateIds = removeDups(data);

  // Filter button info to be mapped later
  const buttons = [
    {
      name: "Reset",
      value: "reset",
    },
    {
      name: "Hide Completed",
      value: "hide-completed",
    },
    {
      name: "Completed Only",
      value: "completed-only",
    },
  ];

  return (
    <div className="App">
      <h1>Filter</h1>
      <p>Visible posts: {filteredData.length} out of 200</p>
      {buttons.map((filter, index) => (
        <>
          <button key={index} value={filter.value} onClick={filterData}>
            {filter.name}
          </button>
        </>
      ))}
      <label htmlFor="users">Users</label>
      <select onChange={handleSelectChange}>
        <option key="blah" value="">
          Filter By User
        </option>
        {removeDuplicateIds.map((userId) => (
          <option key={userId} value={userId}>
            {userId}
          </option>
        ))}
      </select>

      <ul>
        {filteredData ? (
          filteredData.map(({ userId, id, title, completed }) => (
            <li key={id}>
              <h2>{userId}</h2>
              <p>{title}</p>
              <p>{completed ? "Completed" : "NOT Completed"}</p>
            </li>
          ))
        ) : (
          <h2>Loading...</h2>
        )}
      </ul>
    </div>
  );
};

export default App;
