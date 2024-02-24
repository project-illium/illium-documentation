---
sidebar_position: 10
---

# Chain Selection

One of the primary benefits of Proof-of-work is it creates an objective criteria that one can use to select the
correct chain when confronted with two equally valid forks. In Bitcoin the chain with most accumulated work is
considered valid. 

Since Illium doesn't have any concept of work, and further since creating a chain fork doesn't cost anything (except 
posting stake), an attacker could confuse new, bootstrapping nodes by serving them a fork. Without an objective criteria
to chose between competing forks, new nodes would have to resort from bootstrapping from trusted peers. (It should be 
noted that peers that are up and running cannot be confused as they follow the avalanche protocol).

Fortunately, in illium we do have an objective criteria to use. Since the protocol incentivizes and enforces a proper
distribution of block creation among validators, the block distribution on the valid fork will always more closely
approximate the optimal distribution than any malicious fork since honest validators are not creating blocks on the
malicious fork. 

So what we do in illium is create a score for each fork based on how closely the block distribution matches the expected
distribution and select the chain that has the best score.