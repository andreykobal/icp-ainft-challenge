# AI NFT on ICP

This repository hosts a solution to mint and manage AI NFTs on the Internet Computer Protocol (ICP) blockchain. This smart contract implementation enables users to create, burn, and query NFTs, leveraging ICP's unique capabilities. 

## Table of Contents
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Code Highlights](#code-highlights)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- **NFT Creation**: Mint new NFTs up to a fixed supply limit.
- **Ownership Management**: Track and query NFTs owned by specific wallets.
- **Burn Functionality**: Burn NFTs that are no longer needed.
- **Metadata Handling**: Retrieve metadata for NFTs.
- **Fixed Price Model**: NFTs have a fixed minting price.
- **ICP Integration**: Deploy and interact with the contract on the ICP blockchain.

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- [ICP SDK](https://sdk.dfinity.org/)
- [Azle](https://github.com/demergent-labs/azle)

### Installation
1. **Clone the Repository:**
    ```bash
    git clone https://github.com/your-repo/ainft-icp.git
    cd ainft-icp
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

### Environment Setup
Create a `.env` file in the root directory and configure necessary environment variables if needed.

## Usage

### NFT Minting

To mint a new NFT, use the `createToken` function by providing a URI:

```javascript
import { ic, Principal } from 'azle';

update;
export function createToken(uri: string): string {
    if (nfts.size >= maxSupply) {
        return 'Maximum NFT supply reached';
    }

    const id = uuidv4();
    const nft: NFT = { id, owner: ic.caller(), uri };
    nfts.set(id, nft);

    return id;
}
```

### Querying NFTs

To query the current token count or to fetch NFTs owned by a specific wallet:

```javascript
query;
export function getCurrentToken(): nat {
    return BigInt(nfts.size);
}

query;
export function getOwnedNFTsByWallet(wallet: Principal): NFT[] {
    const ownedNFTs: NFT[] = [];
    for (const nft of nfts.values()) {
        if (nft.owner.toText() === wallet.toText()) {
            ownedNFTs.push(nft);
        }
    }
    return ownedNFTs;
}
```

### Burning NFTs

To burn an existing NFT:

```javascript
update;
export function burnToken(id: string): string {
    const nft = nfts.get(id);
    if (!nft) {
        return 'NFT not found';
    }
    if (nft.owner.toText() !== ic.caller().toText()) {
        return 'Caller is not owner nor approved';
    }
    nfts.delete(id);
    return 'NFT burned successfully';
}
```

## Code Highlights

### Minting NFTs

Minting an NFT involves generating a unique identifier and storing it along with metadata:

```javascript
import { ic, Principal, update, query } from 'azle';
import { v4 as uuidv4 } from 'uuid';

type NFT = {
    id: string;
    owner: Principal;
    uri: string;
};

const nfts: Map<string, NFT> = new Map();
const fixedPrice: nat = 1000000000000000n; // 0.001 ICP
const maxSupply: nat = 40n;

update;
export function createToken(uri: string): string {
    if (nfts.size >= maxSupply) {
        return 'Maximum NFT supply reached';
    }

    const id = uuidv4();
    const nft: NFT = { id, owner: ic.caller(), uri };
    nfts.set(id, nft);

    return id;
}
```

### Query Functions

Retrieve information about NFTs and their owners:

```javascript
query;
export function getCurrentToken(): nat {
    return BigInt(nfts.size);
}

query;
export function getOwnedNFTsByWallet(wallet: Principal): NFT[] {
    const ownedNFTs: NFT[] = [];
    for (const nft of nfts.values()) {
        if (nft.owner.toText() === wallet.toText()) {
            ownedNFTs.push(nft);
        }
    }
    return ownedNFTs;
}
```

### Burning NFTs

Securely burn an NFT owned by the caller:

```javascript
update;
export function burnToken(id: string): string {
    const nft = nfts.get(id);
    if (!nft) {
        return 'NFT not found';
    }
    if (nft.owner.toText() !== ic.caller().toText()) {
        return 'Caller is not owner nor approved';
    }
    nfts.delete(id);
    return 'NFT burned successfully';
}
```

## Deployment

To deploy the smart contract on ICP, follow these steps:

1. **Install ICP SDK and Azle:**
    ```bash
    npm install -g dfx
    ```

2. **Deploy the Canister:**
    ```bash
    dfx start --background
    dfx deploy
    ```

3. **Interact with the Canister:**
    Use the `dfx` command line tool to call functions and manage your canister.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

Feel free to star this repository if you find it useful and innovative! If you face any issues, please open an issue, and we'll be happy to assist you.

**Resources:**
- [Azle Documentation](https://github.com/demergent-labs/azle)
- [ICP SDK](https://sdk.dfinity.org/)
