---
title: "I Closed My PR and Moved On"
authors: [kvnkho]
tags: [ai, open-source, engineering]
slug: i-closed-my-pr-and-moved-on
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

I think the security framing is partly true and partly cover. The more pressing problem for a company like Cal.com is that anyone can now point an agent at their repo and build their own calendar system. A scheduling system used to be the kind of thing you bought because building one yourself, even from open source, was more work than it was worth. Now an agent can read the whole repo, infer the architecture, and hand you something deployable in a few days. The friction that kept "use Cal.com" cheaper than "have my agent build me a Cal.com" was load-bearing for the business.

But here's what actually gets lost. When Cal.com was open, a random developer could open a PR for a Zoom integration, end up in a thread with someone building the Google Calendar one, and both walk away with a connection. The code being open meant the collaboration surface was open. Close the code and you close that surface too. The serendipity isn't a side effect of open source. It is the product. Cal.com's decision pencils. It just also removes the last place those connections could form.

## The Code Was Never The Moat

There's a related point that the people building these things have started saying out loud.

[Peter Steinberger](https://www.youtube.com/watch?v=OIqBK9Vdp64), who built the viral OpenClaw project, was asked on TBPN how he feels about people copying his code. His answer: "Code is not worth that much anymore. You could just delete that and build it again in months. It's much more the idea and the eyeballs and maybe the brand that actually has value. So let them." He picked MIT. He's considering a foundation, not a company.

[Chris Riccomini](https://rng.md/posts/opens-source-projects-are-cached-agent-output/) went further: open source projects are cached agent output. A repo is just a prompt someone else already paid for, materialized as code so you don't have to spend the time and tokens generating it yourself. Sometimes the repo is literally a prompt, like [StrongDM's Attractor](https://github.com/strongdm/attractor), which ships as a README that points a coding agent at it.

If the code is just cached output of a prompt anyone can re-run, then forking isn't betrayal, it's caching with edits. That used to be a nuclear option. Now it's Tuesday.

Cal.com and Peter looked at the same landscape and reached opposite conclusions. Peter's project is ideas; copying the code doesn't get you the thing. Cal.com is the product; the code more or less is the moat. Same landscape, different exposure.

## Where I Landed

I gave up on the PR, and on OpenClaw entirely. Too many tokens, too bloated, and clearly nobody on the receiving end of my ten lines. If I can't get a critical bugfix in, the open source pitch stops working. I went with [Zo Computer](https://zo.computer). Closed source, scoped, opinionated, and a direct line to someone who'll actually answer me. Open source in this space tends toward bloat or staleness anyway. Design by committee meets the pace of AI tooling, and a small closed tool with a real support channel sidesteps the whole tension.

I don't think I'm going back. Not in the current shape. Maybe OpenClaw trending toward a plugin model helps, and maybe AI-assisted triage suffices for a while. But the core asymmetry doesn't fix itself. Contributing got cheap. Reviewing didn't. When volume overwhelms a system, you can automate the queue, but you can't automate what the queue was actually for.

I [maintained Fugue](https://github.com/fugue-project/fugue) for a few years, and at [Prefect](https://www.prefect.io/) some of the most fun I had was encouraging people to open a PR and feeding it back. I met people I never would have met. A stranger in another country who cared about the same weird edge case. You'd hop on a call, figure it out, and walk out with a collaborator. That was open source's real product. Not the license. Not the code. The serendipity.

That part is gone now. Meetups don't replace it. Startups have founder camaraderie but it's not the same thing. Open source was special because it was serendipity with strangers who shared a craft, at a scale that still let you be human with each other. Volume killed that before AI even touched the code.

Riccomini is right that the code is cached agent output. The code was never what I was going to miss.
