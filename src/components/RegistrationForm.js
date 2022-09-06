import React, { useState } from "react";
import { API } from 'aws-amplify';
import styles from "../css/RegistrationForm.module.scss";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';


const apiName = 'CRUDPatients';
const apiPath="/patient"

const date = new Date();
const current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();


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
    name: "",
    email: "",
    birthday: "",
    city: "",
    neighborhood: "",
    street: "",
    houseNumber: "",
    zipCode: "",
}

function RegistrationForm(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    //   const usersCtx = useContext(UsersContext);

    const [addFormData, setAddFormData] = useState(
        initialFormState
    );

    async function getData() {
        const apiRequest = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        return await API.get(apiName, apiPath, apiRequest);
      }

    const submitForm =async (e) => {
        e.preventDefault();
        props.isLoading();
        await props.addPatient({
            name: addFormData.name,
            email: addFormData.email,
            birthday: addFormData.birthday,
            city: addFormData.city,
            neighborhood: addFormData.neighborhood,
            street: addFormData.street,
            houseNumber: addFormData.houseNumber,
            zipCode: addFormData.zipCode,
        });
        await props.updateList().then(()=>props.isLoading());
    }

    return (

        <div className={styles.alignCenter}>
            <div>
                <Fab onClick={handleOpen} color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <h1>Formulário de registro</h1>
                        <form className={styles.formStyle} onSubmit={submitForm}>
                            <h4>Paciente</h4>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="name">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    className={styles.formControl}
                                    name="name"
                                    onChange={e => setAddFormData({ ...addFormData, 'name': e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="date">Nascimento</label>
                                <input
                                    type="date"
                                    min="1900-01-01"
                                max = {Date("yyyy-MM-dd")}
                                    className={styles.formControl}
                                    name="birthday"
                                    onChange={e => setAddFormData({ ...addFormData, 'birthday': e.target.value })}
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
                                    onChange={e => setAddFormData({ ...addFormData, 'email': e.target.value })}
                                    required
                                />
                            </div>
                            <h4>Endereço</h4>
                            <div className={styles.formGroup}>
                                <label htmlFor="city">Cidade</label>
                                <input
                                    type="text"
                                    placeholder="Nome da cidade"
                                    className={styles.formControl}
                                    name="city"
                                    onChange={e => setAddFormData({ ...addFormData, 'city': e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="neighborhood">Bairro</label>
                                <input
                                    type="text"
                                    placeholder="Nome do bairro"
                                    className={styles.formControl}
                                    name="neighborhood"
                                    onChange={e => setAddFormData({ ...addFormData, 'neighborhood': e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="street">Rua</label>
                                <input
                                    type="text"
                                    placeholder="Nome da rua"
                                    className={styles.formControl}
                                    name="street"
                                    onChange={e => setAddFormData({ ...addFormData, 'street': e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="houseNumber">Casa</label>
                                <input
                                    type="number"
                                    placeholder="Número da casa"
                                    className={styles.formControl}
                                    name="houseNumber"
                                    onChange={e => setAddFormData({ ...addFormData, 'houseNumber': e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="zipCode">Código</label>
                                <input
                                    type="number"
                                    placeholder="Código postal"
                                    className={styles.formControl}
                                    name="zipCode"
                                    onChange={e => setAddFormData({ ...addFormData, 'zipCode': e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Button variant="contained"  type="submit">Cadastrar</Button>
                            </div>
                        </form>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default RegistrationForm;