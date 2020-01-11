pragma solidity ^0.5.0;

import "./Context.sol";
import "./ERC20.sol";
import "./ERC20Detailed.sol";

/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract SimpleToken is Context, ERC20, ERC20Detailed {

    /**
     * @dev Constructor that gives _msgSender() all of existing tokens.
     */
    constructor (string memory token_name,string memory token_symbol,uint8 point_number,uint256 amount) public ERC20Detailed(token_name, token_symbol, point_number) {
        _mint(_msgSender(), amount * (10 ** uint256(decimals())));
    }
}