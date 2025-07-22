require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    hardhat: {
      forking: {
      url: "https://rpc.primordial.bdagscan.com",
      chainId: 1043,
      }
    }
  }
};

NEXT_PUBLIC_TEMPLATE_CLIENT_ID="1575789ecafdcce277d35df7c64744b5";
SECRET_KEY = CgLJ8Ii1AE7oEovBeao-F0lqxLUcHHY-P1gv8fVUIf07tN5ucqH_NCfMaDv3MBB4VHkAzp8wFnOB4fcKhn1UHA