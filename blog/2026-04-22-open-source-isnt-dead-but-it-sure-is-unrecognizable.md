---
title: "Open Source Isn't Dead, It Just Looks Unrecognizable"
authors: [kvnkho]
tags: [ai, open-source, engineering]
slug: open-source-isnt-dead-but-it-sure-is-unrecognizable
image: /img/blog/open-source-is-dying-thumbnail.png
---

Last week I was burning five or six dollars a day in API calls just to run a task tracker.

I'd been trying out [KiloClaw](https://kilo.ai/kiloclaw), a managed OpenClaw offering, for some [KnitKnot](https://knitknot.ai) busy work like lead generation. Useful, but expensive. So I went to bring my own key from [z.ai](https://z.ai). It wasn't working. Fine, that's the deal with open source. You can usually fix things yourself.

After some debugging I traced it into the upstream OpenClaw repo. The API key wasn't being attached to outgoing requests. Maybe ten lines, plus a test. I [opened a PR](https://github.com/openclaw/openclaw/pull/68322).

The Kilo team reviewed it. The OpenClaw team, nothing. I checked their queue: over 6,000 open PRs, dozens added that day. My ten lines weren't being ignored, they were just invisible. There's no human-scalable way to tell them apart from the AI-generated drive-bys around them.

## Contributing Got Free, Reviewing Didn't

Daniel Stenberg, the creator of curl, has been the loudest voice on this. Curl is in your car, your TV, probably your fridge, and he's been running it since 1998. By mid-2025 only about 5% of bug bounty submissions were genuine vulnerabilities, with around 20% being obvious AI slop. He [called it](https://daniel.haxx.se/blog/2025/07/14/death-by-a-thousand-slops/) "death by a thousand slops" and a DDoS attack on the maintenance process. In [January 2026 he killed the bounty entirely](https://socket.dev/blog/curl-shuts-down-bug-bounty-program-after-flood-of-ai-slop-reports). Node.js tightened their requirements. The Internet Bug Bounty stopped paying out.

A few months after the shutdown, Stenberg said the slop had actually tapered off, but his burden went up anyway, because [the AI-assisted reports got good](https://www.theregister.com/2026/04/06/ai_coding_tools_more_work/). Plausible. Often correct. Coming in faster than ever. The problem was never that AI writes bad reports. The problem is that AI made contributing nearly free, and review didn't get any cheaper.

If curl can't survive the volume, my invisible PR isn't a story about one ignored fix. It's the same story, smaller.

## Cal.com Goes Closed Source

[Cal.com just went closed source after five years](https://cal.com/blog/cal-com-goes-closed-source-why). The stated reason was security: AI scanners can now systematically read any open codebase looking for vulnerabilities, faster than human maintainers can patch them. They kept a community fork around and closed the production codebase.

I think the security framing is partly true and partly cover. The more pressing problem for a company like Cal.com is that anyone can now point an agent at their repo and build their own calendar system. Not even a competing product, just an internal tool. A scheduling system used to be the kind of thing you bought because building one yourself, even from open source, was more work than it was worth. Now an agent can read the whole repo, infer the architecture, and hand you something deployable in a few days. The friction that kept "use Cal.com" cheaper than "have my agent build me a Cal.com" was load-bearing for the business.

A lot of B2B SaaS sits in the same place. The product is well understood, the surface area is finite, and the moat was mostly that nobody wanted to build it themselves. That calculation is shifting.

Either way, the conclusion lines up. The economics of publishing your source code shifted, and one of the most visible open source companies looked at the new math and walked. Two years ago that would have been heretical. Now it just pencils.

## The Code Was Never The Moat

There's a related point that the people building these things have started saying out loud.

[Peter Steinberger](https://www.youtube.com/watch?v=OIqBK9Vdp64), who built the viral OpenClaw project, was asked on TBPN how he feels about people copying his code. His answer: "Code is not worth that much anymore. You could just delete that and build it again in months. It's much more the idea and the eyeballs and maybe the brand that actually has value. So let them." He picked MIT. He's considering a foundation, not a company.

[Chris Riccomini](https://rng.md/posts/opens-source-projects-are-cached-agent-output/) went further: open source projects are cached agent output. A repo is just a prompt someone else already paid for, materialized as code so you don't have to spend the time and tokens generating it yourself. Sometimes the repo is literally a prompt, like [StrongDM's Attractor](https://github.com/strongdm/attractor), which ships as a README that points a coding agent at it.

If the code is just cached output of a prompt anyone can re-run, then forking isn't betrayal, it's caching with edits. That used to be a nuclear option. Now it's Tuesday.

Cal.com and Peter looked at the same landscape and reached opposite conclusions. Peter's project is ideas; copying the code doesn't get you the thing. Cal.com is the product; the code more or less is the moat. Same landscape, different exposure.

## Where I Landed

I gave up on the PR, and on OpenClaw entirely. Too many tokens, too bloated, and clearly nobody on the receiving end of my ten lines. If I can't get a critical bugfix in, the open source pitch stops working. I went with [Zo Computer](https://zo.computer). Closed source, scoped, opinionated, and a direct line to someone who'll actually answer me. Open source in this space tends toward bloat or staleness anyway. Design by committee meets the pace of AI tooling, and a small closed tool with a real support channel sidesteps the whole tension.

I'll caveat all of this. I [maintained Fugue](https://github.com/fugue-project/fugue) for a few years, and at [Prefect](https://www.prefect.io/) some of the most fun I had was encouraging people in the community to open a PR and feed it back. I met a lot of cool people that way. That part of open source is kinda gone now. I don't think you're hopping on the phone with maintainers anymore, and the thing it costs is the random connections that come from working on something with strangers who care. I don't know what replaces that. Discords, maybe. It's not the same.

What it looks like now is some mix of Peter's version (build in the open because it's fun, MIT it, don't owe anyone a governance process), Cal.com's version (open as a launchpad, close when the math changes), and Attractor's version (the repo is the prompt, the code is something you regenerate locally). All of them look unrecognizable next to open source from two or three years ago. I'm not going to pretend I prefer any of them. I closed the tab on my PR and moved on.
