---
layout: post
title: How to build a decentralized inflation oracle
date: 2022-03-31
author: "Odysseas Lamtzidis"
tags:
    - DeFi
    - "sovereign tech"
excerpt: "Gov of Venice is an evolution to the current standard of DAO Governance, where autonomous groups participate in the governance process"
image:
---

# An Inflation Oracle

This is probably the project with which I started my crypto journey. I was, and still is, motivated by problems that I can reason about. Problems who make sense to me and will keep awake at night.

It all started with a tweet by @balajis, who talked about the importance of a decentralized and censor-resistant inflation oracle. That oracle would report the current inflation on-chain, creating an indisputable log. Inflation is important, as it accurately shows the true wealth that society has. It's no good to be a billionaire, if you live in Zimbabwe [1].

## Why we should all care about measuring inflation

Inflation really affects everything, as the great Heyes noted:

> The end game of rampant inflation is always war and/or revolution. Show me a regime change, and I will show you inflation. When you work your ass off only to stand still or get poorer, any “ism” that promises affordable food and shelter for the unwashed masses will reign supreme. If you are starving to death, nothing else matters except feeding your family. The symptoms of inflation are populism, social strife, food riots, high and rising financial asset prices, and income inequality. (..) Invest wisely and you can maintain or increase your standard of life against the rising fiat cost of energy. Invest poorly and the road to serfdom is real. You will find yourself working harder for a declining standard of living, and your fiat earnings and assets will not be able to keep up with the rising fiat cost of energy." — [Arthur Hayes](https://blog.bitmex.com/pumping-iron/)

The issue arises when we come into terms with the fact that **inflation is not always reported accurately**, either because that the official bodies fail to respond to extraordinary events, such as the COVID crisis[*](((KAy35H-qb))) or because it is in their best interest to falsely report the Inflation[*](((_pm9cd8vh))). The second is particularly important, as the Government has an incentive to lie about the real inflation. Of course, Argentina is not the only example of a country[*](((J3N5MACrK))) that falsified official statistics reports.

A more recent example that made ripples through the world is the inflation in the US, which the Fed admitted that it was both mistakenly calculated and labeled as "transitory".[], []

That problem resonated with me and I figured it would be fun to try and build it. So, I took PTO with my web2 job and used an ethGlobal hackathon as the excuse to start working on this full-time. What excited me the most was that it wasn't simply a public-goods case, but also had DeFi applications, with the most apparent one being a token that gets rebased according to the inflation so that the owner retains their purchasing power.

At the base layer, we have the off-chain agent that collects data and computes the inflation. Next, we have the smart contract oracle that is responsible for receiving the inflation data points and realise the incentivisation mechanism.

After about two weeks, I had scoped how a solution would work and what would be the parts that I would need to build. The problem can be divided into two main challenges:

1) How to gather data to compute the inflation (and how to define inflation, etc.)
2) How to push the data on-chain and what security tradeoffs you are willing to make.

In other words, the second challenge is essentially what we call "The Oracle Problem", which in the end didn't seem all that interesting. Moreover, it was too big of a project for my skills at the time, so I figured it would make sense to start with more narrowly scoped work. The project was abandoned, as I went on to become a Solidity Engineer.

After several months, I figured that it would be helpful for others to read the work I have already done and why not pass the torch to someone else.

In the end, it doesn't matter who builds it, as long as it built.

In the blog post, we will see:
- Inflation estimation using online prices
- The Inflation problem
- Proposed architecture of the oracle and the off-chain agent
- Next steps

Buckle up, anon.

## Inflation Estimation

This is the meat of the work here. Thankfully, we are standing on the shoulder of Giants, with Professor Alberto Cavallo from the Billion Prices project[2] leading the charge. In essence, we will be using **daily data from online sources** to build an index that we will use to compute the real inflation. In essence, we will scrape the price of these items on a frequent basis and observe the price differences.

This is **monumental** because it enables regular citizens to accurately calculate the inflation of a whole country. You no longer need substantial capital to perform on-site market research, but you can simply lean on an open-source community to produce the scraping targets and then do the scraping and calculations, using readily available hardware.

In essence, this is the application of **"Don't trust, verify"** on the inflation statistics. We give the tools to people to measure and surface the true wealth, without having to blindly follow official statistics.

This has a few benefits:
- The high frequency of data collection, enables us to observe short-term patterns
- The online index is built with all the items offered from the retailer at the time of data collection. That means that the basket of good changes as products appear and disappear, making it more accurate.
- There is no forced product substitutions. Products affect the index while they exist and due to the fact that they are treated independently, it's in practice simpler.

### Building the Index

Price changes are calculated at the product level and then averaged inside categories with a *weighted arithmetic mean*.

There are 3 steps, which produce the 3 following data points, with every step using the information from the one before it.

- A price change, per item, per time unit (e.g day)
- A category-level index, per category, per time unit
- A supermarket index, per retailer, per time unit

In practice:

**Step 1**

