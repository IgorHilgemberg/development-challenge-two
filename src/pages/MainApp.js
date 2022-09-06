import React, { } from 'react';
import { Auth, API } from 'aws-amplify';
import awsConfig from '../amplify-config';
import '../css/App.css';
import { nanoid } from "nanoid";
import Users from '../components/Users';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout'
const apiName = 'CRUDPatients';
const apiPath = '/patient';

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: null,
      idToken: null,
      dataSource: {},
      isLoading: true

    };
    this.getData = this.getData.bind(this);
    this.createPatient = this.createPatient.bind(this);
    this.updateData = this.updateData.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.getPatientById = this.getPatientById.bind(this);
  }
  timer;

  async componentDidMount() {
    const response = await this.getData();
    const session = await Auth.currentSession();
    this.setState({ authToken: session.accessToken.jwtToken });
    this.setState({ idToken: session.idToken.jwtToken });
    this.setState({ dataSource: response });
    this.isLoading();
    console.log(response);
  }

  isLoading() {
    console.log(this.state.isLoading);
    this.setState({ isLoading: !this.state.isLoading })
  }

  /**
   * Determines if the API is enabled
   *
   * @return {Boolean} true if API is configured
   */
  hasApi() {
    const api = awsConfig.API.endpoints.filter(v => v.endpoint !== '');
    return (typeof api !== 'undefined');
  }

  /**
   * Calls the backend API to retrieve the Patients data
   */
  async getData() {
    const apiRequest = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return await API.get(apiName, apiPath, apiRequest);
  }

    /**
   * Calls the backend API to retrieve the Patients data
   */
     async getPatientById(id) {
      const apiPathToId = `/patient/${id}`
      const apiRequest = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return await API.get(apiName, apiPathToId, apiRequest);
    }
    

  async updateData(id) {
    console.log(id);
    if(id===""){
    let response = await this.getData();
    return this.setState({ dataSource: response });  
  
  }else{
      const response = await this.getPatientById(id);
      console.log(response);
      if(Object.keys(response).length===0){
        console.log("Nenhum paciente com essa id!");
        const response = await this.getData();
        this.setState({ dataSource: response }); 
      return;  
      };
      return this.setState({ dataSource: response });
      
    }
  }

  async createPatient(Patient) {
    const id = `patient-${nanoid()}`
    const apiRequest = {
      body: {
        "id": id,
        "name": Patient.name,
        "email": Patient.email,
        "birthday": Patient.birthday,
        "address": {
          "PatientCity": Patient.city,
          "PatientNeighborhood": Patient.neighborhood,
          "PatientStreet": Patient.street,
          "PatientHouseNumber": Patient.houseNumber,
          "PatientZipCode": Patient.zipCode
        }

      },
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // response= await API.get(apiName, apiPath, apiRequest);
    console.log('API Request:', apiRequest);
    //await API.post(apiName, apiPath, apiRequest); 
    //this.timer = setTimeout(() => this.updateData(), 10000);
    return await API.post(apiName, apiPath, apiRequest);

  }

  signOut = () => {
    try {
      Auth.signOut().then(this.props.history.replace('/'))
        .catch(err => console.log(err));

    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  hasApi = this.hasApi();
  render() {
    if (this.state.isLoading) {
      return (
        <div>Carregando...</div>
      )
    }
    return (

      <div >
        <div className="out ">


          <Button endIcon={<LogoutIcon />} variant="contained" onClick={() => {
            try {
              Auth.signOut().then(this.props.history.replace('/'))
                .catch(err => console.log(err));

            } catch (error) {
              console.log('error signing out: ', error);
            }
          }} >Sair</Button>


        </div>



        <div id="main">
          <Users isLoading={this.isLoading} addPatient={this.createPatient} patientList={this.state.dataSource} updateList={this.updateData}></Users>
        </div>
      </div>
    );
  }
}

export default MainApp;