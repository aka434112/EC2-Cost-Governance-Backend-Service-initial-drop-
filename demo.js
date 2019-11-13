var fetch = require('isomorphic-fetch');        
		
		fetch("http://localhost:9200/awsaccounts/_search", {
            mode: "no-cors",
            headers: {'Content-Type': 'application/json' },
        }).then(response=>{
            console.log(response.status);
});