Obtain the unweighted geometric avergae of price changes in category *j* for each day *t*:

$$R^j_{t, t-1} = \prod_i( \frac{p^i_t}{p^i_{t-1}})^{1/n_{j,t}}$$, where $$p^i_t$$ is the price of good $$i$$ at time $$t$$, $$n_{j,t}$$ is the number of products in category $$j$$ that are present in the sample that day.

**Step 2**

The second step is to compute the category-level index at $$t$$.

$$I^j_t=R^j_{1,0}*R^j_{2,1}*...R^j_{t,t-1}$$

**Step 3**

Finally, the supermarket index is the weighted arithmetic average of all category indexes:

$$S_t=\sum_j\frac{w^j}{W}I^j_t$$,

where $$w^j$$ is the official CPI[3] for that category and $$W$$ is the sum of all the weights includes in the sample.

That *S* value is what we want to find it's way on-chain, as it compress the information about the daily inflation into an index.

## Some numbers

Based on data obtained by prior work[], for the United States we can make the following stipulations:

**Data**:
- 10.2 million observations over 827 days. That's about 12.334 observations per day.
- 30.000 products
- 22 Categories
- 241 URLs
- 1 Retailer

**This produces**:
- 12.334 price changes $$R^j_{t, t-1}$$ per day
- 12 $$I^j_t$$ category-level indexes per day
- 1 Retailer Index $$S_t$$ per day

For the Unites States, there are ample statistics available regarding the national CPI indexes ([*](((DQiYOfGrA))) and [**](((_DICnLuOE)))).

### Product Classification

The classification of products and weighting of categories is one of the most complex parts of this process. We need to build an index of hundreds of products that includes the following information:

- product page
- product unique id and selector
- product CPI category

The selector is very important, as it's in essence unique to every product page. The selector is used by the scraper to identify the product's price and extract it from the product webpage.

I envision the index to be built and maintained by the open-source community (e.g a DAO) that will align around this project. I expect it to be a time-consuming enterprise, but otherwise not very complex as the products and their categories are well defined.

Based on comments from [Alberto et al.](((Uo9XAKd-1))), when choosing the Supermarket, we will need to choose an adequately large supermarket chain, that it has a considerable percentage of the market. Ideally, we want a chain that is present in most regions of the country so that we avoid local prices. This will reflect the nation-wide accuracy of it's prices. Finally, multiple supermarkets will offer an even more accurate view of the situation, but this obviously increases the difficulty of the endeavour.

### Product scraping

Product scraping can be quite trivial with the appropriate `css selector` and a performant scraper.

A scraper is a little program that receives as an input the `url` and the `css selector` of a particular product and returns the current `price` for that product.

## The Oracle Problem

The Oracle problem is one of the big challenges in the wider cryptocurrency space. We want to add arbitrary real-world data into the blockchain and use that data in our applications. The problem is that the blockchain has no way to natively verify that accuracy of said data. Ethereum can't really know if the "price" of ETH is $1800 or $6000, so the apps have to trust the actor that inputs the data about their veracity.

The most accepted design-space for this problem is to tackle it using game theoretical schemes, where we create a system that a rational actor is rewarded for supplying correct data and punished if the data is false. The system uses the multiple actors to police one-another with various ways, creating a probabilistic accuracy for the offchain data that make it on chain.


## Referenece Architecture

As I explained above, the design is very modular and can easily be decomposed into four distinct systems:

- **Off-chain agent**: Responsible for computing the inflation index and posting it on-chain.
- **Oracle**: Responsible for digesting the inflation index(or indexes), compute the canonical inflation, serve it to other consumers and finally incentivize the off-chain agents to be honest.
- **DAO**:A DAO that is responsible for managing said oracle, issues the inflation-adjusted DeFi products and more.
- **DeFi stack**: A stack of DeFi products that leverage the ability of the system to "know" the current inflation of various countries.

### Mechanism Design considerations

At this point, there are a couple of important mechanism design questions that I haven't addressed, but I feel are important to keep in mind:
- Do we need a single "canonical" inflation value or the Oracle can function as an index of feeds that users (or smart contacts) can chose to follow based on reputation
- What should be the mechanism around the reward/punishment of feeds based on their accuracy
- What should be the mechanism around whitelisting(or not) feeds to participate in the Oracle
- What parts of the oracle will be designed to be modifiable?
    - Attributes only (e.g Inflation Taxonomy)
    - Entire Oracle will be upgradeable

### Off-chain agent

The off-chain agent was designed with performance and ease-of-use in mind. It should:
- be as performant as possible, enabling users to run it on minimal hardware (e.g Raspberry Pi)
- be as easy as possible to be installed, ideally by users with low technical knowledge (or none)
- be installed/setup in a clearly defined and reproducible manner

To that effect, it should be written in Rust and packaged in a docker container. Although various designs were made regarding the Agent, I find that they are not important.

The most important aspect of the agent must be:
- the efficient scraping of thousands of products per day
- the efficient archival of the data points

