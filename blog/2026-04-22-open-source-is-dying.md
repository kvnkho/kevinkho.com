---
title: "Open Source Isn't Dead, It Just Looks Hella Different"
authors: [kvnkho]
tags: [ai, open-source, engineering]
slug: open-source-is-dying
image: /img/blog/open-source-is-dying-thumbnail.png
---

Last week I spent a Saturday afternoon chasing down a ten-line bug.

I was using an open-source AI coding tool, built on top of another open-source AI coding tool, and I'd hit a wall. My API key wasn't being attached to outgoing requests. I dug into the downstream repo, traced it into the upstream one, and with some help from Claude Code (using an AI coding tool to fix an AI coding tool, which is either very 2026 or very stupid, possibly both), I found the issue. A handful of lines. I wrote a test. I opened a pull request.

The downstream team reviewed it. The upstream team, nothing. No comment. No label. A week later, still nothing.

I refreshed the tab a few times like an idiot. Then I looked at the project's PR queue. Hundreds open. Dozens opened that same day. That's when it clicked that my PR wasn't being ignored, it was just invisible. The signal-to-noise ratio had collapsed, and my ten good lines were sitting next to a hundred AI-generated refactors that happened to pass CI. I closed the tab and went to lunch.

And then, a day or two later, I read about Daniel Stenberg.

## Death By A Thousand Slops

Stenberg is the creator of curl. Not a hobby project. Curl is in your car, your TV, your phone, probably your fridge. He's been running it since 1998. In January, he shut down curl's bug bounty program entirely. The reason: he was drowning in AI-generated vulnerability reports that cited nonexistent functions, fabricated memory addresses, and imaginary patches. He called it "death by a thousand slops" and, in other venues, a DDoS attack on the maintenance process.

Curl's own data: by mid-2025, only about 5% of submissions were genuine vulnerabilities, and roughly 20% were obvious AI slop. In January 2026 he pulled the plug. No more bounty, no more HackerOne, just a private disclosure channel and a warning on their security.txt that crap submissions will be publicly ridiculed. The Linux kernel team is dealing with the same thing. Node.js tightened their signal requirements. The Internet Bug Bounty program stopped paying out.

Here's the twist that's been living in my head since I read it. Stenberg said, a few months after the bounty shutdown, that the slop had actually tapered off. But the maintainer burden went up, not down. Because now the AI-assisted reports are good. Plausible. Often correct. Coming in faster than ever. So the problem was never really that AI writes bad code or bad reports. The problem is that AI makes the act of contributing nearly free, and nothing else in the open source model scales with that.

If curl, with 3,000+ historical contributors and genuine industrial importance, can't survive the volume, then what happened to my tiny PR stops being a story about one ignored fix. It's the same story, just smaller.

## The Code Was Never The Point

Once you see it that way, a lot of other things line up.

There's a framing from Chris Riccomini that stuck with me: open source projects are cached agent output. A repo is just a prompt someone else already paid for, materialized as code so you don't have to spend the time and tokens generating it yourself. Sometimes the repo is literally a prompt, like StrongDM's Attractor, which ships as a README that tells you to point a coding agent at it. The code isn't the artifact. The plan is.

Peter Steinberger, who built the viral personal-agent project Maltbot (formerly OpenClaw), was asked on TBPN how he feels about people copying his code and selling it. His answer: "Code is not worth that much anymore. You could just delete that and build it again in months. It's much more the idea and the eyeballs and maybe the brand that actually has value. So let them." He picked MIT. He's considering a foundation, not a company. His whole position is that the code isn't the moat, the momentum is.

Then there's Cal.com, which just went closed source after five years. Their stated reason was security. AI scanners can now systematically look for vulnerabilities in any open codebase, so being open is like handing attackers the blueprints. Whether security is the real reason or a convenient one, the outcome is the same. One of the most visible open-source companies decided the model doesn't work for them anymore. They kept a community fork around and closed the production codebase.

