---
title: "Open Source Is Dying, and AI Is Holding the Knife"
authors: [kvnkho]
tags: [ai, open-source, engineering]
slug: open-source-is-dying
image: /img/blog/open-source-is-dying-thumbnail.png
---

Last week, I tried to fix a bug. It was maybe 10 lines of code — attaching an API key to a request. It took me three or four iterations to get the fix right, and I opened a pull request. A week later, nobody from the upstream project has even acknowledged it. And honestly? I don't blame them.

But this experience sent me down a rabbit hole about the state of open source in the AI era, and I'm not sure I like what I found.

## The Bug That Started It All

I've been experimenting with [Kilo Code](https://kilocode.ai/), which offers an open-source AI coding assistant (an "OpenClaw" — an open-source Claude Code alternative). I was using their code review tool backed by the z.ai GLM model, and things were going well — until the costs started adding up. So I did what any reasonable person would do: I purchased a z.ai subscription and tried to bring my own API key into Kilo Code.

It didn't work. There was a bug — the API key simply wasn't being attached to outgoing requests.

The nice thing about open source, in theory, is that you can fix things yourself. So I dug into the Kilo Code repository, which led me down a rabbit hole into the upstream [OpenClaw](https://github.com/anthropics/claude-code) repository. With some help from Claude Code (yes, using an AI coding tool to fix an AI coding tool), I found the issue and opened a PR.

The fix was trivial. A handful of lines to properly attach the API key to the request. If you exclude the tests, we're talking maybe 10 lines of actual code changes.

## The Sound of Silence

Someone from the Kilo team reviewed my PR, which was appreciated. But from the OpenClaw side? Nothing. No review, no comment, no acknowledgment. And looking at the project's activity, I can see why — they're getting hundreds of pull requests a day.

I genuinely don't know how the maintainers filter through them. I don't know how reviews work on a project at that scale. My PR is a needle in a haystack, and the haystack is growing faster than anyone can sort through it.

This isn't a complaint about any individual maintainer. It's a structural problem that I think is only going to get worse.

## The Vibe Coding Flood

Here's what I think is happening: the cost of opening a pull request has collapsed to near zero.

Before AI coding tools, contributing to an open source project required you to understand the codebase, write the code, write the tests, and iterate until the CI passed. That friction was actually useful — it filtered out low-quality contributions naturally.

Now? Someone can point an AI at a bug, get a sweeping refactor that happens to pass the tests, and open a PR in minutes. The contributor might not even understand what the code does. The tests might pass because the AI was clever enough to make them pass, not because the fix is correct.

The maintainer team is now saddled with a new problem: the volume of plausible-looking contributions has exploded, but the cost of *reviewing* those contributions hasn't decreased at all. If anything, it's increased — because now you have to evaluate whether a large diff is a thoughtful contribution or an AI-generated shotgun blast.

Yes, projects are using AI to triage issues and auto-tag PRs. But the bottleneck was never triage. **The bottleneck is review**, and you can't automate that away without effectively letting strangers steer your project.

## The Fork Explosion

The alternative to waiting for upstream is forking. And boy, are people forking.

Kilo Code CLI itself is a fork of OpenCode CLI. When I asked why, the answer was straightforward: they couldn't get the changes they wanted accepted upstream. That's the rational response when your PR sits in limbo — fork and move on.

But this creates a fragmented ecosystem where dozens of forks diverge in slightly different directions, each with their own bugs and incompatibilities. The "community" that open source supposedly fosters gets shattered into isolated camps.

## Design by Committee Is Dead

Open source used to be design by committee. Projects had maintainer meetings, project management committees (PMCs), and long mailing list discussions about the right direction. That model worked when the pace of change was measured in months.

In the AI world, design by committee is a death sentence. A small disagreement about vision means your PR sits unreviewed. A two-week PMC discussion means your competitors ship three features. Why would a project slow down for consensus when moving fast is the only way to survive?

The community aspect of open source — the part where diverse contributors shape the direction of a project together — is collapsing under the weight of speed.

## Do the Advantages Still Exist?

The traditional arguments for open source were:

- **Transparency**: You can see the code and understand what it does.
- **Community**: People contribute, report bugs, and collectively improve the project.
- **Reliability**: With many eyes, bugs are found and fixed quickly.
- **Control**: If you don't like the direction, you can fork or fix it yourself.

Let's check these against reality:

**Transparency** still exists, technically. I *could* see the code, and that's how I found the bug. But being able to see the code doesn't help if you can't get your fix merged.

**Community** is fracturing. The contributor-to-maintainer ratio has blown up. Hundreds of PRs a day doesn't create community — it creates noise. The signal-to-noise ratio has shifted so badly that legitimate contributions get lost alongside AI-generated drive-bys.

**Reliability** is questionable. My bug was a simple one — a missing API key attachment — and it's been sitting unpatched for over a week. For fast-moving AI projects, the release cadence is so aggressive that bugs get introduced faster than the community can fix them through the traditional PR process.

**Control** is technically true but practically limited. Yes, I can fork. But maintaining a fork is a full-time job when upstream is shipping changes daily. The "just fork it" argument assumes you have the resources to keep up.

## What Others Are Saying

I'm not alone in thinking this. [Matthew Rocklin](https://matthewrocklin.com/), the creator of Dask and founder of Coiled, has been hinting at similar observations. The economics of open source maintainership were already strained before AI. Now they're breaking.

The open source sustainability problem isn't new — it's been discussed for years. What's new is that AI has simultaneously:

1. **Increased the number of users** (AI tools have massive adoption curves)
2. **Increased the volume of contributions** (AI makes it trivial to generate PRs)
3. **Decreased the quality signal** of contributions (harder to distinguish thoughtful fixes from AI slop)
4. **Accelerated the pace** at which projects need to evolve (competitive pressure)

Each of these individually would strain the model. Together, they're breaking it.

<!-- Consider linking to:
- Nadia Eghbal's "Working in Public" (https://press.stripe.com/working-in-public)
- xkcd 2347 (https://xkcd.com/2347/)
- Matthew Rocklin's blog about open source economics
-->

## The Incentive Problem

There's another layer here. The incentive structure of open source has shifted dramatically.

In the early days, open source was genuinely communal. Someone built a tool, others found it useful, and a community formed organically around maintaining and improving it. Think of how projects like Linux, Apache, or even early Python libraries grew.

Then came the VC-funded open source era. Companies realized that open source was an incredible distribution mechanism — give away the core, sell the enterprise version. This worked for a while, but it subtly changed the incentives. The project's direction became driven by business needs, not community needs. Contributors were effectively doing free labor for a company's product roadmap.

Now we're in a third era where the incentive to *contribute* to someone else's open source project is diminishing. Why spend time getting a PR merged upstream when you can fork, customize, and ship? Why invest in community when the community can't keep up with the pace of change?

## Where I Landed

After all of this, I moved to [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview). It's more minimal, which is actually what I wanted. I can tailor it to my workflow. The building blocks are there without the overhead. I also started using [Zo Computer](https://zo.computer) — it's more bare bones, but I can tailor it to how I want. The building blocks are there.

OpenClaw was too much — I needed something more minimal. All this to say: man, open source, closed source, reliability — I don't know if these advantages exist anymore. I don't know if open source is going to be the same anymore.

It's not like the days when Airflow was created and maintained by a genuine community. Open source as we know it is largely dead, and it only really exists in super niche circles now. These are just my thoughts on the matter — take them or leave them.
