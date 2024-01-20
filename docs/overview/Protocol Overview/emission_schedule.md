---
sidebar_position: 11
---

# Coin Distribution

!!THIS SECTION IS  A WORK IN PROGRESS!!

Check back later or offer some feedback!

## 10 Year Distribution Target

The protocol aims to have distributed a total of 2<sup>60</sup> = 1,152,921,504,606,846,976 coins by the 
end of the 10-year period following the genesis block.

## Genesis Distribution

Of the 2<sup>60</sup> coins, 20% or 230,584,300,921,369,395 coins are created in the genesis block. 

- A quarter of that 20% or 57,646,075,230,000,000 coins is earmarked for a founders reward.
- The other three-quarters or 17,293,822,257,000,000 coins will be distributed via faucets, puzzle scripts, grants, and donations to dependency developers.  
The full list of recipients of this distribution with amounts will be published here when available.

A technical note: The consensus algorithm *requires* some coins be created up front in the genesis block so that they can be staked 
and used to validate transactions. The blockchain could not move forward without at least some coins created up front.

## Validator Distribution

75% of the initial 2<sup>60</sup> or 864,691,128,500,000,000 coins will be distributed to validators, at one-week
intervals over a 10-year period, according to an exponential decay function (more coins are distributed in the early periods
than later periods). 

Each validator will receive a reward in proportion to their share of the total weighted stake on the network.

## Treasury Distribution
5% of the initial 2<sup>60</sup> or 57,646,075,230,000,000 coins will be distributed to the illium treasury, also at one-week intervals and
according to the same exponential decay function used for the validator distribution.

These coins can only be released from the treasury to a recipient with the approval of a majority of the validators. The purpose of the treasury
is to fund protocol development, marketing, conferences, grants or any other activity validators deemed necessary. 

Alternatively validators could choose not to distribute the treasury funds if it's not believed the benefit from doing so would
exceed the downward pressure on price from the increased circulating supply.

## Long Term Inflation Rate
After the initial 10-year period the protocol targets a 2% annualized increase supply, also distributed over one-week periods.

Of these coins:

- 95% will be awarded to validators in proportion to their weighted stake.
- 5% will be paid into the illium treasury.
