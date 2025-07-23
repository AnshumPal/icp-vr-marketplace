# icp-vr-marketplace
A decentralized VR asset marketplace on the Internet Computer for minting, previewing, and trading NFT-backed 3D models.
roject Overview
icp-vr-marketplace combines blockchain security with immersive previews. Creators upload 3D models, mint them as NFTs on ICP, and list them in a marketplace. Buyers can interactively preview assets in a WebXR viewer and complete purchases on-chain.

# Features
1.NFT minting for 3D assets via ICP canisters
2.Decentralized storage of metadata and ownership records
3.WebXR/Three.js viewer for real-time 3D previews
4.Marketplace UI with asset browsing, filtering, and purchase flow
5.Internet Identity authentication for secure logins


# Architecture
The application splits into frontend and backend modules running entirely on ICP:
1.Frontend served as static assets from a canister
2.Backend logic implemented in Motoko/Rust canisters
3.Asset data stored in dedicated asset canisters
4.Transactions handled via smart contracts on ICP
