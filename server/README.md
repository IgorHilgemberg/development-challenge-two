# Informações sobre o back-end

Nome da tabela hospedada no DynamoDB: patient_registers

Estrutura da tabela patient_registers:

{
  "id": {
    "S": "patient-qCZvgR2moblX6ljBur_Ze"
  },
  "PatientAddress": {
    "M": {
      "PatientCity": {
        "S": "Ponta Grossa"
      },
      "PatientHouseNumber": {
        "S": "2000"
      },
      "PatientNeighborhood": {
        "S": "Ancho"
      },
      "PatientStreet": {
        "S": "Rua Perdeu as botas"
      },
      "PatientZipCode": {
        "S": "88455454"
      }
    }
  },
  "PatientBD": {
    "S": "11985-05-11"
  },
  "PatientEmail": {
    "S": "teste@teste.com"
  },
  "PatientName": {
    "S": "Jovinacio"
  }
}

As configurações da API para comunicação com Gateway API se encontram no arquivo amplify-config.js.
As configurações referentes a autenticação com o Cognito se encontram no arquivo public/js/config.js