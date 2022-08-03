import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask } from '@reach-sh/stdlib';
import { done } from '@reach-sh/stdlib/ask.mjs';


let ctc = null;
const stdlib = loadStdlib(process.env);

//function that return a string which will be passed to the backend
const getProof_Loc_Addr = ((params)=>{
  const {proof, location, walletAddress} = params;
  return `${proof}-${location}-${walletAddress}`;
});



//setting the user role
let role = "creator" //default
const user_know_id = await ask.ask(`Do you already have a contract id?`, ask.yesno);
if (user_know_id){
  //check if the user is an ATTACHER or VERIFIER
  const verifier = await ask.ask(`Are you a Verifier?`, ask.yesno);
  if(!verifier){
    role = "attacher"
  }else{
    role = "verifier"
  }
 
}

//setting the call for reach api
const call = async (f) => {
  let res = undefined;
  try {
    res = await f();
    console.log(`res`, res);
    return res;
  } catch (e) {
    res = [`err`, e]
    console.log(`res`, res);
    return false;
  }
};

console.log(`Your role is ${role}`);

const fmt = (x) => stdlib.formatCurrency(x, 18);

//console.log(fmt(stdlib.bigNumberify(50000000000000000000)));

//getting balance of the address
const getBalance = async (acc) => fmt(await stdlib.balanceOf(acc));


const iBalance = stdlib.bigNumberify(50000000000000000000);
const acc = await stdlib.newTestAccount(iBalance);
const myGasLimit = 5000000;
acc.setGasLimit(myGasLimit);

//calling getBalance() function
const before = await getBalance(acc);
console.log(`Your balance is: ${before}`);

// some informations
console.log(`The consensus network is ${stdlib.connector}.`);
console.log(`The standard unit is ${stdlib.standardUnit}`);
console.log(`The atomic unit is ${stdlib.atomicUnit}`);


// const commonInteract = {
//   reportPosition: (did,  proof_and_position) => console.log(`New position inserted \n DID: "${did}" \n proof_and_position: "${proof_and_position}"`),
//   report_results: (results) => console.log(`Results "${results}"`),

// };
const creatorInteract = {
  reportPosition: (did,  proof_and_position) => console.log(`New position inserted \n DID: "${did}" \n proof_and_position: "${proof_and_position}"`),
  report_results: (results) => console.log(`Results "${results}"`),
};
//implement the functions to log inside the backend
creatorInteract.log = async (...args) => { //era commonInteract.log
  console.log(...args)
};
// CREATOR
if (role === 'creator') { // ***** CREEATOR ******


  var did = await ask.ask(
    `What is your DID?`,
    (did => did)
  );
  var location_creator = await ask.ask(
    `What is your Location?`,
    (x => x)
  );
  var proof_creator = await ask.ask(
    `What is your Proof?`,
    (proof => proof)
  );

  const addrCreator = stdlib.formatAddress(acc.getAddress());

  var proof_and_location_creator = getProof_Loc_Addr({
    proof: String(proof_creator),
    location: String(location_creator),
    walletAddress: addrCreator
  });

  console.log(proof_and_location_creator)
  creatorInteract.decentralized_identifier = did;
  creatorInteract.position = proof_and_location_creator;
  

  // await showBalance(acc);
  //const ctc = acc.contract(backend); //OLD VERSION
  ctc = acc.contract(backend); //creating the contract
  ctc.getInfo().then((info) => {
    console.log(`The contract is deployed as = ${JSON.stringify(info)}`); //display the id of the contract. It was "parse" not "stringify"
  });



  const part = backend.Creator;
  await part(ctc, creatorInteract);
  
  const afterCreator = await getBalance(acc);
  console.log(`Your balance is: ${afterCreator}`);
  // ATTACHER
} else if (role == 'attacher'){ // ***** ATTACHER ******


  //TODO: receive the proofs
  console.log("\t\tA smart contract associated to this position already existed.");
  console.log("SIMULATION MODE: the credential is the DID (Decentralized IDentifier)");


  const acc = await stdlib.newTestAccount(iBalance);

  //calling getBalance() function
  const before = await getBalance(acc);
  console.log(`Your balance is: ${before}`);

  const info = await ask.ask(
    `Please paste the contract information:`,
    JSON.parse
  );

  ctc = acc.contract(backend, info);
  
  var did = await ask.ask(
    `What is your DID?`,
    (did => did)
  );
  var location_attacher = await ask.ask(
    `What is your Location?`,
    (x => x)
  );
  var proof_attacher = await ask.ask(
    `What is your Proof?`,
    (proof_attacher => proof_attacher)
  );

  const addrAttacher = stdlib.formatAddress(acc.getAddress());
  //Proof + Location + waletAddres e.g "jshsj2a9sjdja3ksl-G294A02-0x32idssdji2034"
  var proof_and_location_attacher = getProof_Loc_Addr({
    proof: String(proof_attacher),
    location: String(location_attacher),
    walletAddress: addrAttacher
  });
  const attacher_api = ctc.a.attacherAPI;
  
  await call(() => attacher_api.insert_position(
        String(proof_and_location_attacher),
        String(did)
      )
    );


}else{ // ***** VERIFIER ******
  console.log('%c Hi Verifier! ', 'background: #222; color: #bada55');

  // const acc_verifier = await stdlib.newTestAccount(iBalance);
  const info = await ask.ask(
    `Please paste the contract information:`,
    JSON.parse
  );

  ctc = acc.contract(backend, info);
  
  var did = await ask.ask(
    `What is your DID which you are looking for?`,
    (did => did)
  );

  //only for testing
  const addrVerifier = stdlib.formatAddress(acc.getAddress());


  const retrieve_Data = await ctc.v.views.retrieve_results(parseInt(did));
  console.log("retrieve data: ",retrieve_Data[1])

  const verify_response = await ask.ask(`Do you want to verify the user?`, ask.yesno);
  if (verify_response){
    const verifierAPI = ctc.a.verifierAPI;

    console.log("You are paying the following amount: 5");
    //PAYING the smart contract
    const money_sent = await call(() => verifierAPI.insert_money(stdlib.bigNumberify(5000000000000000000)));
    console.log("You have sent ", money_sent);
    //INSERT DATA into smart contract
    //call the API to execute the verification process
    await call(() => verifierAPI.verify(
      parseInt(did),
      addrVerifier //TODO: replace addrVerifier with the address of attacher
      )
    );

    const afterVerifier = await getBalance(acc);
    console.log(`Your balance is: ${afterVerifier}`);

    
  }






}


done();