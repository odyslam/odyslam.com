---
layout: post
title:	Developer Relations and Community CRMs
date: 2020-09-15
author: "Odysseas Lamtzidis"
tags:
    - "2020"
    - "developer-relations"
excerpt: "A community CRM tool is a very new breed of tools which focus on helping DevRels with their job in managing technical communities"
image: https://thumbs.dreamstime.com/b/isometric-desktop-connected-to-servers-database-blue-back-background-data-center-concept-based-design-131817082.jpg
vertical: developer-relations
---

![](https://thumbs.dreamstime.com/b/isometric-desktop-connected-to-servers-database-blue-back-background-data-center-concept-based-design-131817082.jpg)

# Community CRMs

Developer Relations is a relatively new field, having emerged in response to the intricate needs of a technical community. A technical community, as Mary Thenvgall underlines, is not simply a community that has gathered around a purpose (product). **They are a group of people who actively help one another and create value for the community**. 

In other words, a technical community has powerful network effects in play, hardly a surprise, considering that the word of mouth is one of the best advertisements in the tech industry. With community members interacting all the time, exchanging best practices and solving problems together, being on IRC, reddit or a proprietary forum, there must be a person to monitor and nurture such interactions.

# What is a Community CRM

A CRM tool, or Customer Relations Management tool is a tool which 1) serves as the source of truth for the customer and 2) logs all interactions of the customer with the company. A community CRM tool is a very new breed of tools which focus on helping DevRels with their job, by:
1) Giving them an aggregate view of the community health. With charts and graphs, the Developer Relations team can observe how the community engagements change over time, how code contributions evolve and if the community is talking about a particular matter. The important aspect to consider is that **we want a view of the community as a whole, across all platforms.**
2) Logging all the touch-points of the community members with the community. This is important for improving the quality of tactical decisions in regards to particular members. If the team wants to identify candidates for their beta-testing program, it's best to start contacting the community members who are most active, in whatever activity one cares (e.g contributions, forum topics, etc.)
3) Aggregating data from numerous data sources. Communities rarely exist on a single platform, but usually they are isles of different communities, with a central island serving as the core. We need to be able to gather information across every isle (e.g GitHub, Discourse, Discord, etc.) and then combine the data points so that we get a singular view for each community member and the community as a whole. **The merger of different digital identities which belong to the same physical person is the name of the game.**

In this article, we are going over 2 tools that I have been using for the last months in Netdata while wearing my Community Manager hat.

# The Netdata Community

Before jumping into the matter at hand, let's talk a little bit about the Netdata community to give you some context on where I stand.

Netdata started in 2016 as an open-source project and immediately joined the hype train, with the peak reaching around 2017-2018. Since then, the community has obeyed to the laws of gravity, normalizing into a much more stable kernel of community members and contributors.

1) The community mainly runs on GitHub (for now, more on that later), thus we need a tool to help us analyze the health there.
2) We just shipped our new forums, which will be the center of the community from now on. 
3) Engineers and thought leaders interact on twitter as well, thus we need to be able to analyze the interactions there as well. This is not a hard requirement, since our marketing handles the twitter account.
4) Currently I am leading a team of 1 in Developer Relations, thus we need something easy to setup, so we can initially focus on customer-facing activities and setting up the program.

# The suitors

Currently, there are 3 products that I personally know of and they are appropriate for the use-case of a technical community.

1) ShavannahHQ
2) OrbitHQ
3) Grimoire Labs

I am going to start with 3) and say that I haven't used it. It seems the more in-depth and robust tool of the 3 in terms of analysis of technical communities (particular open-source). It supports many many different data sources and it can produce a dashboard rife with detail.

