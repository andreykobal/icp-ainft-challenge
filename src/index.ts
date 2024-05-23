import { ic, nat, Principal, update, query, stable } from 'azle';
import { v4 as uuidv4 } from 'uuid';

type NFT = {
    id: string;
    owner: Principal;
    uri: string;
};

let nfts: Map<string, NFT> = stable(new Map());
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

query;
export function getCurrentTokenCount(): nat {
    return BigInt(nfts.size);
}

query;
export function getOwnedNFTsByWallet(wallet: Principal): NFT[] {
    return Array.from(nfts.values()).filter(nft => nft.owner.toText() === wallet.toText());
}

query;
export function getAllNFTs(): NFT[] {
    return Array.from(nfts.values());
}

update;
export function burnToken(id: string): string {
    const nft = nfts.get(id);
    if (!nft) {
        return 'NFT not found';
    }
    if (nft.owner.toText() !== ic.caller().toText()) {
        return 'Caller is not the owner';
    }
    nfts.delete(id);
    return 'NFT burned successfully';
}

update;
export function transferNFT(to: Principal, id: string): string {
    const nft = nfts.get(id);
    if (!nft) {
        return 'NFT not found';
    }
    if (nft.owner.toText() !== ic.caller().toText()) {
        return 'Caller is not the owner';
    }
    nfts.set(id, { ...nft, owner: to });
    return 'NFT transferred successfully';
}

query;
export function contractURI(): string {
    return "https://gateway.pinata.cloud/ipfs/QmRacdswUKh7EU5rsFy8uehmo9USDxx69LVmD1UDCQ9HD8";
}

query;
export function tokenURI(id: string): string | null {
    const nft = nfts.get(id);
    return nft ? nft.uri : null;
}
