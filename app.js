const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your own MongoDB connection string
const connectionString = 'mongodb+srv://pkrhtdm:987654321.0@hypermovegame.loejrx2.mongodb.net';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Connected");
}).catch((e)=>{
    console.log(e);
});

const walletSchema = new mongoose.Schema({
    address: String,
    coinsRewarded: Boolean
});

const Wallet = mongoose.model('Wallet', walletSchema);

app.post('/saveWalletAddress', async (req, res) => {
    const walletAddress = req.body.walletAddress;
    console.log('Received wallet address:', walletAddress); // Log the received wallet address
    let wallet = await Wallet.findOne({ address: walletAddress });

    if (!wallet) {
        console.log('Creating a new wallet record'); // Log when creating a new wallet record
        wallet = new Wallet({ address: walletAddress, coinsRewarded: false });
        await wallet.save();
    } else {
        console.log('Found an existing wallet record'); // Log when an existing wallet record is found
    }

    if (!wallet.coinsRewarded) {
        console.log('Rewarding in-game coins'); // Log when rewarding in-game coins
        wallet.coinsRewarded = true;
        await wallet.save();
        res.send('150');
    } else {
        console.log('No reward: Wallet already rewarded'); // Log when the wallet has already been rewarded
        res.send('0');
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
