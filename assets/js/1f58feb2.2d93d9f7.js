"use strict";(self.webpackChunkillium_documentation=self.webpackChunkillium_documentation||[]).push([[8627],{3905:(e,n,t)=>{t.d(n,{Zo:()=>h,kt:()=>m});var s=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);n&&(s=s.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,s)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,s,o=function(e,n){if(null==e)return{};var t,s,o={},a=Object.keys(e);for(s=0;s<a.length;s++)t=a[s],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(s=0;s<a.length;s++)t=a[s],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=s.createContext({}),l=function(e){var n=s.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},h=function(e){var n=l(e.components);return s.createElement(c.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return s.createElement(s.Fragment,{},n)}},p=s.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,h=i(e,["components","mdxType","originalType","parentName"]),u=l(t),p=o,m=u["".concat(c,".").concat(p)]||u[p]||d[p]||a;return t?s.createElement(m,r(r({ref:n},h),{},{components:t})):s.createElement(m,r({ref:n},h))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,r=new Array(a);r[0]=p;var i={};for(var c in n)hasOwnProperty.call(n,c)&&(i[c]=n[c]);i.originalType=e,i[u]="string"==typeof e?e:o,r[1]=i;for(var l=2;l<a;l++)r[l]=t[l];return s.createElement.apply(null,r)}return s.createElement.apply(null,t)}p.displayName="MDXCreateElement"},4502:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>d,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var s=t(7462),o=(t(7294),t(3905));const a={sidebar_position:2},r="Blockchain Service",i={unversionedId:"api/blockchain-service",id:"api/blockchain-service",title:"Blockchain Service",description:"RPC Messages",source:"@site/docs/api/blockchain-service.md",sourceDirName:"api",slug:"/api/blockchain-service",permalink:"/api/blockchain-service",draft:!1,editUrl:"https://github.com/project-illium/illium-documentation/docs/api/blockchain-service.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"apiSidebar",previous:{title:"Overview",permalink:"/api"},next:{title:"Wallet Server Service",permalink:"/api/wallet-server"}},c={},l=[{value:"RPC Messages",id:"rpc-messages",level:3}],h={toc:l},u="wrapper";function d(e){let{components:n,...t}=e;return(0,o.kt)(u,(0,s.Z)({},h,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"blockchain-service"},"Blockchain Service"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"service BlockchainService {\n    // GetMempoolInfo returns the state of the current mempool\n    rpc GetMempoolInfo(GetMempoolInfoRequest) returns (GetMempoolInfoResponse) {}\n\n    // GetMempool returns all the transactions in the mempool\n    rpc GetMempool(GetMempoolRequest) returns (GetMempoolResponse) {}\n\n    // GetBlockchainInfo returns data about the blockchain including the most recent\n    // block hash and height.\n    rpc GetBlockchainInfo(GetBlockchainInfoRequest) returns (GetBlockchainInfoResponse) {}\n\n    // GetBlockInfo returns a BlockHeader plus some extra metadata.\n    rpc GetBlockInfo(GetBlockInfoRequest)returns (GetBlockInfoResponse) {}\n\n    // GetBlock returns a BlockInfo metadata object plus the transactions either\n    // as IDs or full transactions.\n    rpc GetBlock(GetBlockRequest) returns (GetBlockResponse) {}\n    \n    // GetRawBlock returns the raw block in protobuf format\n    rpc GetRawBlock(GetRawBlockRequest) returns (GetRawBlockResponse) {}\n\n    // GetCompressedBlock returns a block that is stripped down to just the outputs.\n    // It is the bare minimum information a client side wallet needs to compute its internal\n    // state.\n    rpc GetCompressedBlock(GetCompressedBlockRequest) returns (GetCompressedBlockResponse) {}\n\n    // GetHeaders returns a batch of headers according to the request parameters.\n    rpc GetHeaders(GetHeadersRequest) returns (GetHeadersResponse) {}\n\n    // GetCompressedBlocks returns a batch of CompressedBlocks according to the request parameters.\n    rpc GetCompressedBlocks(GetCompressedBlocksRequest) returns (GetCompressedBlocksResponse) {}\n\n    // GetTransaction returns the transaction for the given transaction ID.\n    //\n    // **Requires TxIndex**\n    // **Input/Output metadata requires AddrIndex**\n    rpc GetTransaction(GetTransactionRequest) returns (GetTransactionResponse) {}\n\n    // GetAddressTransactions returns a list of transactions for the given address\n    // Note: only public address are indexed\n    //\n    // **Requires AddrIndex**\n    rpc GetAddressTransactions(GetAddressTransactionsRequest) returns (GetAddressTransactionsResponse) {}\n\n    // GetMerkleProof returns a Merkle (SPV) proof for a specific transaction\n    // in the provided block.\n    //\n    // **Requires TxIndex**\n    rpc GetMerkleProof(GetMerkleProofRequest) returns (GetMerkleProofResponse) {}\n\n    // GetValidator returns all the information about the given validator including number\n    // of staked coins.\n    rpc GetValidator(GetValidatorRequest) returns (GetValidatorResponse) {}\n\n    // GetValidatorSetInfo returns information about the validator set.\n    rpc GetValidatorSetInfo(GetValidatorSetInfoRequest) returns (GetValidatorSetInfoResponse) {}\n\n    // GetValidatorSet returns all the validators in the current validator set.\n    rpc GetValidatorSet(GetValidatorSetRequest) returns (GetValidatorSetResponse) {}\n\n    // GetValidatorCoinbases returns a list of coinbase txids for the validator.\n    //\n    // **Requires AddrIndex**\n    rpc GetValidatorCoinbases(GetValidatorCoinbasesRequest) returns (GetValidatorCoinbasesResponse) {}\n    \n    // GetAccumulatorCheckpoint returns the accumulator at the requested height.\n    // If there is no checkpoint at that height, the *prior* checkpoint found in the\n    // chain will be returned. If there is no prior checkpoint (as is prior to the first)\n    // an error will be returned.\n    rpc GetAccumulatorCheckpoint(GetAccumulatorCheckpointRequest) returns (GetAccumulatorCheckpointResponse) {}\n\n    // SubmitTransaction validates a transaction and submits it to the network. An error will be returned\n    // if it fails validation.\n    rpc SubmitTransaction(SubmitTransactionRequest) returns (SubmitTransactionResponse) {}\n\n    // SubscribeBlocks returns a stream of notifications when new blocks are finalized and\n    // connected to the chain.\n    rpc SubscribeBlocks(SubscribeBlocksRequest) returns (stream BlockNotification) {}\n\n    // SubscribeCompressedBlocks returns a stream of CompressedBlock notifications when new\n    // blocks are finalized and connected to the chain.\n    rpc SubscribeCompressedBlocks(SubscribeCompressedBlocksRequest) returns (stream CompressedBlockNotification) {}\n}\n")),(0,o.kt)("h3",{id:"rpc-messages"},"RPC Messages"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-go"},"message GetMempoolInfoRequest{}\nmessage GetMempoolInfoResponse {\n    // The count of transactions in the mempool\n    uint32 size  = 1;\n    // The size in bytes of all transactions in the mempool\n    uint32 bytes = 2;\n}\n\nmessage GetMempoolRequest {\n    // When `full_transactions` is true, full transaction data is provided\n    // instead of just transaction hashes. Default is false.\n    bool full_transactions = 1;\n}\nmessage GetMempoolResponse {\n    // List of unconfirmed transactions.\n    repeated TransactionData transaction_data = 1;\n}\n\nmessage GetBlockchainInfoRequest {}\nmessage GetBlockchainInfoResponse {\n    // Illium network types\n    enum Network {\n        // Live public network with monetary value\n        MAINNET  = 0;\n        // An isolated environment for automated testing\n        REGTEST  = 1;\n        // A public environment where monetary value is agreed to be zero,\n        // and some checks for transaction conformity are disabled.\n        TESTNET  = 2;\n        // Alpha testnet\n        ALPHANET = 3;\n    }\n    \n    // Which network the node is operating on\n    Network network           = 1;\n    // The current number of blocks in the chain\n    uint32 best_height        = 2;\n    // The hash of the best (tip) block in the chain\n    bytes best_block_ID       = 3;\n    // The timestamp of the best block\n    int64 block_time          = 4;\n    // When `tx_index` is true, the node has full transaction index enabled\n    bool tx_index             = 5;\n    // The total number of coins in circulation in nanoillium\n    uint64 circulating_supply = 6;\n    // The total number of coins staked in nanoillium\n    uint64 total_staked       = 7;\n    // The balance of the treasury in nanoillium\n    uint64 treasury_balance   = 8;\n    // The total size of the database on disk\n    uint64 blockchain_size    = 9;\n    // The current epoch number (also total number of epochs)\n    uint32 epoch              = 10;\n}\n\nmessage GetBlockInfoRequest {\n    oneof id_or_height {\n        // The block hash as a byte array\n        bytes block_ID = 1;\n        // The block number\n        uint32 height  = 2;\n    }\n}\nmessage GetBlockInfoResponse {\n    // Marshaled block header data, as well as metadata\n    BlockInfo info = 1;\n}\n\nmessage GetBlockRequest {\n    oneof id_or_height {\n        // The block hash as a byte array\n        bytes block_ID = 1;\n        // The block number\n        uint32 height  = 2;\n    }\n\n    // Default is false, only the transaction IDs are included for\n    // a marshaled block.\n    bool full_transactions = 3;\n}\nmessage GetBlockResponse {\n    // The BlockInfo (including header data) for the block\n    BlockInfo block_info                  = 1;\n    // The blocks transactions (if requested).\n    //\n    // The transactions will either be returned in for or just the txids depending\n    // on the request.\n    repeated TransactionData transactions = 2;\n}\n\nmessage GetRawBlockRequest {\n    oneof id_or_height {\n        // The block hash as a byte array\n        bytes block_ID = 1;\n        // The block number\n        uint32 height   = 2;\n    }\n}\nmessage GetRawBlockResponse {\n    // The full block response\n    Block block = 1;\n}\n\nmessage GetCompressedBlockRequest {\n    oneof id_or_height {\n        // The block hash as a byte array\n        bytes block_ID = 1;\n        // The block number\n        uint32 height  = 2;\n    }\n}\nmessage GetCompressedBlockResponse {\n    // The compressed block contains only transaction outputs\n    CompressedBlock block = 1;\n}\n\nmessage GetHeadersRequest {\n    // The height to start receiving headers\n    uint32 start_height = 1;\n    // The last header height to return. Note that a maximum of 2000\n    // blocks will be returned per request. If end_height is > start_height + 1999\n    // then end_height will be set set to start_height + 1999 and 2000 headers\n    // will be returned. If end_height is past the tip of the chain the headers\n    // will be returned up to the tip.\n    //\n    // If end_height is less than start_height 2000 headers will be returned.\n    uint32 end_height   = 2;\n}\nmessage GetHeadersResponse {\n    repeated BlockHeader headers = 1;\n}\n\nmessage GetCompressedBlocksRequest {\n    // The height to start receiving headers\n    uint32 start_height = 1;\n    // The last block height to return. Note that a maximum of 2000 blocks will be returned\n    // per request. If end_height is > start_height + 1999 then end_height will be set set\n    // to start_height + 1999 and 2000 compressed blocks will be returned. If end_height is\n    // past the tip of the chain the compressed blocks will be returned up to the tip.\n    //\n    // If end_height is less than start_height 2000 blocks will be returned.\n    uint32 end_height   = 2;\n}\nmessage GetCompressedBlocksResponse {\n    // The compressed block response\n    repeated CompressedBlock blocks = 1;\n}\n\nmessage GetTransactionRequest {\n    // A transaction hash\n    bytes transaction_ID = 1;\n}\nmessage GetTransactionResponse {\n    // The transaction response\n    Transaction tx              = 1;\n    // The ID of the containing block\n    bytes block_ID              = 2;\n    // The height of the containing block\n    uint32 height               = 3;\n\n    // The input and output metadata will\n    // only only be non-nil if the address\n    // index is enabled.\n    //\n    // Further it will only metadata for public\n    // inputs or outputs will be included otherwise\n    // it will be `unknown`.\n    repeated IOMetadata inputs  = 4;\n    repeated IOMetadata outputs = 5;\n}\n\nmessage GetAddressTransactionsRequest {\n    // The address to get transactions for\n    string address = 1;\n    // The number of transactions to skip, starting with the oldest first.\n    uint32 nb_skip = 2;\n    // Specify the number of transactions to fetch.\n    uint32 nb_fetch = 3;\n}\nmessage GetAddressTransactionsResponse {\n    // The list of transactions\n    repeated TransactionWithMetadata txs = 1;\n    \n    message TransactionWithMetadata {\n        // The transaction response\n        Transaction tx              = 1;\n        // The ID of the containing block\n        bytes block_ID              = 2;\n        // The height of the containing block\n        uint32 height               = 3;\n        \n        // Metadata will only metadata for public\n        // inputs or outputs will be included otherwise\n        // it will be `unknown`.\n        repeated IOMetadata inputs  = 4;\n        repeated IOMetadata outputs = 5;\n    }\n}\n\nmessage GetMerkleProofRequest {\n    // A transaction hash\n    bytes transaction_ID = 1;\n}\nmessage GetMerkleProofResponse {\n    // Block header information for the corresponding transaction\n    BlockInfo block       = 1;\n    // Is the proof hashes linking the tx to the root\n    repeated bytes hashes = 2;\n    // The least significant bit in flags corresponds to the last hash in `hashes`. The second least\n    // significant to the second to last hash, and so on. The bit signifies whether the hash should be\n    // prepended (0) or appended (1) when hashing each level in the tree.\n    uint32 flags          = 3;\n}\n\nmessage GetValidatorRequest {\n    // A serialized validator ID\n    bytes validator_ID = 1;\n}\nmessage GetValidatorResponse {\n    // The validator response\n    Validator validator = 1;\n}\n\nmessage GetValidatorCoinbasesRequest {\n    // A serialized validator ID\n    bytes validator_ID = 1;\n}\nmessage GetValidatorCoinbasesResponse {\n    // Coinbase transactions\n    repeated bytes txids = 1;\n}\n\nmessage GetValidatorSetInfoRequest{}\nmessage GetValidatorSetInfoResponse{\n    // The total number of coins staked on the network in nanoillium\n    uint64 total_staked   = 1;\n    // The total stake weighted by time locks in nanoillium\n    uint64 stake_weight   = 2;\n    // The total number of validators on the network\n    uint32 num_validators = 3;\n}\n\nmessage GetValidatorSetRequest{}\nmessage GetValidatorSetResponse{\n    // The full list of validators on the network\n    repeated Validator validators = 1;\n}\n\nmessage GetAccumulatorCheckpointRequest{\n    oneof height_or_timestamp {\n        // The height of the accumulator checkpoint to return.\n        // If there is no checkpoint at that height, the *prior*\n        // checkpoint found in the chain will be returned.\n        //\n        // An error will be returned if there is no checkpoint before\n        // the provided height.\n        uint32 height   = 1;\n        \n        // The timestamp of the accumulator checkpoint to return.\n        // If there is no checkpoint at that timestamp, the *prior*\n        // checkpoint found in the chain will be returned.\n        //\n        // An error will be returned if there is no checkpoint before\n        // the provided timestamp.\n        int64 timestamp = 2;\n    }\n}\nmessage GetAccumulatorCheckpointResponse{\n    // The height of the checkpoint\n    uint32 height              = 1;\n    // The number of entries in the accumulator at this checkpoint\n    uint64 num_entries         = 2;\n    // The accumulator hashes\n    repeated bytes accumulator = 3;\n}\n\nmessage SubmitTransactionRequest {\n    // The transaction to submit to the network\n    Transaction transaction = 1;\n}\nmessage SubmitTransactionResponse {\n    // The transaction ID of the transaction.\n    //\n    // If submission was unsuccessful and error will be returned.\n    bytes transaction_ID = 1;\n}\n\nmessage SubscribeBlocksRequest {\n    // When full_block is true, a complete marshaled block is sent.\n    // Default is false, block metadata is sent. See `BlockInfo`.\n    bool full_block        = 1;\n    \n    // When full_transactions is true, provide full transaction info\n    // for a marshaled block.\n    //\n    // Default is false, only the transaction IDs are included for\n    // a marshaled block.\n    bool full_transactions = 2;\n}\n\nmessage SubscribeCompressedBlocksRequest {}\n")))}d.isMDXComponent=!0}}]);