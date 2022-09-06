const awsConfig = {
    Auth: {
        identityPoolId: 'us-east-2:0e8a4301-81a0-4996-a2ee-eb97c4787536', // example: 'us-east-2:c85f3c18-05fd-4bb5-8fd1-e77e7627a99e'
        region: 'us-east-2', // example: 'us-east-2'
        userPoolId: 'us-east-2_6JC3jGVcl', // example: 'us-east-2_teEUQbkUh'
        userPoolWebClientId: '478hc77849spoi3rovbko02fk' // example: '3k09ptd8kn8qk2hpk07qopr86'
    },
    API: {
        endpoints: [
            {
                name: 'CRUDPatients',
                endpoint: 'https://k3fwikz07c.execute-api.us-east-2.amazonaws.com/prod', // example: 'https://u8swuvl00f.execute-api.us-east-2.amazonaws.com/prod'
                region: 'us-east-2' // example: 'us-east-2'
            }
        ]
    },
    Storage: {
        bucket: '', //example: 'wildrydesbackend-profilepicturesbucket-1wgssc97ekdph'
        region: '' // example: 'us-east-2'
    }
}

export default awsConfig;
