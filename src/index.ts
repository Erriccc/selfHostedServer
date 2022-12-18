import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import config from './config';
import { parseServer } from './parseServer';
// @ts-ignore
import ParseServer from 'parse-server';
import http from 'http';
import ngrok from 'ngrok';
import { streamsSync } from '@moralisweb3/parse-server';

export const app = express();

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(
  streamsSync(parseServer, {
    apiKey: config.MORALIS_API_KEY,
    webhookUrl: '/streams',
  }),
);

app.use(`/server`, parseServer.app);

const httpServer = http.createServer(app);
httpServer.listen(config.PORT, async () => {
  if (config.USE_STREAMS) {
    const url = await ngrok.connect(config.PORT);
    // eslint-disable-next-line no-console
    console.log(
      `Moralis Server is running on port ${config.PORT} and stream webhook url ${url}${config.STREAMS_WEBHOOK_URL}`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(`Moralis Server is running on port ${config.PORT}.`);
  }
});
// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);


// const NFT_transfer_ABI = [{
//   "anonymous": false,
//   "inputs": [ndexed": true, "name": "from", "type": "address" },
//     { "indexed": true, "name": "to", "type": "address" },
//     { "indexed": true, "name": "tokenId", "type": "uint256" },
//   ],
//   "name": "transfer",
//   "type": "event",
// }]; // valid abi of the event

// const options = {
//   chains: [EvmChain.ETHEREUM], // list of blockchains to monitor
//   description: "monitor all NFT transfers", // your description
//   tag: "NFT_transfers", // give it a tag
//   abi: NFT_transfer_ABI,
//   includeContractLogs: true,
//   allAddresses: true,
//   topic0: ["transfer(address,address,uint256)"], // topic of the event
//   webhookUrl: "https://YOUR_WEBHOOK_URL", // webhook url to receive events,
// };

// const stream = await Moralis.Streams.add(options);