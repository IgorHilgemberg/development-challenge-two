import React, { Fragment } from "react";
import RegistrationForm from "./RegistrationForm";
import UsersList from "./UsersList";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource:props.patientList,
      
      
    };
  }
  render(){
    console.log(this.state.dataSource);
  return (
    <div>
      <RegistrationForm isLoading={this.props.isLoading} addPatient={this.props.addPatient} updateList={this.props.updateList} patientList={this.state.dataSource}/>
      <UsersList isLoading={this.props.isLoading} addPatient={this.props.addPatient} updateList={this.props.updateList} patientList={this.state.dataSource}/>
      </div>
  );
  };
};

export default Users;