See the [Mauticon dashboard](https://dashboard.mautic.org/app/kibana) for example.

At this point, it's pertinent to underline that Grimoire is more of an analytic tools rather a CRM. What this means basically is that it is focused on analyzing the community as a whole and bring every bit of information about it and it's members. This comes in contrast with the other 2 tools, which although they can perform a similar functionality, they care deeply about logging the individual journey of each member, as any CRM would do.

It is also seems excessive complex, at least for the stage of the Developer Relations program and the Netdata community. We want something much more agile, which will not require time to setup and learn and can be used, immediately to guide tactical decisions.

Thus, I put Grimoire Labs for re-assessment in the next Quarter, and moved forwards with the other two.

## There can be only one

Or can it? 

Up to this point, I have used both tools, in parallel, since they are quite complimentary in certain aspects, and while they are in alpha, they are free.

I would imagine, that come billing time, we will have to make a choice, but for the near future, I intend to use both, depending on the kind of report or decision that I want to make.

In broad terms, Orbit and Savannah, although they seem similar, and for sure they share a large part of their functionality, they seem to have a different focus.

Savannah is mainly focused on the inside, the internal community  and how members interact in it. Orbit on the other hand, is also interested in the activities of the community members outside of the community.

## Orbit
[Orbit](https://orbit.love/) is actually an implementation of the eponymous community model that was pioneered by one of the co-founders, [Josh Dzielak ](https://dzello.com/about/during) his time as VP of engineering in Keen.io and then when leading Developer relations at Algolia. It is a venture-backed startup, currently with only 3 people and they are rapidly implementing new features and integrations. Moreover, they have a very active slack channel where users offer feedback and chat with the developers.

The project was open-sourced in 2019 and anyone can find the model and contribute on [GitHub](https://github.com/orbit-love/orbit-model). Although we are not going to talk about the model itself, it's worth mentioning that it diverges from the usual AAARRRP funnel. You can read more about their differences on [GitHub](https://github.com/orbit-love/orbit-model#orbit-and-funnel).

The product is based on the concept of feed, for both the entire community and on a per-member basis. You can see a live feed of all the activities that members do inside the community, activities which of-course depend on the data sources that you have added.

![](https://i.imgur.com/eduh4aM.png)

This is especially useful on a per-member basis, since it allows you to take optimal tactical decisions when interacting with that particular community member. For example, you can welcome them to the community, you can congratulate them for their first contribution or see that they have interacted a lot of times, thus you want to chat with them about your beta-testing program.

![](https://orbit.love/assets/images/hero-screenshot.png)

What I particularly like about Orbit is that it has this **twitter integration**, thus it can correlate different accounts from GitHub and Twitter that belong to the same person. This is powerful, because it allows you to find influencers if they have interacted with both accounts with your community (e.g a RT and a GitHub issue) or if they have added their twitter account on the GitHub profile.

Orbit cares a lot about the reach of the members, measuring their reach both in terms of twitter and in terms of GitHub followers, stars in projects, etc. On top of that, Orbit tries to gather information about their profile from the GitHub activity (e.g what languages does the user usually uses in projects/contributions).

As I said above, this outward angle is unique to Orbit and I feel that it adds value to the table, as I want to know how many "important" people my community attracts. These rock-stars, if managed correctly, can offer a unique boost to any community and project.

Finally, orbit offers standard reporting regarding the community members, their activities and platform-specific (e.g contributions on GitHub). Reports feel a bit weird and for sure they are not the strong suite of Orbit. For example, in the following image, although I can see the aggregate number of contributions and the relative size in a per-week manner, it's not very useful.

![Orbit contributions](https://i.imgur.com/sa7Gh15.png)

Ideally, I would prefer to see for the total period, what is the percentage of contributions to each open-source repository.

### Final words

Orbit finally offers a great `read` [API](https://docs.orbit.love/reference#members-overview)], which means that you can use Orbit to extract information about your community and export the to your data-lake. This is particularly important in the situation where you have a company CRM like hubspot or Salesforce.

Using Orbit, you can extract and aggregate the community information about every community member, which is actually a lot of information, which is more-or-less auto-detected thanks to the frictionless integrations that Orbit offers. Taking an example from the docs can be quite illuminating:

```JSON
{
  "id": "48986",
  "type": "member",
  "attributes": {
    "activities_count": 299,
    "avatar_url": "https://pbs.twimg.com/profile_images/1110162582143406080/vu7_kN8f.png",
    "bio": "Co-founder & CTO @OrbitModel - we're hiring! · advocate for dev advocates 🥑 · Rails · JAMstack · DevRel · he/him · #BlackLivesMatter",
    "birthday": "September 12",
    "company": "@orbit-love",
    "created_at": "2020-04-21T14:43:54.266Z",
    "deleted_at": null,
    "first_activity_occurred_at": "2011-03-14T19:04:59.000Z",
    "id": 48986,
    "last_activity_occurred_at": "2020-10-11T18:52:47.000Z",
    "location": "Paris, France",
    "name": "Josh Dzielak",
    "orbit_level": 1,
    "pronouns": "He/him",
    "reach": 8,
    "shipping_address": "1 Champs-Élysée; Paris, France 75001",
    "slug": "dzello",
    "source": "api",
    "tag_list": [
      "DevRel",
      "Founder",
      "Paris"
    ],
    "teammate": true,
    "tshirt": "M",
    "updated_at": "2020-10-22T16:15:09.572Z",
    "url": "https://orbit.love/",
    "web_url": "https://app.orbit.love/dzello/members/dzello",
    "twitter": "dzello",
    "github": "dzello",
    "discourse": null,
    "email": "josh@orbit.love",
    "devto": "dzello",
    "linkedin": "in/dzello",
    "love": 13.886322317666968
  },
  "relationships": {
    "identities": {
      "data": [
        {
          "id": "149721",
          "type": "email_identity"
        },
        {
          "id": "173894",
          "type": "twitter_identity"
        },
        {
          "id": "376",
          "type": "github_identity"
        },
        {
          "id": "608267",
          "type": "devto_identity"
        },
        {
          "id": "609227",
          "type": "linkedin_identity"
        }
      ]
    }
  }
}
```
Now, you can extract all the members that exist inside Orbit, take what information is relevant for your use-case and import that information inside the company CRM. You can even store them in your data-lake and enrich any user information with their community standing in a very frictionless manner. Quite neat I should say.

This integrations work the other way around too. You can export product data from your production database and into the data-lake, then for each community member you have, you can create a `Note` which is a simple text associated with the community member and visible inside their Orbit profile. This Note could be a simple generated text that contains information about their product use, like:
```
plan: standard
Number of machines: 16
Last login: 22-11-2020
Usage: very active
```
This gives you valuable context in your interactions with the community members, since you know how they have interacted with the product, how credible their feedback is, etc. To super-charge this integration, a SSO system for your forum and main product would ensure that people don't use different emails, thus making impossible to correlate their identities.

Regarding the orbit framework, it is certainly useful that the tools offers an abstraction to the Community Manager in regards to community member segmentation. It is an easy and quick way to understand how the community is evolving and get a quick understanding of a member's identity inside the community, either by viewing their `reach` , their `love` (total engagement) or their `orbit level`. As a professional, I think I would prefer to be able to customize the point system of my platform, as I feel that for each community, the same activities could have different points so that the model is more reflective of the community reality.

For example, in my twitter community, there is a member which is depicted as `Orbit 1` or inner community, but I would even hesitate to call them a community member. The reason is that they are a media account talking about the Greek Startup ecosystem. They have simply mentioned Netdata a lot of times, either in the context of funding announcements, hiring or simply as a greek startup.

Thus, I would probably reduce the impact a tweet can have in considering a user part of my community. Although I am sure that there is a rationale behind the point system, which might be appropriate for more cases, offering the choice seems like a low-hanging fruit.

You can join the beta-testing and the slack channel, by visiting [Orbit](https://orbit.love).

### Data sources
- [Discourse](https://docs.orbit.love/docs/setup-the-orbit-discourse-integration)
- [Twitter](https://docs.orbit.love/docs/setup-the-twitter-integration)
- [GitHub](https://docs.orbit.love/docs/how-to-setup-the-orbit-github-integration)
- [Zapier](https://zapier.com/apps/orbit/integrations)
- [API integration](https://docs.orbit.love/reference)


## Savannah

Savannah is the brainchild of [Michael Hall](https://www.linkedin.com/in/mhall119/), Senior Community Manager at InfluxDB. I met Michael, during his time in the Linux Foundation, when I was an active member of the EdgeX Foundry community in my IoT years.

I met Michael again in the [DevRel collective](https://devrelcollective.fun/) slack and he was kind enough to invite me for a closed beta of SavannahHQ, a community CRM for Developer Relations, by a Developer Relations guy.

Savannah offers a great aggregate view of the various aspects of my community, integrating the Graphs inside the dashboard (in contrast with Orbit which are isolated). For some reason, this offers a greater user experience, with the product feeling much more coherent.

For example, taking the contributions example from Orbit, in Savannah I can view the number of total contributions for the period and then a contribution-by-channel pie chart. 

![Savannah Contributions](https://i.imgur.com/ZHsER8t.png)

The information is the same, but in Savannah is more thoughtfully presented. 

In essence, Savannah does a functional division of the community in:
- Conversations
- Members
- Contributions
- Connections

It offers a view of the community for each function, both in terms of the aggregate, but also in terms of distinct community members. For example, in the image bellow, we see the total number of conversations in the Netdata community, we see conversations by Tag (keyword-based) but also we see a list of community members, based on activity, engagement, etc.

![](https://i.imgur.com/fCMeBS0.png)

Finally, **one of the most interesting features** of SavannahHQ is the `connections` tab, which shows the community as a graph, where each community member is a node and each edge is a connection between 2 community members. A connection is defined as the interaction of 2 community members on some platform at some point in their community journey.

![](https://docs.savannahhq.com/insights/connections/LooseWeb.png)

As this feature is somewhat complex, meaning that it is just a visualization, and demands experience to properly decode the patterns and shapes that you see, it's best to visit the [docs](https://docs.savannahhq.com/insights/connections/) and read how different shapes can signify different things about the health of the community. It's a great start and I can't wait to see this feature evolve by giving the user **actionable insights** about their community, without demanding excessive experience from their part.

### Final Words

SavannahHQ is a one-man band project and it shows, it's much more immature than orbit, with a number of features missing from the package, such as a robust `read` API to be able to extract all this info from the platform and to a proprietary data warehouse or to enrich the central CRM of your company. Moreover, there are a number of features here and there, that are currently missing and are implemented as we speak. For example, Savannah offers a historical view of the community that goes up to 6 months in the past.

On the positive side, because it's a one-man band with a small slack community, feedback is integrated in a rapid manner.

Moreover, as you have probably guessed, it does not provide a data visualization like the live feed in Orbit, for neither the aggregate or in a per-member basis. It has a list of all the conversations in the member's profile, but I would argue that is not very useful. Furthermore, it doesn't concern itself with things such as reach, as it only focuses on the interactions that the community members are having inside the community.

You can join the beta-testing, learn more about the product and join the slack in the [Savannah CRM docs](https://docs.savannahhq.com/).


### Data Sources

- Discourse
- GitHub
- Gitlab
- RSS feed
- Slack
- Blog
- Discord
- API integration

## Verdict

At this point, I have yet to make a final decision on which tool is more appropriate for my needs.

I have concluded to use Savannah for more aggregate understanding of my community, being able to quickly see who are my latest contributors or the most active in conversations. Moreover, the network graph is a great tool to see how the community is evolving and to spot community members which start to become more active, get more connections and becoming a link for the community. Finally, the keyword tag of conversations is a nice little feature, as it gives me a gist of the conversations that are happening, in broad terms of-course.

On the other hand, I use Orbit to get a live understanding of my community, see the newest contributors and make sure to welcome them to the community and thank them for their contributions. Moreover, being able to monitor twitter is a great aspect, as I can see the *high reach* individuals that interact with Netdata and keep an eye on them, without having to use yet another service/platform. Finally, the reports offer a great detailed view of the community as a whole and being able to quickly benchmark the current period of the last one, is a great asset.

Since this seems a new and exciting field, I intend to come back with thoughts and insights from my experience. At this moment, I am trying to standardize a process around  these tools, and hopefully I will be able to share back and open-source my results in a timely manner.

After all, community is everything.