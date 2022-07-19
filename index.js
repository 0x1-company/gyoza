const firebaseConfig = {
    apiKey: "AIzaSyCVkaTNRBPdfnc0L1inuwJyJKphmRTcI-A",
    projectId: "gyoza-93a1c",
    storageBucket: "gyoza-93a1c.appspot.com",
    messagingSenderId: "775707115846",
    appId: "1:775707115846:web:3812461bbb6f6ca50be547"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

document.getElementById('location').innerText = "url";

var contractAddress = '';
var tokenId = '';
var id = '';

chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
    const url = e[0].url;
    contractAddress = url.split('/')[4];
    tokenId = url.split('/')[5];
    document.getElementById('location').innerText = url;

    getNFT();
});

async function getNFT() {
    const response = await fetch(`https://api-testnet.aspect.co/api/v0/asset/${contractAddress}/${tokenId}`, { mode: 'cors' });
    const data = await response.json();
    id = data.id;

    document.getElementById('message-list').innerHTML = '';

    var messageCollection = db.collection(`rooms/${id}/messages`);
    messageCollection.orderBy('createdAt').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const text = doc.data().text;
            var z = document.createElement('p');
            z.innerHTML = text;
            document.getElementById('message-list').appendChild(z);
        });
    });
}

document.getElementById("myButton").addEventListener("click", myFunction);

async function myFunction(){
    const text = document.getElementById('text').value

    db.collection(`rooms/${id}/messages`).add({
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById('text').innerHTML = '';
        getNFT();
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}
