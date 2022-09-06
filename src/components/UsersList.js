import React, { } from "react";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import styles from "../css/UsersList.module.scss";
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import { API } from 'aws-amplify';

const apiName = 'CRUDPatients';
const apiPath = '/patient';

const date = new Date();
const current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: '#282c34',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const initialFormState = {
  id: "",
  name: "",
  email: "",
  birthday: "",
  city: "",
  neighborhood: "",
  street: "",
  houseNumber: "",
  zipCode: "",
}

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // page: 0,
      // rowsPerPage: 5,
      dataSource: props.patientList,
      open: false,
      addFormData: initialFormState,
      search: "",
    };
    
    this.deletePatient = this.deletePatient.bind(this);
    this.editPatient = this.editPatient.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    // this.handleChangePage = this.handleChangePage.bind(this);
    // this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  //   emptyRows =
  //    (this.state.page) > 0 ? Math.max(0, (1 + (this.state.page)) * (this.state.rowsPerPage) - (this.props.patientList.length)) : 0;

  //  handleChangePage = async (event, newPage) => {
  //   this.setState({page:newPage});
  // };

  //  handleChangeRowsPerPage =  (event) => {
  //   this.setState({rowsPerPage:parseInt(event.target.value, 10)});
  //   this.setState({page : 0});
  // };


  handleOpen(Patient) {
    console.log(Patient);
    this.setState({
      addFormData: {
        id: Patient.id,
        name: Patient.PatientName ?? "",
        email: Patient.PatientEmail ?? "",
        birthday: Patient.PatientBD ?? "",
        city: Patient.PatientAddress.PatientCity ?? "",
        neighborhood: Patient.PatientAddress.PatientNeighborhood ?? "",
        street: Patient.PatientAddress.PatientStreet ?? "",
        houseNumber: Patient.PatientAddress.PatientHouseNumber ?? "",
        zipCode: Patient.PatientAddress.PatientZipCode ?? "",
      },
    });
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  async deletePatient(id) {
    this.props.isLoading();
    const apiPathDel = `/patient/${id}`;
    const apiRequest = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    console.log(apiPathDel);
    await API.del(apiName, apiPathDel, apiRequest);
    await this.props.updateList().then(() => this.props.isLoading());
    return;
  }

  submitForm = async (e) => {
    e.preventDefault();
    console.log(this.state.addFormData);
    this.props.isLoading();
    await this.editPatient({
      id: this.state.addFormData.id,
      name: this.state.addFormData.name,
      email: this.state.addFormData.email,
      birthday: this.state.addFormData.birthday,
      city: this.state.addFormData.city,
      neighborhood: this.state.addFormData.neighborhood,
      street: this.state.addFormData.street,
      houseNumber: this.state.addFormData.houseNumber,
      zipCode: this.state.addFormData.zipCode,
    });
    // setAddFormData(initialFormState);
    await this.props.updateList().then(() => this.props.isLoading());
  }

  submitSearchForm = async (e) => {
    e.preventDefault();
    console.log(this.state.search)
    this.props.isLoading();

    await this.props.updateList(this.state.search).then(() => this.props.isLoading());
  }



  async editPatient(Patient) {
    const apiRequest = {
      body: {
        "id": Patient.id,
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
    console.log('API Request:', apiRequest);
    return await API.post(apiName, apiPath, apiRequest);

  }

  render() {
    console.log({current_date});
    console.log(this.props.patientList);
    
    if(Object.keys(this.props.patientList).length===1){
      return (



        <><div className={styles.userList}>
          <h1>Lista de pacientes</h1>
        </div><div>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <form onSubmit={this.submitSearchForm}> <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                  <TextField id="input-with-sx" placeholder="Pesquise aqui" variant="standard" onChange={e => this.setState({ search: e.target.value })} />
                </form></Box>
            </Box>
            {/* <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}> */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 800 }} size="small" aria-label="custom pagination table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Nome</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Data de nascimento</TableCell>
                    <TableCell align="center">Cidade</TableCell>
                    <TableCell align="center">Bairro</TableCell>
                    <TableCell align="center">Rua</TableCell>
                    <TableCell align="center">Número</TableCell>
                    <TableCell align="center">Código postal</TableCell>
  
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(this.props.patientList).map((datasource) => (
                    <TableRow
                      key={datasource.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {datasource.PatientName}
                      </TableCell>
                      <TableCell align="center">{datasource.PatientEmail}</TableCell>
                      <TableCell align="center">{datasource.PatientBD}</TableCell>
                      <TableCell align="center">{datasource.PatientAddress.PatientCity}</TableCell>
                      <TableCell align="center">{datasource.PatientAddress.PatientNeighborhood ?? ""}</TableCell>
                      <TableCell align="center">{datasource.PatientAddress.PatientStreet}</TableCell>
  
                      <TableCell align="center">{datasource.PatientAddress.PatientHouseNumber}</TableCell>
                      <TableCell align="center">{datasource.PatientAddress.PatientZipCode}</TableCell>
                      <TableCell align="center"><IconButton onClick={() => this.handleOpen(datasource)}><EditIcon></EditIcon></IconButton>
                        <Modal
                          open={this.state.open}
                          onClose={this.handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <h1>Alterar dados de paciente</h1>
                            <form onSubmit={this.submitForm} className={styles.formStyle} /*onSubmit={submitHandler}*/>
                              <h3>Paciente</h3>
                              <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="name">
                                  Nome
                                </label>
                                <input
                                  type="text"
                                  placeholder="Nome completo"
                                  className={styles.formControl}
                                  name="name"
                                  value={this.state.addFormData.name}
                                  onChange={e => this.setState({ addFormData: { ...this.state.addFormData, name: e.target.value } })}
                                  required
                                ></input>
                              </div>
                              <div className={styles.formGroup}>
                                <label htmlFor="date">Nascimento</label>
                                <input
                                  type="date"
                                  min="1900-01-01"
                                  max = {current_date}
                                  className={styles.formControl}
                                  name="birthday"
                                  value={this.state.addFormData.birthday}
                                  onChange={e => this.setState({ addFormData: { ...this.state.addFormData, birthday: e.target.value } })}
                                  required
                                />
                              </div>
                              <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                  type="email"
                                  placeholder="Melhor email"
                                  className={styles.formControl}
                                  name="email"
                                  value={this.state.addFormData.email}
                                  onChange={e => this.setState({ addFormData: { ...this.state.addFormData, email: e.target.value } })}
                                  required
                                />
                              </div>
                              <h3>Endereço</h3>
                              <div className={styles.formGroup}>
                                <label htmlFor="city">Cidade</label>
                                <input
                                  type="text"
                                  placeholder="Nome da cidade"
                                  className={styles.formControl}
                                  name="city"
                                  value={this.state.addFormData.city}
                                  onChange={e => this.setState({ addFormData: { ...this.state.addFormData, city: e.target.value } })}
                                  required
                                />
                              </div>
                              <div className={styles.formGroup}>
                                <label htmlFor="district">Bairro</label>
                                <input
                                  type="text"
                                  placeholder="Nome do bairro"
                                  className={styles.formControl}
                                  name="neighborhood"
                                  value={this.state.addFormData.neighborhood}
                                  onChange={e => this.setState({ addFormData: { ...this.state.addFormData, neighborhood: e.target.value } })} required
                                />
                              </div>
                              <div className={styles.formGroup}>
                                <label htmlFor="street">Rua</label>
                                <input
                                  type="text"
                                  placeholder="Nome da rua"
                                  className={styles.formControl}
                                  name="street"
                                  value={this.state.addFormData.street}
                                  onChange={e => this.setState({ addFormData: { ...this.state.addFormData, street: e.target.value } })} required
                                />
                              </div>
                              <div className={styles.formGroup}>
                                <label htmlFor="houseNumber">Casa</label>
                                <input
                                  type="number"
                                  placeholder="Número da rua"
                                  className={styles.formControl}
                                  name="houseNumber"
                                  value={this.state.addFormData.houseNumber}
                                  onChange={e => this.setState({ addFormData: { ...this.state.addFormData, houseNumber: e.target.value } })} required
                                />
                              </div>
                              <div className={styles.formGroup}>
                                <label htmlFor="zipCode">Código</label>
                                <input
                                  type="number"
                                  placeholder="Código postal"
                                  className={styles.formControl}
                                  name="zipCode"
                                  value={this.state.addFormData.zipCode}
                                  onChange={e => this.setState({ addFormData: { ...this.state.addFormData, zipCode: e.target.value } })} required
                                />
                              </div>
                              <div>
                                <Button variant="contained" type="submit">Salvar</Button>
                                <Button variant="contained" onClick={this.handleClose}>Cancelar</Button>
                              </div>
                            </form>
                          </Box>
                        </Modal></TableCell>
                      <TableCell align="center"><IconButton onClick={() => this.deletePatient(datasource.id)}><DeleteIcon></DeleteIcon></IconButton></TableCell>
                    </TableRow>
                  ))}
                  
                </TableBody>
                {/* <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={this.props.patientList.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter> */}
              </Table>
            </TableContainer>
            {/* </Paper>
          </Box> */}
          </div></>
      );
    }else{
    return (



      <><div className={styles.userList}>
        <h1>Lista de pacientes</h1>
      </div><div>
          <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <form onSubmit={this.submitSearchForm}> <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField id="input-with-sx" placeholder="Pesquise aqui" variant="standard" onChange={e => this.setState({ search: e.target.value })} />
              </form></Box>
          </Box>
          {/* <Box sx={{ width: '100%' }}>
    <Paper sx={{ width: '100%', mb: 2 }}> */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 800 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nome</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Data de nascimento</TableCell>
                  <TableCell align="center">Cidade</TableCell>
                  <TableCell align="center">Bairro</TableCell>
                  <TableCell align="center">Rua</TableCell>
                  <TableCell align="center">Número</TableCell>
                  <TableCell align="center">Código postal</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {(this.props.patientList.Items).map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.PatientName}
                    </TableCell>
                    <TableCell align="center">{item.PatientEmail}</TableCell>
                    <TableCell align="center">{item.PatientBD}</TableCell>
                    <TableCell align="center">{item.PatientAddress.PatientCity}</TableCell>
                    <TableCell align="center">{item.PatientAddress.PatientNeighborhood ?? ""}</TableCell>
                    <TableCell align="center">{item.PatientAddress.PatientStreet}</TableCell>

                    <TableCell align="center">{item.PatientAddress.PatientHouseNumber}</TableCell>
                    <TableCell align="center">{item.PatientAddress.PatientZipCode}</TableCell>
                    <TableCell align="center"><IconButton onClick={() => this.handleOpen(item)}><EditIcon></EditIcon></IconButton>
                      <Modal
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <h1>Alterar dados de paciente</h1>
                          <form onSubmit={this.submitForm} className={styles.formStyle} /*onSubmit={submitHandler}*/>
                            <h3>Paciente</h3>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel} htmlFor="name">
                                Nome
                              </label>
                              <input
                                type="text"
                                placeholder="Nome completo"
                                className={styles.formControl}
                                name="name"
                                value={this.state.addFormData.name}
                                onChange={e => this.setState({ addFormData: { ...this.state.addFormData, name: e.target.value } })}
                                required
                              ></input>
                            </div>
                            <div className={styles.formGroup}>
                              <label htmlFor="date">Nascimento</label>
                              <input
                                type="date"
                                min="1900-01-01"
                                max = {current_date}
                                className={styles.formControl}
                                name="birthday"
                                value={this.state.addFormData.birthday}
                                onChange={e => this.setState({ addFormData: { ...this.state.addFormData, birthday: e.target.value } })}
                                required
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label htmlFor="email">Email</label>
                              <input
                                type="email"
                                placeholder="Melhor email"
                                className={styles.formControl}
                                name="email"
                                value={this.state.addFormData.email}
                                onChange={e => this.setState({ addFormData: { ...this.state.addFormData, email: e.target.value } })}
                                required
                              />
                            </div>
                            <h3>Endereço</h3>
                            <div className={styles.formGroup}>
                              <label htmlFor="city">Cidade</label>
                              <input
                                type="text"
                                placeholder="Nome da cidade"
                                className={styles.formControl}
                                name="city"
                                value={this.state.addFormData.city}
                                onChange={e => this.setState({ addFormData: { ...this.state.addFormData, city: e.target.value } })}
                                required
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label htmlFor="district">Bairro</label>
                              <input
                                type="text"
                                placeholder="Nome do bairro"
                                className={styles.formControl}
                                name="neighborhood"
                                value={this.state.addFormData.neighborhood}
                                onChange={e => this.setState({ addFormData: { ...this.state.addFormData, neighborhood: e.target.value } })} required
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label htmlFor="street">Rua</label>
                              <input
                                type="text"
                                placeholder="Nome da rua"
                                className={styles.formControl}
                                name="street"
                                value={this.state.addFormData.street}
                                onChange={e => this.setState({ addFormData: { ...this.state.addFormData, street: e.target.value } })} required
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label htmlFor="houseNumber">Casa</label>
                              <input
                                type="number"
                                placeholder="Número da rua"
                                className={styles.formControl}
                                name="houseNumber"
                                value={this.state.addFormData.houseNumber}
                                onChange={e => this.setState({ addFormData: { ...this.state.addFormData, houseNumber: e.target.value } })} required
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label htmlFor="zipCode">Código</label>
                              <input
                                type="number"
                                placeholder="Código postal"
                                className={styles.formControl}
                                name="zipCode"
                                value={this.state.addFormData.zipCode}
                                onChange={e => this.setState({ addFormData: { ...this.state.addFormData, zipCode: e.target.value } })} required
                              />
                            </div>
                            <div>
                              <Button variant="contained" type="submit">Salvar</Button>
                              <Button variant="contained" onClick={this.handleClose}>Cancelar</Button>
                            </div>
                          </form>
                        </Box>
                      </Modal></TableCell>
                    <TableCell align="center"><IconButton onClick={() => this.deletePatient(item.id)}><DeleteIcon></DeleteIcon></IconButton></TableCell>
                  </TableRow>
                ))}
                {/* {this.emptyRows > 0 && (
            <TableRow style={{ height: 53 * this.emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )} */}
                </TableBody>
                {/* <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={this.props.patientList.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter> */}
            </Table>
          </TableContainer>
          {/* </Paper>
        </Box> */}
        </div></>
    );
      }
  };
};

export default UsersList;


