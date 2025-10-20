// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title BaseBoxCapsule
 * @dev Time Capsule NFT Contract for Base Box
 * @notice Mint time-locked capsules that reveal after a specific date
 */
contract BaseBoxCapsule is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Capsule data structure
    struct Capsule {
        uint256 createdAt;
        uint256 unlockDate;
        address creator;
        string encryptedMessage;
        bool revealed;
        CapsuleType capsuleType;
        uint256 duration; // in seconds
    }
    
    enum CapsuleType {
        PERSONAL,
        PREDICTION,
        GOAL,
        GIFT
    }
    
    // Mappings
    mapping(uint256 => Capsule) public capsules;
    mapping(address => uint256[]) public userCapsules;
    mapping(address => uint256) public userCapsuleCount;
    
    // Stats
    uint256 public totalCapsules;
    uint256 public totalRevealed;
    
    // Events
    event CapsuleMinted(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 unlockDate,
        CapsuleType capsuleType
    );
    
    event CapsuleRevealed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 revealedAt
    );
    
    event CapsuleTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    constructor() ERC721("Base Box Capsule", "BBC") Ownable(msg.sender) {
        _baseTokenURI = "https://basebox.app/api/metadata/";
    }
    
    /**
     * @dev Mint a new time capsule NFT
     * @param unlockDate Unix timestamp when capsule can be revealed
     * @param encryptedMessage Encrypted message stored on-chain
     * @param capsuleType Type of capsule (personal, prediction, etc.)
     */
    function mintCapsule(
        uint256 unlockDate,
        string memory encryptedMessage,
        CapsuleType capsuleType
    ) external returns (uint256) {
        require(unlockDate > block.timestamp, "Unlock date must be in future");
        require(bytes(encryptedMessage).length > 0, "Message cannot be empty");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint NFT
        _safeMint(msg.sender, tokenId);
        
        // Calculate duration
        uint256 duration = unlockDate - block.timestamp;
        
        // Store capsule data
        capsules[tokenId] = Capsule({
            createdAt: block.timestamp,
            unlockDate: unlockDate,
            creator: msg.sender,
            encryptedMessage: encryptedMessage,
            revealed: false,
            capsuleType: capsuleType,
            duration: duration
        });
        
        // Update user tracking
        userCapsules[msg.sender].push(tokenId);
        userCapsuleCount[msg.sender]++;
        totalCapsules++;
        
        emit CapsuleMinted(tokenId, msg.sender, unlockDate, capsuleType);
        
        return tokenId;
    }
    
    /**
     * @dev Reveal a capsule (only after unlock date)
     * @param tokenId The ID of the capsule to reveal
     */
    function revealCapsule(uint256 tokenId) external {
        require(_ownerOf(tokenId) == msg.sender, "Not capsule owner");
        require(!capsules[tokenId].revealed, "Already revealed");
        require(
            block.timestamp >= capsules[tokenId].unlockDate,
            "Capsule still locked"
        );
        
        capsules[tokenId].revealed = true;
        totalRevealed++;
        
        emit CapsuleRevealed(tokenId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Check if capsule can be revealed
     * @param tokenId The ID of the capsule
     */
    function canReveal(uint256 tokenId) external view returns (bool) {
        return block.timestamp >= capsules[tokenId].unlockDate &&
               !capsules[tokenId].revealed;
    }
    
    /**
     * @dev Get time remaining until unlock
     * @param tokenId The ID of the capsule
     */
    function timeUntilUnlock(uint256 tokenId) external view returns (uint256) {
        if (block.timestamp >= capsules[tokenId].unlockDate) {
            return 0;
        }
        return capsules[tokenId].unlockDate - block.timestamp;
    }
    
    /**
     * @dev Get all capsule IDs for a user
     * @param user Address of the user
     */
    function getUserCapsules(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userCapsules[user];
    }
    
    /**
     * @dev Get capsule details
     * @param tokenId The ID of the capsule
     */
    function getCapsule(uint256 tokenId) 
        external 
        view 
        returns (Capsule memory) 
    {
        return capsules[tokenId];
    }
    
    /**
     * @dev Get user statistics
     * @param user Address of the user
     */
    function getUserStats(address user) 
        external 
        view 
        returns (
            uint256 total,
            uint256 locked,
            uint256 revealed
        ) 
    {
        total = userCapsuleCount[user];
        locked = 0;
        revealed = 0;
        
        uint256[] memory userTokens = userCapsules[user];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (capsules[userTokens[i]].revealed) {
                revealed++;
            } else {
                locked++;
            }
        }
        
        return (total, locked, revealed);
    }
    
    /**
     * @dev Override transfer to emit custom event
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        address previousOwner = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0)) {
            emit CapsuleTransferred(tokenId, from, to);
        }
        
        return previousOwner;
    }
    
    /**
     * @dev Set base URI for token metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Override base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() 
        external 
        view 
        returns (
            uint256 total,
            uint256 revealed,
            uint256 locked,
            uint256 totalUsers
        ) 
    {
        return (
            totalCapsules,
            totalRevealed,
            totalCapsules - totalRevealed,
            _tokenIdCounter.current() // Approximation
        );
    }
    
    /**
     * @dev Check if token exists
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}