Although the agent will submit a single data point to the blockchain, it could store the raw data in a manner that would be publicly accessible.

Assuming that the data points are stored on a `csv` file, we can assume ~13.000 data points will consume about `1.2-2Mb` of storage on a daily basis, creating a total of about `680Mb` per year. Using services such as:
- [filecoin](https://filecoin.io)
- [arweave](https://arweave.org)
- [celestia](https://celestia.org)

It should be fairly cheap for the user to keep a public record of all the raw data that they have aggregated and used to submit their inflation prices. This should add a useful transparency to the actors of the system that could be used by the system's Governance.

## Oracle

The Oracle system is the set of smart contracts that receive the indexes by the agents and compute the system's inflation index. The Oracle has been modeled after the [MakerDAO Oracle Module](https://docs.makerdao.com/smart-contract-modules/oracle-module) and is a system with the following smart contracts.

Let's see them at a high level.

### Aggregator

- It's responsible for aggregating the index from the agents, by enabling the agents to submit them
- It's modeled after the MakerDAO's [median.sol](https://github.com/makerdao/median/blob/master/src/median.sol) smart contract
- It computes the *median* value from all the submitted values.

### Security

- It's responsible for adding a delay to the Oracle's data feed, so there is time to mitigate an attack
- It follows MakerDao's structure of the Oracle-v2 [osm.sol](https://github.com/makerdao/osm/blob/master/src/osm.sol) module
- With every epoch, it gets an update by the [aggregator](#aggregator). With every update, it makes the previous epoch's value available to the rest of the system. In other words, the system has a full epoch (a day) to deal with a bad input to the system

### Mesa

It's the very core of the Oracle. I expect Mesa to be the smart contract that interfaces the Oracle with the DAO Governance of the system.

It servies as an index of all the important information that concerns the system:
- Target URLs for products
- Inflation taxonomy (retailer, country, product category, CPI weights)
- Whitelisted ethereum addresses that can change the various attributes of the Oracle (e.g Governance)
- Based Feed Reward: Will be used by the [Gifter](#gifter)

While the addresses and the rewards can be stored on-chain, we can't store the rest of that data on the blockchain, thus we need to store them somewhere else and then **anchor** them to the mesa contract.

An idea could be to use something like Arweave (mentioned above), where the system will pay to host the data and then submit the `location_hash` to the mesa smart_contract. Using the `location_hash`, anyone can go to the Arweave network and retrieve the data. Of course, with using Arweave, we make the system vulnerable to Arweave's security, as if Arweave stops working, the system would no longer have access to the data and Governance should kick in to mitigate this.

The above information can be summarised in the following data structure, in the form of a JSON file:

```json
{"retailer": "country"}
{"product_id": "CPI_product_category"}
{
  "urls":["
         {
         "product_id": "identifier"
          "identifier_type": "css_selector" || "regex"
         }"
		]
}
{"CPI_product_category": "CPI_weight" }
```
**note:** The identifier is the unique element that will be used to find the price for that particular product item. A `css selector`, a `regex` expression, etc.

So, the list above could be stored on the smart contract as follows:
- `inflation_info`: `location_hash`
- `whitelisted_addresses`: `address[]``
- `based_feed_reward`: `int`

### Gifter

It's responsible for rewarding the feeds for submitting inflation indexes.

- Computes the rewards for each feed
- Sends the reward to the feed's address. The reward is made available from Oracle's treasury, which will be funded and managed by [mesa](#mesa)

**Reward Formula (Naive Approach)**

- Euclidean distance from the Median and a base reward.
    - Euclidian Distance: $$d(p,q) = \sqrt{(p-q)^2} $$, where $$p$$ is the median index chosen by the [aggregator](#aggregator) and $$q$$ is the index supplied by the feed.
    - Reward $$R_i = T - d_i$$. If $$R_i<0$$, then $$R_i=0$$. Where $$T$$ is a threshold value set by the Oracle and $$R_i$$ is reward for Feed $$i$$.
- We could also design a formula-scheme that results to a zero-sum game between the feeds. That would lead the feeds to police one another in case of malpractice, so that they can raise the issue to the governance, kick the feed and thus increase their revenue.

### DeFi - DAO

I never reached this point, but I invite others to  work on this very interesting front. What DeFi tools could we design, if we had a good data point on the current inflation over some part of the world?

## Envisioned Roadmap

- Build Agent MVP: Given a list of targets, scrape product prices and store them on a csv file
- Build Product target list for a specific region/country
- Launch MVP of the Oracle tied to a multi-sig Governance
- Address decentralized storage of agent's config (target list, etc.)
- Launch Agent (stable, easy to install, etc.)
- Launch Governance, token

## Open Questions



## Call to Action


## References

- [1] [The 1 billion Zimbabwe dollar bill](https://www.banknoteworld.com/zimbabwe-currency/1-billion-zimbabwe-dollars/). Accessed at July 4th, 2021.
- [2] Billion prices project
- [3] https://www.bls.gov/cpi/questions-and-answers.htm
-
