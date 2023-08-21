---
sidebar_position: 4
---

# Become a validator

Illium validators validate and process transactions, create blocks, participate in the consensus process, and earn newly
generated coins for their effort. 

Becoming a validator is extremely simple. The following steps will walk you through it.

1. **Make sure your node is publicly reachable.**

    While the libp2p networking stack used by ilxd will go through great lengths to try to make your node reachable from the
    outside (upnp, hole punching, circuit relaying, etc), there no guarantee that it will work. For that reasons we strongly
    recommend that those wishing to be a validator set up port-forwarding in their firewall (if applicable) and forward connections
    to port 9001 (the default port).
2. **Get some coins**
    
    Validators must post coins as *stake* in order to become a validator. The default minimum stake is currently set
    to 1000000 ILX. 

    To get your wallet's address use:
    ```
   $ ilxcli getaddress
   
   reg1p6fyg6w5lvrw5ku7v55d6ctv4qsnyxflvaejfm4dzuwu05ln6mjjccgzrvkfc07gj90xrz9j499ma4348jq2h2zh5tgrn0tkpfdqfqqqcnxz3q
    ```
    
    Have at least the minimum stake amount sent to that address.

3. **Stake your coins**
    
    List your wallet utxos:
    ```
   $ ilxcli getutxos
   
   [
       {
           "address": "reg1p6fyg6w5lvrw5ku7v55d6ctv4qsnyxflvaejfm4dzuwu05ln6mjjccgzrvkfc07gj90xrz9j499ma4348jq2h2zh5tgrn0tkpfdqfqqqcnxz3q",
           "commitment": "110d2d4a3516fd399c248972ff3b3268c856140f3587ffae9348e9b890d16e29",
           "amount": 115292150459298487,
           "watchOnly": false,
           "staked": false
       },
       {
           "address": "reg1p6fyg6w5lvrw5ku7v55d6ctv4qsnyxflvaejfm4dzuwu05ln6mjjccgzrvkfc07gj90xrz9j499ma4348jq2h2zh5tgrn0tkpfdqfqqqcnxz3q",
           "commitment": "8ad4cc17bcf1f0a3f3eda0754a92cb29e183b9cea74a9bb760e168ffab5d48a0",
           "amount": 115292150460684697,
           "watchOnly": false,
           "staked": false
       }
    ]
   ```
   
    Pick one of them (with an amount at or above the minimum stake) to stake and copy the commitment field.

    Stake the coins:
    ```
   $ ilxcli stake -c 8ad4cc17bcf1f0a3f3eda0754a92cb29e183b9cea74a9bb760e168ffab5d48a0
   
   success
   ```
   
    **Note**: You may stake more than one utxo.

    **Note2**: Keep your node up and running. You will not earn rewards of your node is off.
   
### Earning rewards

Rewards are distributed at the beginning of each new epoch (1-week period). The ilxd software will detect when the 
new epoch is reached and will automatically create and broadcast a coinbase transaction claiming your reward. By default,
the coins will be sent to the wallet's internal address. 

If you wish the coins to go to a different address you can specify the address with a command line/config file option:

```
$ ./ilxd --coinbaseaddr=reg1pvuxrsstxqcye5pzau9w27h42gukqjmpv8qeze88nadnqf4xx84aursjg6qd608vlxkcrda7zyzmuhwyzxu5q6j5s48htc60q065fu5cdvhnq9
```

### Timelocking

You can increase the amount of reward you earn by locking your coins in a timelock address before staking them. Your stake
weighting and reward increases according to a yield curve based on how much you stake (the reward increases superlinearly as
the timelock increases.)

To first timelock your coins run:
```
$ ilxcli timelockcoins --amount=105292150459298487 --lockuntil=1722321036
```

Now you can stake the locked utxo:
```
$ ilxcli stake -c 8ad4cc17bcf1f0a3f3eda0754a92cb29e183b9cea74a9bb760e168ffab5d48a0
```

You wont be able to spend your staked utxo until after the timelock expires.

### Autostake

By default, rewards are not automatically staked. They go into your wallet and are spendable coins like any others. Ilxd
does offer an option to automatically stake coinbase rewards.

To turn on autostake use the following ilxcli command:
```
$ ilxcli setautostakerewards -a true
```

This setting persists even after the node is restarted.

**Note**: The internal wallet must not be pruned or encrypted to auto stake rewards.

### Destaking

You can cease being a validator simply by spending your staked coins. By default, the internal wallet will not spend staked
coins unless you explicitly tell it to.

To tell it spend your stake first list your wallet utxos:
```
   $ ilxcli getutxos
   
   [
       {
           "address": "reg1p6fyg6w5lvrw5ku7v55d6ctv4qsnyxflvaejfm4dzuwu05ln6mjjccgzrvkfc07gj90xrz9j499ma4348jq2h2zh5tgrn0tkpfdqfqqqcnxz3q",
           "commitment": "110d2d4a3516fd399c248972ff3b3268c856140f3587ffae9348e9b890d16e29",
           "amount": 115292150459298487,
           "watchOnly": false,
           "staked": true
       }
    ]
   ```

Notice staked utxos are marked as such. Copy the commitment of the staked utxo(s) you want to spend.

Spend the coins:

```
$ ilxcli spend --amount=105292150459298487 \
               --addr= reg1pvuxrsstxqcye5pzau9w27h42gukqjmpv8qeze88nadnqf4xx84aursjg6qd608vlxkcrda7zyzmuhwyzxu5q6j5s48htc60q065fu5cdvhnq9 \
               --commitment=110d2d4a3516fd399c248972ff3b3268c856140f3587ffae9348e9b890d16e29
```

**Note**: since you are allowed to stake multiple utxos, you must spend *all* your staked utxos to cease being a validator.

### Stake Expiration
Stake automatically expires after a 26-week period. You can obviously re-stake your coins after expiration by executing the
same command you used to initially stake them. However, illium lets you do this as early as 1-week before expiration to avoid
losing your status as a validator, even just temporarily.