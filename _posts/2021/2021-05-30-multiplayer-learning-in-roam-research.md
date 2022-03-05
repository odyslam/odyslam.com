---
layout: post
title:	"Multiplayer Learning with Roam Research"
date: 2021-05-30
author: "Odysseas Lamtzidis"
tags:
    - "learning"
excerpt: "Learning in Public is a project where I attempt to to document everything that I am learning, as I am learning it"
image: https://i.imgur.com/utdgJ7D.png
vertical: learning
---

![cover](https://i.imgur.com/utdgJ7D.png)
Learning in public serves 3 main functions, which I am refining every day that I use this system.
- It forces me to write down and note every *single* thing that I write. Although it slows things down, I can later document what I learn.
- It's a call for like-minded people. Learning is simply much more fun when learning with others. Moreover, I find it difficult to participate in 10 different domain-specific communities. **People are multi-faceted, and I want this community to be too.**
- It's a great repository to help others get up to speed in the domains that I cover.

## TL;DR
- Visit the Graph on [Roam Research](https://roamresearch.com/#/app/Symposium/page/t9PFemV3W)
- Read the blog post on [Roam Research](https://roamresearch.com/#/app/Symposium/page/XCjPplbNs)

## Roam Research

As I hinted in the title, I opted to go for Roam Research. The choice was a no-brainer, as it's by far the lowest friction that I had with writing down things. It's snappy, yet powerful.

With the power of `[[pages]]` and `((blocks))`, you can do project management and any kind of organization you want. It needs some experimentation and time, but it's possible.

![image](https://i.imgur.com/BXO9Gzy.png)

For those who don't know Roam, the TL;DR version  is the following.

In Roam research, every bullet that you see is a block. It has a hierarchal structure. While writing you can either reference entire pages or blocks. When you reference a page, in essence you embed a link to that page, while you create a `backlink` in that page towards the page that you made the reference. The same for blocks.

In essence, you can use `[[pages]]` as both a page to write into or a tag to anchor the children. For example, if I have the systems that I use inside a `[[project system]]` page, I can go to that page and get an overview of **all the systems** that I am using.

![image](https://i.imgur.com/x0IzSUE.png)


For the same reason I use tags as column names for the kanban. I can easily get a view of all the items that are currently in the `DOING` column. Moreover, using filters, I can do advanced filtering. For example, all the _blocks_ that have a `project DOING` parent and  `Learning in Public`. Of course, this particular example is not very helpful, since I could simply visit the project page for `Learning in Public`, but you get the idea.

At this point it's important to note that a `#tag` and a `[[page]]` work exactly the same way. The difference is only visual, perhaps to have them implicitly for different uses.

With these primitives in mind, let's see the actual system that I am using.

## The structure

The system can be divided into 2 main groups.

The System: How I use the graph in my every day and how I hope that others will do too

The Ontology: How knowledge is organized in this repository.

Let's start with the ontology, which is basically a cool word to signify "structure". We will see what are the building blocks of this repository and why I chose to organize it that way.

## Ontology

The repository uses a set of **tags** and **pages** to organize knowledge.

## Tags

- **[[fleeting notes]]**: raw notes about something. They are meant to be converted into notes for longer storage (evergreen). Using queries inside a [[project]], we aggregate all the _fleeting notes_ for that particular project. They are meant to be discarded once they have been either discarded or converted to evergreen notes.
- **[[external resources]]**: Tags external content for further research. All links should be anchored by this tag so that we can quickly view all the external links for a particular [[Location of Knowledge]].
- **[[open question]]**: An unanswered question that I save so that we don't forget about it. It is meant to have an inbox for all our open questions about a particular project so that we can quickly address them.
- **[[project version]]** You can define different project versions so that you can group notes that are for current version or the next iteration.

## Pages

### [[project]]

A project page.  Although we don't need to narrowly define a project, let's just say that it's a define set of actions to achieve a particular goal. e.g [[Odysseas learns Solidity]] or [[odyslam.com v3]]

[[kanban]]: It's the main way to store items that I need to go through for that particular project.

We have 3 different groups [[project TODO]], [[project DOING]], [[project DONE]]

Items are divided into `IMP:<item_name>` and `RE:<item_name>`

- **IMP**: implement something. We have already decided to do this.
- **RE**: Research into something. We don't know yet if we will implement it or not.

Every item can have a START DATE and END DATE. This is helpful for us to keep track of when we start/finish our project items

- **[[project system]]**: We define the system that supports this project. Systems are much more effective than goals because they define habitual behavior. Read more on [[system vs goal]] and this [blog post](https://jamesclear.com/goals-systems) by [[james clear]]
- **[[project brainstorming]]**: A general category to write thoughts and ideas for a particular project. After we refine and them, we should transfer them into the #kanban as project items.
- **[[project NEXT ITERATION]]**: A general category for things that we want to do, but not at the current [[project version]]. We write them here so that we keep track of them and not forget them.
- **[[project persona]]**: When doing a project, it is helpful to remember for whom this project is for. We assume that the project has a consumer, a human at the other end who will use the outcome of the project (e.g _a tool_). We should always have an end-user at mind and this category is the perfect place to take a few notes about it.
- **[[project inbox]]**:  A query that returns all the fleeting notes about a particular project. This enables the user to keep of a log of all their learning in the same top-level block (e.g a date) and be certain that every fleeting note will end up in the appropriate project.
- **[[project open questions]]**: The same functionality as [[project inbox]], but for _open questions_.

![image](https://i.imgur.com/DPDACiD.png)


### [[Location of Knowledge]]

- **page name:** "Learn <X>", where X can be anything
- **Type:** Is it a [[tooling]] or an entire [[domain]]. This is rather ill-defined and we will reassess as more LoCs are created.
- **Domain**: Can we group this into a higher order [[domain]] ? e.g [[Learn Solidity]] is in the domain of [[Learn Ethereum]]
- **Introduction**
- **How to read this category**: An introduction on how to read a Location of Knowledge.
- **[[insights]]**: This is the primary category. A set of curated insights about this category. Usually, they are complementary to some original [[external resources]].  We don't need to mirror the entire original context, only our "insight" or note that we believe is important. This way, we super-charge our learning by coupling original content and "hints" that might be unintuitive or hard to grasp. It's learning 10x.
- **[[external resources]]**: This group is for external resources that are not tied to a particular insight, but are useful to have around.
- **[[capstone project ideas]]**: A capstone project solidifies the understanding of the subject.  This is a category to add ideas for capstone projects that people can take up on.

![image](https://i.imgur.com/DYiEbQw.png)

### [[personal page]]:

This is the personal space for every user of this repository. It is the **source** of every page that is created by that user. An anchor for their content.

- **meta**: meta information about the user (e.g twitter account)
- **fleeting notes**: the learning log of that particular user. Only they should be writing in it. It is structured as follows:
  - **date**
    - A project page
      - raw learnings, ideally with timestamps (to get a view of how much each took)

**example:**

- [[May 29th, 2021]]
  - [[Odysseas learns Solidity]]
      - 22:54 Solidity is just a language for writing smart contracts on [[Ethereum]]. Actually, there are alternatives, such as [[Vyper]]

- **learning projects**: A list of project pages that concern learning. e.g [[Odysseas learns Solidity]]
- **capstone projects**: A list of capstone projects that the user would like to do. This helps the community to get visibility into what every user is working on. Visibility translates into more shared knowledge and enables collaboration.

![image](https://i.imgur.com/MqChRnQ.png)


The use of pages is supported by a very handy #roamcult add-on, called [42SmartBlocks](https://roamstack.com/workflow-automation-roam42-smartblocks/). To install the add-on, you have to copy-paste some Javascript code in your graph, which will run every time you open your Roam Research app. The add-on is very powerful, but for now we use it as a templating engine for our pages.

Instead of copy-pasting the blocks in every new LoC or project page,  we run the SmartBlock command which auto populates the blocks. Templates are already available to vanilla Roam Research, but SmartBlock makes the templates dynamic. For example, instead of manually adding the date, we can add the SmartBlock code `<%DATE:Today%>`. This will be replaced by the page with the date of today. It's like typing `/today`.

```
#42SmartBlock project

Tags: #project

Creation Date: **<%DATE:**Today**%>**

## [[project description]]

### [[project inbox]]

{{[[query]]: {and: [[fleeting notes]] [[<%CURRENTPAGENAME%>]]}}}

### [[project open questions]]

{{[[query]]: {and: [[open question]] [[TODO]] [[<%CURRENTPAGENAME%>]]}}}

### [[project brainstorming]]



### [[project persona]]



### [[project system]]



### [[project NEXT ITERATION]]



#kanban {{[[kanban]]}}

[[project TODO]]

[[project DOING]]

[[project DONE]]
```
```

#42SmartBlock loc

## [[Location of Knowledge]] template

Type:

Creation Date: **<%DATE:**Today**%>**

Domain:

## Introduction

## How to read this category

The insights are not meant to be all-inclusive, but complementary resources. Follow the instructions at the start of the Insights.

Insights are meant to **greatly accelerate** your learning process of the original material that they accompany.

This should be collaborative. If you have any questions, just jump into **Discord:** https://discord.gg/CqpaY9FAgU.

If you want to enrich the content, let's chat in the **Discord** channel.

If you are unfamiliar with Roam Research, visit [[Learn Roam Research]] to learn more about it.

Think of this as a trunk of a tree. A body of knowledge that branches into different subjects. All subjects (branches) have [[external resources]], so you can research further into the subject.

For example, click on the following image for an example from [[Learn Solidity]], where the insights were generated while following [Crypto Zombies](https://cryptozombies.io/)

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zb53e16m98ppptss9772.png)



## Insights

## [[external resources]]

## [[capstone projects]] ideas

## People who [[<%CURRENTPAGENAME%>]]

{{[[query]]: {and: [[person]] [[<%CURRENTPAGENAME%>]]}}}

```
## System

Creating an ontology is cool. But you know what's cooler?

Having a system that can support such an ontology, for multiple concurrent users and a considerable amount of time.

The system is the result of many hours of "doing" **Learning in Public** and thinking about the best way to keep track of my learnings. It's not perfect, but I feel it's refined enough to consider it an **alpha version**. I do not have a set of explicitly requirements, but there are some principles that I kept in mind when designing this system:
- It should have the minimum possible friction. The user should focus on the note taking itself, rather than the system. The system's success, in a way, is measured by it's transparency. The more transparent it is, the more natural it feels to the user. This is important, as reducing friction is the best way to help yourself develop a habit.
- It should support multiple concurrent users. We need a system where multiple people will use it in parallel and it will not result into a chaotic graph.
- It should be forward facing. We probably use more tags that we currently needs, but that's ok. I am sure that in the future, new use-cases will emerge and the advanced filtering options will be really helpful. It is impossible to foresee all the possibilities, since we are still at the start of the project.

With the in mind, this is how this system should work:

**[[Locations of Knowledge]]**

They are the treasure of this graph. Only curated insights and refined blocks should end up. They should be treated as a **book**, rather than a **notebook**.

They should follow a specific name pattern: <Learn X>, where X is something to be learned.

**[[project]]**

When you are in doubt, it's a project. A **capstone project**  is a project. Your **personal** learning page is a project.

A project can have any name, except if it about learning a particular Location of Knowledge. In that case, use <NAME learns X>

![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0p8eof5dsy0xhhowi8lx.png)


### How to keep notes

The core of this graph is the habit of taking notes as we learn something.  The following diagram sums up the process

![image](https://i.imgur.com/ZfJ6Euo.png)

The process described above, results to the following Personal Page, with one personal learning project named "Odysseas Learns Solidity"

![image](https://i.imgur.com/DPDACiD.png)


### How to add insights in a Location of Knowledge

![image](https://i.imgur.com/NWNl2RP.png)

Which results to the following Location of Knowledge

![image](https://i.imgur.com/DYiEbQw.png)

### What about tags and pages

At this point, I haven't define a specific "rule" around when to define something as a page and when not. It is ad-hoc, based on what I expect to want to refer to in the future. For example, it make sense to group together all the various notes and information that I gather around the Ethereum Virtual Machine. It's a good rule of thumb to be cautious, so that the graph is not riddles with meaningless tags that make it visually impossible to read.

### Unlinked References

Roam Research has a great feature where it will show **unlinked references** in a page. That means that if I later create a page "EVM", it will tell me about all the occurrences of the word "EVM" in my graph. It assumes that they refer to this page, even though they don't link to it. This is very helpful to be able to backfill links when you add a tag later in the "life" of the graph.

## Future

The graph is still very early in its conception, with less than a month of active usage, so I expect this system to be constantly evolved. The more we use the system and structure, the more we will find optimizations to make.  In the future, I hope to have a community of people that all learn in parallel on the same graph.

I believe that people are multi-faceted, thus we shouldn't necessarily cluster in domain-specific communities. The community of Symposium will be a rich community, where people learn about many different things, in a way that the learnings of one can benefit everyone. A community where people love learning and helping one another like good comrades. What we share is our love of learning.

## CTA

If you find this interesting, make sure to check out the graph on [Roam Research](https://roamresearch.com/#/app/Symposium/page/t9PFemV3W) and join the Discord community. If you want to participate send a message and we will talk through it. At the moment, Roam Research demands a high degree of trust, so we will need to work things out first.

I regularly tweet about technology, communities, learning and decentralisation, so make sure you [follow](https://twitter.com/odysseas_lam) me for more.


