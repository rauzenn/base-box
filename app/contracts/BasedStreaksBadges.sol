// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title BasedStreaksBadges
 * @dev ERC-1155 NFT badges for Based Streaks milestones
 * Free mint for users who achieve streak milestones
 */
contract BasedStreaksBadges is ERC1155, Ownable {
    using Strings for uint256;

    // Badge IDs
    uint256 public constant SEED_BADGE = 1;      // 7 days
    uint256 public constant FLAME_BADGE = 2;     // 14 days
    uint256 public constant DIAMOND_BADGE = 3;   // 21 days
    uint256 public constant CROWN_BADGE = 4;     // 30 days

    // Mapping: FID => Badge ID => claimed
    mapping(uint256 => mapping(uint256 => bool)) public hasClaimed;

    // Authorized backend address (for verification)
    address public backendSigner;

    // Base URI for metadata
    string private baseURI;

    // Events
    event BadgeMinted(uint256 indexed fid, uint256 indexed badgeId, address indexed to);
    event BackendSignerUpdated(address indexed oldSigner, address indexed newSigner);
    event BaseURIUpdated(string newBaseURI);

    constructor(
        address _backendSigner,
        string memory _baseURI
    ) ERC1155(_baseURI) Ownable(msg.sender) {
        backendSigner = _backendSigner;
        baseURI = _baseURI;
    }

    /**
     * @dev Mint badge for user (called by backend after verification)
     * @param fid Farcaster ID of the user
     * @param to Address to mint badge to
     * @param badgeId Badge ID to mint (1-4)
     * @param signature Backend signature for verification
     */
    function mintBadge(
        uint256 fid,
        address to,
        uint256 badgeId,
        bytes memory signature
    ) external {
        require(badgeId >= 1 && badgeId <= 4, "Invalid badge ID");
        require(!hasClaimed[fid][badgeId], "Badge already claimed");
        require(to != address(0), "Invalid address");

        // Verify backend signature
        bytes32 messageHash = keccak256(abi.encodePacked(fid, to, badgeId));
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        
        address recoveredSigner = recoverSigner(ethSignedHash, signature);
        require(recoveredSigner == backendSigner, "Invalid signature");

        // Mark as claimed
        hasClaimed[fid][badgeId] = true;

        // Mint badge (ERC-1155: token ID = badge ID, amount = 1)
        _mint(to, badgeId, 1, "");

        emit BadgeMinted(fid, badgeId, to);
    }

    /**
     * @dev Recover signer from signature
     */
    function recoverSigner(
        bytes32 ethSignedHash,
        bytes memory signature
    ) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature 'v' value");

        return ecrecover(ethSignedHash, v, r, s);
    }

    /**
     * @dev Check if user has claimed a badge
     */
    function hasClaimedBadge(uint256 fid, uint256 badgeId) external view returns (bool) {
        return hasClaimed[fid][badgeId];
    }

    /**
     * @dev Get all badges claimed by FID
     */
    function getClaimedBadges(uint256 fid) external view returns (uint256[] memory) {
        uint256[] memory claimed = new uint256[](4);
        uint256 count = 0;

        for (uint256 i = 1; i <= 4; i++) {
            if (hasClaimed[fid][i]) {
                claimed[count] = i;
                count++;
            }
        }

        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = claimed[i];
        }

        return result;
    }

    /**
     * @dev Get badge name
     */
    function getBadgeName(uint256 badgeId) public pure returns (string memory) {
        if (badgeId == SEED_BADGE) return "Seed Badge";
        if (badgeId == FLAME_BADGE) return "Flame Badge";
        if (badgeId == DIAMOND_BADGE) return "Diamond Badge";
        if (badgeId == CROWN_BADGE) return "Crown Badge";
        return "Unknown Badge";
    }

    /**
     * @dev Get badge milestone days
     */
    function getBadgeMilestone(uint256 badgeId) public pure returns (uint256) {
        if (badgeId == SEED_BADGE) return 7;
        if (badgeId == FLAME_BADGE) return 14;
        if (badgeId == DIAMOND_BADGE) return 21;
        if (badgeId == CROWN_BADGE) return 30;
        return 0;
    }

    // ===== ADMIN FUNCTIONS =====

    /**
     * @dev Update backend signer address
     */
    function setBackendSigner(address _newSigner) external onlyOwner {
        require(_newSigner != address(0), "Invalid address");
        address oldSigner = backendSigner;
        backendSigner = _newSigner;
        emit BackendSignerUpdated(oldSigner, _newSigner);
    }

    /**
     * @dev Update base URI
     */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
        emit BaseURIUpdated(_newBaseURI);
    }

    /**
     * @dev Get token URI
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }
}