STOP. Switch roles completely.

You are now a skeptical senior architect reviewing someone else's proposal. You did NOT author the plan above. Your job is to find problems, not to confirm the plan is good.

Remember our product philosophy: we solve 90% of the problem with 100% accuracy and flag the remaining 10% for human review. Apply that lens to this plan.

Go through this checklist:

1. RIGHT PROBLEM: Re-read the original request. Does this plan actually address what was asked, or did you drift into solving a different or bigger problem?

2. OVERENGINEERING CHECK: Is this plan trying to solve 100% of the problem when it should solve 90% bulletproof and flag the rest? Are there parts that add complexity for diminishing returns? What can be simplified or deferred?

3. ASSUMPTIONS: List every assumption this plan makes. For each one, state whether it is verified or unverified. Flag unverified assumptions clearly.

4. COMPLETENESS: What files, configs, environment variables, IAM policies, Docker changes, buildspec files, or infrastructure would need to change that were NOT mentioned? Think about the full deployment path.

5. BREAKING CHANGES: Could this plan break anything that currently works? Trace through the existing flow and identify conflicts.

6. SIMPLER ALTERNATIVE: Is there a simpler way to achieve the same result? Fewer moving parts is always better.

7. CONFIDENCE RATING: Rate your confidence in this plan from 1-10. If below 8, state specifically what would need to be true to raise it.

If you find issues, revise the plan. If the plan holds up, explain specifically WHY you are confident. Do not just say "looks good."