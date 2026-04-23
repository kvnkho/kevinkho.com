---
title: "Open Source Is Changing"
authors: [kvnkho]
tags: [ai, open-source, engineering]
slug: open-source-is-dying
image: /img/blog/open-source-is-dying-thumbnail.png
---

Last week, I tried to fix a bug. It was maybe 10 lines of code. I opened a pull request. A week later, nobody from the upstream project has even acknowledged it. And honestly, I don't blame them.

This sent me down a rabbit hole about open source, and I'm still not sure where I land. But here's where my head is at.

## What I Feel

Open source is changing. I'm not sure that's a feature.

I was using an open-source AI coding tool and found a bug. The API key wasn't being attached to requests. Simple fix. I dug into the codebase, found the issue, and opened a PR. The downstream team reviewed it. The upstream team? Radio silence.

And I get it. They're drowning in hundreds of pull requests a day. Most of them are AI-generated. The cost of opening a PR has collapsed to near zero, but the cost of reviewing one hasn't changed at all. So the maintainers are stuck playing defense against a firehose of plausible-looking code that may or may not be correct.

This made me realize something uncomfortable: to some degree, I kind of prefer closed source now. Not ideologically. Practically. A closed-source product with a small, focused team and a clear roadmap will probably move faster than an open-source project that's spending half its bandwidth triaging AI-generated drive-bys.

That feels weird to say out loud. I grew up believing open source was the answer. But maybe the question changed.

## Some Interesting Beats

Cal.com just announced they're going closed source after five years. Their reasoning: security. AI can now be pointed at an open codebase and systematically scanned for vulnerabilities. Being open source, they said, is increasingly like giving attackers the blueprints to the vault. They released a community fork called Cal.diy, but the production codebase is now private.

I don't know if security is the real reason or if it's a convenient one. Maybe it doesn't matter. The outcome is the same. One of the most visible open-source companies just decided the model doesn't work for them anymore.

Then there's Peter Steinberger, the creator of OpenClaw (now Maltbot), who went viral recently. He built a personal AI agent that blew up on GitHub. In an interview with TBPN, someone asked him how he feels about people just taking his code and selling it. His answer stuck with me: "Code is not worth that much anymore. You could just delete that and build it again in months. It's much more the idea and the eyeballs and maybe the brand that actually has value. So let them."

He built it for fun. He already has money. He's considering a foundation, not a company. When asked about licensing, he picked MIT because he genuinely doesn't care if someone forks it and commercializes it. His position is basically: the code isn't the moat. The community and the momentum are.

I think both of these perspectives are right, and I think they point to the same thing from different angles.

## The Code Was Never the Point

The traditional pitch for open source was: transparency, community, reliability, control. Let's be honest about where those stand.

Transparency still exists. I can read the code. That's how I found my bug. But being able to see the code doesn't help if you can't get your fix merged.

Community is fracturing. The contributor-to-maintainer ratio has blown up. Hundreds of PRs a day doesn't create community. It creates noise. Legitimate contributions get buried alongside AI-generated shotgun blasts.

Reliability is questionable for fast-moving projects. My bug was trivial and it sat unpatched. The release cadence is so aggressive that bugs get introduced faster than the community can fix them through the traditional PR process.

Control is technically true but practically limited. Yes, I can fork. But maintaining a fork is a full-time job when upstream is shipping changes daily.

What Peter Steinberger gets, and what Cal.com's move confirms, is that the code itself was never really the asset. The code is just the medium. What matters is the direction, the momentum, and the people steering it. Open source used to be how you distributed that steering to a community. Now it's mostly how you distribute the cost of maintenance to strangers.

## An Open Source Project Funded With Dollars Will Outmarket One Without

This is the part I keep coming back to. An open source project backed by VC money will almost always outmarket a project without funding, irrespective of quality. That's not a controversial statement. It's just how distribution works.

The romantic version of open source is a ragtag group of developers building something beautiful together. The reality is that most successful open-source projects today are company-funded, company-directed, and company-benefiting. Community contributions are welcome, but the roadmap isn't set by consensus. It's set by whoever pays the maintainers.

And that's fine. I'm not mad about it. But let's call it what it is: open source as a distribution strategy, not a governance model. Once you see it that way, the Cal.com decision makes total sense. They used open source to get distribution. Now that they have it, the costs of staying open outweigh the benefits. So they're closing up.

## Where I Landed

I moved to Claude Code. It's more minimal, which is what I wanted. I can tailor it to my workflow. I also started using Zo Computer for the same reason. Bare bones, but mine to shape.

I don't know if open source is dying. That's probably too dramatic. But it's definitely not what it was even two years ago. The economics have shifted. The incentives have shifted. The tools have shifted.

Maybe the future is what Peter Steinberger is doing: building in the open because it's fun, not because you owe anyone a governance process. Or maybe it's what Cal.com is doing: using open source as a launchpad and then closing the door when the math changes. Or maybe it's something else entirely.

I don't have a clean take. These are just thoughts. Take them or leave them.
