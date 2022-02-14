---
layout: post
title: Announcing Governance of Venice
date: 2022-01-29
author: "Odysseas Lamtzidis"
tags:
    - solidity
    - DAOs

excerpt: "Gov of Venice is an evolution to the current standard of DAO Governance, where autonomous groups participate in the governance process"
image: https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Republic_of_Venice_%281659-1675%29.svg
---

I am excited to announce a small new Governance Protocol we cooked up with the good folks at pentagon.xyz, particularly [@transmissions11](https://twitter.com/transmissions11) and [@jai_bhavnani](https://twitter.com/jai_bhavnani). I should begin by thanking them immensely for their guidance and feedback during this project. Their understanding on how DAOs **should work** smart contract security was immensely helpful.

Jai had come up with an interesting new concept, called Gov 2.0. It was an envisioned evolution on the standard Governance process that most of the DAOs and protocols follow. The core idea is that functional groups naturally emerge in these protocols, and the new paradigm should make their role in the Governance Process explicit.

We agreed for me to implement a PoC for the idea, starting with the mechanism design and finishing with a set of working smart contracts.

In this blog post, we are going to see:
- The initial Gov 2.0 idea and why it matters
- A reference implementation of the bulk of the aforementioned ideas
- A standard for inter-DAO Governance Participation

## Gov 2.0

DAOs are one of the most powerful tools of the century. A new paradigm in aligning incentives and organizing a group of people around a common goal. Coordination is a tough problem to crack and it has been proven that token voting **alone** is not the most effective way to do things.

A few problems that we found are:
- **Limited Proposers**. Few people go over the obstacles of proposing and even fewer are informed enough to be able to rationally vote.
- **Mixed Intentions**. Large stakeholders (e.g VCs) can obfuscate their identity through different delegation schemes, keeping their power intact.
- **Overestimated Knowledge**. By treating all token holders the same, Governance expects token holders to know equally well vastly different topics, such as finances and smart contract security.

With that in mind, Gov 2.0 introduces a new actor in the Governance system: the `functional group`. Simply put, people organize in groups based on their expertise and these groups have the power to **veto** a proposal, as long as the proposal has marked the group as **relevant** to the proposal itself.

Moreover, for a token holder to join a group, others have to vote them using a parallel token, called **$CLAP**. Token holders get a **clap** for every token they have and every clap is group-specific, meaning that Alice can clap for Bob to join the Developers group and for Jane to join the Design group.

Participating in a group is incentivized, so missing several votes will result in removal from the group. Removal can also come from group members voting other group members out.

Finally, groups that vote for a proposal can decide that another group is needed, even if it wasn't called to vote on the proposal. If they do, the proposer is slashed (for not choosing the appropriate groups) and the group is invited to vote whether to veto the proposal.

We can distill the core concepts into two domains:
- A framework for autonomous subDAOs to participate in the Governance process of Protocols via a well-defined process and set of interfaces. The framework describes the relationship of the two entities (Protocol Governance - subDAO) and not how each entity works internally.
- A model about the identity of subDAOs, aka functional groups, and how these groups should function internally (e.g claps as a signaling mechanism).

The reference implementation, called Governance of Venice, tackles the latter, while the EIP draft aims to target the former.

## Governance of Venice

We draw inspiration about the reference implementation from the years of the [Republic of Venice](https://en.wikipedia.org/wiki/Republic_of_Venice), a prime example of decentralization in a time riddled with Empires.

![](https://i.imgur.com/jEgPX52.jpg)
*Figure 1. An overview of the Governance of Venice*

Imagine a world where [LexDAO](https://www.lexdao.coop/)is both a DAO, but also has a Guild instance that participates in the Governance process of different DAOs. By governance process, we mean on-chain voting by token holders that results in actual protocol changes, such as [Governor Bravo](https://github.com/compound-finance/compound-protocol/tree/master/contracts/Governance) or [Maker Governance Module](https://docs.makerdao.com/smart-contract-modules/governance-module). We mean votes on proposals that result in literal code execution.

In that world, proposers could specify that a certain proposal must first be approved by LexDAO, to reach the floor of the token holders, as it has to do with some change that touches the Legal aspect of the DAO. With Governance of Venice, the proposal would first have to be approved by LexDAO for it to continue.

We can expect many different guilds performing work relevant to their functional area for many different governance modules. To ensure that the relevant Guild will be called, we force users to submit proposals that define at least a Guild to b e consulted. On top of that, Guilds can call other Guilds to the vote, making sure that most relevant voices are heard.

Although the standard is completely agnostic about the Guild and the Merchant Republic, we took a highly opinionated approach for the reference implementation.

Before we dive into the specifics, let's get a lay of the land:

### Glossary

- **Governance Modules**: The part of the architecture that has to do with the Governance of the DAO. Our implementation is based on Governor Bravo by Compound Labs. The main module is called the **Merchant Republic** and uses the **Constitution** to execute the proposals.
- **Guild Council**: An interface that sits between the Guilds and the Merchant Republic. It functions as a registry of the Guilds that participate in Governance and proxies messages between a Guild and the Merchant Republic.
- **Guild**: This particular Guild implementation that is permissionless, meaning that **anyone** can join and most actions require voting from the Guild Members.
- **Commoner**: A token holder of the Merchant Republic that doesn't belong to a particular Guild.
- **Guild Member**: A member of the Guild. They may or may not be token-holders.

## General Architecture

Governance of Venice is an extension of [Governor Bravo](https://compound.finance/docs/governance#introduction), which is divided into two main components:
- Governor Bravo: is the smart contract where token holders make proposals and vote on them. It tracks the lifecycle of all the proposals and it's votes.
- Timelock: is the smart contracts that executes the transactions that are defined in a proposal. It enforces a timelock to the proposals that pass, so they are not executed right away.

In our architecture, they are called **Merchant Republic** and **Constitution** respectively.

On top of it, it has another smart contract that functions as a registry and proxy for the communication between the Merchant Republic and the Guilds. It's called the **Guild Council**. Finally, we have an arbitrary number of Guilds, for which we have created a reference implementation that showcases some interesting concepts (e.g reputation-based admission for members).

![general architecture](https://i.imgur.com/RNcef8c.png)
*Figure 2. Main components of the architecture*

### Joining a Guild

Any commoner can join a Guild that participates in their Governance Process. Once they join, they are Guild Members and they can vote on any proposal that goes to the Guild for a vote, even if they don't **personally** participate in the Governance that sent the proposal. If a Guild Member is found to have some functional knowledge, that should apply to any proposal that is passed to that **particular** Guild.

In other words, if Bob is a member of LexDAO, he will be able to vote in proposals coming to LexDAO from Compound even if he personally doesn't own any `$COMP` and can't vote in the proposal as a COMP owner.

As we said, Guilds are a group of people that share functional expertise. That expertise is expressed through the metric of **Gravitas**.

Gravitas is an expression of the claps I mentioned in the Introduction. It's a experiment, as it adds the concept of weight to the claps, based on who sent them. In essence, we divide claps into **two different quantities**, called **Gravitas** and **Silver**.

Any user can join a Guild that follows the reference implementation, **if they have the appropriate Gravitas**. Gravitas is a per-Guild metric that shows how much credibility a commoner has for **that particular Guild**, exactly like claps.

But, people don't "send" Gravitas. They send another quantity, called **Silver**.

**Silver** is given by the Merchant Republic to all token holders, according to some relationship. In our implementation is a simple 1:1 between the Governance's native *$TOKEN* and *Silver*. That silver can be "sent" from one commoner to another, for a particular Guild. When sending Silver, the sender will "lose" the Silver from their balance, and the Silver value will be converted to Gravitas and added to the Gravitas value of the receiver. We underline again that all these are per-Guild quantities.

**Gravitas Formula**:

$$
\begin{aligned}
gravitas = (silverAmount * silverRatio + senderGravitas * senderGravitasRatio) / 100
\end{aligned}
$$

Firstly, we assume that the Guild **knows** about the silver mechanism of the Merchant Republic. With that information, they can choose a weight to apply on the silver amount in the formula. That way, Guilds can choose how much they want for the silver amount to **affect** the Gravitas (Reputation). In other words, Guilds have full control over the threshold that users need to pass to enter the Guild. Even if a Merchant Republic decides to give x1000 Silver (Claps) to commoners, the Guild will simply change the `silverRatio`. Note that this Ratio is on a per-Merchant-Republic basis, so a Guild can set different weights for different Merchant Republics.

Moreover, Guilds can add a weight coefficient to the Gravitas of the sender. This is **important** because the vote of confidence of Guild Members should play a higher role than the vote from those who do not participate in the Guild. Guild Members have naturally higher Gravitas (for this particular Guild) than commoners.

If you are considered an expert in a field, your **attestation** about someone's abilities is not the same with someone who hasn't the same reputation.

**It's an effort to model real-life reputation in the Guild membership mechanics.**

By replacing Claps with two individual "quantities", we make the protocol more flexible, as Guilds have the freedom to choose:
- How much a "vote of confidence" is translated into "Reputation", for every different Merchant Republic.
- How much the "Reputation" of the person who sends the "Claps" affects the "Claps" that are received.

### Guild Rewards

The reference implementation suggests that Guild Members should be rewarded for just being part of the Guild, as we can expect it to be a much more demanding position than being a simple voter in a DAO.

In the guild, we have two types of agents: A Guild Master and a Guild Member, each having a different multiplier in the formula.

The Guild Member receives a reward based on how long they have been in the guild and their gravitas, with more weight given to the former parameter.

**Guild Member Reward Formula**

$$
\begin{aligned}
claimableReward = timeSinceLastClaim * memberRewardPerSecond ^ 2 * (gravitas * gravitasWeight) * guildMemberMultiplier
\end{aligned}
$$

**Guild Master Reward Formula**

$$
\begin{aligned}
claimableReward = timeSinceLastClaim * memberRewardPerSecond ^ 2 * (gravitas * gravitasWeight) * guildMasterMultiplier
\end{aligned}
$$

Since all Guild Members use the same  "reserve" to get their rewards, that being the address of the Guild, we can expect that the Guild will organically remove members who are not contributing.

### Guild's revenues

Guild's accounting has been kept as simple as possible. At the creation of the Guild, an ERC20 contract is passed as an argument to be used for the reward system.

The reference implementation assumes that the Guild will always own enough tokens of the ERC20 contract in order to pay out rewards.

It is expected that Guilds will negotiate with Merchant Republics for the Guild's payment, without needing to interact with the protocol. If the Merchant Republic stops sending the negotiated amount, the Guild will simply stop voting for proposals.

I expect that Guilds will want to support multiple ERC20, so that Merchant Republics can pay the Guilds in their native ERC20 token (for incentive alignment) and thus Guild Members should be able to be compensated in that. It adds considerable complexity though, as different tokens have different "Dollar value" and thus this will need to be taken into consideration.

Another idea would be that the rewards are equally distributed to all Guild Members, making it a zero-sum game. This would incentivize Guild Members to kick out a Member that is not **helpful enough**, as fewer Guild Members would mean that everybody would receive more tokens via the equal distribution.

We expect complex schemes to rise, such as coding the ability to use [vested ERC20](https://github.com/ZeframLou/vested-erc20) or other protocols such as [Radicle Drips](https://www.drips.network/).

### Slashing

Rewards are not the only mechanism that is baked in the reference implementation. As Jai noted in the original design of Gov 2.0, slashing can play an integral part in aligning incentives and nudge Guild Members to the behavior that we want.

The slashing is very simple: Any member who doesn't vote in a proposal can potentially get their **Gravitas** slashed. This has the upstream result of potentially kicking out Guild Members whose Gravitas fell below the admission threshold.

Any address can invoke the function `slashForCash(address guildCouncil, uint48 proposalId)` and slash all Guild Members that didn't participate in the vote for proposal `proposalId` of the Merchant Republic with Guild Council `guildCouncil`. The address will receive a `slashForCashReward` in ERC20 tokens (the same used for rewards).

*We expect this mechanism to degrade into a gas war for searchers and be used as an MEV opportunity.*

### Guild Voting

Due to the decentralized nature of the Guild's implementation, any member can start a vote to either replace the current Guild Master with a new one or banish(remove) a Guild Member entirely.

To avoid spamming the guild, **a Guild Member will get slashed if they call a vote that doesn't pass**. We expect Guild Members to **first align the Guild and reach consensus through off-chain methods**, such as a simple Discourse vote or snapshot.

**On-chain guild voting should work as a rubber stamp of a decision that has already been made at the social layer.**

### Guild Master

The Guild Master is designed to have a broader role in the mechanism than simply changing parameters of the Guild "protocol".

Because of the high-touch engagement in ensuring that the Guild functions, they are rewarded more than the Guild Members. The added reward is not only a reflection of the increased responsibilities of the Guild Master but also a compensation mechanism for the cost of requiring them to perform a larger number of on-chain actions.

As for the Guild parameters, I implemented a simple timelock mechanism. All changes need at least a week to come into effect. A Guild Master needs to invoke the function once and then invoke it again to ratify the change. That gives time to the Guild to see the change on-chain and if they disagree, remove the Guild Master.

## Inter-DAO Governance Participation standard

The inter-DAO Governance Participation standard is the second result of the work on bringing Gov 2.0 to life. While the reference implementation and resulting experiments are indeed exciting, there is a larger opportunity here in standardizing the way DAOs interoperate and participate in the Governance of other DAOs.

That's right. There is no reason why a Guild couldn't be a DAO of its own, voting and vetoing on proposals of other DAOs, as long as they have been accepted to participate in the Governance Process. They could also be a thin wrapper around a Gnosis safe wallet, offering the required interfaces in order to function as part of the system, while boasting the great UX of gnosis safe.

As far as the standard is concerned, **a Guild is an ethereum address of a smart contract that supports a simple and specific set of interfaces**, mainly around sending proposals and receiving verdicts.

![DAOs as Guilds](https://i.imgur.com/BaG5etk.png)
*Figure 4. DAOs as Guilds, with Guilds of their own*

The standard is intentionally abstract about the exact inner workings of the Governance protocol and the Guild. It focuses on their intercommunication and how they work as autonomous units. That means that a Guild can function in any way it seems best, from a closely-knit group of people who align over a video call, to a trust-less Guild where Guild Members **vote** on how the Guild should respond.

**This is an evolving standard and we foresee making many changes after initial feedback.**

![](https://i.imgur.com/s8WFuLM.png)
*Figure 5. The interaction of the components*

We define the following interfaces, which can also be found in the [GitHub repository](https://github.com/pentagonxyz/gov-of-venice) of the reference implementation. Note that the reference implementation is much more opinionated, so is actually a super-set of the interfaces that we will define here.

This is an evolving standard and not anywhere near complete.

### IGuild.sol

```solidity
function guildVoteRequest(uint48 proposalId) external ;
```
Called by a registered Guild Council address to signal to a Guild that it needs to vote on a proposal.

### IGuildCouncil.sol

```solidity
function _callGuildsToVote(uint48[] calldata guildsId, uint48 proposalId) external returns(bool);
```
Called by a Guild to signal that another Guild in the Merchant Republic should also participate in the Guild's vote.

It returns `true` if at least a Guild was successfully called to vote.

```solidity
function _callGuildsToVote(uint48[] calldata guildsId, uint48 proposalId, uint48 maxDecisionTime) external returns(bool);
```
Called by the Merchant Republic to call Guilds to vote on a proposal. An extra argument `minDecisionTime` is passed so that the Merchant Republic signals what's the max voting period that it will allow the Guilds to have for this proposal. The Guild Council will revert the action if one of the Guilds that are defined in the `guildsId` array has set a minimum decision time that is **greater** than the one passed by the Merchant Republic. It's a safety mechanism for the Guild so that it's not forced to take rapid decisions. If the Merchant Republic wants to engage that particular Guild for this particular proposal, it will have to *respect* the minimum time the Guild requires to properly decide on a proposal.

It returns `true` if at least a Guild was called. If no Guilds are called or a Guild with improper `decisionTime` is called, it will revert.

```solidity
function setMiminumGuildVotingPeriod(uint48 minDecisionTime, uint48 guildId) external returns(bool);
```

Called by Guilds to set their `minDecisionTime`. It returns `true` if the change is successful.

```solidity
function _guildVerdict(bool guildAgreement, uint48 proposalId, uint48 guildId) external returns(bool success);
```

Called by Guilds after reaching a verdict on a proposal. Returns `true` if the answer is successfully registered by the Guild Council.


### Guild Council

```solidity
function _guildVerdict(bool guildAgreement, uint48 proposalId, uint48 guildId) external returns(bool success);
```

## Next Steps

With the release of the Governance of Venice reference implementation and the proto-definition of a possible EIP, we invite the community to test, deploy and experiment with the reference implementation.

We also invite any interested party to participate in the EIP discussions and help us author a new EIP.

Reach out via [Twitter](https://twitter.com/odyslam_), [Telegram](https://t.me/odyslam) or via Discord(odyslam#5467).

