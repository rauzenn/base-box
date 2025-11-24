// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BaseBoxNFT
 * @dev Time Capsule NFTs on Base - Free to mint, only gas fees
 */
contract BaseBoxNFT is ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Base URI for metadata
    string private _baseTokenURI;
    
    // Minting state
    bool public mintingEnabled = true;
    
    // Mapping from token ID to capsule ID
    mapping(uint256 => uint256) public tokenToCapsuleId;
    
    // Mapping to prevent double minting same capsule
    mapping(uint256 => bool) public capsuleMinted;
    
    // Events
    event CapsuleMinted(
        uint256 indexed tokenId,
        uint256 indexed capsuleId,
        address indexed minter
    );
    
    event MintingToggled(bool enabled);
    event BaseURIUpdated(string newBaseURI);

    constructor() ERC721A("Base Box Time Capsule", "BBTC") {
        _baseTokenURI = "https://basebox.vercel.app/api/nft/";
    }

    /**
     * @dev Mint a capsule NFT (FREE - only gas fee)
     * @param capsuleId The ID of the capsule being minted
     */
    function mint(uint256 capsuleId) external nonReentrant {
        require(mintingEnabled, "Minting is paused");
        require(!capsuleMinted[capsuleId], "Capsule already minted");
        
        // Get next token ID
        uint256 tokenId = _nextTokenId();
        
        // Mark capsule as minted
        capsuleMinted[capsuleId] = true;
        
        // Store capsule ID mapping
        tokenToCapsuleId[tokenId] = capsuleId;
        
        // Mint NFT to sender
        _safeMint(msg.sender, 1);
        
        emit CapsuleMinted(tokenId, capsuleId, msg.sender);
    }

    /**
     * @dev Batch mint multiple capsules (for future use)
     * @param capsuleIds Array of capsule IDs to mint
     */
    function mintBatch(uint256[] calldata capsuleIds) external nonReentrant {
        require(mintingEnabled, "Minting is paused");
        require(capsuleIds.length > 0, "Empty array");
        require(capsuleIds.length <= 10, "Max 10 per batch");
        
        uint256 startTokenId = _nextTokenId();
        
        for (uint256 i = 0; i < capsuleIds.length; i++) {
            require(!capsuleMinted[capsuleIds[i]], "Capsule already minted");
            capsuleMinted[capsuleIds[i]] = true;
            tokenToCapsuleId[startTokenId + i] = capsuleIds[i];
        }
        
        _safeMint(msg.sender, capsuleIds.length);
        
        for (uint256 i = 0; i < capsuleIds.length; i++) {
            emit CapsuleMinted(startTokenId + i, capsuleIds[i], msg.sender);
        }
    }

    /**
     * @dev Check if a capsule has been minted
     * @param capsuleId The capsule ID to check
     */
    function isCapsuleMinted(uint256 capsuleId) external view returns (bool) {
        return capsuleMinted[capsuleId];
    }

    /**
     * @dev Get capsule ID from token ID
     * @param tokenId The NFT token ID
     */
    function getCapsuleId(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return tokenToCapsuleId[tokenId];
    }

    /**
     * @dev Get all token IDs owned by an address
     * @param owner The address to query
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        if (tokenCount == 0) {
            return new uint256[](0);
        }
        
        uint256[] memory tokens = new uint256[](tokenCount);
        uint256 index = 0;
        uint256 totalSupply = totalSupply();
        
        for (uint256 tokenId = 0; tokenId < totalSupply && index < tokenCount; tokenId++) {
            if (_exists(tokenId) && ownerOf(tokenId) == owner) {
                tokens[index] = tokenId;
                index++;
            }
        }
        
        return tokens;
    }

    /**
     * @dev Returns the base URI for token metadata
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Returns the token URI for a given token ID
     * @param tokenId The token ID to query
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        string memory baseURI = _baseURI();
        uint256 capsuleId = tokenToCapsuleId[tokenId];
        
        // Return: https://basebox.vercel.app/api/nft/{capsuleId}
        return bytes(baseURI).length > 0 
            ? string(abi.encodePacked(baseURI, capsuleId.toString())) 
            : "";
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Toggle minting on/off
     */
    function toggleMinting() external onlyOwner {
        mintingEnabled = !mintingEnabled;
        emit MintingToggled(mintingEnabled);
    }

    /**
     * @dev Update base URI for metadata
     * @param newBaseURI The new base URI
     */
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Withdraw any ETH accidentally sent to contract
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get contract metadata
     */
    function contractURI() public pure returns (string memory) {
        return "https://basebox.vercel.app/api/nft/contract";
    }

    // ============ OVERRIDE REQUIRED FUNCTIONS ============

    /**
     * @dev See {IERC721-_startTokenId}
     */
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1; // Start token IDs from 1 instead of 0
    }
}