Peter and Cal.com look like opposites, but they're reacting to the same fact. The code itself isn't what's valuable. For Peter, that means give it away, the community and the brand are the real asset. For Cal.com, it means close it, because the asymmetry between attackers using AI to read your code and maintainers using humans to defend it has stopped being worth it. Different conclusions, same underlying observation.

## Forking Cuts Both Ways

Forking used to be a nuclear option. Now it's Tuesday.

The AI tool I was trying to fix, Kilo Code, is itself a fork of OpenCode CLI. When I asked why, the answer was basically that they couldn't get their changes accepted upstream, so they forked and moved on. That's the rational response when your PR sits in limbo, and in the age of agents it barely costs anything to maintain a divergent copy. Riccomini makes the same point: forks used to be a sign of failure, now they're a feature.

But "just fork it" cuts the other way too. PearAI raised venture money on what was essentially a fork of Continue, with messy license and attribution handling, and got pilloried for it. I'm not relitigating that specific drama. The point is that forking is now cheap enough to happen for good reasons and bad ones, and the community can't really gate which is which. The old social contract where forking meant something has thinned out.

So on one end you have Kilo, forking because they had to. On the other, PearAI, forking because they could. Same mechanic, different motives, and from upstream's perspective it's hard to celebrate one and object to the other without sounding arbitrary.

## Community Has Shifted

Matthew Rocklin, who created Dask, stepped back from running Coiled recently and wrote something I keep thinking about:

> Mostly I get the sense that people have started to expect a lot of free work without a sense of collaboration or working together, which doesn't feel good. I suspect that users have been trained by all the for-profit companies throwing free things at them for their attention. While Dask isn't dead, to me it feels like community OSS has died a little.

That matches what I see. The contributor-to-maintainer ratio has blown up. Hundreds of PRs a day doesn't create community, it creates noise. The people who do the sustained, unglamorous maintenance work are the same small group they always were, they're just getting shouted at by a much larger crowd. Stenberg is the loud version of this. Rocklin is the quiet version. They're saying the same thing.

It's a topic for another day, but an open source project funded with dollars will outmarket one without, irrespective of quality. That's just how distribution works. Combine that with what Rocklin is describing, and a lot of what we call "open source community" today is really a company's roadmap with a public issue tracker.

## Where I Landed

The traditional pitch for open source was transparency, community, reliability, control. Let me be honest about where those stand for fast-moving AI tooling.

Transparency still exists. I can read the code. That's how I found the bug. Being able to see the code doesn't help much if you can't get your fix merged.

Community is fracturing, for the reasons above.

Reliability is questionable. My bug was trivial and it sat unpatched. Release cadence is aggressive enough that bugs get introduced faster than volunteers can fix them through the traditional PR process.

Control is technically true but practically limited. Yes, I can fork. Maintaining a fork is a full-time job when upstream ships changes daily.

I moved to Claude Code. It's more minimal, which is what I wanted. I can tailor it to my workflow. I also started using Zo Computer for the same reason. Bare bones, mine to shape. Smaller tools I can bend around what I'm doing beat bigger tools I have to wait on.

Open source isn't dead. That's too dramatic. It sure looks hella different though. The economics shifted, the incentives shifted, the tools shifted. Curl had to kill its bounty. Cal.com had to close its code. Peter Steinberger just shrugged and picked MIT. Kilo forked because they had to. PearAI forked because they could. Rocklin stepped back.

None of these are the same decision, but they're all responses to the same underlying fact: the thing that used to make open source valuable, free distribution of scarce code written by motivated humans, has changed on both ends. The code isn't scarce anymore, and the humans aren't as motivated when a tenth of their inbox is slop.

Maybe the future looks like Peter's version: build in the open because it's fun, MIT it, don't owe anyone a governance process. Maybe Cal.com's version: open source as a launchpad, close the door when the math changes. Maybe Attractor's version, where the repo is just a prompt and the code is something you regenerate locally.

I don't have a clean take. These are just thoughts. Take them or leave them.
