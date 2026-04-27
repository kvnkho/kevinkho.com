---
title: "The UI Was the Wrong Shape"
authors: [kvnkho]
tags: [ai, productivity, product]
draft: true
---

I went through three task managers in a month. Not because I'm picky — because each step revealed that the problem wasn't the tool. It was the shape.

First I was going to buy Evernote or Todoist. Standard move. You have habits to track, projects to manage, notes to keep. You shop for the right container. Implicitly accepting that the answer is an app with a UI. You're just picking which one.

Then I thought I'd build my own. Vibe code it in Lovable. Custom exactly to my needs — a Kanban board with a daily habit tracker bolted on. Generation got cheap enough that building bespoke felt like the move. I'd have exactly the columns I wanted, the card layout I wanted, the exact workflow.

Then I moved everything to OpenClaw, and shortly after to [Zo Computer](https://zo.computer). And suddenly the container was gone.

## The Kanban Wasn't Wrong — It Was the Wrong Layer

I had two fundamentally different things I was trying to track:

**Baseline habits.** Workout. Eat right. Sleep. Work on [KnitKnot](https://knitknot.ai). Binary, repetitive, daily. Not tasks with state transitions. Just — did I do it or not.

**Project work.** Build the ecommerce demo. Schedule the Nixtla call. Finish the report Max handed off. These have state. They move through stages. Kanban is genuinely good for this.

Shoving both into one board meant the habits polluted the project tracking. I was copying the same cards every day, marking them done, recreating them tomorrow. Ritualistic overhead that felt like productivity but was just administrative theater. And the project work — the stuff the board was actually built for — got buried under the noise.

The Kanban wasn't broken. It was just the wrong surface for half of what I needed.

## The UI Was a Constraint

Here's the thing about UIs: they're constraints. That's not a flaw — it's the whole point. A well-designed product constrains the problem space to something the system can handle well. Compliance software has controls frameworks. A Kanban board limits you to cards, columns, and state transitions. These constraints enable optimization. You can measure throughput, limit WIP, see bottlenecks. The constraint *is* the product.

But constraints are only valuable when they match the problem. My daily habit checklist didn't need a drag-and-drop interface. It needed a binary signal at the end of the day. "Did you work out?" Yes or no. Pass or fail. No columns, no state machine, no visual hierarchy.

The fix wasn't to build a better UI. It was to remove the UI entirely. Now I get a text at midnight asking if I hit my baselines. That's it. The surface area of possible operations is tiny — I ask, you answer, it's logged. And because it's tiny, it actually works. Every dimension of freedom you add is a dimension where the system can be wrong or where you can lose the signal.

## Vibe Coding Enabled Bad Product Practice

This is the uncomfortable part. The generation layer isn't the bottleneck anymore. Anyone can spin up a beautiful task manager in 20 minutes. And that speed skips the part where you sit with the problem and ask: *is a Kanban even the right shape for this?*

When building code was expensive, the cost forced you to think about whether you were building the right thing. Now the cost is near-zero, so the default is to just generate. Build the app, add the feature, make the dashboard. You optimize for what's cheap to produce instead of what's correct.

I moved fast: "I'll buy Todoist" → "I'll build it myself" → "Actually, an agent can just handle this." Each step felt like progress. But the real unlock wasn't the tool — it was the realization that the tool shape was wrong. A chat interface connected to [Linear via MCP](https://linear.app) means I never open Linear anymore. I say "add a ticket for the ecommerce demo" and it's in the backlog. "Move Nixtla call prep to in progress" and it's done. The Kanban still exists — the structure, the states, the project tracking — but I never interact with it visually. The agent is the interface.

## The Agent Is the Unifying Layer

Every product has to pick its ontology. Linear picks project management. Todoist picks task lists. Evernote picks notes. They're all walled gardens with their own data models. The "unified productivity" fantasy is always just one more app claiming to be the one ring.

What I actually ended up with — without meaning to — is a federated system:

- **Linear** holds the structured work. Real tickets, real states, real project tracking. It's the system of record. I almost never look at it.
- **Flat files** hold the lightweight stuff. My monk mode doc is a markdown table. No schema, no API, no overhead.
- **Zo** is the routing layer. It knows which backend to hit based on what I need. I just say the thing, and it goes to the right place.

The agent doesn't replace the tools. It sits on top and abstracts away the *decision* of which tool to use. That's the layer that no single app can provide, because every app is bound to its own data model.

## Constraints Still Matter

I don't think the answer is "everything should be chat." If anything, the lesson is the opposite: constraints are load-bearing, but you have to pick the right ones for the right problem.

My habit tracking needed almost zero constraint — just a ping and a yes/no. Project work needed real structure — tickets, states, a system of record. Compliance software needs a controls framework because the problem space has to be tight enough that the system can actually perform. SOC 2 isn't a product limitation, it's an enforced boundary that keeps the problem solvable.

The same principle applies to AI products. Whenever you add a dimension of freedom — custom data imports, flexible schemas, arbitrary workflows — results get worse by default. The surface area of possible operations has to stay small enough that the system can be good at what it does. People can bring in custom data and we'll wrangle it, but we can't automatically map it to things outside what we know well. That's not a limitation. That's the product.

The UI wasn't the enemy. It was just the wrong constraint for the wrong problem. The right answer wasn't more UI or less UI — it was matching the constraint to the job. Sometimes that's a Kanban board. Sometimes it's a text at midnight.
