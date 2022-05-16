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

Based on comments from [Alberto et al.](((Uo9XAKd-1))), when choosing the Supermarket, we will need to choose an adequately large supermarket chain, that it has a considerable percentage of the market. This will reflect the nation-wide accuracy of it's prices. Moreover, multiple supermarkets will offer an even more accurate view of the situation.

### Product scraping

Product scraping can be quite trivial with the appropriate `css selector` and a performant scraper. The maintainer should make sure that all the selectors are kept up to date and return the correct information.

## The Oracle Problem


## Referenece Architecture

As I explained above, the design is very modular and can easily be decomposed into three distinct systems:

- Off-chain agent: Responsible for computing the inflation index and posting it on-chain
- Oracle: Responsible for digesting the inflation index(or indexes), compute the canonical inflation, serve it to other consumers and finally incentivize the off-chain agents to be honest.
- DeFi stack: A DAO that is responsible for managing said oracle, issues the inflation-adjusted DeFi products and more

### Mechanism Design considerations

### Off-chain agent

#### Module 1

### Oracle

### DeFi - DAO
## Envisioned Roadmap

## Open Questions

## Call to Action


## References

- [1] [The 1 billion Zimbabwe dollar bill](https://www.banknoteworld.com/zimbabwe-currency/1-billion-zimbabwe-dollars/). Accessed at July 4th, 2021.
- [2] Billion prices project
- [3] https://www.bls.gov/cpi/questions-and-answers.htm
-
